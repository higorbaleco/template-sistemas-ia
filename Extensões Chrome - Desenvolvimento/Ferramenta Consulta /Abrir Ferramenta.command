#!/bin/zsh
set -euo pipefail

SCRIPT_PATH="$(/usr/bin/python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$0")"
PROJECT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"

open -a "Google Chrome" "chrome://extensions" 2>/dev/null || open "chrome://extensions"
open "$PROJECT_DIR/chrome-extension" 2>/dev/null || true

echo "Groups Hunter Advance aberta para instalação/uso."
echo "Selecione a pasta chrome-extension em chrome://extensions se ainda não tiver carregado."
