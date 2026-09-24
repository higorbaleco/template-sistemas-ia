#!/usr/bin/env python3
"""
scan_system_data.py — Cataloga os "Dados do Sistema"
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, LOGS_DIR, du_size, ensure_project_dirs


def scan_system_data() -> str:
    ensure_project_dirs()
    output_file = CATALOG_DIR / "system_data.json"
    log_file = LOGS_DIR / f"scan-system-data-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"

    home = Path.home()
    library = home / "Library"

    data = {
        "timestamp": datetime.now().isoformat(),
        "categories": {},
    }

    with log_file.open("w", encoding="utf-8") as log:
        log.write(f"Scan de Dados do Sistema iniciado em {datetime.now()}\n\n")

        def measure(key: str, path: Path, description: str, regenerable: bool) -> int:
            size_bytes, stderr, rc = du_size(path, timeout=6)
            if stderr:
                log.write(f"  du warning {path}: {stderr}\n")
            data["categories"][key] = {
                "path": str(path),
                "size_bytes": size_bytes,
                "size_gb": size_bytes / (1024**3),
                "description": description,
                "regenerable": regenerable,
                "du_returncode": rc,
            }
            log.write(f"  {key}: {size_bytes / (1024**3):.2f} GB\n")
            return size_bytes

        log.write("Medindo Xcode DerivedData...\n")
        xcode_size = measure(
            "xcode_derived_data",
            library / "Developer" / "Xcode" / "DerivedData",
            "Xcode build artifacts (100% regenerável)",
            True,
        )

        log.write("Medindo iOS Simulators...\n")
        sim_size = measure(
            "ios_simulators",
            library / "Developer" / "CoreSimulator" / "Caches",
            "iOS Simulator caches (regenerável)",
            True,
        )

        log.write("Medindo ~/Library/Caches...\n")
        caches_size = measure(
            "general_caches",
            library / "Caches",
            "App caches (seguro remover, serão recriados)",
            True,
        )

        log.write("Medindo ~/Library/Containers...\n")
        measure(
            "containers",
            library / "Containers",
            "App sandboxed data (verifique antes de remover)",
            False,
        )

        log.write("Medindo ~/Library/Group Containers...\n")
        measure(
            "group_containers",
            library / "Group Containers",
            "Shared app data (verifique antes de remover)",
            False,
        )

        log.write("Medindo ~/Library/Application Support...\n")
        measure(
            "application_support",
            library / "Application Support",
            "App data (Steam, Docker, etc. — verifique antes de remover)",
            False,
        )

        log.write("Medindo ~/Library/Application Support/MobileSync/Backup...\n")
        measure(
            "mobile_backups",
            library / "Application Support" / "MobileSync" / "Backup",
            "iPhone/iPad backups (pode ser arquivado)",
            False,
        )

        log.write("Medindo Time Machine local snapshots...\n")
        tm_snapshots: list[str] = []
        try:
            import subprocess

            result = subprocess.run(
                ["tmutil", "listlocalsnapshots", "/"],
                capture_output=True,
                text=True,
                timeout=10,
            )
            if result.stdout.strip():
                tm_snapshots = result.stdout.strip().splitlines()
        except Exception:  # noqa: BLE001
            pass

        log.write(f"  Time Machine snapshots encontrados: {len(tm_snapshots)}\n")
        data["categories"]["time_machine_snapshots"] = {
            "count": len(tm_snapshots),
            "snapshots": tm_snapshots[:5],
            "description": "Local snapshots (APFS only, aparecem em Storage mas não em du)",
            "note": "Remoção via tmutil deletelocalsnapshots (requer admin)",
        }

        total_size = sum(
            cat.get("size_bytes", 0)
            for cat in data["categories"].values()
            if isinstance(cat, dict) and "size_bytes" in cat
        )
        data["total_size_bytes"] = total_size
        data["total_size_gb"] = total_size / (1024**3)

        log.write("\n--- Resumo ---\n")
        log.write(f"Total Dados do Sistema: {data['total_size_gb']:.2f} GB\n")
        log.write(f"Regenerável com segurança: {(xcode_size + sim_size + caches_size) / (1024**3):.2f} GB\n")

    with output_file.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, ensure_ascii=True)

    print(f"✓ Scan de Dados do Sistema concluído: {data['total_size_gb']:.2f} GB")
    print(f"  Output: {output_file}")
    return str(output_file)


if __name__ == "__main__":
    scan_system_data()
