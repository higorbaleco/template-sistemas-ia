#!/usr/bin/env python3
"""Runs the read-only catalog pipeline end-to-end."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import ensure_project_dirs, project_path


STEPS = [
    ("scan_inventory", project_path("scripts", "scan_inventory.py")),
    ("scan_applications", project_path("scripts", "scan_applications.py")),
    ("scan_system_data", project_path("scripts", "scan_system_data.py")),
    ("scan_git_repos", project_path("scripts", "scan_git_repos.py")),
    ("scan_regenerable", project_path("scripts", "scan_regenerable.py")),
    ("scan_duplicates", project_path("scripts", "scan_duplicates.py")),
    ("classify_catalog", project_path("scripts", "classify_catalog.py")),
    ("build_catalog", project_path("scripts", "build_catalog.py")),
]


def run_step(name: str, script: Path) -> None:
    print(f"[{name}] {script.name}")
    result = subprocess.run([sys.executable, str(script)], cwd=str(project_path()))
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def main() -> int:
    ensure_project_dirs()
    for name, script in STEPS:
        run_step(name, script)
    print("Pipeline finished.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
