#!/bin/zsh
set -euo pipefail

SCRIPT_PATH="$(/usr/bin/python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$0")"
PROJECT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
EXT_DIR="${PROJECT_DIR}/chrome-extension"
DESKTOP_DIR="${HOME}/Desktop"
READY_DIR="${DESKTOP_DIR}/Extensao Chrome Groups Hunter Advance"

if [[ ! -d "$EXT_DIR" ]]; then
  echo "Pasta da extensao nao encontrada: ${EXT_DIR}"
  exit 1
fi

rm -rf "$READY_DIR"
mkdir -p "$READY_DIR"
cp -R "$EXT_DIR"/. "$READY_DIR"/

COPIED=false
if command -v pbcopy >/dev/null 2>&1; then
  printf "%s" "$READY_DIR" | pbcopy
  COPIED=true
fi

open -a "Google Chrome" "chrome://extensions" 2>/dev/null || open "chrome://extensions"
open "$READY_DIR" 2>/dev/null || true

echo ""
echo "Chrome aberto em: chrome://extensions"
echo "Pasta para selecionar no Chrome:"
echo "${READY_DIR}"
echo ""
echo "Importante: nao selecione a pasta raiz do projeto."
echo "Selecione exatamente a pasta acima, que contem apenas os arquivos da extensao."
if [[ "$COPIED" = true ]]; then
  echo "Caminho da pasta copiado para a area de transferencia."
fi
echo ""
echo "Passos:"
echo "1) Ative Modo do desenvolvedor"
echo "2) Clique em Carregar sem compactacao"
echo "3) Selecione a pasta: Extensao Chrome Groups Hunter Advance"
echo "4) Clique no icone da extensao e use o popup"
