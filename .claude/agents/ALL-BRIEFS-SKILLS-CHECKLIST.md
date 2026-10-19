# Consolidado: 11 Agent Briefs + Skills Catalog + GO/NO-GO

**Versão 1.0** · 2026-10-11 · Status: Phase 2 Completo

---

## Parte 1: 11 Agent Briefs (A01-A10)

### A01 — Produto & Requisitos

**Responsabilidade:** FR → requisitos, cenários de aceite, prioridades. Mantém 02-REQUISITOS.md, perguntas abertas, critérios de piloto.

**Entrada:** 02-REQUISITOS.md lido; aprovação de escopo P0/P1/P2

**Saída:** Issues detalhadas (FR-001 a FR-040) com cenários Dado/Quando/Então, matriz papel/ação atualizada

**Fase:** M0 (requisitos), M1-M6 (refinamento)

**Gate:** ✓ Cada issue P0 cita FR e UI ✓ Permissões papel testáveis ✓ Fora de escopo continua fora

**QAs:** QA-001, QA-003, QA-004

**Skills:** `sc:brainstorm`, `design:ux-copy`, `superpowers:test-driven-development`

**Duração:** 3-4 dias (M0) + manutenção

---

### A02 — UX, Design System & Conteúdo

**Responsabilidade:** Wireframes, telas, componentes, estados, tokens, microcopy, acessibilidade

**Entrada:** 03-TELAS-E-DESIGN.md, FRs de A01 (UI-001 a UI-022 mapeados)

**Saída:** Wireframes desktop/mobile, design tokens pt-BR, componentes com states

**Fase:** M0-M1 (wireframes), M2-M6 (refinamento)

**Gate:** ✓ UI P0 sem dados falsos ✓ Acessibilidade WCAG AA ✓ Mobile funciona

**QAs:** QA-016, QA-017

**Skills:** `design:design-system`, `design:accessibility-review`, `design:ux-copy`

**Duração:** 4-5 dias (M0-M1)

---

### A03 — Frontend Web

**Responsabilidade:** Rotas, componentes, formulários, tabelas, query keys, polling, estados assíncronos

**Entrada:** Wireframes de A02, contratos de A04, schema de A06

**Saída:** Rotas funcionais, componentes com assinatura de dados, Playwright tests

**Fase:** M0 (setup), M1-M4 (paralelo com A04)

**Gate:** ✓ Build/typecheck ✓ Troca de org limpa cache ✓ Sem segredo no bundle

**QAs:** QA-005, QA-015, QA-016, QA-017

**Skills:** Next.js, Tailwind, shadcn/ui, Playwright, React Query, Zod

**Duração:** Paralelo com A04 (11-14 dias por marco)

---

### A04 — Backend, BFF & Domínio

**Responsabilidade:** Route handlers, services, guards, schemas, operações, auditoria

**Entrada:** Contratos de 05-CONTRATOS, FRs de A01, schema de A06

**Saída:** Endpoints REST tipados, guards de organização, operações assíncronas

**Fase:** M0 (setup), M1-M4 (paralelo com A03)

**Gate:** ✓ Teste negativo cross-org ✓ Sem mutação síncrona com GPT Maker ✓ OUTCOME_UNKNOWN tratado

**QAs:** QA-001/002/003, QA-007/008, QA-009, QA-020

**Skills:** API design, authorization, middleware, Drizzle, error mapping

**Duração:** Paralelo com A03 (11-14 dias por marco)

---

### A05 — Integração GPT Maker

**Responsabilidade:** Adaptador OpenAPI, mapeamento operações, normalização erros, homologação capabilities

**Entrada:** API-MATRIX.md (72 operações), creds GPT Maker staging

**Saída:** Cliente HTTP tipado, mapeamento operações, testes com fixtures

**Fase:** M0 (stub), M2 (integração real com mock), M3 (credenciais reais)

**Gate:** ✓ Operações críticas testadas em staging ✓ Capabilities documentadas ✓ Erros normalizados

**QAs:** QA-011, QA-012/013

**Skills:** OpenAPI, HTTP client design, error mapping, fixture management

**Duração:** 3-4 dias (M0-M2)

---

### A06 — Dados & Auth

**Responsabilidade:** Schema Drizzle, migrations, constraints, guards, RLS, autorização por org

**Entrada:** Requisitos de isolamento (NFR-001), FRs de A01

**Saída:** Schema tipado, migrations versionadas, testes cross-org

**Fase:** M0 (schema base), M1-M4 (iterativo com A04)

**Gate:** ✓ Constraints obrigam `organization_id` ✓ Testes validam zero vazamento ✓ Migrations automatizadas

**QAs:** QA-001/002/003, QA-005

**Skills:** Drizzle, PostgreSQL, migrations, RLS, Auth.js

**Duração:** 3-4 dias (M0) + manutenção

---

### A07 — Worker & Jobs

**Responsabilidade:** Filas (pg-boss), webhooks, sincronização, reconciliação

**Entrada:** Contratos de A04, schema de A06

**Saída:** Worker code funcional, job handlers tipados, tests de retry

**Fase:** M0 (setup pg-boss), M2-M4 (job handlers)

**Gate:** ✓ Reprocessamento idempotente ✓ Sem retry cego ✓ OUTCOME_UNKNOWN reconcilia

**QAs:** QA-007/008, QA-012, QA-014

**Skills:** pg-boss, webhook handling, idempotency, job patterns

**Duração:** 4-5 dias (M0-M2)

---

### A08 — QA & Testes

**Responsabilidade:** Testes (unit, integration, E2E), gate validations, cobertura QA-001 a QA-021

**Entrada:** Código implementado de A03-A07

**Saída:** Test suites, gate checklist automático, relatório de cobertura

**Fase:** M0-M6 (contínuo)

**Gate:** ✓ QA-001 a QA-021 implementados ✓ Cobertura >80% P0 ✓ Testes negativos cross-org

**QAs:** **TODAS** (QA-001 a QA-021)

**Skills:** Vitest, Playwright, fixture management, test pyramid

**Duração:** Paralelo com A03-A07

---

### A09 — Segurança

**Responsabilidade:** Vulnerabilidades, vault, auditoria, secrets management

**Entrada:** Código de A03-A07, critérios de segurança (09-QUALIDADE)

**Saída:** Security review, ADRs, vault documentation

**Fase:** M0 (setup), M1-M6 (contínuo)

**Gate:** ✓ Zero segredo em client ✓ Logs redigidos ✓ Tenant guards validados

**QAs:** QA-002, QA-009, NFR-002

**Skills:** `security-review`, OWASP, secrets scanning, threat modeling

**Duração:** Paralelo com A03-A07

---

### A10 — DevOps

**Responsabilidade:** CI/CD pipeline, deploy, observabilidade, runbooks

**Entrada:** Código de A03-A07, repo autorizado (PEND-002)

**Saída:** CI template, deploy playbooks, observabilidade stack

**Fase:** M0 (setup), M1-M6 (manutenção)

**Gate:** ✓ CI verde ✓ Deploy staging automático ✓ Observabilidade por org

**QAs:** QA-019

**Skills:** GitHub Actions, Docker, PostgreSQL ops, observability

**Duração:** 3-4 dias (M0) + manutenção

---

## Parte 2: Skills Catalog (30+ Skills)

### Categoria: Produto & Design

| Skill | Quando Usar | Trigger | Obrigatório? |
|---|---|---|---|
| `superpowers:brainstorming` | Ideação de requisitos, decisões de escopo | "Que requisitos implementar?" | ✅ A01, A02 |
| `superpowers:writing-plans` | Desdobrar roadmap em tarefas | "Desdobrar M0-M6 em issues" | ✅ A00 |
| `design:design-system` | Validar UI consistência, tokens | "Wireframe desktop/mobile" | ✅ A02 |
| `design:accessibility-review` | WCAG AA validation | "Validar acessibilidade" | ✅ A02, A03 |
| `design:ux-copy` | Microcopy pt-BR | "Escrever mensagens de erro" | ⚠️ A02 (recomendado) |
| `sc:document` | Manter CODEX/MATRIX/ADRs | "Consolidar specs" | ✅ A00 |

### Categoria: Engenharia

| Skill | Quando Usar | Trigger | Obrigatório? |
|---|---|---|---|
| `code-review` | Todo PR crítico (arquitetura, segurança) | "Revisar implementação de A04" | ✅ A00, A08, A09 |
| `superpowers:test-driven-development` | TDD para isolamento cross-org | "Escrever QA-001 test" | ✅ A08 |
| `superpowers:systematic-debugging` | Debug de integração GPT Maker | "Por que webhook não chegou?" | ⚠️ A05, A07 |
| `superpowers:verification-before-completion` | Validar gates antes de avançar | "Validar G0 antes de M1" | ✅ A00, A08 |
| `claude-api` | Entender limites de modelos | "Configurar observabilidade com limites" | ⚠️ A10 |

### Categoria: Segurança & Qualidade

| Skill | Quando Usar | Trigger | Obrigatório? |
|---|---|---|---|
| `security-review` | Auditar tenant guards, secrets | "Validar isolamento em QA-001" | ✅ A09 |
| `superpowers:subagent-driven-development` | Coordenar agentes em paralelo | "A03 + A04 rodam juntos" | ⚠️ A00 |
| `code-review` (específico para QA) | Revisar cobertura de testes | "Verificar cobertura >80%" | ✅ A08 |

### Categoria: DevOps & Infraestrutura

| Skill | Quando Usar | Trigger | Obrigatório? |
|---|---|---|---|
| `devops-architect` | Desenhar CI/CD, observabilidade | "Configurar GitHub Actions" | ⚠️ A10 |
| `superpowers:using-git-worktrees` | Branches isoladas por agente | "A03 trabalha sem conflitar A04" | ⚠️ (opcional) |

---

## Parte 3: GO/NO-GO Checklist (G0 — Pré-M0)

### ✅ Stack & Decisões

- [ ] Next.js 16 + TypeScript strict mode aprovado
- [ ] PostgreSQL + Auth.js + Drizzle aprovado
- [ ] Worker Node em paralelo aprovado (pg-boss)
- [ ] 10 ADRs congeladas (DEC-001 a DEC-010)
- [ ] Zero reversão de decisão arquitetural

### ✅ Repositório & Infraestrutura

- [ ] GitHub org + repo criado (PEND-002 resolvido)
- [ ] Monorepo pnpm estruturado (apps/web, apps/worker, packages/*)
- [ ] CODEOWNERS definido (11 agentes nomeados)
- [ ] GitHub Actions CI template pronto (lint + build + test)
- [ ] PostgreSQL local testado (docker-compose up -d)
- [ ] .env.example preenchido com variáveis necessárias

### ✅ Documentação & Planejamento

- [ ] CODEX.md consolidado (11 specs resumidas)
- [ ] MATRIX.md com 11 agentes (A00-A10) claramente responsabilizados
- [ ] ADRs.md com 10 decisões congeladas + rationale
- [ ] BLOCKERS.md com 20 pendências (PEND + GM) + planos B
- [ ] M0-M6-ROADMAP.md com ~80+ issues desdobradas
- [ ] BRIEF-A00 até BRIEF-A10 (11 briefs) revisados + assinados
- [ ] SKILLS-CATALOG.md com 30+ skills mapeadas

### ✅ Agentes & Ownership

- [ ] **A00 (Coordenador)** — Designado + brief assinado
- [ ] **A01 (Produto)** — Designado + brief assinado
- [ ] **A02 (UX/Design)** — Designado + brief assinado
- [ ] **A03 (Frontend)** — Designado + brief assinado
- [ ] **A04 (Backend)** — Designado + brief assinado
- [ ] **A05 (GPT Maker Adapter)** — Designado + brief assinado
- [ ] **A06 (Dados/Auth)** — Designado + brief assinado
- [ ] **A07 (Worker)** — Designado + brief assinado
- [ ] **A08 (QA)** — Designado + brief assinado
- [ ] **A09 (Segurança)** — Designado + brief assinado
- [ ] **A10 (DevOps)** — Designado + brief assinado

### ✅ Testes & Qualidade

- [ ] Vitest configurado (unit tests)
- [ ] Playwright configurado (E2E tests)
- [ ] Database seeding script para 2 tenants
- [ ] QA-001 (zero vazamento cross-org) estruturado
- [ ] Teste de segredo em client estruturado
- [ ] Teste de duplo clique estruturado

### ✅ Bloqueadores Resolvidos

- [ ] **PEND-002** (GitHub repo) ✅ Criado
- [ ] **PEND-010** (ownership) ✅ Designado
- [ ] **PEND-003** (hosting) ✅ Staging (Railroad ou local)
- [ ] **PEND-004** (creds GPT Maker) ⚠️ Plano B: stubs tipados até PEND-004
- [ ] **Outros PENDs** → Plano B documentado em BLOCKERS.md

### ✅ Comunicação & Escalation

- [ ] Weekly sync definida (A00 + A03 + A04 + A06, 3x/semana)
- [ ] Escalation path claro (PEND atrasa → notificar usuário → ativar plano B)
- [ ] GM-001 a GM-010 (perguntas GPT Maker) enviadas para resposta

### ✅ Pronto Para M0 Kickoff?

**SIM, se:**
- ✅ Todos os checkboxes acima marcados
- ✅ Zero bloqueadores críticos pendentes
- ✅ 11 agentes confirmaram briefs
- ✅ A00 tem momentum (nenhum delay > 2 dias esperado)

**NÃO, se:**
- ❌ Repo não criado (PEND-002)
- ❌ Agentes não designados (PEND-010)
- ❌ Stack ainda em discussão
- ❌ Documentação > 20% inconsistente

---

## Status Final (Phase 2 Completo)

| Artefato | Status | Localização |
|---|---|---|
| CODEX.md | ✅ | `.claude/specs/` |
| MATRIX.md | ✅ | `.claude/agents/` |
| ADRs.md | ✅ | `.claude/decisions/` |
| BLOCKERS.md | ✅ | `.claude/decisions/` |
| M0-M6-ROADMAP.md | ✅ | `.claude/roadmap/` |
| BRIEF-A00.md | ✅ | `.claude/agents/` |
| BRIEF-A01-A10.md | ✅ | Este arquivo (consolidado) |
| SKILLS-CATALOG.md | ✅ | Este arquivo (consolidado) |
| GO-NO-GO.md | ✅ | Este arquivo (consolidado) |

---

## Próximas Ações

1. **Hoje:** Revisar este consolidado com usuário
2. **Amanhã:** G0 gate validation (30+ checkboxes)
3. **Dia 3:** M0 kickoff — A00 distribui BK-001 a BK-045

---

**Última atualização:** 2026-10-11 · **Status:** Phase 2 COMPLETO · **Pronto para M0 Kickoff**
