---
description: Gera o relatorio final e apresenta a parada humana obrigatoria antes do git push.
---

Gere o relatório de ship:

1. Issues concluídas nesta sessão, com link ou número.
2. Suíte: verde ou vermelho, com resultado do `test-runner`.
3. Achados de `code-reviewer` (e `security-auditor`/`db-guardian` se acionados): confirmados, corrigidos, ou descartados com justificativa.
4. Arquivos tocados no total.
5. Risco aberto, se houver.

Apresente o relatório e pare. `git push` não roda automaticamente (`.claude/hooks/block-push`). Aguarde autorização explícita do owner antes de prosseguir.
