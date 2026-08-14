"""Scraper via Google/DuckDuckGo para buscar links em redes sociais."""
from __future__ import annotations

import logging
import random
import re
import time
from urllib.parse import parse_qs, quote_plus, urlparse

from bs4 import BeautifulSoup

from config import (
    SOCIAL_MEDIA_QUERIES, GOOGLE_DELAY_MIN, GOOGLE_DELAY_MAX,
    MAX_GOOGLE_QUERIES,
)
from scrapers.base import BaseScraper
from scrapers.link_extractor import extract_all_links, deduplicate_links
from services.rate_limiter import RateLimiter

logger = logging.getLogger(__name__)

_JINA_MAX_CANDIDATE_PAGES = 8
_JINA_MAX_CANDIDATE_URLS = 30


class GoogleSearchScraper(BaseScraper):
    """Busca links de grupos em redes sociais via Google dork + fallback DuckDuckGo."""

    def __init__(self, rate_limiter: RateLimiter | None = None):
        super().__init__(rate_limiter)
        self._query_count = 0
        self._google_blocked = False
        self._visited_candidate_urls: set[str] = set()

    def scrape(self, keyword: str, max_pages: int = 3,
               start_page: int = 1,
               platforms: list[str] | None = None,
               link_types: list[str] | None = None,
               progress_callback=None) -> list[str]:
        """
        Busca links em redes sociais via Google dorking.

        Args:
            keyword: Palavra-chave de busca
            max_pages: Páginas por lote
            start_page: Página inicial do lote
            platforms: Lista de plataformas (facebook, twitter, etc.)
            link_types: Lista de tipos (whatsapp, telegram)
            progress_callback: Função callback(mensagem) para progresso
        """
        self.reset_metrics()
        platforms = platforms or list(SOCIAL_MEDIA_QUERIES.keys())
        link_types = link_types or ["whatsapp", "telegram"]
        all_links = []

        link_domains = []
        if "whatsapp" in link_types:
            link_domains.append("chat.whatsapp.com")
        if "telegram" in link_types:
            link_domains.append("t.me")

        query_jobs = []
        for platform in platforms:
            if platform not in SOCIAL_MEDIA_QUERIES:
                continue

            for link_domain in link_domains:
                query_template = SOCIAL_MEDIA_QUERIES[platform]
                query = query_template.format(
                    link_domain=link_domain, keyword=keyword
                )
                query_jobs.append((platform, link_domain, query))

        # Varredura ampla (sem ficar restrito aos sites de referência).
        broad_templates = [
            '"{keyword}" "{link_domain}"',
            '"{keyword}" inurl:{link_domain}',
            '"grupo" "{link_domain}" "{keyword}"',
        ]
        for link_domain in link_domains:
            for template in broad_templates:
                query_jobs.append((
                    "web",
                    link_domain,
                    template.format(keyword=keyword, link_domain=link_domain),
                ))

        if not query_jobs:
            return deduplicate_links(all_links)

        # Rotaciona cobertura entre lotes para não repetir sempre as mesmas queries.
        rotation_index = (max(1, start_page) - 1) % len(query_jobs)
        if rotation_index:
            query_jobs = query_jobs[rotation_index:] + query_jobs[:rotation_index]

        # Interpreta max_pages como orçamento total por keyword e reparte entre as queries.
        pages_plan = self._build_pages_plan(max_pages, len(query_jobs))

        for (platform, link_domain, query), pages_for_query in zip(
            query_jobs, pages_plan
        ):
            if pages_for_query <= 0:
                continue

            remaining_budget = MAX_GOOGLE_QUERIES - self._query_count
            if remaining_budget <= 0:
                logger.info("Limite de queries Google atingido.")
                if progress_callback:
                    progress_callback("Limite de queries atingido.")
                break

            pages_to_search = min(pages_for_query, remaining_budget)

            if progress_callback:
                tipo = "WhatsApp" if "whatsapp" in link_domain else "Telegram"
                platform_label = (
                    "web ampla" if platform == "web" else platform.capitalize()
                )
                progress_callback(
                    f"Buscando {tipo} em {platform_label} "
                    f"({pages_to_search} pags)..."
                )

            links = self._search_engine_query(
                query, pages_to_search, start_page=start_page
            )
            all_links.extend(links)

        return deduplicate_links(all_links)

    def search_query(self, query: str, max_pages: int = 3,
                     start_page: int = 1) -> list[str]:
        """Executa uma query direta em motores de busca com fallbacks."""
        self.reset_metrics()
        pages = max(1, max_pages)
        page_start = max(1, start_page)
        return self._search_engine_query(query, pages, start_page=page_start)

    def _build_pages_plan(self, max_pages: int, query_count: int) -> list[int]:
        """Cria um plano de distribuição de páginas entre várias queries."""
        if query_count <= 0:
            return []

        total_pages = max(1, max_pages)

        # Se páginas suficientes, divide de forma equilibrada.
        if total_pages >= query_count:
            base = total_pages // query_count
            extra = total_pages % query_count
            return [
                base + (1 if idx < extra else 0)
                for idx in range(query_count)
            ]

        # Se páginas insuficientes, cobre as primeiras queries com 1 página cada.
        return [
            1 if idx < total_pages else 0
            for idx in range(query_count)
        ]

    def _search_engine_query(self, query: str, max_pages: int,
                             start_page: int = 1) -> list[str]:
        """Tenta Google primeiro e usa fallback em múltiplos motores."""
        collected_links = []

        if not self._google_blocked:
            links = self._google_search(query, max_pages, start_page=start_page)
            if links is not None:
                collected_links.extend(links)
                if links:
                    return deduplicate_links(collected_links)
            else:
                logger.info("Google bloqueado. Pulando para fallbacks.")
                self._google_blocked = True

        jina_links = self._jina_google_search(query, max_pages, start_page=start_page)
        collected_links.extend(jina_links)
        if jina_links:
            return deduplicate_links(collected_links)

        ddg_links = self._duckduckgo_search(query, max_pages, start_page=start_page)
        collected_links.extend(ddg_links)
        if ddg_links:
            return deduplicate_links(collected_links)

        logger.info("DuckDuckGo sem resultados úteis. Usando Bing como fallback.")
        bing_links = self._bing_search(query, max_pages, start_page=start_page)
        collected_links.extend(bing_links)
        return deduplicate_links(collected_links)

    def _jina_google_search(self, query: str, max_pages: int,
                            start_page: int = 1) -> list[str]:
        """
        Busca via r.jina.ai sobre páginas do Google e visita páginas candidatas.

        Este fallback costuma capturar links que não aparecem diretamente
        no HTML dos resultados dos buscadores.
        """
        all_links = []
        session = self._get_session()
        encoded_query = quote_plus(query)
        empty_streak = 0

        page_offset = max(0, start_page - 1)
        for page_idx in range(max_pages):
            page = page_offset + page_idx
            self._query_count += 1
            start = page * 10
            source_url = (
                "http://www.google.com/search?"
                f"q={encoded_query}&start={start}&hl=pt-BR"
            )
            proxy_url = f"https://r.jina.ai/{source_url}"

            time.sleep(random.uniform(GOOGLE_DELAY_MIN, GOOGLE_DELAY_MAX))

            content = self._fetch_page(proxy_url, session)
            if content is None:
                break

            page_links, candidate_urls = self._parse_jina_google_results(content)
            page_links.extend(self._crawl_candidate_pages(candidate_urls, session))
            page_links = deduplicate_links(page_links)
            all_links.extend(page_links)

            if page_links:
                empty_streak = 0
            else:
                empty_streak += 1
                if empty_streak >= 2:
                    break

        return deduplicate_links(all_links)

    def _google_search(self, query: str, max_pages: int,
                       start_page: int = 1) -> list[str] | None:
        """Busca no Google. Retorna None se bloqueado."""
        all_links = []
        session = self._get_session()
        encoded_query = quote_plus(query)

        page_offset = max(0, start_page - 1)
        for page_idx in range(max_pages):
            page = page_offset + page_idx
            self._query_count += 1
            start = page * 10
            url = f"https://www.google.com/search?q={encoded_query}&start={start}&hl=pt-BR"

            # Delay específico para Google
            time.sleep(random.uniform(GOOGLE_DELAY_MIN, GOOGLE_DELAY_MAX))

            html = self._fetch_page(url, session)
            if html is None:
                return None  # Provavelmente bloqueado

            # Detectar CAPTCHA/bloqueio
            if self._is_google_blocked(html):
                logger.warning("Google CAPTCHA detectado.")
                return None

            links = self._parse_google_results(html)
            all_links.extend(links)

            if not links:
                break  # Sem mais resultados

        return all_links

    def _duckduckgo_search(self, query: str, max_pages: int,
                           start_page: int = 1) -> list[str]:
        """Busca no DuckDuckGo HTML (menos agressivo com bloqueios)."""
        all_links = []
        session = self._get_session()
        encoded_query = quote_plus(query)

        page_offset = max(0, start_page - 1)
        for page_idx in range(max_pages):
            page = page_offset + page_idx
            self._query_count += 1

            if page == 0:
                url = f"https://html.duckduckgo.com/html/?q={encoded_query}"
            else:
                url = f"https://html.duckduckgo.com/html/?q={encoded_query}&s={page * 30}"

            time.sleep(random.uniform(GOOGLE_DELAY_MIN, GOOGLE_DELAY_MAX))

            html = self._fetch_page(url, session)
            if html is None:
                break

            links = self._parse_duckduckgo_results(html)
            all_links.extend(links)

            if not links:
                break

        return all_links

    def _bing_search(self, query: str, max_pages: int,
                     start_page: int = 1) -> list[str]:
        """Busca no Bing HTML como fallback quando outros motores falham."""
        all_links = []
        session = self._get_session()
        encoded_query = quote_plus(query)

        page_offset = max(0, start_page - 1)
        for page_idx in range(max_pages):
            page = page_offset + page_idx
            self._query_count += 1
            first = page * 10 + 1
            url = (
                "https://www.bing.com/search?"
                f"q={encoded_query}&first={first}&setlang=pt-BR"
            )

            time.sleep(random.uniform(GOOGLE_DELAY_MIN, GOOGLE_DELAY_MAX))

            html = self._fetch_page(url, session)
            if html is None:
                break

            links = self._parse_bing_results(html)
            all_links.extend(links)

            if not links:
                break

        return deduplicate_links(all_links)

    def _is_google_blocked(self, html: str) -> bool:
        """Detecta se o Google está mostrando CAPTCHA ou bloqueio."""
        indicators = [
            "captcha", "unusual traffic", "not a robot",
            "recaptcha", "sorry/index", "detected unusual traffic",
        ]
        html_lower = html.lower()
        return any(ind in html_lower for ind in indicators)

    def _parse_google_results(self, html: str) -> list[str]:
        """Extrai links de grupos dos resultados do Google."""
        links = []
        soup = BeautifulSoup(html, "lxml")

        # Extrair dos snippets de texto e URLs de resultado
        for tag in soup.find_all(["a", "span", "div", "cite"]):
            text = tag.get_text(" ", strip=True)
            links.extend(extract_all_links(text))

            # Verificar hrefs
            href = tag.get("href", "")
            links.extend(extract_all_links(href))

        # Busca regex direto no HTML inteiro como fallback
        links.extend(extract_all_links(html))

        return deduplicate_links(links)

    def _parse_duckduckgo_results(self, html: str) -> list[str]:
        """Extrai links de grupos dos resultados do DuckDuckGo."""
        links = []
        soup = BeautifulSoup(html, "lxml")

        # Resultados do DuckDuckGo HTML
        for result in soup.find_all("a", class_="result__a"):
            href = result.get("href", "")
            links.extend(extract_all_links(href))
            text = result.get_text(" ", strip=True)
            links.extend(extract_all_links(text))

        # Snippets
        for snippet in soup.find_all("a", class_="result__snippet"):
            text = snippet.get_text(" ", strip=True)
            links.extend(extract_all_links(text))

        # Fallback: regex no HTML inteiro
        links.extend(extract_all_links(html))

        return deduplicate_links(links)

    def _parse_bing_results(self, html: str) -> list[str]:
        """Extrai links de grupos dos resultados do Bing."""
        links = []
        soup = BeautifulSoup(html, "lxml")

        for result_link in soup.select("li.b_algo h2 a"):
            href = result_link.get("href", "")
            links.extend(extract_all_links(href))
            links.extend(extract_all_links(result_link.get_text(" ", strip=True)))

        for snippet in soup.select("li.b_algo .b_caption p"):
            links.extend(extract_all_links(snippet.get_text(" ", strip=True)))

        # Fallback: regex no HTML inteiro
        links.extend(extract_all_links(html))

        return deduplicate_links(links)

    def _parse_jina_google_results(self, content: str) -> tuple[list[str], list[str]]:
        """Extrai links diretos e URLs candidatas de saída do texto via jina."""
        direct_links = extract_all_links(content)
        raw_urls = re.findall(r"\]\((https?://[^)\s]+)\)", content)

        expanded_candidates = []
        for raw_url in raw_urls:
            cleaned = raw_url.strip()
            expanded_candidates.append(cleaned)
            expanded_candidates.append(self._unwrap_candidate_url(cleaned))

        deduped_candidates = self._dedupe_urls(expanded_candidates)

        # Prioriza URLs externas (não buscador) antes de limitar a lista.
        external = [
            url for url in deduped_candidates
            if not self._should_skip_candidate_url(url)
        ]
        if external:
            candidate_urls = external[:_JINA_MAX_CANDIDATE_URLS]
        else:
            candidate_urls = deduped_candidates[:_JINA_MAX_CANDIDATE_URLS]

        return deduplicate_links(direct_links), candidate_urls

    def _crawl_candidate_pages(self, candidate_urls: list[str], session) -> list[str]:
        """Visita páginas candidatas e extrai links de grupo do HTML."""
        links = []
        crawled = 0

        for candidate_url in candidate_urls:
            if crawled >= _JINA_MAX_CANDIDATE_PAGES:
                break

            url = candidate_url.strip().rstrip(").,")
            if self._should_skip_candidate_url(url):
                continue
            if url in self._visited_candidate_urls:
                continue

            self._visited_candidate_urls.add(url)
            crawled += 1

            # Alguns resultados já carregam o link de convite no próprio URL.
            links.extend(extract_all_links(url))

            html = self._fetch_page(url, session)
            if html:
                links.extend(extract_all_links(html))

        return deduplicate_links(links)

    def _should_skip_candidate_url(self, url: str) -> bool:
        """Filtra URLs internas de buscador e entradas inválidas."""
        try:
            parsed = urlparse(url)
        except Exception:
            return True

        host = parsed.netloc.lower()
        if not host or parsed.scheme not in ("http", "https"):
            return True

        skip_hosts = (
            "google.com",
            "google.com.br",
            "duckduckgo.com",
            "bing.com",
            "r.jina.ai",
            "support.google.com",
        )
        if any(host == h or host.endswith(f".{h}") for h in skip_hosts):
            return True

        return False

    def _dedupe_urls(self, urls: list[str]) -> list[str]:
        """Deduplica URLs preservando ordem."""
        seen = set()
        deduped = []
        for url in urls:
            key = url.lower()
            if key in seen:
                continue
            seen.add(key)
            deduped.append(url)
        return deduped

    def _unwrap_candidate_url(self, url: str) -> str:
        """Desembrulha URLs de redirect de buscador para URL de destino."""
        try:
            parsed = urlparse(url)
        except Exception:
            return url

        host = parsed.netloc.lower()
        if "google." not in host:
            return url

        params = parse_qs(parsed.query, keep_blank_values=False)
        for key in ("url", "q"):
            values = params.get(key) or []
            for value in values:
                if value.startswith(("http://", "https://")):
                    return value

        return url
