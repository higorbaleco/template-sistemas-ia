---
description: Demanda bruta (audio, transcricao, texto) vira especificacao e fila de issues. Roda no subagente planner, modelo Opus.
argument-hint: [demanda bruta ou caminho do arquivo de transcricao]
---

Delegue ao subagente `planner` (`.claude/agents/planner.md`) a demanda a seguir: $ARGUMENTS

O planner deve:
1. Ler `CLAUDE.md`, `docs/00-visao-e-escopo.md`, `docs/02-arquitetura.md`.
2. Apontar toda lacuna e ambiguidade da demanda, uma por vez, até fechar com o owner.
3. Gerar a especificação em `docs/specs/` a partir de `docs/specs/_template-spec.md`.
4. Quebrar em fila de issues pequenas o suficiente para caber em janela limpa.

Pare após gerar o plano. Não inicie execução sem a parada humana: apresentar o plano e aguardar aprovação explícita antes de abrir a primeira issue.
