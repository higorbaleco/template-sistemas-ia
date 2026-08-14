#!/bin/bash
# COMANDOS RÁPIDOS PARA INSTAGRAM SALVOS
# Copie e cole no terminal conforme necessário

PASTA="/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos"

# ========================================
# 1. ADICIONAR POR URL (MAIS FÁCIL)
# ========================================
# Uso: ./COMANDOS.sh url "https://www.instagram.com/reels/SHORTCODE/"

url() {
  cd "$PASTA"
  python3 baixar_por_url.py "$1"
}

# Exemplo:
# url "https://www.instagram.com/reels/Da3Z0zLpRlU/"

# ========================================
# 2. BAIXAR NOVOS SALVOS (EM MASSA)
# ========================================
# Uso: ./COMANDOS.sh baixar_salvos 50

baixar_salvos() {
  cd "$PASTA"
  .venv-instagram-salvos/bin/python .claude/skills/instagram-salvos/scripts/baixar_salvos.py \
    baixar --perfil omagodowhats --confirmo-perfil omagodowhats --max "${1:-50}" --pausa 3
}

# Exemplo:
# baixar_salvos 50

# ========================================
# 3. RECATALOGAR TUDO
# ========================================
# Uso: ./COMANDOS.sh recatalogar

recatalogar() {
  cd "$PASTA"
  echo "🔄 Catalogando..."
  python3 catalogar.py
  echo "🔄 Renomeando..."
  python3 renomear.py
  echo "✅ Concluído!"
}

# ========================================
# 4. VER QUANTOS POSTS TEM
# ========================================
# Uso: ./COMANDOS.sh contar

contar() {
  cd "$PASTA"
  total=$(python3 -c "import json; print(len(json.load(open('salvos.json'))))")
  inspiracao=$(ls -1 inspiracao-conteudos/*.md 2>/dev/null | grep -v INDEX | wc -l)
  tutorial=$(ls -1 tutorial-conteudo/*.md 2>/dev/null | grep -v INDEX | wc -l)

  echo "📊 Status da Base:"
  echo "   Total: $total posts"
  echo "   Inspiração: $inspiracao posts"
  echo "   Tutorial: $tutorial posts"
}

# ========================================
# 5. VER ÍNDICE (BUSCAR POSTS)
# ========================================
# Uso: ./COMANDOS.sh indice [pasta]

indice() {
  cd "$PASTA"
  if [ -z "$1" ]; then
    cat INDEX.md
  else
    cat "$1/INDEX.md"
  fi
}

# Exemplo:
# indice inspiracao-conteudos

# ========================================
# 6. LIMPAR E COMEÇAR DO ZERO
# ========================================
# Uso: ./COMANDOS.sh limpar (CUIDADO!)

limpar() {
  cd "$PASTA"
  echo "⚠️  AVISO: Isso vai deletar inspiracao-conteudos e tutorial-conteudo!"
  echo "   salvos.json será preservado"
  read -p "Deseja continuar? (s/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Ss]$ ]]; then
    rm -rf inspiracao-conteudos tutorial-conteudo
    mkdir -p inspiracao-conteudos tutorial-conteudo
    echo "✅ Pastas limpas!"
  fi
}

# ========================================
# 7. QUICK START APÓS URL
# ========================================
# Uso: ./COMANDOS.sh quick_url "URL"

quick_url() {
  url "$1"
  echo ""
  contar
}

# ========================================
# 8. TUDO DE UMA VEZ (NOVO BATCH DE SALVOS)
# ========================================
# Uso: ./COMANDOS.sh tudo 50

tudo() {
  echo "📥 Baixando $1 posts..."
  baixar_salvos "$1"
  echo ""
  echo "🔄 Catalogando e renomeando..."
  recatalogar
  echo ""
  contar
}

# ========================================
# SHORTCUTS (COPIE PARA .bashrc OU .zshrc)
# ========================================
# alias ig-url='bash '"$0"' url'
# alias ig-salvos='bash '"$0"' baixar_salvos'
# alias ig-catalog='bash '"$0"' recatalogar'
# alias ig-count='bash '"$0"' contar'
# alias ig-index='bash '"$0"' indice'

# ========================================
# USO EXEMPLO
# ========================================
# bash COMANDOS.sh url "https://www.instagram.com/reels/XXX/"
# bash COMANDOS.sh baixar_salvos 50
# bash COMANDOS.sh recatalogar
# bash COMANDOS.sh contar
# bash COMANDOS.sh indice inspiracao-conteudos
# bash COMANDOS.sh tudo 50

# ========================================

# Se nenhum argumento, mostrar ajuda
if [ -z "$1" ]; then
  echo "📱 COMANDOS INSTAGRAM SALVOS"
  echo ""
  echo "Uso: bash COMANDOS.sh [comando] [args]"
  echo ""
  echo "Comandos:"
  echo "  url <URL>              - Adicionar post por URL"
  echo "  baixar_salvos [N]      - Baixar N salvos (padrão: 50)"
  echo "  recatalogar            - Recatalogar e renomear tudo"
  echo "  contar                 - Ver quantos posts tem"
  echo "  indice [pasta]         - Ver INDEX (todas ou específica)"
  echo "  quick_url <URL>        - Adicionar URL + mostrar status"
  echo "  tudo [N]               - Fazer tudo: baixar + catalogar + contar"
  echo "  limpar                 - Deletar pastas (CUIDADO!)"
  echo ""
  echo "Exemplos:"
  echo "  bash COMANDOS.sh url 'https://www.instagram.com/reels/XXX/'"
  echo "  bash COMANDOS.sh tudo 50"
  echo "  bash COMANDOS.sh contar"
  exit 0
fi

# Executar comando
"$@"
