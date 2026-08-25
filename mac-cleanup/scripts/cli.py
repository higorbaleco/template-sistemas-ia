#!/usr/bin/env python3
"""Command line entry point for the Mac cleanup pipeline."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.check_environment import main as check_environment_main
from scripts.run_pipeline import main as run_pipeline_main


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="mac-cleanup", description="Read-only Mac cleanup catalog pipeline")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("check", help="Validate local dependencies and permissions")
    subparsers.add_parser("run", help="Run the full catalog pipeline")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "check":
        return check_environment_main()
    if args.command == "run":
        return run_pipeline_main()

    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
