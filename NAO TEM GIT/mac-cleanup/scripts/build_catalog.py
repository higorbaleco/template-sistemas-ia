#!/usr/bin/env python3
"""Consolida tudo em CSV, MD e dados para dashboard."""

from __future__ import annotations

import csv
import json
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, ensure_project_dirs


def load_json(path: Path, default):
    if not path.exists():
        return default
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except (json.JSONDecodeError, OSError):
        return default


def load_inventory() -> dict[str, dict]:
    path_to_record: dict[str, dict] = {}
    file = CATALOG_DIR / "inventory.jsonl"
    if not file.exists():
        return path_to_record

    with file.open("r", encoding="utf-8") as handle:
        for line in handle:
            if not line.strip():
                continue
            try:
                record = json.loads(line)
                path_to_record[record["path"]] = record
            except json.JSONDecodeError:
                continue
    return path_to_record


def load_classification() -> dict:
    classification_file = CATALOG_DIR / "classification.json"
    return load_json(classification_file, {})


def build_catalog() -> None:
    ensure_project_dirs()

    inv = load_inventory()
    git_repos = load_json(CATALOG_DIR / "git_repos.json", [])
    regenerable = load_json(CATALOG_DIR / "regenerable.json", {})
    duplicates = load_json(CATALOG_DIR / "duplicates.json", {})
    classification = load_classification()
    applications = load_json(CATALOG_DIR / "applications.json", [])
    system_data = load_json(CATALOG_DIR / "system_data.json", {})

    git_by_path = {repo["path"]: repo for repo in git_repos if repo.get("path")}

    dup_by_path: dict[str, str] = {}
    for dup_id, dup_info in duplicates.items():
        for path in dup_info.get("paths", []):
            dup_by_path[path] = dup_id

    classification_by_path: dict[str, dict] = {}
    for item in classification.get("items", []):
        classification_by_path[item["path"]] = item

    app_by_path = {app["path"]: app for app in applications if app.get("path")}
    system_by_path = {
        info.get("path"): {"key": key, **info}
        for key, info in system_data.get("categories", {}).items()
        if info.get("path")
    }

    catalog_rows: list[dict] = []

    def base_row(path: str, size_bytes: int, row_type: str, ext: str, top_level: str, mtime: str | None, source: str) -> dict:
        return {
            "path": path,
            "size_bytes": size_bytes,
            "size_mb": round(size_bytes / (1024**2), 2),
            "size_gb": round(size_bytes / (1024**3), 4),
            "type": row_type,
            "source": source,
            "ext": ext,
            "top_level": top_level,
            "mtime": mtime,
            "git_status": "",
            "git_origin": "",
            "git_ahead_behind": "",
            "duplicate_group": dup_by_path.get(path, ""),
            "regenerable_type": "",
            "system_data_key": "",
            "acao_recomendada": "nao-classificado",
            "motivo": "",
            "risco": "desconhecido",
            "categoria": "",
            "confidence": 0.0,
        }

    def enrich_from_classification(row: dict, path: str) -> None:
        item = classification_by_path.get(path)
        if not item:
            return
        row["acao_recomendada"] = item.get("acao_recomendada", row["acao_recomendada"])
        row["motivo"] = item.get("motivo", row["motivo"])
        row["risco"] = item.get("risco", row["risco"])
        row["categoria"] = item.get("categoria", row["categoria"])
        row["confidence"] = item.get("confidence", row["confidence"])

    for path, inv_record in sorted(inv.items()):
        row = base_row(
            path=path,
            size_bytes=int(inv_record.get("size_bytes", 0)),
            row_type=inv_record.get("type", "file"),
            ext=inv_record.get("ext", ""),
            top_level=inv_record.get("top_level_dir", "root"),
            mtime=inv_record.get("mtime_iso"),
            source="inventory",
        )

        if path in git_by_path:
            git = git_by_path[path]
            row["git_status"] = git.get("git_status", "")
            row["git_origin"] = git.get("origin_url") or "sem-remote"
            if git.get("ahead_behind"):
                row["git_ahead_behind"] = f"ahead={git['ahead_behind']['ahead']},behind={git['ahead_behind']['behind']}"

        for marker in regenerable:
            if marker in path:
                row["regenerable_type"] = marker
                break

        if path in system_by_path:
            row["system_data_key"] = system_by_path[path]["key"]

        enrich_from_classification(row, path)

        if row["regenerable_type"] and row["acao_recomendada"] == "nao-classificado":
            row["acao_recomendada"] = "apagar"
            row["motivo"] = f"artefato regenerável ({row['regenerable_type']})"
            row["risco"] = "baixo"
            row["categoria"] = row["categoria"] or "regeneravel"
            row["confidence"] = max(row["confidence"], 0.9)

        catalog_rows.append(row)

    for app in applications:
        path = app["path"]
        row = base_row(
            path=path,
            size_bytes=int(app.get("size_bytes", 0)),
            row_type="application",
            ext=".app",
            top_level="Applications" if "/Applications/" in path else "root",
            mtime=app.get("mtime_iso"),
            source="applications",
        )
        row["git_status"] = "app"
        row["motivo"] = "aplicativo catalogado"
        row["risco"] = "medio"
        row["categoria"] = "aplicativo"
        row["confidence"] = 0.5
        row["is_system_app"] = app.get("is_system_app", False)
        row["last_used"] = app.get("last_used")
        enrich_from_classification(row, path)
        catalog_rows.append(row)

    for key, info in system_data.get("categories", {}).items():
        path = info.get("path", f"system_data:{key}")
        size_bytes = int(info.get("size_bytes", 0))
        row = base_row(
            path=path,
            size_bytes=size_bytes,
            row_type="system_data",
            ext="dir",
            top_level="Library",
            mtime=None,
            source="system_data",
        )
        row["system_data_key"] = key
        row["motivo"] = info.get("description", "")
        row["risco"] = "medio" if not info.get("regenerable") else "baixo"
        row["categoria"] = "system_data"
        row["confidence"] = 0.8
        enrich_from_classification(row, path)
        catalog_rows.append(row)

    csv_file = CATALOG_DIR / "catalog.csv"
    with csv_file.open("w", newline="", encoding="utf-8") as handle:
        fieldnames = [
            "path",
            "size_bytes",
            "size_mb",
            "size_gb",
            "type",
            "source",
            "ext",
            "top_level",
            "mtime",
            "git_status",
            "git_origin",
            "git_ahead_behind",
            "duplicate_group",
            "regenerable_type",
            "system_data_key",
            "acao_recomendada",
            "motivo",
            "risco",
            "categoria",
            "confidence",
            "is_system_app",
            "last_used",
        ]
        for row in catalog_rows:
            for field in fieldnames:
                row.setdefault(field, "")
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(catalog_rows)

    md_file = CATALOG_DIR / "RELATORIO.md"
    action_totals = defaultdict(lambda: {"count": 0, "size_gb": 0.0})
    for row in catalog_rows:
        action = row["acao_recomendada"]
        action_totals[action]["count"] += 1
        action_totals[action]["size_gb"] += float(row["size_gb"])

    with md_file.open("w", encoding="utf-8") as handle:
        handle.write("# Catálogo de Limpeza Mac\n\n")
        handle.write(f"Gerado em {datetime.now(timezone.utc).isoformat()}\n\n")
        handle.write("## Resumo por Ação Recomendada\n\n")
        handle.write("| Ação | Items | Size (GB) |\n")
        handle.write("|---|---:|---:|\n")
        for action in sorted(action_totals.keys()):
            info = action_totals[action]
            handle.write(f"| {action} | {info['count']} | {info['size_gb']:.2f} |\n")

        handle.write("\n## Top 20 Maiores Items\n\n")
        handle.write("| Path | Size (GB) | Ação | Risco |\n")
        handle.write("|---|---:|---|---|\n")
        for row in sorted(catalog_rows, key=lambda item: item["size_gb"], reverse=True)[:20]:
            path_short = row["path"].replace(str(Path.home()), "~")
            handle.write(f"| {path_short} | {row['size_gb']:.2f} | {row['acao_recomendada']} | {row['risco']} |\n")

    dashboard_data = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "total_items": len(catalog_rows),
            "total_size_gb": round(sum(r["size_gb"] for r in catalog_rows), 4),
            "total_regenerable_gb": round(sum(r["size_gb"] for r in catalog_rows if r["regenerable_type"]), 4),
            "total_duplicable_gb": round(sum(r["size_gb"] for r in catalog_rows if r["duplicate_group"]), 4),
        },
        "acoes": dict(action_totals),
        "items": catalog_rows,
    }

    dashboard_json = CATALOG_DIR / "dashboard_data.json"
    with dashboard_json.open("w", encoding="utf-8") as handle:
        json.dump(dashboard_data, handle, indent=2, ensure_ascii=True)

    print("✓ Catálogo consolidado")
    print(f"  CSV: {csv_file}")
    print(f"  MD: {md_file}")
    print(f"  JSON (para dashboard): {dashboard_json}")
    print(f"\n  Total: {len(catalog_rows)} items, {dashboard_data['summary']['total_size_gb']:.2f} GB")


if __name__ == "__main__":
    build_catalog()
