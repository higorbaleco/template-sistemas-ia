#!/bin/zsh
set -euo pipefail

SCRIPT_PATH="$(/usr/bin/python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$0")"
PROJECT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"

"${PROJECT_DIR}/Instalar Extensao Chrome.command" || true

echo ""
echo "Groups Hunter Advance preparada para teste no Chrome."
