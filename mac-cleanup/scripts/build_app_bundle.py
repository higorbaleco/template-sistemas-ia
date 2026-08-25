#!/usr/bin/env python3
"""Builds a minimal macOS .app bundle that opens the local panel."""

from __future__ import annotations

import os
import stat
import textwrap
from pathlib import Path

if __package__ in (None, ""):
    import sys

    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import project_path

APP_NAME = "Mac Curator"
PROJECT_ROOT = project_path()
BUNDLE_DIR = PROJECT_ROOT / "dist" / f"{APP_NAME}.app"
CONTENTS_DIR = BUNDLE_DIR / "Contents"
MACOS_DIR = CONTENTS_DIR / "MacOS"
RESOURCES_DIR = CONTENTS_DIR / "Resources"


def main() -> int:
    MACOS_DIR.mkdir(parents=True, exist_ok=True)
    RESOURCES_DIR.mkdir(parents=True, exist_ok=True)

    executable = MACOS_DIR / APP_NAME
    executable.write_text(
        textwrap.dedent(
            f"""\
            #!/bin/zsh
            set -euo pipefail
            exec /usr/bin/env python3 '{PROJECT_ROOT}/scripts/app_server.py'
            """
        ).strip()
        + "\n",
        encoding="utf-8",
    )
    executable.chmod(executable.stat().st_mode | stat.S_IEXEC)

    plist = CONTENTS_DIR / "Info.plist"
    plist.write_text(
        textwrap.dedent(
            f"""\
            <?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
            <plist version="1.0">
              <dict>
                <key>CFBundleName</key>
                <string>{APP_NAME}</string>
                <key>CFBundleDisplayName</key>
                <string>{APP_NAME}</string>
                <key>CFBundleIdentifier</key>
                <string>com.higorplens.maccurator</string>
                <key>CFBundleVersion</key>
                <string>1.0.0</string>
                <key>CFBundleExecutable</key>
                <string>{APP_NAME}</string>
                <key>CFBundlePackageType</key>
                <string>APPL</string>
                <key>LSUIElement</key>
                <true/>
              </dict>
            </plist>
            """
        ),
        encoding="utf-8",
    )

    print(f"Built app bundle at: {BUNDLE_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
