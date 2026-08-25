#!/usr/bin/env python3
"""
scan_duplicates.py — Detecta candidatos a duplicados de forma rápida
Nesta fase inicial, usamos agrupamento por tamanho exato para manter o pipeline leve.
"""

from __future__ import annotations

import json
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, LOGS_DIR, ensure_project_dirs


def scan() -> str | None:
    ensure_project_dirs()
    inventory_file = CATALOG_DIR / "inventory.jsonl"
    output_file = CATALOG_DIR / "duplicates.json"
    log_file = LOGS_DIR / f"scan-duplicates-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"

    if not inventory_file.exists():
        print(f"✗ Erro: {inventory_file} não encontrado")
        return None

    size_groups: defaultdict[int, list[str]] = defaultdict(list)
    with inventory_file.open("r", encoding="utf-8") as inv:
        for line in inv:
            if not line.strip():
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            if record.get("type") == "file" and record.get("size_bytes", 0) > 250 * 1024:
                size_groups[int(record["size_bytes"])].append(record["path"])

    duplicates: dict[str, dict] = {}
    total_groups = 0
    total_recoverable = 0
    dup_id = 0

    for size, paths in sorted(size_groups.items(), reverse=True):
        if len(paths) < 2:
            continue
        dup_id += 1
        total_groups += 1
        recoverable = size * (len(paths) - 1)
        total_recoverable += recoverable
        duplicates[f"dup-{dup_id}"] = {
            "hash": f"size-only:{size}",
            "file_size_bytes": size,
            "file_size_mb": round(size / (1024**2), 2),
            "count": len(paths),
            "recoverable_bytes": recoverable,
            "recoverable_mb": round(recoverable / (1024**2), 2),
            "paths": sorted(paths[:50]),
            "note": "triagem rápida por tamanho exato",
        }

    with output_file.open("w", encoding="utf-8") as out:
        json.dump(duplicates, out, indent=2, ensure_ascii=True)

    with log_file.open("w", encoding="utf-8") as log:
        log.write(f"Duplicates Scan em {datetime.now()}\n\n")
        log.write("Modo rápido: agrupamento por tamanho exato.\n")
        log.write(f"Grupos de candidatos: {total_groups}\n")
        log.write(f"Total espaço recuperável estimado: {total_recoverable / (1024**3):.2f} GB\n")

    print(f"✓ Duplicates scan concluído: {total_groups} grupos")
    print(f"  Espaço recuperável estimado: {total_recoverable / (1024**3):.2f} GB")
    print(f"  Saída: {output_file}")
    return str(output_file)


if __name__ == "__main__":
    scan()
