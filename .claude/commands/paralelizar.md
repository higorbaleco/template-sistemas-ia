---
description: Analisa a fila de issues aberta e agrupa em lotes paralelizaveis vs sequenciais, com base em dependencia de arquivo e de dado. Nao executa nada sozinho.
---

Leia a fila de issues atual (`docs/specs/`, issues abertas). Para cada issue, identifique:

1. Arquivos e tabelas que ela toca.
2. Dependencia declarada em relacao a outra issue (`docs/specs/_template-spec.md`, coluna "Depende de").

Agrupe em:

- **Lote paralelo**: issues sem arquivo, tabela ou dependencia em comum entre si. Podem ser trabalhadas ao mesmo tempo, cada uma em janela limpa propria (`docs/04-fluxo-operacional.md`, secao 3; `docs/06-economia-de-contexto-e-tokens.md`, secao 4).
- **Cadeia sequencial**: issues que dependem umas das outras ou tocam o mesmo arquivo/tabela. Ordem de execucao explicita.

Saida: a lista de lotes e cadeias, sem executar nenhuma issue. Este comando nao abre janela nova nem dispara `/work-issue` sozinho; a decisao de quantas janelas abrir e quando e sempre do owner. Ele existe para que a decisao de paralelizar seja informada por dependencia real, nao por suposicao.
