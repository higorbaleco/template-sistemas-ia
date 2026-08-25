#!/usr/bin/env python3
"""Verifica overlaps com Google Drive."""

from __future__ import annotations

import json
import sys
from datetime import datetime

from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, LOGS_DIR, ensure_project_dirs


def scan() -> None:
    ensure_project_dirs()
    log_file = LOGS_DIR / f"scan-drive-overlap-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"
    output_file = CATALOG_DIR / "drive_overlap.json"

    with log_file.open("w", encoding="utf-8") as log:
        log.write(f"Drive Overlap Scan (placeholder) em {datetime.now()}\n")
        log.write("Nota: este script roda depois da classificação.\n")
        log.write(f"Aguardando JSON de classificação em {CATALOG_DIR / 'classification.json'}\n")

    with output_file.open("w", encoding="utf-8") as out:
        json.dump({"status": "pending", "note": "aguardando classificação"}, out, indent=2, ensure_ascii=True)

    print("✓ Drive overlap placeholder criado")


if __name__ == "__main__":
    scan()
