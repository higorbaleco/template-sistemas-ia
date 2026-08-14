#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

sh "$ROOT_DIR/scripts/package-macos-app.sh"
sh "$ROOT_DIR/scripts/package-macos-dmg.sh"
