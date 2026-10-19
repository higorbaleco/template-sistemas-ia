# SKILLS-CATALOG: Skills Necessários por Agente e Fase

**Versão 1.0** · 2026-10-11 · Status: Phase 2 (Orquestração) · Owner: A00 (Coordenador)

Consolida os skills citados em MATRIX.md e nos 11 AGENT-BRIEFs (A00-A10) em um catálogo único, categorizado por obrigatoriedade e mapeado para quando usar. Serve como checklist de "o agente invocou o skill certo antes de agir?" durante M0-M6.

---

## Como usar este catálogo

- 🔴 **Obrigatório** — sem este skill, o agente não deve prosseguir na tarefa (gate bloqueante).
- 🟡 **Recomendado** — melhora qualidade/velocidade, mas não bloqueia.
- 🟢 **Opcional** — usar quando o contexto específico pedir.

---

## 1. Skills de Processo (transversais, qualquer agente)

| Skill | Obrigatoriedade | Quando usar | Agentes principais |
|---|---|---|---|
| `superpowers:writing-plans` | 🔴 | Antes de qualquer tarefa multi-step com spec clara, antes de tocar código | A00, A01 |
| `superpowers:test-driven-development` | 🔴 | Antes de implementar qualquer feature/bugfix | A03, A04, A06, A07 |
| `superpowers:systematic-debugging` | 🔴 | Ao encontrar bug, teste falho, comportamento inesperado | Todos |
| `superpowers:requesting-code-review` | 🔴 | Ao completar tarefa, antes de merge | Todos |
| `code-review` | 🔴 | Revisão de diff antes de todo push | A00, A09 |
| `superpowers:brainstorming` | 🟡 | Antes de trabalho criativo/novo recurso | A01, A02 |
| `superpowers:subagent-driven-development` | 🟡 | Execução de plano com tarefas independentes via subagentes | A00 |
| `superpowers:executing-plans` | 🟢 | Quando execução é inline, sem subagentes | A00 |
| `superpowers:finishing-a-development-branch` | 🟡 | Ao finalizar branch, decidir merge/integração | A00 |
| `superpowers:using-git-worktrees` | 🟢 | Trabalho paralelo isolado em worktrees | A00, A03, A04 |

---

## 2. Skills por Domínio Funcional

### Produto & Requisitos (A01)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `sc:brainstorm` | 🔴 | Descoberta de requisitos via diálogo socrático |
| `design:ux-copy` | 🟡 | Microcopy pt-BR, mensagens de erro/sucesso |
| `design:user-research` | 🟢 | Validação de hipótese com usuário real (piloto) |

### UX, Design System & Conteúdo (A02)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `design:design-system` | 🔴 | Definir tokens, componentes, estados visuais |
| `design:accessibility-review` | 🔴 | Validar WCAG AA antes de qualquer tela P0 |
| `design:ux-copy` | 🔴 | Toda string visível ao usuário em pt-BR |
| `design:design-critique` | 🟡 | Revisão crítica de wireframe antes de A03 implementar |
| `frontend-design` / `ui-ux-pro-max` | 🟢 | Quando wireframe precisa virar protótipo navegável rápido |

### Frontend Web (A03)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `frontend-design` | 🟡 | Componentes novos sem padrão visual definido ainda |
| `web-design-guidelines` | 🟡 | Checar conformidade com Web Interface Guidelines |
| `design:accessibility-review` | 🔴 | Antes de considerar uma tela P0 "pronta" |

### Backend, BFF & Domínio (A04)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `security-review` | 🔴 | Todo endpoint novo exposto, toda mudança em guard de organização |
| `db-guardian` (agente) | 🔴 | Toda mudança que toca schema/query/migration |

### Integração GPT Maker (A05)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `claude-api` | 🟡 | Apenas se a integração envolver chamadas a modelos Claude/Anthropic (não GPT Maker) |
| (nenhum skill de API genérica dedicado — usar `code-review` + testes de fixture) | — | — |

### Dados & Auth (A06)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `db-guardian` (agente) | 🔴 | Toda migration, índice, constraint nova |
| `security-review` | 🔴 | Guards de isolamento, RLS, Auth.js config |

### Worker & Jobs (A07)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `queue-architect` (agente) | 🔴 | Desenho de fila/worker antes de implementar handler |
| `observability-agent` (agente) | 🟡 | Instrumentar jobs para depuração de retry/idempotência |

### QA & Testes (A08)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `superpowers:test-driven-development` | 🔴 | Base de todo trabalho de A08 |
| `test-runner` (agente) | 🔴 | Rodar suite e interpretar saída após toda implementação |
| `superpowers:verification-before-completion` | 🔴 | Antes de declarar gate como validado |

### Segurança (A09)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `security-review` | 🔴 | Review contínuo de A03-A07; obrigatório antes de G0/G1/G5 |
| `security-auditor` (agente) | 🔴 | Antes de release e em toda rota nova exposta |
| `finance-validator` (agente) | 🟢 | Apenas se/quando billing for implementado (fora do P0 atual) |

### DevOps (A10)

| Skill | Obrigatoriedade | Quando usar |
|---|---|---|
| `devops-architect` (agente) | 🔴 | Desenho de pipeline CI/CD e estratégia de rollback |
| `superpowers:writing-plans` | 🟡 | Documentar fluxo de deploy/observabilidade |

---

## 3. Skills de Documentação & Memória

| Skill | Obrigatoriedade | Quando usar | Agentes principais |
|---|---|---|---|
| `sc:document` | 🟡 | Manter CODEX/MATRIX/ADRs/BLOCKERS sincronizados | A00 |
| `claude-mem:mem-search` | 🟢 | Checar se um problema já foi resolvido em sessão anterior | Todos |
| `claude-mem:learn-codebase` | 🟢 | Ao entrar em parte nova do código ainda não mapeada | A03, A04 |

---

## 4. Skills Explicitamente Fora de Escopo (não usar neste projeto)

- Skills de marketing/copy/branding (`copy-squad`, `brand-squad`, `marketing-squad`, `storytelling`) — este é um projeto de produto B2B interno, não uma campanha.
- Skills de geração visual de marca (`brandkit`, `logo-design`) — PEND-001 resolve identidade visual separadamente; não gerar ad-hoc.
- `typeui-*` (50+ variantes de estilo visual) — A02 já define tokens próprios em `design:design-system`; não misturar com temas pré-fabricados.

---

## Checklist de Verificação por Fase

**Antes de M0 kickoff:**
- [ ] A00 confirmou que `superpowers:writing-plans` e `code-review` estão disponíveis no ambiente de execução
- [ ] A08 confirmou que `test-runner` roda localmente
- [ ] A09 confirmou que `security-review` está acessível antes de G0

**Antes de cada gate (G0-G5):**
- [ ] A09 rodou `security-review` no código da fase
- [ ] A08 rodou `superpowers:verification-before-completion` nos QAs da fase
- [ ] A00 rodou `code-review` nos PRs críticos da fase

---

**Última atualização:** 2026-10-11 · **Owner:** A00 (Coordenador) · **Status:** Phase 2 (Orquestração)
