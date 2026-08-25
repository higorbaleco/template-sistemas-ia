#!/usr/bin/env python3
"""
scan_regenerable.py — Identifica diretórios regeneráveis
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, LOGS_DIR, ensure_project_dirs

REGENERABLE_MARKERS = {
    "node_modules": "npm dependencies",
    ".venv": "python venv",
    "venv": "python venv",
    ".next": "nextjs cache",
    "dist": "build artifacts",
    "build": "build artifacts",
    "__pycache__": "python cache",
    ".cache": "generic cache",
    "Cache": "generic cache",
    "CachedData": "vscode cache",
    "CachedExtensionVSIXs": "vscode extensions cache",
    ".gradle": "gradle cache",
    "Pods": "cocoapods dependencies",
    ".pytest_cache": "pytest cache",
    ".mypy_cache": "mypy cache",
    ".tox": "tox cache",
    "vendor": "ruby/php vendor",
    ".bundle": "bundler cache",
}


def is_regenerable(path: str) -> tuple[str | None, str | None]:
    parts = Path(path).parts
    for marker, category in REGENERABLE_MARKERS.items():
        if marker in parts:
            return marker, category
    return None, None


def scan() -> str | None:
    ensure_project_dirs()
    inventory_file = CATALOG_DIR / "inventory.jsonl"
    output_file = CATALOG_DIR / "regenerable.json"
    log_file = LOGS_DIR / f"scan-regenerable-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"

    regenerable_items: dict[str, dict] = {}
    total_regenerable_size = 0

    with log_file.open("w", encoding="utf-8") as log:
        log.write(f"Regenerable Scan em {datetime.now()}\n\n")

        if not inventory_file.exists():
            log.write(f"Erro: {inventory_file} não encontrado\n")
            print(f"✗ Erro: {inventory_file} não encontrado")
            return None

        with inventory_file.open("r", encoding="utf-8") as inv:
            for line in inv:
                if not line.strip():
                    continue
                try:
                    record = json.loads(line)
                    marker, category = is_regenerable(record["path"])
                    if not marker:
                        continue

                    size = int(record.get("size_bytes", 0))
                    bucket = regenerable_items.setdefault(
                        marker,
                        {
                            "category": category,
                            "total_size_bytes": 0,
                            "count": 0,
                            "examples": [],
                        },
                    )
                    bucket["total_size_bytes"] += size
                    bucket["count"] += 1
                    total_regenerable_size += size
                    if len(bucket["examples"]) < 3:
                        bucket["examples"].append(record["path"])
                except json.JSONDecodeError:
                    continue

    output: dict[str, dict] = {}
    for marker, info in sorted(regenerable_items.items(), key=lambda item: item[1]["total_size_bytes"], reverse=True):
        output[marker] = {
            "category": info["category"],
            "total_size_bytes": info["total_size_bytes"],
            "total_size_gb": round(info["total_size_bytes"] / (1024**3), 2),
            "count": info["count"],
            "examples": info["examples"][:3],
        }

    with output_file.open("w", encoding="utf-8") as out:
        json.dump(output, out, indent=2, ensure_ascii=True)

    with log_file.open("a", encoding="utf-8") as log:
        log.write("\n--- Resumo ---\n")
        log.write(f"Total regenerável: {total_regenerable_size / (1024**3):.2f} GB\n")
        log.write(f"Marcadores únicos encontrados: {len(regenerable_items)}\n")
        for marker in sorted(regenerable_items.keys()):
            size_gb = regenerable_items[marker]["total_size_bytes"] / (1024**3)
            count = regenerable_items[marker]["count"]
            log.write(f"  {marker}: {size_gb:.2f} GB ({count} items)\n")

    print(f"✓ Regenerable scan concluído: {total_regenerable_size / (1024**3):.2f} GB")
    print(f"  Saída: {output_file}")
    return str(output_file)


if __name__ == "__main__":
    scan()
