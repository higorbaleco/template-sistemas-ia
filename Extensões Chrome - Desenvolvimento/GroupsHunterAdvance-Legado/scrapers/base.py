"""Classe base abstrata para todos os scrapers."""
from __future__ import annotations

import logging
import random
import time
from abc import ABC, abstractmethod

import requests

from config import REQUEST_TIMEOUT
from services.rate_limiter import RateLimiter

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Classe base com sessão HTTP, rotação de User-Agent e rate limiting."""

    def __init__(self, rate_limiter: RateLimiter | None = None):
        self._rate_limiter = rate_limiter or RateLimiter()
        self.reset_metrics()

    def reset_metrics(self) -> None:
        """Reseta métricas acumuladas do scraper."""
        self._metrics = {
            "requests": 0,
            "status_200": 0,
            "status_429": 0,
            "timeouts": 0,
            "connection_errors": 0,
            "request_errors": 0,
            "blocked_signals": 0,
            "empty_responses": 0,
            "last_failure_reason": "",
        }

    def get_metrics(self) -> dict:
        """Retorna cópia das métricas coletadas."""
        return dict(self._metrics)

    def _mark_failure(self, reason: str) -> None:
        self._metrics["last_failure_reason"] = reason

    # User-Agents fixos de Chrome recente para evitar respostas estranhas
    _CHROME_UAS = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    ]

    def _get_session(self) -> requests.Session:
        """Cria uma sessão com headers de Chrome realistas."""
        session = requests.Session()
        session.headers.update({
            "User-Agent": random.choice(self._CHROME_UAS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Encoding": "gzip, deflate",  # sem brotli — requests não decodifica
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Cache-Control": "no-cache",
        })
        return session

    def _fetch_page(self, url: str, session: requests.Session | None = None, retries: int = 2) -> str | None:
        """Faz GET em uma URL com rate limiting, retry logic e error handling."""
        self._rate_limiter.wait(url)
        
        for attempt in range(retries + 1):
            self._metrics["requests"] += 1
            sess = session or self._get_session()
            
            try:
                response = sess.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
                
                if response.status_code == 200:
                    self._metrics["status_200"] += 1
                    text = response.text or ""
                    if not text.strip():
                        self._metrics["empty_responses"] += 1
                        self._mark_failure("empty_response")
                        return None
                    
                    lowered = text[:5000].lower()
                    block_markers = ("captcha", "cloudflare", "access denied", "forbidden", "bot detected", "verify you are human")
                    if any(marker in lowered for marker in block_markers):
                        self._metrics["blocked_signals"] += 1
                        self._mark_failure("captcha_protected")
                    return response.text
                    
                elif response.status_code == 429:
                    self._metrics["status_429"] += 1
                    self._metrics["blocked_signals"] += 1
                    if attempt < retries:
                        backoff = (2 ** attempt) + random.uniform(0, 1)
                        logger.info(f"Rate limited (429) em: {url} | Retry em {backoff:.1f}s")
                        time.sleep(backoff)
                        continue
                    else:
                        logger.warning(f"Rate limited (429) em: {url} | Sem retries restantes")
                        self._mark_failure("rate_limited")
                        return None
                        
                elif response.status_code in (401, 403, 405, 406, 409, 418, 451, 503):
                    logger.warning(f"Status {response.status_code} (bloqueado) em: {url}")
                    self._metrics["blocked_signals"] += 1
                    self._mark_failure("blocked_http")
                    return None
                else:
                    logger.warning(f"Status {response.status_code} em: {url}")
                    self._mark_failure(f"http_{response.status_code}")
                    return None
                    
            except requests.exceptions.Timeout:
                if attempt < retries:
                    logger.info(f"Timeout em: {url} | Tentativa {attempt + 1}/{retries}")
                    time.sleep(1 + attempt)
                    continue
                else:
                    logger.warning(f"Timeout ao acessar: {url} (sem retries)")
                    self._metrics["timeouts"] += 1
                    self._mark_failure("timeout")
                    return None
                    
            except requests.exceptions.ConnectionError:
                if attempt < retries:
                    logger.info(f"Erro de conexão em: {url} | Retry...")
                    time.sleep(1)
                    continue
                else:
                    logger.warning(f"Erro de conexão: {url}")
                    self._metrics["connection_errors"] += 1
                    self._mark_failure("connection_error")
                    return None
                    
            except requests.exceptions.RequestException as e:
                logger.warning(f"Erro ao acessar {url}: {e}")
                self._metrics["request_errors"] += 1
                self._mark_failure("request_error")
                return None
        
        return None

    @abstractmethod
    def scrape(self, keyword: str, max_pages: int = 3, **kwargs) -> list[str]:
        """Executa o scraping e retorna lista de links encontrados."""
        ...
