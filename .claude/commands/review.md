---
description: Revisao de codigo em contexto isolado, sobre o diff atual. Roda no subagente code-reviewer.
---

Delegue ao subagente `code-reviewer` (`.claude/agents/code-reviewer.md`), em contexto isolado desta janela: revisar o diff atual contra `CLAUDE.md` e a issue relacionada.

Cada achado retorna numerado, com arquivo e linha. Confirme cada achado no código antes de aceitá-lo; descarte com justificativa o que não se confirmar (`docs/05-travas-e-quality-gates.md`, seção 4).

Se houver mudança de schema no diff, acione também `db-guardian`. Se houver rota nova ou alterada, acione também `security-auditor`.
