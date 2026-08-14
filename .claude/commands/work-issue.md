---
description: Executa uma issue especifica em janela limpa. Roda no subagente executor, modelo Sonnet.
argument-hint: [numero da issue]
---

Janela limpa para a issue $ARGUMENTS. Não carregue histórico de outra issue.

Delegue ao subagente `executor` (`.claude/agents/executor.md`):
1. Ler apenas a issue $ARGUMENTS e os arquivos que ela cita.
2. Declarar o que vai fazer antes de executar.
3. Implementar no escopo exato, sem extra não pedido.

Após a implementação, rode `test-runner` e só então `/review`. Não avance para `/ship` dentro deste mesmo comando.
