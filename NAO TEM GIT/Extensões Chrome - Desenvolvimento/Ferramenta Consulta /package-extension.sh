#!/bin/zsh
set -euo pipefail

SCRIPT_PATH="$(/usr/bin/python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$0")"
PROJECT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
EXT_DIR="${PROJECT_DIR}/chrome-extension"
DIST_DIR="${PROJECT_DIR}/dist"

VERSION="$(/usr/bin/python3 -c 'import json; print(json.load(open("chrome-extension/manifest.json","r",encoding="utf-8")).get("version","0.0.0"))')"

ZIP_NAME="GroupsHunterAdvance_v${VERSION}.zip"
STAGE_DIR="${DIST_DIR}/package"
ZIP_PATH="${DIST_DIR}/${ZIP_NAME}"

if [[ ! -d "$EXT_DIR" ]]; then
  echo "Pasta da extensao nao encontrada: ${EXT_DIR}"
  exit 1
fi

rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR"
mkdir -p "$DIST_DIR"

# Para publicar na Chrome Web Store, o manifest.json precisa ficar na RAIZ do ZIP.
cp -R "$EXT_DIR"/. "$STAGE_DIR"/

# Limpeza comum (macOS)
find "$STAGE_DIR" -name ".DS_Store" -delete 2>/dev/null || true

rm -f "$ZIP_PATH"
(
  cd "$STAGE_DIR"
  /usr/bin/zip -r "$ZIP_PATH" . >/dev/null
)

echo "ZIP gerado:"
echo "$ZIP_PATH"
