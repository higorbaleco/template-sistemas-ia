#!/usr/bin/env python3
"""Shared helpers for the Mac cleanup catalog pipeline."""

from __future__ import annotations

import json
import os
import subprocess
import webbrowser
from datetime import datetime
from pathlib import Path
from typing import Iterable

PROJECT_ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = PROJECT_ROOT / "catalog"
LOGS_DIR = PROJECT_ROOT / "logs"
REPORTS_DIR = PROJECT_ROOT / "reports"
DASHBOARD_DIR = PROJECT_ROOT / "dashboard"

REQUIRED_TOOLS = ("python3", "du", "mdls", "tmutil", "git")


def ensure_project_dirs() -> None:
    for directory in (CATALOG_DIR, LOGS_DIR, REPORTS_DIR, DASHBOARD_DIR, PROJECT_ROOT / "config"):
        directory.mkdir(parents=True, exist_ok=True)


def timestamp() -> str:
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def run(cmd: Iterable[str], cwd: str | None = None, timeout: int | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(list(cmd), cwd=cwd, capture_output=True, text=True, timeout=timeout)


def parse_size(size_str: str) -> int:
    size_str = size_str.strip()
    multipliers = {"K": 1024, "M": 1024**2, "G": 1024**3, "T": 1024**4}
    for unit, mult in multipliers.items():
        if size_str.endswith(unit):
            try:
                return int(float(size_str[:-1]) * mult)
            except ValueError:
                return 0
    try:
        return int(float(size_str))
    except ValueError:
        return 0


def du_size(path: str | Path, timeout: int = 30) -> tuple[int, str, int]:
    """Measure a path with du -sh and keep stdout even when du warns."""
    try:
        result = run(["du", "-sh", str(path)], timeout=timeout)
        size_text = result.stdout.strip().split()[0] if result.stdout.strip() else ""
        size_bytes = parse_size(size_text) if size_text else 0
        stderr = result.stderr.strip()
        return size_bytes, stderr, result.returncode
    except subprocess.TimeoutExpired:
        return 0, f"timeout after {timeout}s", 124


def mdls_value(path: str | Path, name: str = "kMDItemLastUsedDate", timeout: int = 5) -> str | None:
    """Read a macOS metadata field with mdls."""
    result = run(["mdls", "-name", name, str(path)], timeout=timeout)
    if not result.stdout:
        return None

    line = result.stdout.strip()
    if "=" not in line:
        return None

    value = line.split("=", 1)[1].strip()
    if not value or value == "(null)":
        return None
    return value


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)


def write_jsonl(path: Path, records: Iterable[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for record in records:
            handle.write(json.dumps(record, ensure_ascii=True) + "\n")


def tool_exists(name: str) -> bool:
    return subprocess.run(["/usr/bin/env", "sh", "-lc", f"command -v {name} >/dev/null 2>&1"]).returncode == 0


def project_path(*parts: str) -> Path:
    return PROJECT_ROOT.joinpath(*parts)


def open_in_browser(url: str) -> None:
    webbrowser.open(url, new=1, autoraise=True)
