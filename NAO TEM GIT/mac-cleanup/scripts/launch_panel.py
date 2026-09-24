#!/usr/bin/env python3
"""Convenience launcher for the Mac Curator panel."""

from __future__ import annotations

import sys
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.app_server import main as app_main


def main() -> int:
    return app_main()


if __name__ == "__main__":
    raise SystemExit(main())
