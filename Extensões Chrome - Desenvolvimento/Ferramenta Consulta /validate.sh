#!/bin/zsh
set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔍 Validando a extensão simples..."
echo ""

REQUIRED_FILES=(
  "chrome-extension/manifest.json"
  "chrome-extension/shared.js"
  "chrome-extension/sources.js"
  "chrome-extension/background.js"
  "chrome-extension/content-script.js"
  "chrome-extension/popup.html"
  "chrome-extension/popup.js"
  "chrome-extension/options.html"
  "chrome-extension/options.js"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file não encontrado"
    exit 1
  fi
done

echo ""
echo "Verificando manifest..."
python3 - <<'PY'
import json
with open("chrome-extension/manifest.json", "r", encoding="utf-8") as fp:
    manifest = json.load(fp)
assert manifest["manifest_version"] == 3
assert manifest["background"]["service_worker"] == "background.js"
assert "downloads" in manifest["permissions"]
assert "storage" in manifest["permissions"]
assert "tabs" in manifest["permissions"]
print("manifest.json OK")
PY

echo ""
echo "Verificando ausência de backend local nos arquivos da extensão..."
if rg -n "127\\.0\\.0\\.1:5050|localhost:5050|\\bFlask\\b|\\bSSE\\b|app\\.py|/buscar|/status/" chrome-extension >/dev/null; then
  echo -e "${RED}✗${NC} Ainda existem referências ao backend dentro da extensão"
  exit 1
else
  echo -e "${GREEN}✓${NC} Nenhuma referência ao backend na pasta da extensão"
fi

echo ""
echo "Verificando ausência de filtro mínimo de membros..."
if rg -n "\\bminMembers\\b|search-min-members|min-members|Mínimo de membros" chrome-extension >/dev/null; then
  echo -e "${RED}✗${NC} Ainda existem referências ao filtro mínimo de membros"
  exit 1
else
  echo -e "${GREEN}✓${NC} Nenhuma referência ao filtro mínimo de membros na pasta da extensão"
fi

echo ""
echo "════════════════════════════════════════"
echo -e "${GREEN}✅ VALIDAÇÃO COMPLETA${NC}"
echo "════════════════════════════════════════"
