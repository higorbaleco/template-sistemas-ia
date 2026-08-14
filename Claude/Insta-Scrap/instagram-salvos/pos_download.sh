#!/bin/bash
# Script para rodar APÓS o download terminar

cd "/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos"

echo ""
echo "🔄 FASE 2: CATALOGAÇÃO E RENOMEAÇÃO"
echo "==================================="
echo ""

# Contar posts antes
echo "📊 Contando posts antes..."
total_antes=$(python3 -c "import json; print(len(json.load(open('salvos.json'))))")
echo "   Total: $total_antes posts"
echo ""

# Catalogar
echo "🔄 Catalogando posts por tema..."
python3 catalogar.py
echo ""

# Renomear
echo "🔄 Renomeando com título + @autor..."
python3 renomear.py
echo ""

# Contar depois
echo "📊 Contando posts depois..."
total_depois=$(python3 -c "import json; print(len(json.load(open('salvos.json'))))")
inspiracao=$(ls -1 inspiracao-conteudos/*.md 2>/dev/null | grep -v INDEX | wc -l)
tutorial=$(ls -1 tutorial-conteudo/*.md 2>/dev/null | grep -v INDEX | wc -l)

echo "   Total: $total_depois posts"
echo "   Inspiração: $inspiracao posts"
echo "   Tutorial: $tutorial posts"
echo ""

echo "✅ CONCLUÍDO!"
echo "==================================="
