#!/bin/zsh
set -euo pipefail

SCRIPT_PATH="$(/usr/bin/python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$0")"
PROJECT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
DESKTOP_DIR="${HOME}/Desktop"

OPEN_LINK="${DESKTOP_DIR}/Abrir Groups Hunter Advance.command"
STOP_LINK="${DESKTOP_DIR}/Parar Groups Hunter Advance.command"
EXT_LINK="${DESKTOP_DIR}/Instalar Extensao Groups Hunter Advance.command"
READY_LINK="${DESKTOP_DIR}/Preparar Tudo para Groups Hunter Advance.command"

ln -sf "${PROJECT_DIR}/Abrir Ferramenta.command" "$OPEN_LINK"
ln -sf "${PROJECT_DIR}/Parar Ferramenta.command" "$STOP_LINK"
ln -sf "${PROJECT_DIR}/Instalar Extensao Chrome.command" "$EXT_LINK"
ln -sf "${PROJECT_DIR}/Preparar Tudo para Chrome.command" "$READY_LINK"
chmod +x "$OPEN_LINK" "$STOP_LINK" "$EXT_LINK" "$READY_LINK"

echo "Atalhos criados na Area de Trabalho:"
echo "- ${OPEN_LINK}"
echo "- ${STOP_LINK}"
echo "- ${EXT_LINK}"
echo "- ${READY_LINK}"
echo ""
echo "Dica: arraste os atalhos principais para o Dock para acesso rapido."
