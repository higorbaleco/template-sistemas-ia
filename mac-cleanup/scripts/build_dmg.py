#!/usr/bin/env python3
"""Builds a distributable macOS .dmg containing the Mac Curator app."""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.build_app_bundle import main as build_app_bundle
from scripts.common import project_path

APP_NAME = "Mac Curator"
PROJECT_ROOT = project_path()
DIST_DIR = PROJECT_ROOT / "dist"
APP_BUNDLE = DIST_DIR / f"{APP_NAME}.app"
DMG_PATH = DIST_DIR / f"{APP_NAME}.dmg"


def ensure_app_bundle() -> None:
    if not APP_BUNDLE.exists():
        build_app_bundle()


def build_dmg() -> Path:
    ensure_app_bundle()
    DIST_DIR.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="mac-curator-dmg-") as tmp:
        staging = Path(tmp) / APP_NAME
        staging.mkdir(parents=True, exist_ok=True)

        shutil.copytree(APP_BUNDLE, staging / APP_BUNDLE.name, symlinks=True)
        applications_link = staging / "Applications"
        if not applications_link.exists():
            applications_link.symlink_to("/Applications")

        if DMG_PATH.exists():
            DMG_PATH.unlink()

        subprocess.run(
            [
                "hdiutil",
                "create",
                "-volname",
                APP_NAME,
                "-srcfolder",
                str(staging),
                "-ov",
                "-format",
                "UDZO",
                str(DMG_PATH),
            ],
            check=True,
        )

    return DMG_PATH


def main() -> int:
    dmg = build_dmg()
    print(f"Built DMG at: {dmg}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
