"""Serviço de orquestração que coordena scrapers e validação."""
from __future__ import annotations

import logging
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

from config import (
    CATEGORIES,
    DEFAULT_EXECUTION_MODE,
    DEFAULT_PAGES,
    DIRECTORY_SITES,
    EXECUTION_MODES,
    MAX_WORKERS,
    SOCIAL_MEDIA_LABELS,
)
from scrapers.directory_sites import DirectorySiteScraper
from scrapers.google_search import GoogleSearchScraper
from scrapers.link_extractor import classify_link, deduplicate_links
from services.rate_limiter import RateLimiter
from services.source_health import SourceHealthStore
from validators.link_validator import LinkValidator

logger = logging.getLogger(__name__)


class SearchService:
    """Orquestra a busca completa: scraping → dedup → validação."""

    def __init__(self):
        self._rate_limiter = RateLimiter()
        self._validator = LinkValidator()
        self._health_store = SourceHealthStore()

    def search(
        self,
        keyword: str,
        category: str = "",
        max_pages: int = DEFAULT_PAGES,
        start_page: int = 1,
        social_media: list[str] | None = None,
        directory_sites: list[str] | None = None,
        link_types: list[str] | None = None,
        execution_mode: str = DEFAULT_EXECUTION_MODE,
        progress_callback=None,
    ) -> dict:
        """Executa a busca completa com alocação adaptativa por fonte."""
        mode = execution_mode if execution_mode in EXECUTION_MODES else DEFAULT_EXECUTION_MODE
        mode_cfg = EXECUTION_MODES[mode]
        link_types = link_types or ["whatsapp", "telegram"]
        errors = []

        keywords = self._expand_keywords(keyword, category)
        selected_social = [key for key in (social_media or []) if key in SOCIAL_MEDIA_LABELS]
        selected_directory = [key for key in (directory_sites or []) if key in DIRECTORY_SITES]
        selected_sources = selected_social + selected_directory

        if progress_callback:
            label = keyword if keyword else category.capitalize() if category else "—"
            progress_callback(
                f"Buscando: \"{label}\" (páginas {start_page} a {start_page + max_pages - 1})"
            )
            progress_callback({
                "type": "metrics_snapshot",
                "execution_mode": mode,
                "keywords": keywords,
                "scheduled_sources": len(selected_sources),
                "finished_sources": 0,
                "links_collected": 0,
            })

        all_links: list[str] = []
        finished_sources = 0
        scheduled_sources = 0

        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures: dict = {}

            for kw in keywords:
                if selected_social:
                    social_alloc = self._health_store.allocate_pages(
                        sources=selected_social,
                        total_pages=max_pages,
                        execution_mode=mode,
                    )
                    for source_key, pages in social_alloc.items():
                        if pages <= 0:
                            continue
                        scheduled_sources += 1
                        self._emit_source_update(
                            progress_callback=progress_callback,
                            source_key=source_key,
                            source_kind="social",
                            status="scheduled",
                            keyword=kw,
                            pages_allocated=pages,
                        )
                        future = executor.submit(
                            self._run_social_source,
                            keyword=kw,
                            source_key=source_key,
                            max_pages=pages,
                            start_page=start_page,
                            link_types=link_types,
                        )
                        futures[future] = ("social", source_key, kw, pages)

                if selected_directory:
                    directory_alloc = self._health_store.allocate_pages(
                        sources=selected_directory,
                        total_pages=max_pages,
                        execution_mode=mode,
                    )
                    for source_key, pages in directory_alloc.items():
                        if pages <= 0:
                            continue
                        scheduled_sources += 1
                        self._emit_source_update(
                            progress_callback=progress_callback,
                            source_key=source_key,
                            source_kind="directory",
                            status="scheduled",
                            keyword=kw,
                            pages_allocated=pages,
                        )
                        future = executor.submit(
                            self._run_directory_source,
                            keyword=kw,
                            source_key=source_key,
                            max_pages=pages,
                            start_page=start_page,
                            link_types=link_types,
                        )
                        futures[future] = ("directory", source_key, kw, pages)

            for future in as_completed(futures):
                source_kind, source_key, kw, pages_allocated = futures[future]
                source_label = self._resolve_source_label(source_kind, source_key)
                started = time.perf_counter()
                try:
                    payload = future.result()
                    links = payload["links"]
                    metrics = payload["metrics"]
                    elapsed_ms = payload["elapsed_ms"]
                except Exception as exc:
                    elapsed_ms = max(1.0, (time.perf_counter() - started) * 1000)
                    links = []
                    metrics = {
                        "blocked_signals": 0,
                        "status_429": 0,
                        "timeouts": 0,
                        "empty_responses": 0,
                        "last_failure_reason": "scraper_exception",
                    }
                    error_msg = f"Erro no scraper {source_label} ({kw}): {str(exc)[:120]}"
                    logger.error(error_msg)
                    errors.append(error_msg)

                all_links.extend(links)
                reason = self._derive_failure_reason(links=links, metrics=metrics)
                health = self._health_store.record_run(
                    source_key=source_key,
                    source_kind=source_kind,
                    pages_allocated=pages_allocated,
                    links_found=len(links),
                    elapsed_ms=elapsed_ms,
                    blocked_events=int(metrics.get("blocked_signals", 0) + metrics.get("status_429", 0)),
                    timeout_events=int(metrics.get("timeouts", 0)),
                    reason=reason,
                )

                finished_sources += 1
                self._emit_source_update(
                    progress_callback=progress_callback,
                    source_key=source_key,
                    source_kind=source_kind,
                    status="completed",
                    keyword=kw,
                    pages_allocated=pages_allocated,
                    links_found=len(links),
                    elapsed_ms=round(elapsed_ms, 1),
                    reason=reason,
                    source_score=health.get("score"),
                )

                if int(metrics.get("blocked_signals", 0) + metrics.get("status_429", 0)) > 0:
                    if progress_callback:
                        progress_callback({
                            "type": "source_blocked",
                            "source_key": source_key,
                            "source_kind": source_kind,
                            "source_label": source_label,
                            "reason": reason,
                            "hint": "Fonte com sinais de bloqueio/captcha. Priorização reduzida temporariamente.",
                        })

                if progress_callback:
                    progress_callback({
                        "type": "metrics_snapshot",
                        "execution_mode": mode,
                        "scheduled_sources": scheduled_sources,
                        "finished_sources": finished_sources,
                        "links_collected": len(all_links),
                    })

        unique_links = deduplicate_links(all_links)
        filtered_links = [
            link for link in unique_links
            if classify_link(link) in link_types
        ]

        if progress_callback:
            progress_callback(
                f"Encontrados {len(filtered_links)} links únicos. Iniciando validação..."
            )

        if filtered_links:
            results = self._validator.validate_links(
                filtered_links,
                progress_callback,
                retry_unknown=bool(mode_cfg.get("retry_unknown", True)),
            )
        else:
            results = []

        total_valid = sum(1 for r in results if r["valid"] is True)
        total_invalid = sum(1 for r in results if r["valid"] is False)
        total_unknown = sum(1 for r in results if r["valid"] is None)

        results.sort(
            key=lambda item: (
                2 if item.get("valid") is True else 1 if item.get("valid") is None else 0,
                float(item.get("confidence_score", 0.0)),
                float(item.get("validated_at", 0.0)),
            ),
            reverse=True,
        )

        return {
            "total_found": len(results),
            "total_valid": total_valid,
            "total_invalid": total_invalid,
            "total_unknown": total_unknown,
            "results": results,
            "errors": errors,
            "execution_mode": mode,
            "source_health": self._health_store.get_snapshot(selected_sources),
        }

    def get_source_health(self) -> dict[str, dict]:
        return self._health_store.get_snapshot()

    def reset_source_health(self, sources: list[str] | None = None) -> dict[str, dict]:
        return self._health_store.reset(sources)

    def _resolve_source_label(self, source_kind: str, source_key: str) -> str:
        if source_kind == "social":
            return SOCIAL_MEDIA_LABELS.get(source_key, source_key)
        return DIRECTORY_SITES.get(source_key, {}).get("name", source_key)

    def _emit_source_update(
        self,
        *,
        progress_callback,
        source_key: str,
        source_kind: str,
        status: str,
        keyword: str,
        pages_allocated: int,
        links_found: int | None = None,
        elapsed_ms: float | None = None,
        reason: str | None = None,
        source_score: float | None = None,
    ) -> None:
        if not progress_callback:
            return
        payload = {
            "type": "source_update",
            "source_key": source_key,
            "source_kind": source_kind,
            "source_label": self._resolve_source_label(source_kind, source_key),
            "status": status,
            "keyword": keyword,
            "pages_allocated": pages_allocated,
        }
        if links_found is not None:
            payload["links_found"] = int(links_found)
        if elapsed_ms is not None:
            payload["elapsed_ms"] = float(elapsed_ms)
        if reason:
            payload["reason"] = reason
        if source_score is not None:
            payload["source_score"] = source_score
        progress_callback(payload)

    def _derive_failure_reason(self, links: list[str], metrics: dict) -> str:
        if links:
            return "ok"
        if int(metrics.get("status_429", 0)) > 0:
            return "rate_limited"
        if int(metrics.get("blocked_signals", 0)) > 0:
            return "captcha_or_blocked"
        if int(metrics.get("timeouts", 0)) > 0:
            return "timeout"
        if int(metrics.get("empty_responses", 0)) > 0:
            return "empty_response"
        last_reason = str(metrics.get("last_failure_reason", "")).strip()
        return last_reason or "no_links"

    def _expand_keywords(self, keyword: str, category: str) -> list[str]:
        """Expande keywords baseado na categoria selecionada."""
        keywords = [keyword] if keyword.strip() else []

        if category and category in CATEGORIES:
            cat_keywords = CATEGORIES[category]
            for kw in cat_keywords:
                if kw.lower() not in [k.lower() for k in keywords]:
                    keywords.append(kw)

        if not keywords and category:
            keywords = [category]

        return keywords[:5]

    def _run_social_source(
        self,
        *,
        keyword: str,
        source_key: str,
        max_pages: int,
        start_page: int,
        link_types: list[str],
    ) -> dict:
        started = time.perf_counter()
        scraper = GoogleSearchScraper(self._rate_limiter)
        links = scraper.scrape(
            keyword=keyword,
            max_pages=max_pages,
            start_page=start_page,
            platforms=[source_key],
            link_types=link_types,
            progress_callback=None,
        )
        elapsed_ms = (time.perf_counter() - started) * 1000.0
        return {
            "links": links,
            "metrics": scraper.get_metrics(),
            "elapsed_ms": elapsed_ms,
        }

    def _run_directory_source(
        self,
        *,
        keyword: str,
        source_key: str,
        max_pages: int,
        start_page: int,
        link_types: list[str],
    ) -> dict:
        started = time.perf_counter()
        scraper = DirectorySiteScraper(self._rate_limiter)
        links = scraper.scrape(
            keyword=keyword,
            max_pages=max_pages,
            start_page=start_page,
            sites=[source_key],
            link_types=link_types,
            progress_callback=None,
        )
        elapsed_ms = (time.perf_counter() - started) * 1000.0
        return {
            "links": links,
            "metrics": scraper.get_metrics(),
            "elapsed_ms": elapsed_ms,
        }
