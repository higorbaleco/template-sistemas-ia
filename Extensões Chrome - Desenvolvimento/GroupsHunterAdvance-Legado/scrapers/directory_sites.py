"""Scraper para sites diretório de grupos (WhatsApp e Telegram)."""
from __future__ import annotations

import logging
import re
import time
from urllib.parse import quote_plus, urljoin, urlparse

from bs4 import BeautifulSoup

from config import (
    BROWSER_FALLBACK_ALLOWLIST,
    BROWSER_FALLBACK_MAX_PAGES,
    BROWSER_FALLBACK_MAX_SECONDS_PER_SITE,
    BROWSER_FALLBACK_MAX_TOTAL_SECONDS,
    DIRECTORY_SITES,
    REQUEST_TIMEOUT,
)
from scrapers.base import BaseScraper
from scrapers.browser_fallback import BrowserFallbackFetcher
from scrapers.google_search import GoogleSearchScraper
from scrapers.link_extractor import (
    deduplicate_links,
    extract_telegram_links,
    extract_whatsapp_links,
)
from services.rate_limiter import RateLimiter

logger = logging.getLogger(__name__)

_DIRECT_MAX_CANDIDATES = 36
_DIRECT_MAX_CRAWL_PAGES = 18
_DIRECT_MAX_JOIN_CHECKS = 24
_JOIN_TIMEOUT = 6
_UTILITY_PATH_TOKENS = (
    "/login",
    "/signin",
    "/register",
    "/signup",
    "/contato",
    "/contact",
    "/sobre",
    "/about",
    "/termos",
    "/terms",
    "/privacy",
    "/politica",
    "/cookies",
    "/sitemap",
    "/feed",
    "/tag/",
    "/author/",
)
_GROUP_PATH_HINTS = (
    "/group/",
    "/grupos/",
    "/grupo/",
    "/category/",
    "/categoria/",
)
_ASSET_EXTENSIONS = (
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg",
    ".ico", ".css", ".js", ".json", ".xml", ".woff", ".woff2",
)


class DirectorySiteScraper(BaseScraper):
    """Scraper para sites brasileiros de diretório de grupos.

    Estratégias suportadas:
    - "search_engine": usa query `site:dominio` e extrai convites.
    - "direct": varredura direta do site com seeds/crawl interno.
    - "browser": igual ao direct com fallback de renderização.
    - "redirect": listagem com IDs + endpoint que devolve 302.
    - "html": extrai links diretamente do HTML.
    """

    def __init__(self, rate_limiter: RateLimiter | None = None):
        super().__init__(rate_limiter)
        self._browser_fallback = BrowserFallbackFetcher()
        self._browser_budget_remaining = BROWSER_FALLBACK_MAX_TOTAL_SECONDS

    def scrape(
        self,
        keyword: str,
        max_pages: int = 3,
        start_page: int = 1,
        sites: list[str] | None = None,
        link_types: list[str] | None = None,
        progress_callback=None,
    ) -> list[str]:
        """Busca links em sites diretório de grupos."""
        self.reset_metrics()
        self._browser_budget_remaining = BROWSER_FALLBACK_MAX_TOTAL_SECONDS

        selected_sites = [
            key for key in (sites or list(DIRECTORY_SITES.keys()))
            if key in DIRECTORY_SITES
        ]
        if not selected_sites:
            return []

        rotation_index = (max(1, start_page) - 1) % len(selected_sites)
        if rotation_index:
            selected_sites = (
                selected_sites[rotation_index:] + selected_sites[:rotation_index]
            )

        channel_types = link_types or ["whatsapp", "telegram"]
        all_links: list[str] = []
        pages_plan = self._build_pages_plan(max_pages, len(selected_sites))

        for site_key, pages_for_site in zip(selected_sites, pages_plan):
            if pages_for_site <= 0:
                continue

            site_config = DIRECTORY_SITES[site_key]
            strategy = site_config.get("strategy", "search_engine")

            if progress_callback:
                progress_callback(
                    f"Buscando em {site_config['name']} "
                    f"(páginas {start_page} a {start_page + pages_for_site - 1})..."
                )

            try:
                if strategy == "redirect":
                    links = self._scrape_redirect_site(
                        site_config=site_config,
                        keyword=keyword,
                        max_pages=pages_for_site,
                        start_page=start_page,
                        progress_callback=progress_callback,
                    )
                elif strategy == "html":
                    links = self._scrape_html_site(
                        site_config=site_config,
                        keyword=keyword,
                        max_pages=pages_for_site,
                        start_page=start_page,
                    )
                elif strategy in ("direct", "browser"):
                    links = self._scrape_site_direct(
                        site_config=site_config,
                        keyword=keyword,
                        max_pages=pages_for_site,
                        start_page=start_page,
                        link_types=channel_types,
                    )
                    if (
                        strategy == "browser"
                        and not links
                        and self._should_use_browser_fallback(site_config)
                    ):
                        links = self._scrape_site_browser_fallback(
                            site_config=site_config,
                            keyword=keyword,
                            max_pages=pages_for_site,
                            start_page=start_page,
                            link_types=channel_types,
                            progress_callback=progress_callback,
                        )
                else:
                    links = self._scrape_search_engine_site(
                        site_config=site_config,
                        keyword=keyword,
                        max_pages=pages_for_site,
                        start_page=start_page,
                        link_types=channel_types,
                        progress_callback=progress_callback,
                    )

                all_links.extend(links)
                logger.info("%s: %d links encontrados", site_config["name"], len(links))
            except Exception as exc:
                logger.error("Erro ao buscar em %s: %s", site_config["name"], exc)
                if progress_callback:
                    progress_callback(f"Erro em {site_config['name']}: {str(exc)[:80]}")

        return deduplicate_links(all_links)

    def _build_pages_plan(self, max_pages: int, item_count: int) -> list[int]:
        """Distribui o orçamento de páginas entre múltiplos sites."""
        if item_count <= 0:
            return []

        total_pages = max(1, int(max_pages))
        if total_pages >= item_count:
            base = total_pages // item_count
            extra = total_pages % item_count
            return [
                base + (1 if idx < extra else 0)
                for idx in range(item_count)
            ]

        return [1 if idx < total_pages else 0 for idx in range(item_count)]

    def _resolve_link_domains(
        self, site_type: str, link_types: list[str]
    ) -> list[str]:
        """Resolve domínios de convite permitidos para um site."""
        domains = []
        if site_type in ("whatsapp", "both") and "whatsapp" in link_types:
            domains.append("chat.whatsapp.com")
        if site_type in ("telegram", "both") and "telegram" in link_types:
            domains.append("t.me")
        return domains

    def _scrape_search_engine_site(
        self,
        site_config: dict,
        keyword: str,
        max_pages: int,
        start_page: int,
        link_types: list[str],
        progress_callback=None,
    ) -> list[str]:
        """Busca por domínio (`site:...`) e extrai links de convite."""
        domain = site_config.get("domain", "").strip().lower()
        if not domain:
            return []

        google = GoogleSearchScraper(self._rate_limiter)
        link_domains = self._resolve_link_domains(
            site_config.get("type", "both"), link_types
        )
        if not link_domains:
            return []

        queries = [
            f'site:{domain} "{link_domain}" "{keyword}"'
            for link_domain in link_domains
        ]
        pages_plan = self._build_pages_plan(max_pages, len(queries))

        links: list[str] = []
        for query, pages_for_query in zip(queries, pages_plan):
            if pages_for_query <= 0:
                continue
            links.extend(
                google.search_query(
                    query=query,
                    max_pages=pages_for_query,
                    start_page=start_page,
                )
            )

        links = deduplicate_links(links)
        if links:
            return links

        if progress_callback:
            progress_callback(
                f"{site_config['name']}: buscadores bloqueados/sem retorno. "
                "Tentando varredura direta no site..."
            )

        fallback_links = self._scrape_site_direct(
            site_config=site_config,
            keyword=keyword,
            max_pages=max_pages,
            start_page=start_page,
            link_types=link_types,
        )
        links.extend(fallback_links)
        if not links and self._should_use_browser_fallback(site_config):
            browser_links = self._scrape_site_browser_fallback(
                site_config=site_config,
                keyword=keyword,
                max_pages=max_pages,
                start_page=start_page,
                link_types=link_types,
                progress_callback=progress_callback,
            )
            links.extend(browser_links)
        return deduplicate_links(links)

    def _scrape_site_direct(
        self,
        site_config: dict,
        keyword: str,
        max_pages: int,
        start_page: int,
        link_types: list[str],
    ) -> list[str]:
        """Varredura direta por padrões comuns de busca/paginação no site."""
        domain = site_config.get("domain", "").strip().lower()
        if not domain:
            return []

        session = self._get_session()
        site_type = site_config.get("type", "both")

        first_page = max(1, start_page)
        last_page = first_page + max_pages - 1

        all_links: list[str] = []
        seen_seed_urls: set[str] = set()
        seen_candidate_urls: set[str] = set()
        seen_join_urls: set[str] = set()
        candidate_urls: list[str] = []
        join_urls: list[str] = []

        for page in range(first_page, last_page + 1):
            seed_urls = self._build_direct_seed_urls(domain, keyword, page)
            for seed_url in seed_urls:
                if seed_url in seen_seed_urls:
                    continue
                seen_seed_urls.add(seed_url)

                html = self._fetch_page(seed_url, session)
                if html is None:
                    continue

                all_links.extend(
                    self._extract_links_from_html(
                        html=html,
                        site_type=site_type,
                        link_types=link_types,
                    )
                )
                self._collect_join_urls(
                    html=html,
                    base_url=seed_url,
                    domain=domain,
                    seen_join_urls=seen_join_urls,
                    join_urls=join_urls,
                )

                discovered = self._extract_candidate_urls(
                    html=html,
                    base_url=seed_url,
                    domain=domain,
                    keyword=keyword,
                )
                for candidate in discovered:
                    if candidate in seen_candidate_urls:
                        continue
                    seen_candidate_urls.add(candidate)
                    candidate_urls.append(candidate)
                    if len(candidate_urls) >= _DIRECT_MAX_CANDIDATES:
                        break
                if len(candidate_urls) >= _DIRECT_MAX_CANDIDATES:
                    break
            if len(candidate_urls) >= _DIRECT_MAX_CANDIDATES:
                break

        for candidate in candidate_urls[:_DIRECT_MAX_CRAWL_PAGES]:
            html = self._fetch_page(candidate, session)
            if html is None:
                continue
            all_links.extend(
                self._extract_links_from_html(
                    html=html,
                    site_type=site_type,
                    link_types=link_types,
                )
            )
            self._collect_join_urls(
                html=html,
                base_url=candidate,
                domain=domain,
                seen_join_urls=seen_join_urls,
                join_urls=join_urls,
            )

        for join_url in join_urls[:_DIRECT_MAX_JOIN_CHECKS]:
            invite = self._resolve_join_url(
                join_url=join_url,
                session=session,
                site_type=site_type,
                link_types=link_types,
            )
            if invite:
                all_links.append(invite)

        return deduplicate_links(all_links)

    def _should_use_browser_fallback(self, site_config: dict) -> bool:
        domain = site_config.get("domain", "").strip().lower()
        if not domain:
            return False
        if site_config.get("strategy") == "browser":
            return True
        return domain in BROWSER_FALLBACK_ALLOWLIST

    def _scrape_site_browser_fallback(
        self,
        site_config: dict,
        keyword: str,
        max_pages: int,
        start_page: int,
        link_types: list[str],
        progress_callback=None,
    ) -> list[str]:
        """Fallback controlado de renderização dinâmica para sites difíceis."""
        domain = site_config.get("domain", "").strip().lower()
        if not domain:
            return []
        if self._browser_budget_remaining <= 1:
            return []

        pages = max(1, min(int(max_pages), BROWSER_FALLBACK_MAX_PAGES))
        site_timeout = min(
            BROWSER_FALLBACK_MAX_SECONDS_PER_SITE,
            max(3, int(self._browser_budget_remaining)),
        )

        site_type = site_config.get("type", "both")
        all_links: list[str] = []
        seen_candidates: set[str] = set()
        candidates: list[str] = []

        first_page = max(1, start_page)
        last_page = first_page + pages - 1
        started = time.perf_counter()
        if progress_callback:
            progress_callback(
                f"{site_config['name']}: ativando fallback browser controlado..."
            )

        for page in range(first_page, last_page + 1):
            if (time.perf_counter() - started) >= site_timeout:
                break
            for seed_url in self._build_direct_seed_urls(domain, keyword, page):
                if (time.perf_counter() - started) >= site_timeout:
                    break
                html, source = self._browser_fallback.fetch(
                    seed_url,
                    timeout_sec=max(3, site_timeout - int(time.perf_counter() - started)),
                )
                if not html:
                    continue
                if progress_callback:
                    progress_callback(
                        f"{site_config['name']}: fallback {source} capturou página dinâmica."
                    )
                all_links.extend(
                    self._extract_links_from_html(
                        html=html,
                        site_type=site_type,
                        link_types=link_types,
                    )
                )
                discovered = self._extract_candidate_urls(
                    html=html,
                    base_url=seed_url,
                    domain=domain,
                    keyword=keyword,
                )
                for candidate in discovered:
                    if candidate in seen_candidates:
                        continue
                    seen_candidates.add(candidate)
                    candidates.append(candidate)

        for candidate in candidates[:BROWSER_FALLBACK_MAX_PAGES]:
            if (time.perf_counter() - started) >= site_timeout:
                break
            html, _ = self._browser_fallback.fetch(
                candidate,
                timeout_sec=max(3, site_timeout - int(time.perf_counter() - started)),
            )
            if not html:
                continue
            all_links.extend(
                self._extract_links_from_html(
                    html=html,
                    site_type=site_type,
                    link_types=link_types,
                )
            )

        elapsed = max(0.0, time.perf_counter() - started)
        self._browser_budget_remaining = max(0.0, self._browser_budget_remaining - elapsed)
        return deduplicate_links(all_links)

    def _build_direct_seed_urls(self, domain: str, keyword: str, page: int) -> list[str]:
        """Monta URLs comuns de busca/paginação para sites de diretórios."""
        keyword = keyword.strip()
        encoded = quote_plus(keyword)
        slug = re.sub(r"[^a-z0-9]+", "-", keyword.lower()).strip("-")

        if page == 1:
            urls = [
                f"https://{domain}/?s={encoded}",
                f"https://{domain}/?q={encoded}",
                f"https://{domain}/?search={encoded}",
                f"https://{domain}/search?q={encoded}",
                f"https://{domain}/search/{slug}",
                f"https://{domain}/busca/{slug}",
                f"https://{domain}/",
            ]
        else:
            urls = [
                f"https://{domain}/page/{page}/?s={encoded}",
                f"https://{domain}/?s={encoded}&page={page}",
                f"https://{domain}/?s={encoded}&paged={page}",
                f"https://{domain}/search?q={encoded}&page={page}",
                f"https://{domain}/search/{slug}/page/{page}",
                f"https://{domain}/busca/{slug}/page/{page}",
                f"https://{domain}/page/{page}/",
            ]

        # Remove vazios e duplicatas mantendo ordem.
        clean_urls = []
        seen = set()
        for url in urls:
            if not url or url in seen:
                continue
            seen.add(url)
            clean_urls.append(url)
        return clean_urls

    def _extract_candidate_urls(
        self,
        html: str,
        base_url: str,
        domain: str,
        keyword: str,
    ) -> list[str]:
        """Extrai URLs candidatas do mesmo domínio para crawl secundário."""
        soup = BeautifulSoup(html, "lxml")
        tokens = [
            t.lower() for t in re.findall(r"[a-z0-9]+", keyword.lower())
            if len(t) >= 3
        ]

        ranked: list[tuple[int, str]] = []
        seen: set[str] = set()

        def consider(url: str, text: str = "") -> None:
            normalized = self._normalize_internal_url(
                raw_url=url,
                base_url=base_url,
                domain=domain,
            )
            if not normalized or normalized in seen:
                return
            seen.add(normalized)
            priority = self._candidate_priority(
                url=normalized,
                tokens=tokens,
                text=text,
            )
            if priority <= 0:
                return
            ranked.append((priority, normalized))

        for a_tag in soup.find_all("a", href=True):
            href = (a_tag.get("href") or "").strip()
            if not href:
                continue
            if href.startswith(("javascript:", "mailto:", "tel:", "#")):
                continue
            consider(
                href,
                text=a_tag.get_text(" ", strip=True) or "",
            )

        for form in soup.find_all("form"):
            action = (form.get("action") or "").strip()
            if not action:
                continue
            consider(action, text=(form.get("id") or "form"))

        for script_url in self._extract_internal_urls_from_text(
            text=html,
            base_url=base_url,
            domain=domain,
        ):
            consider(script_url, text="script")

        ranked.sort(key=lambda item: item[0], reverse=True)
        return [url for _, url in ranked[:_DIRECT_MAX_CANDIDATES]]

    def _collect_join_urls(
        self,
        html: str,
        base_url: str,
        domain: str,
        seen_join_urls: set[str],
        join_urls: list[str],
    ) -> None:
        """Coleta endpoints internos de entrada/convite para resolver redirect."""
        soup = BeautifulSoup(html, "lxml")
        candidates: list[str] = []

        for a_tag in soup.find_all("a", href=True):
            href = (a_tag.get("href") or "").strip()
            if not href:
                continue
            if href.startswith(("javascript:", "mailto:", "tel:", "#")):
                continue
            candidates.append(href)

        for form in soup.find_all("form"):
            action = (form.get("action") or "").strip()
            if action:
                candidates.append(action)

        candidates.extend(
            self._extract_internal_urls_from_text(
                text=html,
                base_url=base_url,
                domain=domain,
            )
        )

        for raw_url in candidates:
            resolved = self._normalize_internal_url(
                raw_url=raw_url,
                base_url=base_url,
                domain=domain,
            )
            if not resolved:
                continue
            parsed = urlparse(resolved)
            path_lower = parsed.path.lower()
            if not any(token in path_lower for token in ("join", "entrar", "convite", "invite", "redirect")):
                continue

            if self._is_utility_url(resolved):
                continue

            if resolved in seen_join_urls:
                continue
            seen_join_urls.add(resolved)
            join_urls.append(resolved)

    def _normalize_internal_url(self, raw_url: str, base_url: str, domain: str) -> str:
        raw_url = (raw_url or "").strip()
        if not raw_url:
            return ""
        if raw_url.startswith(("javascript:", "mailto:", "tel:", "#")):
            return ""

        resolved = urljoin(base_url, raw_url).split("#", 1)[0]
        parsed = urlparse(resolved)
        host = parsed.netloc.lower()
        if not host:
            return ""
        if not (host == domain or host.endswith(f".{domain}")):
            return ""
        if parsed.scheme not in ("http", "https"):
            return ""
        if any(parsed.path.lower().endswith(ext) for ext in _ASSET_EXTENSIONS):
            return ""
        return resolved

    def _candidate_priority(self, url: str, tokens: list[str], text: str = "") -> int:
        lowered = f"{url} {text}".lower()
        parsed = urlparse(url)
        path_lower = parsed.path.lower()
        score = 0
        if any(hint in path_lower for hint in _GROUP_PATH_HINTS):
            score += 9
        if any(tok in path_lower for tok in ("join", "entrar", "invite", "convite")):
            score += 7
        if "/api/groups/" in path_lower and "/invite" in path_lower:
            score += 8
        if "group/" in lowered:
            score += 3
        if tokens and any(token in lowered for token in tokens):
            score += 3
        if self._is_utility_url(url):
            score -= 8
        return score

    def _is_utility_url(self, url: str) -> bool:
        path_lower = urlparse(url).path.lower()
        if any(hint in path_lower for hint in _GROUP_PATH_HINTS):
            return False
        return any(token in path_lower for token in _UTILITY_PATH_TOKENS)

    def _extract_internal_urls_from_text(
        self,
        text: str,
        base_url: str,
        domain: str,
    ) -> list[str]:
        """Extrai URLs internas candidatas de scripts e blobs de texto."""
        candidates: list[str] = []
        if not text:
            return candidates

        snippet = text
        if len(snippet) > 1_500_000:
            snippet = snippet[:1_500_000]
        snippet = snippet.replace("\\/", "/")

        quoted = re.findall(
            r"""["'](https?://[^"'<> ]+|/[A-Za-z0-9_\-./?=&%]+)["']""",
            snippet,
        )
        for raw in quoted:
            normalized = self._normalize_internal_url(
                raw_url=raw,
                base_url=base_url,
                domain=domain,
            )
            if not normalized:
                continue
            path_lower = urlparse(normalized).path.lower()
            if (
                any(hint in path_lower for hint in _GROUP_PATH_HINTS)
                or any(tok in path_lower for tok in ("join", "entrar", "invite", "convite"))
                or "/api/groups/" in path_lower
            ):
                candidates.append(normalized)

        fallback_paths = re.findall(
            r"""fallbackHref\\?":\\?"(/[^"\\]+join[^"\\]*)""",
            snippet,
            flags=re.IGNORECASE,
        )
        for path in fallback_paths:
            normalized = self._normalize_internal_url(
                raw_url=path,
                base_url=base_url,
                domain=domain,
            )
            if normalized:
                candidates.append(normalized)

        return deduplicate_links(candidates)

    def _resolve_join_url(
        self,
        join_url: str,
        session,
        site_type: str,
        link_types: list[str],
    ) -> str | None:
        """Resolve URL interna de join até encontrar convite WA/TG."""
        self._rate_limiter.wait(join_url)
        try:
            response = session.get(
                join_url,
                timeout=_JOIN_TIMEOUT,
                allow_redirects=False,
            )
            location = response.headers.get("Location", "").strip()
            if location:
                resolved = urljoin(join_url, location)
                if self._is_allowed_invite_link(resolved, site_type, link_types):
                    return resolved
        except Exception:
            return None

        try:
            response = session.get(
                join_url,
                timeout=_JOIN_TIMEOUT,
                allow_redirects=True,
            )
            if self._is_allowed_invite_link(response.url, site_type, link_types):
                return response.url

            links = self._extract_links_from_html(
                html=response.text,
                site_type=site_type,
                link_types=link_types,
            )
            if links:
                return links[0]
        except Exception:
            return None

        return None

    def _is_allowed_invite_link(
        self,
        url: str,
        site_type: str,
        link_types: list[str],
    ) -> bool:
        """Valida se URL encontrada respeita canais permitidos."""
        url_lower = (url or "").lower()
        if "chat.whatsapp.com" in url_lower:
            return site_type in ("whatsapp", "both") and "whatsapp" in link_types
        if "t.me/" in url_lower:
            return site_type in ("telegram", "both") and "telegram" in link_types
        return False

    def _extract_links_from_html(
        self,
        html: str,
        site_type: str,
        link_types: list[str],
    ) -> list[str]:
        """Extrai links válidos do HTML respeitando canal solicitado."""
        links: list[str] = []
        if site_type in ("whatsapp", "both") and "whatsapp" in link_types:
            links.extend(extract_whatsapp_links(html))
        if site_type in ("telegram", "both") and "telegram" in link_types:
            links.extend(extract_telegram_links(html))
        return deduplicate_links(links)

    def _scrape_redirect_site(
        self,
        site_config: dict,
        keyword: str,
        max_pages: int,
        start_page: int = 1,
        progress_callback=None,
    ) -> list[str]:
        """Estratégia para sites que escondem o link atrás de redirect."""
        all_links = []
        session = self._get_session()
        id_pattern = re.compile(site_config["id_pattern"])
        join_url_tpl = site_config["join_url"]
        seen_ids: set[str] = set()

        first_page = max(1, start_page)
        last_page = first_page + max_pages - 1

        for page in range(first_page, last_page + 1):
            if page == 1:
                url = site_config["search_url"].format(keyword=keyword)
            else:
                url = site_config["paginated_url"].format(keyword=keyword, page=page)

            html = self._fetch_page(url, session)
            if html is None:
                break

            page_ids = list(dict.fromkeys(id_pattern.findall(html)))
            if not page_ids:
                break

            new_ids = [group_id for group_id in page_ids if group_id not in seen_ids]
            seen_ids.update(new_ids)

            if progress_callback:
                progress_callback(
                    f"{site_config['name']}: página {page} - "
                    f"{len(new_ids)} grupos encontrados..."
                )

            for group_id in new_ids:
                join_url = join_url_tpl.format(id=group_id)
                link = self._follow_redirect(join_url, session)
                if link:
                    all_links.append(link)

        return deduplicate_links(all_links)

    def _follow_redirect(self, url: str, session) -> str | None:
        """Segue redirect e devolve o destino quando for convite WA/TG."""
        self._rate_limiter.wait(url)
        try:
            response = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=False)
            location = response.headers.get("Location", "")
            if "chat.whatsapp.com" in location or "t.me" in location:
                return location.strip()

            if response.status_code == 200:
                meta = re.search(r'url=["\']?(https?://[^"\'>\s]+)', response.text, re.I)
                if meta:
                    candidate = meta.group(1)
                    if "chat.whatsapp.com" in candidate or "t.me" in candidate:
                        return candidate.strip()
        except Exception as exc:
            logger.warning("Erro ao seguir redirect %s: %s", url, exc)
        return None

    def _scrape_html_site(
        self,
        site_config: dict,
        keyword: str,
        max_pages: int,
        start_page: int = 1,
    ) -> list[str]:
        """Estratégia legada: extrai links diretamente do HTML."""
        all_links = []
        session = self._get_session()

        first_page = max(1, start_page)
        last_page = first_page + max_pages - 1

        for page in range(first_page, last_page + 1):
            if page == 1:
                url = site_config["search_url"].format(keyword=keyword)
            else:
                url = site_config["paginated_url"].format(keyword=keyword, page=page)

            html = self._fetch_page(url, session)
            if html is None:
                break

            links = self._parse_html_page(html, site_config)
            all_links.extend(links)
            if not links:
                break

        return deduplicate_links(all_links)

    def _parse_html_page(self, html: str, site_config: dict) -> list[str]:
        """Parseia uma página HTML buscando links de grupos."""
        links = []
        soup = BeautifulSoup(html, "lxml")

        selector = site_config.get("link_selector", "")
        if selector:
            for tag in soup.select(selector):
                href = tag.get("href", "")
                if href:
                    links.append(href)

        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]
            if "chat.whatsapp.com" in href or "t.me" in href:
                links.append(href)

        site_type = site_config.get("type", "both")
        if site_type in ("whatsapp", "both"):
            links.extend(extract_whatsapp_links(html))
        if site_type in ("telegram", "both"):
            links.extend(extract_telegram_links(html))

        return deduplicate_links(links)
