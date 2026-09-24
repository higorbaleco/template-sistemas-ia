"""Validador de links de WhatsApp e Telegram via HTTP."""
from __future__ import annotations

import logging
import random
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from requests.adapters import HTTPAdapter

from config import REQUEST_TIMEOUT, VALIDATION_WORKERS
from scrapers.link_extractor import classify_link
from services.rate_limiter import RateLimiter

logger = logging.getLogger(__name__)

_UNKNOWN_RETRY_REASONS = {
    "unknown_html",
    "timeout",
    "error_connection",
    "rate_limited",
    "captcha_protected",
}


class LinkValidator:
    """Valida links de grupos verificando se estão ativos."""

    _CHROME_UAS = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    ]

    def __init__(self, rate_limiter: RateLimiter | None = None):
        self._rate_limiter = rate_limiter or RateLimiter(
            delay_min=0.5, delay_max=1.5
        )
        self._local = threading.local()

    def validate_links(
        self,
        links: list[str],
        progress_callback=None,
        retry_unknown: bool = True,
    ) -> list[dict]:
        """Valida links em paralelo com retentativa seletiva de desconhecidos."""
        if not links:
            return []

        first_pass = self._run_validation_pass(
            links=links,
            workers=VALIDATION_WORKERS,
            attempt=1,
            progress_callback=progress_callback,
            progress_prefix="Validando links",
        )
        if not retry_unknown:
            return first_pass

        retry_candidates = [
            result["url"]
            for result in first_pass
            if result.get("valid") is None
            and result.get("reason_code") in _UNKNOWN_RETRY_REASONS
        ]
        if not retry_candidates:
            return first_pass

        # Retentativa limitada para não estourar SLA.
        retry_limit = min(max(8, len(links) // 4), 40)
        retry_urls = retry_candidates[:retry_limit]
        if progress_callback:
            progress_callback(
                f"Retentativa seletiva em {len(retry_urls)} links desconhecidos..."
            )

        second_pass = self._run_validation_pass(
            links=retry_urls,
            workers=max(4, VALIDATION_WORKERS // 2),
            attempt=2,
            progress_callback=progress_callback,
            progress_prefix="Revalidando",
        )
        by_url = {item["url"].lower(): item for item in second_pass}

        improved: list[dict] = []
        for original in first_pass:
            updated = by_url.get(original["url"].lower())
            if not updated:
                improved.append(original)
                continue
            improved.append(self._pick_best_result(original, updated))

        return improved

    def _run_validation_pass(
        self,
        *,
        links: list[str],
        workers: int,
        attempt: int,
        progress_callback=None,
        progress_prefix: str,
    ) -> list[dict]:
        total = len(links)
        results: list[dict] = []

        with ThreadPoolExecutor(max_workers=workers) as executor:
            future_to_url = {
                executor.submit(self._validate_single, url, attempt): url
                for url in links
            }
            for i, future in enumerate(as_completed(future_to_url), 1):
                url = future_to_url[future]
                try:
                    results.append(future.result())
                except Exception as exc:
                    logger.error("Erro ao validar %s: %s", url, exc)
                    results.append(self._build_result(
                        url=url,
                        valid=None,
                        link_type=classify_link(url),
                        status="erro",
                        reason_code="validator_exception",
                        confidence=0.2,
                    ))

                if progress_callback and (i % 10 == 0 or i == total):
                    progress_callback(f"{progress_prefix}... ({i}/{total})")

        return results

    def _pick_best_result(self, base: dict, retry: dict) -> dict:
        """Escolhe resultado mais confiável entre primeira e segunda validação."""
        base_valid = base.get("valid")
        retry_valid = retry.get("valid")
        if base_valid is None and retry_valid is not None:
            return retry
        if base_valid is not None and retry_valid is None:
            return base

        base_conf = float(base.get("confidence_score", 0.0))
        retry_conf = float(retry.get("confidence_score", 0.0))
        return retry if retry_conf >= base_conf else base

    def _get_validation_session(self) -> requests.Session:
        """Retorna sessão HTTP reaproveitada por thread para validar links."""
        sess = getattr(self._local, "session", None)
        if sess is not None:
            return sess

        sess = requests.Session()
        adapter = HTTPAdapter(pool_connections=32, pool_maxsize=32)
        sess.mount("http://", adapter)
        sess.mount("https://", adapter)
        sess.headers.update({
            "User-Agent": random.choice(self._CHROME_UAS),
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache",
        })
        self._local.session = sess
        return sess

    def _validate_single(self, url: str, attempt: int = 1) -> dict:
        """Valida um único link."""
        link_type = classify_link(url)
        self._rate_limiter.wait(url)

        try:
            session = self._get_validation_session()
            response = session.get(
                url,
                timeout=REQUEST_TIMEOUT if attempt == 1 else REQUEST_TIMEOUT + 2,
                allow_redirects=True,
            )

            html_lower = (response.text or "").lower()
            if response.status_code == 429:
                return self._build_result(
                    url=url,
                    valid=None,
                    link_type=link_type,
                    status="desconhecido",
                    reason_code="rate_limited",
                    confidence=0.26,
                )
            if any(token in html_lower for token in ("captcha", "cloudflare", "verify you are human")):
                return self._build_result(
                    url=url,
                    valid=None,
                    link_type=link_type,
                    status="desconhecido",
                    reason_code="captcha_protected",
                    confidence=0.24,
                )

            if link_type == "whatsapp":
                return self._validate_whatsapp(url, response)
            if link_type == "telegram":
                return self._validate_telegram(url, response)
            return self._build_result(
                url=url,
                valid=None,
                link_type="unknown",
                status="desconhecido",
                reason_code="unsupported_type",
                confidence=0.15,
            )

        except requests.exceptions.Timeout:
            return self._build_result(
                url=url,
                valid=None,
                link_type=link_type,
                status="timeout",
                reason_code="timeout",
                confidence=0.2,
            )
        except requests.exceptions.RequestException as exc:
            logger.warning("Erro de conexão ao validar %s: %s", url, exc)
            return self._build_result(
                url=url,
                valid=None,
                link_type=link_type,
                status="erro_conexao",
                reason_code="error_connection",
                confidence=0.22,
            )

    def _validate_whatsapp(self, url: str, response: requests.Response) -> dict:
        """Valida link de WhatsApp analisando a resposta."""
        html = (response.text or "").lower()
        name = self._extract_whatsapp_group_name(response.text or "")

        if response.status_code == 404:
            return self._build_result(
                url=url,
                valid=False,
                link_type="whatsapp",
                status="invalido",
                reason_code="not_found",
                confidence=0.96,
            )

        invalid_indicators = [
            "invite link is invalid",
            "this invite link is no longer valid",
            "convite inválido",
            "link de convite inválido",
            "couldn't find the page",
            "link expired",
            "link expirou",
        ]
        if any(ind in html for ind in invalid_indicators):
            return self._build_result(
                url=url,
                valid=False,
                link_type="whatsapp",
                status="invalido",
                reason_code="expired_or_invalid",
                confidence=0.94,
            )

        full_indicators = [
            "group is full",
            "this group is full",
            "grupo está cheio",
            "grupo esta cheio",
            "grupo lotado",
            "convite cheio",
        ]
        if any(ind in html for ind in full_indicators):
            return self._build_result(
                url=url,
                valid=False,
                link_type="whatsapp",
                status="lotado",
                name=name,
                reason_code="group_full",
                confidence=0.9,
            )

        valid_indicators = [
            "click to join",
            "clique para entrar",
            "join group",
            "entrar no grupo",
            "whatsapp group invite",
        ]
        if response.status_code == 200 and any(ind in html for ind in valid_indicators):
            return self._build_result(
                url=url,
                valid=True,
                link_type="whatsapp",
                status="valido",
                name=name,
                reason_code="active_invite",
                confidence=0.93,
            )

        return self._build_result(
            url=url,
            valid=None,
            link_type="whatsapp",
            status="desconhecido",
            name=name,
            reason_code="unknown_html",
            confidence=0.46,
        )

    def _validate_telegram(self, url: str, response: requests.Response) -> dict:
        """Valida link de Telegram analisando a resposta."""
        html = (response.text or "").lower()
        name = self._extract_telegram_group_name(response.text or "")

        if response.status_code == 404:
            return self._build_result(
                url=url,
                valid=False,
                link_type="telegram",
                status="invalido",
                reason_code="not_found",
                confidence=0.96,
            )

        invalid_indicators = [
            "this invite link has expired",
            "link has expired",
            "if you have telegram",
            "este link expirou",
            "invite link invalid",
            "convite inválido",
        ]
        full_indicators = [
            "this group is full",
            "group is full",
            "chat is full",
            "grupo está cheio",
            "grupo esta cheio",
            "grupo lotado",
        ]
        valid_indicators = [
            "you can view and join",
            "view in telegram",
            "join group",
            "join channel",
            "members",
            "subscribers",
            "tgme_page_extra",
        ]

        if any(ind in html for ind in invalid_indicators) and not any(
            ind in html for ind in valid_indicators
        ):
            return self._build_result(
                url=url,
                valid=False,
                link_type="telegram",
                status="invalido",
                reason_code="expired_or_invalid",
                confidence=0.92,
            )

        if any(ind in html for ind in full_indicators):
            return self._build_result(
                url=url,
                valid=False,
                link_type="telegram",
                status="lotado",
                name=name,
                reason_code="group_full",
                confidence=0.9,
            )

        if response.status_code == 200 and any(ind in html for ind in valid_indicators):
            return self._build_result(
                url=url,
                valid=True,
                link_type="telegram",
                status="valido",
                name=name,
                reason_code="active_invite",
                confidence=0.93,
            )

        return self._build_result(
            url=url,
            valid=None,
            link_type="telegram",
            status="desconhecido",
            name=name,
            reason_code="unknown_html",
            confidence=0.45,
        )

    def _build_result(
        self,
        *,
        url: str,
        valid: bool | None,
        link_type: str,
        status: str,
        reason_code: str,
        confidence: float,
        name: str = "",
    ) -> dict:
        return {
            "url": url,
            "valid": valid,
            "type": link_type,
            "status": status,
            "name": name,
            "reason_code": reason_code,
            "confidence_score": round(max(0.0, min(1.0, confidence)), 4),
            "validated_at": time.time(),
        }

    def _extract_whatsapp_group_name(self, html: str) -> str:
        """Tenta extrair o nome do grupo WhatsApp do HTML."""
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html, "lxml")
            og_title = soup.find("meta", property="og:title")
            if og_title and og_title.get("content"):
                return og_title["content"]
            h3 = soup.find("h3")
            if h3:
                return h3.get_text(strip=True)
        except Exception:
            pass
        return ""

    def _extract_telegram_group_name(self, html: str) -> str:
        """Tenta extrair o nome do grupo/canal Telegram do HTML."""
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html, "lxml")
            og_title = soup.find("meta", property="og:title")
            if og_title and og_title.get("content"):
                return og_title["content"]
            title_div = soup.find("div", class_="tgme_page_title")
            if title_div:
                return title_div.get_text(strip=True)
        except Exception:
            pass
        return ""

