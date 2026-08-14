#!/usr/bin/env bash
# Inicializa um projeto novo a partir deste template.
# Ver README.md, secao "Como usar > Projeto novo".
set -euo pipefail

echo "== Bootstrap do template operacao assistida por IA =="

if [ ! -d ".git" ]; then
  echo "-- git init"
  git init -q
fi

echo "-- confirmando permissao de execucao dos hooks"
chmod +x .claude/hooks/*.mjs 2>/dev/null || true

echo "-- criando .env a partir de .env.example, se existir"
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
  cp .env.example .env
  echo "   .env criado. Preencha os valores antes de rodar a aplicacao."
fi

echo "-- verificando placeholders pendentes em CLAUDE.md"
if grep -q "\[PREENCHER\]" CLAUDE.md 2>/dev/null; then
  echo "   CLAUDE.md ainda tem campos [PREENCHER]. Rode /kickoff no Claude Code para completar."
else
  echo "   CLAUDE.md sem placeholder pendente."
fi

echo "-- checando ferramentas esperadas pela stack oficial (docs/01-stack-oficial.md)"
for bin in python3 node docker; do
  if command -v "$bin" >/dev/null 2>&1; then
    echo "   $bin: ok"
  else
    echo "   $bin: nao encontrado no PATH"
  fi
done

echo ""
echo "Bootstrap concluido."
echo "Proximo passo: abra o Claude Code neste diretorio e rode /kickoff."
