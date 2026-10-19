# CODEX: Índice Consolidado das 11 Specs do GPT Maker Dashboard

**Versão 1.0** · 2026-10-11 · Status: Consolidação de Phase 1 · Owner: A00 (Coordenador)

Este documento é o índice único das 11 especificações e um mapa navegável para stakeholders, agentes e revisores. Substitui a necessidade de ler 11 arquivos para obter visão geral.

---

## Ordem de Leitura Crítica

Para máxima coerência, leia nesta ordem (3-4 horas):

1. **README.md** (5 min) → Mapa mental, stack recomendada, premissas principais
2. **01-STACK-E-DECISOES.md** (15 min) → Decisões tecnológicas (DEC-001 a 010)
3. **02-REQUISITOS.md** (20 min) → Requisitos funcionais (FR-001 a 040) e não-funcionais (NFR-001 a 012)
4. **06-AGENTES-E-SKILLS.md** (25 min) → 11 agentes (A00-A10) e responsabilidades
5. **03-TELAS-E-DESIGN.md** (20 min) → Fluxos visuais, rotas, componentes
6. **04-ARQUITETURA-E-DADOS.md** (25 min) → Banco, isolamento, worker, webhooks
7. **07-ROADMAP-E-BACKLOG.md** (20 min) → 6 fases (M0-M6), gates (G0-G5), backlog BK-001 a BK-045
8. **05-CONTRATOS-E-INTEGRACAO.md** (15 min) → APIs internas, contrato do adaptador
9. **08-REPOSITORIO-E-CODIGO.md** (15 min) → Estrutura repo, padrões, CI
10. **09-QUALIDADE-SEGURANCA-OPERACAO.md** (20 min) → QA-001 a QA-021, segurança, runbooks
11. **11-DECISOES-PENDENCIAS-E-RASTREABILIDADE.md** (15 min) → Tabelas síntese, rastreabilidade

---

## Resumo Executivo das 11 Specs

### 📋 README.md
**Propósito:** Mapa mental, stack, premissas

- **Stack recomendado:** Next.js 16 + TypeScript + PostgreSQL + Auth.js + Drizzle + pg-boss + worker Node
- **Premissa principal:** GPT Maker é motor de agentes/conhecimento/canais; nossa plataforma controla identidade, organizações, UX, marca, auditoria
- **Escopo P0:** Autenticar, provisionar workspace, criar agente, adicionar conhecimento TEXT/DOCUMENT, testar em labs, listar canal, inbox + handoff, dashboard, auditoria
- **Fora do P0:** CRM completo, billing, marketplace, app nativo, widget próprio, API pública

**Leitura recomendada:** Começar aqui. Entender stack e escopo.

---

### 🏗️ 01-STACK-E-DECISOES.md
**Propósito:** Decisões tecnológicas com alternativas e trade-offs

**Decisões principais (DEC-001 a DEC-010):**

| ID | Decisão | Motivo | Alternativas rejeitadas |
|---|---|---|---|
| DEC-001 | Next.js App Router + TypeScript | Entrega rápida, BFF + UI mesmo stack | Remix, SvelteKit, Astro |
| DEC-002 | Sem Supabase; PostgreSQL + Auth.js + Drizzle | Usuário quer inserir chave GPT Maker no backend | Supabase realtime, Firebase |
| DEC-003 | Drizzle no MVP | Schema/migrations tipadas, SQL explícito | Prisma, TypeORM |
| DEC-004 | pg-boss para filas | Aproveita Postgres, jobs duráveis | BullMQ + Redis |
| DEC-005 | Repositório único privado | Tipos compartilhados, menos coordenação | Monorepo pnpm com apps/worker separado |
| DEC-006 | UI pt-BR, código/rotas em inglês | Produto local, padrão técnico | Código em português (não) |
| DEC-007 | Polling com snapshots locais | Evita webhook/tempo real não homologado | Webhook-first (risco técnico) |
| DEC-008 | Capabilities por organização/canal | Documentação ≠ comportamento homologado | Capabilities liberadas globalmente (risco) |
| DEC-009 | Onboarding assistido workspace/canal | API pública não prova criação completa | Criação autônoma (risco operacional) |
| DEC-010 | Mutação externa sempre assíncrona (operação) | Evita perder efeito em timeout/restart | Síncrono (risco de OUTCOME_UNKNOWN) |

**Recomendação:** ADRs-001 a 010 em `decisions/ADRs.md` para rationale completo.

---

### 📋 02-REQUISITOS.md
**Propósito:** Requisitos funcionais (FRs) e não-funcionais (NFRs) com critérios de aceite

**Resumo:**
- **40 FRs** (FR-001 a FR-040) com prioridade P0/P1/P2
- **12 NFRs** (NFR-001 a NFR-012) com metas de disponibilidade, performance, segurança
- **7 papéis** (owner, admin, manager, trainer, operator, analyst, platform_admin) com matriz de permissões

**FRs críticos P0:**
- FR-001/002/003: Login, organização, RBAC
- FR-004/005: Onboarding assistido
- FR-006/007/008: Listar, criar, editar agente
- FR-009: Laboratório isolado
- FR-010/011: Conhecimento TEXT/DOCUMENT
- FR-015/016/017/018: Inbox, fila, assumir/devolver, envio textual
- FR-021/023/024: Contatos, canais, conexão canal piloto
- FR-026: Dashboard básico
- FR-033/034/035/036: Auditoria, ops, exclusão assistida
- FR-039: Capabilities por org/canal

**Recomendação:** Cada FR precisa de teste QA (QA-001 a QA-021) e mapeamento para UI e arquitetura.

---

### 👥 06-AGENTES-E-SKILLS.md
**Propósito:** 11 agentes (A00-A10) com responsabilidades e skills

**Matriz simplificada:**

| ID | Agente | Responsabilidade | Entradas críticas | Saídas | Bloqueia | Bloqueado |
|---|---|---|---|---|---|---|
| A00 | Coordenador | Coerência, gates, PRs | Specs, decisões | Backlog, ADRs | **todos** | nenhum |
| A01 | Produto | FR → requisitos, aceite | Spec 02 | Issues | A02,A03,A04 | A00 |
| A02 | UX/Design | Wireframes, tokens, componentes | Spec 03 | UI specs | A03 | A00,A01 |
| A03 | Frontend | Rotas, componentes, formulários | Spec 03, 08 | UI code, stories | — | A00,A02 |
| A04 | Backend/BFF | Endpoints, validação, isolamento | Spec 04, 05, 08 | Route handlers, testes | A03,A05,A07 | A00,A06 |
| A05 | GPT Maker adapter | OpenAPI, integração | Spec 05, API-MATRIX | Cliente HTTP | A04,A02 labs | A00,A04 |
| A06 | Dados/Auth | Schema, migrations, guards | Spec 04, 08 | Drizzle, testes | A04,A03 | A00,A08 |
| A07 | Worker/jobs | Filas, webhooks, sync | Spec 04, 07, 09 | Worker code | — | A00,A04 |
| A08 | QA | Testes, gates, QA-001→021 | Spec 09 | Test suites | **A00** | A01-A10 |
| A09 | Segurança | Vulnerabilidades, vault | Spec 09, 11 | Security ADRs | **A00** | A04,A06,A07 |
| A10 | DevOps | CI, deploy, observabilidade | Spec 08, 09 | CI config | **A00** | A04,A07 |

**Skill úteis por agente:**
- A00: `sc:document`, `superpowers:writing-plans`, `code-review`
- A01: `sc:brainstorm`, `design:ux-copy`
- A02: `design:design-system`, `design:accessibility-review`
- A03: Tailwind, shadcn/ui, Playwright
- A04: API design, cross-tenant, middleware
- A05: OpenAPI, HTTP client, error mapping
- A06: Drizzle, constraints, RLS
- A07: pg-boss, webhooks, worker patterns
- A08: Vitest, fixtures, test pyramid
- A09: `security-review`, OWASP, secrets vault
- A10: GitHub Actions, Docker, monitoring

---

### 🎨 03-TELAS-E-DESIGN.md
**Propósito:** Fluxos visuais, rotas, componentes, design tokens

**Telas P0:**
- UI-01: Login
- UI-02: Organização, troca de org
- UI-03: Dashboard mínimo (volume, fila, saúde)
- UI-04/05/06: Inbox, assumir/devolver, envio
- UI-07/08/09: Agentes (listar, criar, editar)
- UI-10: Laboratório de teste
- UI-11/12: Conhecimento (TEXT, DOCUMENT)
- UI-14: Contatos
- UI-15: Canais
- UI-17: Relatórios
- UI-20: Configurações, exclusão assistida
- UI-21/22: Auditoria, /ops
- UI-01, UI-20: Navegação, acessibilidade

**Design tokens:**
- Paleta pt-BR consistente (cor, tipografia, espaçamento)
- Estados: loading, empty, error, stale, pending, conflict
- Acessibilidade: teclado, foco, semântica, contraste WCAG AA
- Mobile: responsive, touch-friendly, até 3s p75 latência

**Recomendação:** A02 responsável; skill `design:design-system` + `design:accessibility-review` obrigatórios.

---

### 🏛️ 04-ARQUITETURA-E-DADOS.md
**Propósito:** Banco, isolamento, operações, worker, webhooks

**Princípios arquiteturais:**
1. **Isolamento por organização** — FKs compostas, constraints, tenant guards, RLS, testes cross-org
2. **Operações assíncronas** — Outbox pattern, mutações nunca síncronas com fornecedor
3. **Snapshots locais** — Polling com polling, não webhook-first
4. **Webhook como hint** — Valida tudo com releitura autenticada
5. **OUTCOME_UNKNOWN** — Estado de primeira classe, sem retry cego

**Schema principal:**
- `organizations` + `organization_members`
- `agents`, `trainings` (sources)
- `chats`, `messages` (inbox)
- `channels`, `channel_agents`
- `operations`, `operation_results` (outbox)
- `audit_logs`

**Worker responsabilidades:**
- Sync de agentes/canais com GPT Maker
- Processamento de training
- Envio de mensagens
- Reconciliação de OUTCOME_UNKNOWN

**Recomendação:** A04 + A06 + A07 trabalham em conjunto; skill `security-review` obrigatório para isolamento.

---

### 🔗 05-CONTRATOS-E-INTEGRACAO.md
**Propósito:** APIs internas, contrato do adaptador, capabilities

**Contratos principais:**
- `ApiSuccess<T>` — { data: T, meta }
- `ApiError` — { error: { code, message, details }, meta }
- `OperationRef` — { operationId, correlationId, result }

**Endpoints internos** (categorizados por domínio):
- Auth: login, logout, refresh
- Org: listar, trocar org, settings
- Agents: listar, criar, editar, ativar/inativar
- Knowledge: listar sources, upload, processar, deletar
- Inbox: listar chats, assumir, devolver, enviar
- Channels: listar, conectar, desconectar, settings
- Reports: agregados (volume, fila, duração)
- Audit: ações sensíveis por org
- Capabilities: registrar por org/canal

**Adaptador GPT Maker:**
- Mapeia operações OpenAPI
- Normaliza erros
- Fixtures reais sanitizadas
- Homologação de capabilities

**Recomendação:** A05 responsável; skill `claude-api` para entender limites/modelos.

---

### 🛣️ 07-ROADMAP-E-BACKLOG.md
**Propósito:** Fases (M0-M6), gates (G0-G5), backlog (BK-001 a BK-045)

**Fases:**

| Fase | Duração | Objetivo | Gate | Owner |
|---|---|---|---|---|
| **M0** | 7d | Bootstrap monorepo, contratos, CI | G0 | A00, A10, A04, A06, A08 |
| **M1** | 10d | Auth, tenancy, shell, tenant guards | G1 | A03, A04, A06, A08, A09 |
| **M2** | 14d | Agentes, labs, conhecimento TEXT/DOCUMENT | G2 | A05, A04, A07, A03, A02, A08 |
| **M3** | 18d | Canais, inbox, handoff, envio | G3 | A05, A07, A04, A03, A08, A09 |
| **M4** | 10d | Relatórios, operação, dashboard | G4 | A04, A01, A08 |
| **M5** | 14d | QA completa, segurança, piloto | G5 | A08, A09, A00 |
| **M6** | 21d | P1 automações, integrações, expansão | — | Equipe expandida |

**Gates:**

| Gate | Condição |
|---|---|
| **G0** | Stack aprovada, repo autorizado, agentes definem ownership |
| **G1** | Login + organização + tenant guards + QA-001/002/003 ✓ |
| **G2** | Agentes/conhecimento integrado, labs funciona com mock |
| **G3** | Canal piloto recebe mensagem real, webhook testado |
| **G4** | Inbox/handoff/envio operacional, dashboard mostra métricas |
| **G5** | QA completa, backup/restore exercitado, suporte definido |

**Recomendação:** Backlog BK-001 a BK-045 desdobrado em issues por agente em Phase 2.

---

### 📦 08-REPOSITORIO-E-CODIGO.md
**Propósito:** Estrutura repo, padrões, CI, release

**Estrutura:**
```
monorepo/
├── apps/web              (Next.js, BFF, UI)
├── apps/worker           (Node, pg-boss jobs)
├── packages/
│   ├── contracts         (tipos compartilhados)
│   ├── domain            (lógica de negócio)
│   ├── data              (Drizzle schema, migrations)
│   └── ui                (componentes, design tokens)
├── db/
│   └── migrations        (Drizzle)
├── .github/workflows     (CI/CD)
└── docs/                 (documentação)
```

**Padrões de código:**
- ESLint + Prettier obrigatórios
- Teste pyramid (unit > integration > e2e)
- Vitest + Playwright para testes
- TypeScript strict mode
- Zod para validação server-side

**CI/CD:**
- Lint/format check no commit
- Testes na PR
- Build typecheck
- Deploy staging automático
- Deploy prod manual com approval

**Recomendação:** A10 responsável; skill `superpowers:writing-plans` para documentar fluxo CI.

---

### 🛡️ 09-QUALIDADE-SEGURANCA-OPERACAO.md
**Propósito:** QA (QA-001 a QA-021), segurança, runbooks

**Testes QA:**

| ID | Teste | Prioridade |
|---|---|---|
| QA-001 | Dois tenants, zero vazamento de dados | BLOQUEADOR |
| QA-002 | Tenant guard em queries, FKs, cache | BLOQUEADOR |
| QA-003 | Revogação de membro bloqueia próxima ação | BLOQUEADOR |
| QA-004 | Onboarding retomável com estado persistido | P0 |
| QA-005 | Troca de organização limpa cache | P0 |
| QA-006 | Inbox deduplicado, ordenado por regra | P0 |
| QA-007 | Envio com OUTCOME_UNKNOWN, sem retry cego | P0 |
| QA-008 | Reconciliação de OUTCOME_UNKNOWN confirma/resolve | P0 |
| QA-009 | Audit logs sem segredo ou transcrição integral | P0 |
| QA-010 | Webhook validado antes de mudar estado | P0 |
| QA-011 | Capabilities só liberam UI se homologado | P0 |
| QA-012 | Knowledge source não duplica por timeout/duplo clique | P0 |
| QA-013 | Training state coeso (PROCESSING → READY ou FAILED) | P0 |
| QA-014 | Fila com atribuição exclusiva (duplo clique → conflito) | P0 |
| QA-015 | Duplo clique não cria duas operações visuais | P0 |
| QA-016 | Mobile consegue executar atendimento P0 | P0 |
| QA-017 | Acessibilidade: teclado + leitura de tela | P0 |
| QA-018 | Backup/restore valida dados e auditoria | P0 |
| QA-019 | Observabilidade por org, sem conteúdo excessivo | P0 |
| QA-020 | Assinatura com `organization_id` sempre | P0 |
| QA-021 | Métricas agregadas por fuso, período claro | P0 |

**Segurança principal:**
- Zero segredo em cliente (server-only modules)
- Redigir logs (sem transcrição, token GPT Maker)
- Tenant guards em banco, cache, storage
- Auditoria com correlação
- Vault para creds GPT Maker

**Recomendação:** A08 + A09 responsáveis; skill `security-review` obrigatório.

---

### 📍 10-CODEX-START.md
**Propósito:** Prompt para iniciar implementação com agentes

Não consolidado aqui (é prompt para Phase de execução). Ver arquivo original.

---

### 📊 11-DECISOES-PENDENCIAS-E-RASTREABILIDADE.md
**Propósito:** Tabelas síntese, riscos, rastreabilidade

**Consolidado em `decisions/BLOCKERS.md`** (ver abaixo).

---

## Referências Críticas

### 📋 API-MATRIX.md
**72 operações GPT Maker** agrupadas por categoria:

- **Agentes:** List, Get, Create, Update, Delete, Activate, Deactivate
- **Training:** Create, Get, List, Status, Cancel
- **Channels:** List, Get, Create, Update, Connect, Disconnect
- **Messages:** Send, Get, List, Edit, Delete, Mark
- **Chats:** Get, List, Update, Assign, Transfer
- **Webhooks:** Register, Validate, Retry

**Cada operação** tem entradas esperadas, saídas, latência estimada, rate limits, possíveis erros.

**Recomendação:** A05 mapeia cada operação para FR/UI correspondente.

### 📈 ANALYSIS.md
**Análise estratégica** do que é viável reconstruir no painel próprio vs. manter acoplado a GPT Maker.

### 🏛️ ARCHITECTURE-REVIEW.md
**Revisão crítica** de arquitetura com trade-offs e justificativas.

---

## Cross-Referência: FR ↔ Agente ↔ UI ↔ QA

Cada requisito funcional (FR) tem rastro bidirecional:

- **FR-001** (login) → A03/A04 (implementação) → UI-01 (tela) → QA-001/002/003 (testes)
- **FR-004** (onboarding) → A00/A01 (coordenação) → UI-02 (tela) → QA-004 (teste)
- **FR-006** (listar agentes) → A05/A04 (implementação) → UI-07 (tela) → QA-011 (teste)
- **FR-010** (conhecimento TEXT) → A07/A04 (implementação) → UI-11 (tela) → QA-012 (teste)
- **FR-018** (envio textual) → A04/A07 (implementação) → UI-05 (tela) → QA-007/008 (teste)

**Matriz completa em `specs/RASTREABILIDADE.md`** (será criado em Phase 1 Step 6).

---

## Próximas Ações

### Phase 1 (Revisar & Consolidar):
1. ✅ CODEX.md (este arquivo)
2. ⬜ MATRIX.md — 11 agentes com gates/aceite
3. ⬜ ADRs.md — decisões DEC-001 a DEC-010
4. ⬜ BLOCKERS.md — PEND/GM com impacto

### Phase 2 (Orquestração):
- Desdobrar M0-M6 em tarefas sequenciais
- Catalogar 20+ skills necessários
- Criar templates (issue, PR, agent brief)

### Phase 3 (Readiness Check):
- Validar stack vs alternativas
- GO/NO-GO checklist (30+ itens)
- Confirmar G0 gate antes de kickoff M0

---

## Dúvidas ou Conflitos?

Documentados em ADRs e BLOCKERS quando concluídos. Perguntas em aberto → abrir issue com tag `decision-pending`.

---

**Última atualização:** 2026-10-11 · **Owner:** A00 (Coordenador) · **Status:** Consolidação Phase 1
