#!/usr/bin/env python3
"""Checks the local machine for everything required to run the scans."""

from __future__ import annotations

import platform
import subprocess
import sys
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import REQUIRED_TOOLS, ensure_project_dirs, du_size, tool_exists


def probe_protected_path(path: Path) -> tuple[bool, int, str]:
    size_bytes, stderr, rc = du_size(path, timeout=20)
    if rc == 0 and size_bytes > 0:
        return True, size_bytes, ""
    return False, size_bytes, stderr


def main() -> int:
    ensure_project_dirs()

    print(f"Python: {sys.version.split()[0]}")
    print(f"Platform: {platform.platform()}")

    missing = [tool for tool in REQUIRED_TOOLS if not tool_exists(tool)]
    if missing:
        print("Missing tools:", ", ".join(missing))
        return 1

    print("All required tools are available.")

    protected = Path.home() / "Library" / "Application Support"
    accessible, size_bytes, stderr = probe_protected_path(protected)
    if accessible:
        print(f"Protected path check: OK ({size_bytes / (1024**3):.2f} GB at {protected})")
    else:
        print(f"Protected path check: partial or blocked at {protected}")
        if stderr:
            print(f"  du warning: {stderr}")
        print("Recommendation: grant Full Disk Access to the terminal if ~/Library scans return permission errors.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
