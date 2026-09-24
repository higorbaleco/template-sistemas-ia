"""Fallback de renderização para páginas com JS/anti-bot."""
from __future__ import annotations

import contextlib
import logging
import time

import requests

from config import REQUEST_TIMEOUT

logger = logging.getLogger(__name__)


class BrowserFallbackFetcher:
    """Busca HTML renderizado via Playwright (quando disponível) ou jina."""

    def __init__(self):
        self._playwright_available: bool | None = None

    def _fetch_via_playwright(self, url: str, timeout_sec: int) -> str | None:
        if self._playwright_available is False:
            return None

        try:
            from playwright.sync_api import sync_playwright  # type: ignore
        except Exception:
            self._playwright_available = False
            return None

        self._playwright_available = True
        timeout_ms = max(1_000, int(timeout_sec * 1000))
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            try:
                page = browser.new_page()
                page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
                with contextlib.suppress(Exception):
                    page.wait_for_timeout(600)
                return page.content()
            finally:
                with contextlib.suppress(Exception):
                    browser.close()

    def _fetch_via_jina(self, url: str, timeout_sec: int) -> str | None:
        proxy_url = f"https://r.jina.ai/{url}"
        try:
            response = requests.get(
                proxy_url,
                timeout=max(3, min(REQUEST_TIMEOUT, timeout_sec)),
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/124.0.0.0 Safari/537.36"
                    ),
                    "Accept": "text/plain,text/html,*/*",
                },
            )
            if response.status_code != 200:
                return None
            return response.text
        except Exception:
            return None

    def fetch(self, url: str, timeout_sec: int = 10) -> tuple[str | None, str]:
        """Retorna (html, origem) para o fallback de renderização."""
        start = time.perf_counter()

        html = self._fetch_via_playwright(url, timeout_sec=timeout_sec)
        if html:
            return html, "playwright"

        remaining = max(2, int(timeout_sec - (time.perf_counter() - start)))
        html = self._fetch_via_jina(url, timeout_sec=remaining)
        if html:
            return html, "jina"

        return None, "none"
