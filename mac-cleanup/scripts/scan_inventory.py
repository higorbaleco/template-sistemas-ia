#!/usr/bin/env python3
"""
scan_inventory.py — Varredura recursiva do $HOME
Gera JSONL com: path, size_bytes, mtime, ext, top_level_dir
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, LOGS_DIR, du_size, ensure_project_dirs

SKIP_DIRS = {
    ".Trash",
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "__pycache__",
    ".cache",
    "Cache",
    ".gradle",
    "Pods",
}

SKIP_PREFIXES = {
    ".DS_Store",
    "Thumbs.db",
    ".localized",
}


def should_skip(path: str) -> bool:
    name = os.path.basename(path)

    if name in SKIP_PREFIXES:
        return True

    if path.endswith("/.git/objects") or "/.git/objects/" in path:
        return True

    if any(name.startswith(prefix) for prefix in [".", "__"]):
        if not (name.startswith(".claude") or name == ".git"):
            return True

    return False


def get_file_ext(path: str) -> str:
    if os.path.isdir(path):
        return "dir"
    _, ext = os.path.splitext(path)
    return ext.lower() or "no-ext"


def get_top_level_dir(home: str, path: str) -> str:
    rel = os.path.relpath(path, home)
    parts = rel.split(os.sep)
    return parts[0] if parts and parts[0] != "." else "root"


def scan_library_separately(log) -> list[dict]:
    """Escaneia ~/Library de forma agregada por subpasta de topo."""
    home = Path.home()
    library = home / "Library"
    records: list[dict] = []

    if not library.exists():
        log.write("⚠ ~/Library não existe\n")
        return records

    log.write("Escaneando ~/Library (macro pastas selecionadas)...\n")
    targets = [
        "Application Support",
        "Caches",
        "Containers",
        "Group Containers",
        "Developer",
        "Logs",
        "Preferences",
        "Mail",
        "Messages",
        "CloudStorage",
        "Safari",
        "Saved Application State",
        "Calendar",
        "Calendars",
        "Mobile Documents",
        "LaunchAgents",
    ]

    for target in targets:
        item = library / target
        if not item.exists():
            continue

        size_bytes, stderr, rc = du_size(item, timeout=6)
        if stderr:
            log.write(f"  du warning {item}: {stderr}\n")

        try:
            mtime = item.stat().st_mtime
            mtime_iso = datetime.fromtimestamp(mtime).isoformat()
        except OSError:
            mtime = 0.0
            mtime_iso = None

        records.append(
            {
                "path": str(item),
                "size_bytes": size_bytes,
                "mtime": mtime,
                "mtime_iso": mtime_iso,
                "ext": "dir",
                "top_level_dir": "Library",
                "type": "dir_aggregate",
                "du_returncode": rc,
            }
        )

    return records


def scan() -> str:
    ensure_project_dirs()
    home = str(Path.home())
    output_file = CATALOG_DIR / "inventory.jsonl"
    log_file = LOGS_DIR / f"scan-inventory-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"

    count = 0
    total_size = 0

    with output_file.open("w", encoding="utf-8") as out, log_file.open("w", encoding="utf-8") as log:
        log.write(f"Scan iniciado em {datetime.now()}\n")
        log.write(f"Home: {home}\n\n")

        log.write("Fase 1: Varredura de $HOME (exceto Library)...\n")
        for root, dirs, files in os.walk(home, followlinks=False):
            dirs[:] = [
                d
                for d in dirs
                if d != "Library" and not should_skip(os.path.join(root, d)) and d not in SKIP_DIRS
            ]

            if not should_skip(root):
                try:
                    root_path = Path(root)
                    rel_parts = root_path.relative_to(home).parts if root != home else ()
                    depth = len(rel_parts)

                    if root == home:
                        size_bytes = 0
                        stderr = ""
                        rc = 0
                    elif os.path.isdir(root) and depth <= 1:
                        size_bytes, stderr, rc = du_size(root, timeout=8)
                        if stderr:
                            log.write(f"du warning {root}: {stderr}\n")
                    else:
                        size_bytes = 0
                        stderr = ""
                        rc = 0

                    mtime = os.path.getmtime(root)
                    record = {
                        "path": root,
                        "size_bytes": size_bytes,
                        "mtime": mtime,
                        "mtime_iso": datetime.fromtimestamp(mtime).isoformat(),
                        "ext": get_file_ext(root),
                        "top_level_dir": get_top_level_dir(home, root),
                        "type": "dir",
                        "du_returncode": rc,
                    }
                    out.write(json.dumps(record, ensure_ascii=True) + "\n")
                    total_size += size_bytes
                    count += 1
                except (OSError, PermissionError) as exc:
                    log.write(f"Erro ao processar dir {root}: {exc}\n")

            for fname in files:
                fpath = os.path.join(root, fname)
                if should_skip(fpath):
                    continue

                try:
                    size_bytes = os.path.getsize(fpath)
                    mtime = os.path.getmtime(fpath)
                    record = {
                        "path": fpath,
                        "size_bytes": size_bytes,
                        "mtime": mtime,
                        "mtime_iso": datetime.fromtimestamp(mtime).isoformat(),
                        "ext": get_file_ext(fpath),
                        "top_level_dir": get_top_level_dir(home, fpath),
                        "type": "file",
                        "du_returncode": 0,
                    }
                    out.write(json.dumps(record, ensure_ascii=True) + "\n")
                    total_size += size_bytes
                    count += 1
                except (OSError, PermissionError) as exc:
                    log.write(f"Erro ao processar arquivo {fpath}: {exc}\n")

        log.write("\nFase 2: Varredura agregada de ~/Library...\n")
        library_records = scan_library_separately(log)
        for record in library_records:
            out.write(json.dumps(record, ensure_ascii=True) + "\n")
            total_size += record["size_bytes"]
            count += 1

        log.write("\n--- Resumo ---\n")
        log.write(f"Total de items: {count}\n")
        log.write(f"Total size: {total_size / (1024**3):.2f} GB\n")
        log.write(f"Arquivo de saída: {output_file}\n")

    print(f"✓ Scan concluído: {count} items, {total_size / (1024**3):.2f} GB")
    print(f"  Log: {log_file}")
    return str(output_file)


if __name__ == "__main__":
    scan()
