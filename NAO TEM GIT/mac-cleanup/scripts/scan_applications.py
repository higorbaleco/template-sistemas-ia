#!/usr/bin/env python3
"""
scan_applications.py — Cataloga /Applications e ~/Applications
Retorna: path, size_bytes, last_used, se é app do sistema
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, LOGS_DIR, du_size, mdls_value, ensure_project_dirs


def is_system_app(app_name: str) -> bool:
    """Heurística simples para apps do sistema."""
    system_prefixes = ["System", "Utilities", "Developer", "Xcode"]
    return any(app_name.startswith(prefix) for prefix in system_prefixes)


def scan_applications() -> str:
    ensure_project_dirs()
    output_file = CATALOG_DIR / "applications.json"
    log_file = LOGS_DIR / f"scan-applications-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"

    apps: list[dict] = []

    with log_file.open("w", encoding="utf-8") as log:
        log.write(f"Scan de aplicativos iniciado em {datetime.now()}\n\n")

        app_dirs = [Path("/Applications")]
        home_apps = Path.home() / "Applications"
        if home_apps.exists():
            app_dirs.append(home_apps)

        for app_dir in app_dirs:
            log.write(f"Escaneando {app_dir}...\n")
            if not app_dir.exists():
                log.write(f"  Pasta ausente: {app_dir}\n")
                continue

            try:
                for item in sorted(app_dir.iterdir(), key=lambda p: p.name.lower()):
                    if not item.name.endswith(".app"):
                        continue

                    size_bytes, stderr, rc = du_size(item, timeout=15)
                    if stderr:
                        log.write(f"  du warning {item}: {stderr}\n")

                    try:
                        mtime = item.stat().st_mtime
                        mtime_iso = datetime.fromtimestamp(mtime).isoformat()
                    except OSError:
                        mtime = 0.0
                        mtime_iso = None

                    apps.append(
                        {
                            "path": str(item),
                            "name": item.name,
                            "size_bytes": size_bytes,
                            "mtime": mtime,
                            "mtime_iso": mtime_iso,
                            "last_used": mdls_value(item, "kMDItemLastUsedDate"),
                            "is_system_app": is_system_app(item.name),
                            "du_returncode": rc,
                            "type": "application",
                        }
                    )
            except Exception as exc:  # noqa: BLE001
                log.write(f"Erro ao listar {app_dir}: {exc}\n")

        log.write("\n--- Resumo ---\n")
        log.write(f"Total de apps: {len(apps)}\n")
        log.write(f"Total size: {sum(a['size_bytes'] for a in apps) / (1024**3):.2f} GB\n")

    with output_file.open("w", encoding="utf-8") as handle:
        json.dump(apps, handle, indent=2, ensure_ascii=True)

    print(f"✓ Scan de aplicativos concluído: {len(apps)} apps")
    print(f"  Output: {output_file}")
    return str(output_file)


if __name__ == "__main__":
    scan_applications()
