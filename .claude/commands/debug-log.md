---
description: Protocolo de depuracao assistida para bug intermitente, via log instrumentado e recortado. Nunca le log bruto sem recorte.
argument-hint: [descricao do problema ou caminho do recorte de log]
---

Protocolo de `docs/10-observabilidade.md`, seção 4, para o problema: $ARGUMENTS

1. Confirme que o caminho relevante está instrumentado (log estruturado, JSON, correlation id). Se não está, instrumente primeiro; não prossiga sem isso.
2. Se ainda não há recorte de log capturado, pare aqui e oriente o owner a deixar rodar em produção pelo período necessário e exportar o recorte do recurso específico (não o volume total).
3. Com o recorte em mãos, delegue ao subagente `observability-agent` (`.claude/agents/observability-agent.md`) o diagnóstico, entregando o recorte junto com o contexto do problema já discutido.
4. Nunca leia log bruto sem recorte dentro desta janela (`CLAUDE.md`, regra 7).

Saída: causa raiz evidenciada pela linha de log específica, correção proposta.
