#!/usr/bin/env python3
"""Generate a deterministic classification file for the catalog."""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, LOGS_DIR, ensure_project_dirs

DRIVE_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".md",
    ".rtf",
    ".csv",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".mp4",
    ".mov",
    ".zip",
    ".rar",
    ".7z",
    ".psd",
    ".ai",
    ".fig",
}

TEXT_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".json",
    ".yml",
    ".yaml",
    ".html",
    ".css",
    ".scss",
    ".go",
    ".rs",
    ".java",
    ".swift",
    ".kt",
    ".sh",
    ".rb",
    ".php",
    ".sql",
    ".xml",
    ".toml",
    ".ini",
}

SYSTEM_DIR_HINTS = (
    "/Library/Application Support",
    "/Library/Containers",
    "/Library/Group Containers",
    "/Library/Caches",
    "/Library/Developer",
    "/Library/Mobile Documents",
)


def load_json(path: Path, default):
    if not path.exists():
        return default
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except (json.JSONDecodeError, OSError):
        return default


def load_inventory() -> list[dict]:
    inventory: list[dict] = []
    path = CATALOG_DIR / "inventory.jsonl"
    if not path.exists():
        return inventory
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            if not line.strip():
                continue
            try:
                inventory.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return inventory


def normalize_path(value: str) -> str:
    return str(Path(value).expanduser())


def is_under(path: str, root: str) -> bool:
    path_obj = Path(path)
    root_obj = Path(root)
    try:
        return path_obj == root_obj or root_obj in path_obj.parents
    except Exception:  # noqa: BLE001
        return False


def choose_git_root(path: str, git_roots: list[str]) -> str | None:
    for root in git_roots:
        if is_under(path, root):
            return root
    return None


def classify_record(
    record: dict,
    git_roots: list[str],
    git_repo_map: dict[str, dict],
    duplicate_paths: dict[str, str],
    regenerable_paths: dict[str, str],
    system_data: dict,
    application_paths: set[str],
) -> dict:
    path = normalize_path(record["path"])
    ext = (record.get("ext") or "").lower()
    top_level = record.get("top_level_dir") or ""
    lower_path = path.lower()

    acao = "revisar"
    risco = "medio"
    motivo = "triagem manual"
    categoria = "geral"
    confidence = 0.35

    if path in duplicate_paths:
        acao = "apagar"
        risco = "baixo"
        motivo = f"duplicado em {duplicate_paths[path]}"
        categoria = "duplicado"
        confidence = 0.98
    elif path in regenerable_paths:
        acao = "apagar"
        risco = "baixo"
        motivo = f"artefato regenerável ({regenerable_paths[path]})"
        categoria = "regeneravel"
        confidence = 0.95
    else:
        system_entry = system_data.get("categories", {}).get(record.get("system_data_key"))
        if system_entry:
            if system_entry.get("regenerable"):
                acao = "apagar"
                risco = "baixo"
                motivo = system_entry.get("description", "dados regeneráveis")
                categoria = "system_data_regeneravel"
                confidence = 0.92
            else:
                acao = "documentar"
                risco = "medio"
                motivo = system_entry.get("description", "dados do sistema")
                categoria = "system_data"
                confidence = 0.8
        elif path in application_paths:
            if record.get("is_system_app"):
                acao = "manter"
                risco = "baixo"
                motivo = "aplicativo do sistema"
                categoria = "aplicativo_sistema"
                confidence = 0.95
            else:
                acao = "revisar"
                risco = "medio"
                motivo = "aplicativo de terceiros"
                categoria = "aplicativo_terceiro"
                confidence = 0.7
        else:
            git_root = choose_git_root(path, git_roots)
            if git_root and ".git" not in lower_path:
                repo_info = git_repo_map.get(git_root, {})
                if record.get("type") == "file" and ext in TEXT_EXTENSIONS:
                    acao = "atualizar-git"
                    risco = "baixo"
                    motivo = f"conteúdo versionado em {repo_info.get('name') or Path(git_root).name}"
                    categoria = "git"
                    confidence = 0.9
                elif top_level in {"Documents", "Desktop", "Downloads"} and ext in DRIVE_EXTENSIONS:
                    acao = "subir-drive"
                    risco = "baixo"
                    motivo = "arquivo pessoal em repositório"
                    categoria = "drive"
                    confidence = 0.65
                else:
                    acao = "atualizar-git"
                    risco = "baixo"
                    motivo = f"conteúdo dentro de repositório Git ({Path(git_root).name})"
                    categoria = "git"
                    confidence = 0.82
            elif top_level in {"Documents", "Desktop", "Downloads"} and ext in DRIVE_EXTENSIONS:
                acao = "subir-drive"
                risco = "baixo"
                motivo = "documento ou mídia pessoal"
                categoria = "drive"
                confidence = 0.88
            elif any(hint in path for hint in SYSTEM_DIR_HINTS):
                acao = "documentar"
                risco = "medio"
                motivo = "área protegida ou de sistema"
                categoria = "sistema"
                confidence = 0.73
            elif ext in TEXT_EXTENSIONS and top_level not in {"Library"}:
                acao = "revisar"
                risco = "medio"
                motivo = "arquivo textual analisável"
                categoria = "texto"
                confidence = 0.55
            else:
                acao = "documentar"
                risco = "medio"
                motivo = "item não classificado com segurança"
                categoria = "indefinido"
                confidence = 0.4

    return {
        "path": path,
        "acao_recomendada": acao,
        "motivo": motivo,
        "risco": risco,
        "categoria": categoria,
        "confidence": confidence,
    }


def main() -> int:
    ensure_project_dirs()

    inventory = load_inventory()
    git_repos = load_json(CATALOG_DIR / "git_repos.json", [])
    regenerable = load_json(CATALOG_DIR / "regenerable.json", {})
    duplicates = load_json(CATALOG_DIR / "duplicates.json", {})
    applications = load_json(CATALOG_DIR / "applications.json", [])
    system_data = load_json(CATALOG_DIR / "system_data.json", {})

    git_roots = sorted(
        [normalize_path(item["path"]) for item in git_repos if item.get("path")],
        key=len,
        reverse=True,
    )
    git_repo_map = {normalize_path(item["path"]): item for item in git_repos if item.get("path")}
    application_paths = {normalize_path(item["path"]) for item in applications if item.get("path")}

    duplicate_paths: dict[str, str] = {}
    for dup_id, dup_info in duplicates.items():
        for path in dup_info.get("paths", []):
            duplicate_paths[normalize_path(path)] = dup_id

    regenerable_paths: dict[str, str] = {}
    for marker, info in regenerable.items():
        for example in info.get("examples", []):
            regenerable_paths[normalize_path(example)] = marker

    system_key_by_path: dict[str, str] = {}
    for key, info in system_data.get("categories", {}).items():
        if info.get("path"):
            system_key_by_path[normalize_path(info["path"])] = key

    log_file = LOGS_DIR / f"classify-catalog-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"
    items: list[dict] = []

    for record in inventory:
        normalized = normalize_path(record["path"])
        enriched = dict(record)
        if normalized in system_key_by_path:
            enriched["system_data_key"] = system_key_by_path[normalized]
        items.append(
            {
                **classify_record(
                    enriched,
                    git_roots,
                    git_repo_map,
                    duplicate_paths,
                    regenerable_paths,
                    system_data,
                    application_paths,
                ),
                "type": record.get("type", "file"),
                "size_bytes": record.get("size_bytes", 0),
                "top_level_dir": record.get("top_level_dir", "root"),
                "source": "inventory",
            }
        )

    for app in applications:
        record = {
            "path": app["path"],
            "type": "application",
            "size_bytes": app.get("size_bytes", 0),
            "ext": ".app",
            "top_level_dir": "Applications" if "/Applications/" in app["path"] else "root",
            "is_system_app": app.get("is_system_app", False),
        }
        items.append(
            {
                **classify_record(
                    record,
                    git_roots,
                    git_repo_map,
                    duplicate_paths,
                    regenerable_paths,
                    system_data,
                    application_paths,
                ),
                "type": "application",
                "size_bytes": app.get("size_bytes", 0),
                "top_level_dir": record["top_level_dir"],
                "source": "applications",
            }
        )

    for key, info in system_data.get("categories", {}).items():
        record = {
            "path": info.get("path", f"system_data:{key}"),
            "type": "system_data",
            "size_bytes": info.get("size_bytes", 0),
            "ext": "dir",
            "top_level_dir": "Library",
            "system_data_key": key,
        }
        items.append(
            {
                **classify_record(
                    record,
                    git_roots,
                    git_repo_map,
                    duplicate_paths,
                    regenerable_paths,
                    system_data,
                    application_paths,
                ),
                "type": "system_data",
                "size_bytes": info.get("size_bytes", 0),
                "top_level_dir": "Library",
                "system_data_key": key,
                "source": "system_data",
            }
        )

    summary = {
        "total_items": len(items),
        "by_action": {},
    }
    for item in items:
        action = item["acao_recomendada"]
        summary["by_action"].setdefault(action, {"count": 0, "size_bytes": 0})
        summary["by_action"][action]["count"] += 1
        summary["by_action"][action]["size_bytes"] += int(item.get("size_bytes", 0))

    payload = {
        "timestamp": datetime.now().isoformat(),
        "summary": summary,
        "items": items,
    }

    output_file = CATALOG_DIR / "classification.json"
    with output_file.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)

    with log_file.open("w", encoding="utf-8") as log:
        log.write(f"Classification generated at {payload['timestamp']}\n")
        log.write(f"Items: {summary['total_items']}\n")
        for action, info in sorted(summary["by_action"].items()):
            log.write(f"  {action}: {info['count']} items, {info['size_bytes'] / (1024**3):.2f} GB\n")

    print(f"✓ Classification gerada: {output_file}")
    print(f"  Items: {summary['total_items']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
