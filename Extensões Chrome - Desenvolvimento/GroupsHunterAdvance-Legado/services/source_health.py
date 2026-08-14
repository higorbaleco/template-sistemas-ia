"""Persistência e cálculo de saúde das fontes de busca."""
from __future__ import annotations

import json
import os
import threading
import time
from dataclasses import asdict, dataclass
from typing import Iterable

from config import (
    DEFAULT_EXECUTION_MODE,
    EXECUTION_MODES,
    SOURCE_DEPRIORITIZE_COOLDOWN_MINUTES,
    SOURCE_DEPRIORITIZE_ZERO_STREAK,
    SOURCE_HEALTH_FILE,
)


@dataclass
class _SourceHealthEntry:
    key: str
    kind: str
    runs: int = 0
    success_runs: int = 0
    total_links: int = 0
    total_pages: int = 0
    total_latency_ms: float = 0.0
    blocked_events: int = 0
    timeout_events: int = 0
    zero_streak: int = 0
    cooldown_until: float = 0.0
    score: float = 1.0
    last_reason: str = ""
    last_update: float = 0.0


class SourceHealthStore:
    """Armazena desempenho por fonte e calcula pesos adaptativos."""

    def __init__(self, filepath: str = SOURCE_HEALTH_FILE):
        self._filepath = filepath
        self._lock = threading.Lock()
        self._entries: dict[str, _SourceHealthEntry] = {}
        self._loaded = False

    def _ensure_loaded(self) -> None:
        if self._loaded:
            return
        with self._lock:
            if self._loaded:
                return
            self._entries = self._load_from_disk()
            self._loaded = True

    def _load_from_disk(self) -> dict[str, _SourceHealthEntry]:
        if not os.path.exists(self._filepath):
            return {}
        try:
            with open(self._filepath, "r", encoding="utf-8") as fp:
                raw = json.load(fp)
            if not isinstance(raw, dict):
                return {}

            entries: dict[str, _SourceHealthEntry] = {}
            for key, payload in raw.items():
                if not isinstance(payload, dict):
                    continue
                try:
                    entries[key] = _SourceHealthEntry(
                        key=str(payload.get("key", key)),
                        kind=str(payload.get("kind", "unknown")),
                        runs=int(payload.get("runs", 0)),
                        success_runs=int(payload.get("success_runs", 0)),
                        total_links=int(payload.get("total_links", 0)),
                        total_pages=int(payload.get("total_pages", 0)),
                        total_latency_ms=float(payload.get("total_latency_ms", 0.0)),
                        blocked_events=int(payload.get("blocked_events", 0)),
                        timeout_events=int(payload.get("timeout_events", 0)),
                        zero_streak=int(payload.get("zero_streak", 0)),
                        cooldown_until=float(payload.get("cooldown_until", 0.0)),
                        score=float(payload.get("score", 1.0)),
                        last_reason=str(payload.get("last_reason", "")),
                        last_update=float(payload.get("last_update", 0.0)),
                    )
                except Exception:
                    continue
            return entries
        except Exception:
            return {}

    def _save_to_disk_locked(self) -> None:
        os.makedirs(os.path.dirname(self._filepath), exist_ok=True)
        payload = {
            key: asdict(value)
            for key, value in self._entries.items()
        }
        with open(self._filepath, "w", encoding="utf-8") as fp:
            json.dump(payload, fp, ensure_ascii=False, indent=2)

    def _get_or_create_locked(self, key: str, kind: str) -> _SourceHealthEntry:
        entry = self._entries.get(key)
        if entry is None:
            entry = _SourceHealthEntry(key=key, kind=kind)
            self._entries[key] = entry
        elif kind and entry.kind == "unknown":
            entry.kind = kind
        return entry

    def _compute_score(self, entry: _SourceHealthEntry) -> float:
        runs = max(1, entry.runs)
        success_rate = (entry.success_runs + 1) / (runs + 2)
        yield_per_page = (entry.total_links + 1) / (entry.total_pages + runs + 1)
        blocked_rate = entry.blocked_events / runs
        timeout_rate = entry.timeout_events / runs
        avg_latency_s = (entry.total_latency_ms / runs) / 1000.0

        yield_component = min(1.8, 0.35 + yield_per_page)
        latency_penalty = min(0.25, avg_latency_s / 35.0)

        score = (
            (success_rate * 1.15)
            + (yield_component * 0.45)
            - (blocked_rate * 0.55)
            - (timeout_rate * 0.35)
            - latency_penalty
        )
        return max(0.15, min(2.5, score))

    def record_run(
        self,
        *,
        source_key: str,
        source_kind: str,
        pages_allocated: int,
        links_found: int,
        elapsed_ms: float,
        blocked_events: int = 0,
        timeout_events: int = 0,
        reason: str = "",
    ) -> dict:
        """Atualiza métricas agregadas da fonte e devolve snapshot."""
        self._ensure_loaded()
        now = time.time()
        with self._lock:
            entry = self._get_or_create_locked(source_key, source_kind)
            entry.runs += 1
            entry.total_pages += max(0, int(pages_allocated))
            entry.total_links += max(0, int(links_found))
            entry.total_latency_ms += max(0.0, float(elapsed_ms))
            entry.blocked_events += max(0, int(blocked_events))
            entry.timeout_events += max(0, int(timeout_events))

            if links_found > 0:
                entry.success_runs += 1
                entry.zero_streak = 0
                if entry.cooldown_until > 0:
                    entry.cooldown_until = 0.0
            else:
                entry.zero_streak += 1
                if entry.zero_streak >= SOURCE_DEPRIORITIZE_ZERO_STREAK:
                    cooldown_secs = SOURCE_DEPRIORITIZE_COOLDOWN_MINUTES * 60
                    entry.cooldown_until = max(entry.cooldown_until, now + cooldown_secs)

            entry.last_reason = (reason or "").strip()
            entry.last_update = now
            entry.score = self._compute_score(entry)
            self._save_to_disk_locked()
            return self._serialize_entry(entry, now)

    def get_weight(
        self,
        source_key: str,
        *,
        execution_mode: str = DEFAULT_EXECUTION_MODE,
    ) -> float:
        self._ensure_loaded()
        now = time.time()
        with self._lock:
            entry = self._entries.get(source_key)
            if not entry:
                return 1.0
            mode = EXECUTION_MODES.get(execution_mode, EXECUTION_MODES[DEFAULT_EXECUTION_MODE])
            power = float(mode.get("health_weight_power", 1.0))
            base = max(0.1, float(entry.score)) ** power
            if entry.cooldown_until > now:
                return max(0.05, base * 0.2)
            return max(0.08, base)

    def allocate_pages(
        self,
        *,
        sources: Iterable[str],
        total_pages: int,
        execution_mode: str = DEFAULT_EXECUTION_MODE,
    ) -> dict[str, int]:
        """Distribui páginas com base no score de cada fonte."""
        self._ensure_loaded()
        source_list = [src for src in sources if src]
        if not source_list or total_pages <= 0:
            return {}

        mode = EXECUTION_MODES.get(execution_mode, EXECUTION_MODES[DEFAULT_EXECUTION_MODE])
        min_per_source = int(mode.get("min_pages_per_source", 1))
        max_per_source = int(mode.get("max_pages_per_source", total_pages))

        allocations = {src: 0 for src in source_list}
        remaining = int(total_pages)

        if remaining >= len(source_list) * min_per_source:
            for src in source_list:
                allocations[src] = min_per_source
                remaining -= min_per_source
        else:
            for src in source_list[:remaining]:
                allocations[src] = 1
            remaining = 0

        if remaining <= 0:
            return allocations

        weights = {src: self.get_weight(src, execution_mode=execution_mode) for src in source_list}
        total_weight = sum(weights.values()) or 1.0

        raw_parts: list[tuple[str, int, float]] = []
        for src in source_list:
            raw = (remaining * weights[src]) / total_weight
            whole = int(raw)
            frac = raw - whole
            raw_parts.append((src, whole, frac))

        consumed = 0
        for src, whole, _ in raw_parts:
            add = max(0, min(max_per_source - allocations[src], whole))
            allocations[src] += add
            consumed += add

        extra = max(0, remaining - consumed)
        if extra:
            raw_parts.sort(key=lambda item: item[2], reverse=True)
            for src, _, _ in raw_parts:
                if extra <= 0:
                    break
                if allocations[src] >= max_per_source:
                    continue
                allocations[src] += 1
                extra -= 1

        return allocations

    def get_snapshot(self, sources: Iterable[str] | None = None) -> dict[str, dict]:
        self._ensure_loaded()
        now = time.time()
        with self._lock:
            if sources is None:
                items = self._entries.items()
            else:
                source_set = {src for src in sources if src}
                items = (
                    (key, entry)
                    for key, entry in self._entries.items()
                    if key in source_set
                )
            data = {key: self._serialize_entry(entry, now) for key, entry in items}

        return dict(
            sorted(
                data.items(),
                key=lambda item: item[1].get("score", 0.0),
                reverse=True,
            )
        )

    def reset(self, sources: Iterable[str] | None = None) -> dict[str, dict]:
        self._ensure_loaded()
        with self._lock:
            if sources is None:
                self._entries = {}
            else:
                for key in sources:
                    self._entries.pop(key, None)
            self._save_to_disk_locked()
        return self.get_snapshot()

    def _serialize_entry(self, entry: _SourceHealthEntry, now: float) -> dict:
        in_cooldown = entry.cooldown_until > now
        status = "deprioritized" if in_cooldown else "healthy"
        if entry.runs == 0:
            status = "new"

        return {
            "key": entry.key,
            "kind": entry.kind,
            "score": round(float(entry.score), 4),
            "status": status,
            "runs": int(entry.runs),
            "success_runs": int(entry.success_runs),
            "success_rate": round(
                float(entry.success_runs) / float(entry.runs or 1), 4
            ),
            "total_links": int(entry.total_links),
            "total_pages": int(entry.total_pages),
            "yield_per_page": round(
                float(entry.total_links) / float(entry.total_pages or 1), 4
            ),
            "blocked_events": int(entry.blocked_events),
            "timeout_events": int(entry.timeout_events),
            "zero_streak": int(entry.zero_streak),
            "cooldown_until": float(entry.cooldown_until),
            "cooldown_remaining_sec": max(0, int(entry.cooldown_until - now)),
            "last_reason": entry.last_reason or "",
            "last_update": float(entry.last_update),
        }

