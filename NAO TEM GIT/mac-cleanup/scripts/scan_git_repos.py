#!/usr/bin/env python3
"""
scan_git_repos.py — Analisa repositórios .git encontrados
Gera JSON com: path, status, ahead/behind, last_commit, origin_url, dirty_count
"""

from __future__ import annotations

import json
import sys
import subprocess
from datetime import datetime
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import CATALOG_DIR, LOGS_DIR, ensure_project_dirs

GIT_REPOS = [
    "/Users/higorplens/Documents/DaleÔ - Apresentação/.git",
    "/Users/higorplens/Antigravity Software/.git",
    "/Users/higorplens/OpenWa Teste/.git",
    "/Users/higorplens/.nvm/.git",
    "/Users/higorplens/.hermes/hermes-agent/.git",
    "/Users/higorplens/.openclaw/workspace/.git",
    "/Users/higorplens/Antigravity Software/TEM GIT/Avraham New CRM/.git",
    "/Users/higorplens/Antigravity Software/TEM GIT/Cardápio Online | Pizza do Gordo/.git",
    "/Users/higorplens/Antigravity Software/TEM GIT/Painel Feira/.git",
    "/Users/higorplens/Antigravity Software/TEM GIT/SITE AVRAHAM 2026/.git",
    "/Users/higorplens/Antigravity Software/TEM GIT/smart-finance-central/.git",
    "/Users/higorplens/Antigravity Software/TEM GIT/my-project/.git",
    "/Users/higorplens/Antigravity Software/TEM GIT/Gerador de Cardápio Semanal/.git",
    "/Users/higorplens/Antigravity Software/TEM GIT/Higir - Dash Campanha Disparo/.git",
    "/Users/higorplens/Antigravity Software/NAO TEM GIT/prospeccao claude/.git",
    "/Users/higorplens/.codex/vendor_imports/skills/.git",
    "/Users/higorplens/.codex/.tmp/plugins-clone-oLSNyU/.git",
    "/Users/higorplens/.claude/skills/gstack/.git",
]


def run_git_cmd(cmd: list[str], cwd: str) -> str | None:
    try:
        result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=5)
        return result.stdout.strip() if result.returncode == 0 else None
    except Exception:  # noqa: BLE001
        return None


def analyze_repo(git_path: str) -> dict:
    repo_root = str(Path(git_path).parent)
    repo_name = Path(repo_root).name

    status = run_git_cmd(["git", "status", "--porcelain"], repo_root)
    dirty_count = len([line for line in (status or "").splitlines() if line.strip()]) if status else 0
    branch = run_git_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"], repo_root)
    origin_url = run_git_cmd(["git", "config", "--get", "remote.origin.url"], repo_root)

    ahead_behind = None
    if origin_url:
        ab = run_git_cmd(["git", "rev-list", "--left-right", "--count", "HEAD...@{upstream}"], repo_root)
        if ab:
            parts = ab.split()
            if len(parts) == 2:
                ahead_behind = {"ahead": int(parts[0]), "behind": int(parts[1])}

    last_commit = run_git_cmd(["git", "log", "-1", "--format=%aI"], repo_root)

    return {
        "path": repo_root,
        "git_dir": git_path,
        "name": repo_name,
        "origin_url": origin_url or None,
        "current_branch": branch or "unknown",
        "dirty_files": dirty_count,
        "ahead_behind": ahead_behind,
        "last_commit": last_commit,
        "git_status": "dirty" if dirty_count > 0 else "clean",
    }


def scan() -> str:
    ensure_project_dirs()
    output_file = CATALOG_DIR / "git_repos.json"
    log_file = LOGS_DIR / f"scan-git-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"

    repos: list[dict] = []
    found_count = 0

    with log_file.open("w", encoding="utf-8") as log:
        log.write(f"Git Repos Scan em {datetime.now()}\n\n")

        for git_path in GIT_REPOS:
            if not Path(git_path).exists():
                continue
            try:
                repo_info = analyze_repo(git_path)
                repos.append(repo_info)
                found_count += 1
                log.write(f"✓ {repo_info['path']}\n")
                log.write(f"  Status: {repo_info['git_status']}, Dirty: {repo_info['dirty_files']}\n")
            except Exception as exc:  # noqa: BLE001
                log.write(f"✗ {git_path}: {exc}\n")

    with output_file.open("w", encoding="utf-8") as out:
        json.dump(repos, out, indent=2, ensure_ascii=True)

    print(f"✓ Git scan concluído: {found_count} repos")
    print(f"  Saída: {output_file}")
    return str(output_file)


if __name__ == "__main__":
    scan()
