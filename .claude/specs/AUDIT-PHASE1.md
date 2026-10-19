# AUDIT: Revisão Crítica & Otimizações de Phase 1

**Versão 1.0** · 2026-10-11 · Status: Auditoria Pós-Consolidação · Owner: A00 (Coordenador)

Revisão crítica dos 4 documentos consolidados (CODEX, MATRIX, ADRs, BLOCKERS) + otimizações propostas + skills necessários + estrutura de repositório.

---

## I. Revisão Crítica dos 4 Documentos

### CODEX.md — Índice Consolidado

**Pontos fortes:**
- ✅ Ordem de leitura clara (11 specs em sequência lógica)
- ✅ Resumos concisos de cada spec
- ✅ Consolidação de DEC/PEND/GM em seção
- ✅ Cross-referência bidirecionais (FR ↔ agente ↔ UI ↔ QA)

**Gaps identificados:**
- ❌ **Falta:** Esquema de banco completo (tabelas principais não listadas)
- ❌ **Falta:** Matriz de capabilities (DOCUMENT, WEBSITE, VIDEO, HTTP) com status de homologação
- ❌ **Falta:** Mapa de endpoints (quantos? categorizados como?)
- ❌ **Falta:** Estrutura de diretórios esperada no repo (apps/, packages/, db/)
- ❌ **Falta:** Timeline de referência (quando cada spec foi escrita? versão?)

**Otimizações propostas:**
1. Adicionar seção "Schema Snapshot" — tabelas principais com relacionamentos
2. Adicionar seção "Endpoints Inventory" — 72 operações GPT Maker + 20+ internos
3. Adicionar seção "Estructura Esperada do Repo" — tree com apps/, packages/, db/
4. Adicionar "Changelog de Specs" — quando foram atualizadas, por quê

---

### MATRIX.md — Matriz de Agentes

**Pontos fortes:**
- ✅ 11 agentes bem diferenciados
- ✅ Dependências claras (quem bloqueia quem)
- ✅ Gates de saída explícitos
- ✅ QAs associados a cada agente

**Gaps identificados:**
- ❌ **Falta:** Skills específicas por agente (listadas genericamente)
- ❌ **Falta:** Duração estimada é vaga ("3-4 dias (M0)")
- ❌ **Falta:** Ownership de briefing (quem escreve agent-brief para A01-A10?)
- ❌ **Falta:** Escalabilidade — e se precisar 2 A03s paralelos? Como coordenar?
- ❌ **Falta:** Conflito de boas intents — A00 + A01 podem decidir diferente sobre scope
- ❌ **Falta:** Risco de A06 ser gargalo (schema bloqueia A03/A04/A07)

**Otimizações propostas:**
1. Adicionar coluna "Skills Obrigatórios" (ex: A04 → code-review + security-review)
2. Adicionar duração em horas (ex: "12-16h" vs "3-4 dias")
3. Detalhar brief: quem escreve (A00), checklist de acceptance (AGENT-BRIEF.md template)
4. Adicionar strategy de paralelismo: "Se A06 atrasa, A03/A04 usam schema mock até confirmação"
5. Adicionar weekly sync points: "A00 + A03 + A04 + A06 sync 3x/semana em M0"
6. Detalhar risco de A06: "Schema é bloqueador — prioridade #1"

---

### ADRs.md — Decisões Arquiteturais

**Pontos fortes:**
- ✅ 10 decisões bem documentadas
- ✅ Alternativas rejeitadas com justificativa
- ✅ Trade-offs explícitos
- ✅ Conexão para specs (ex: DEC-002 → 04-ARQUITETURA)

**Gaps identificados:**
- ❌ **Falta:** Reversibilidade — qual decisão é reversível após M0?
- ❌ **Falta:** Custo de mudança — se trocar de Next.js para Remix em M3, quanto custa?
- ❌ **Falta:** Risk assessment — qual ADR tem maior risco de "arrependimento"?
- ❌ **Falta:** Validação — como testamos que decisão foi correta? (ex: DEC-001 → "build time <5min")
- ❌ **Falta:** Trigger para revisão — em que condições reabrimos ADR-001?

**Otimizações propostas:**
1. Adicionar coluna "Reversibilidade" — quantos dias para trocar?
2. Adicionar coluna "Risco de Arrependimento" — High/Medium/Low
3. Adicionar "Validação em M0" — teste específico que prova decisão foi correta
4. Adicionar "Trigger de Revisão" — condição que reabre ADR (ex: "Se build >10min")
5. Adicionar "Milestone de Consolidação" — quando decisão fica irreversível?

---

### BLOCKERS.md — Pendências & Homologações

**Pontos fortes:**
- ✅ 20 itens claramente categorizados (PEND + GM)
- ✅ Impacto por fase explicado
- ✅ Plano B para cada bloqueador
- ✅ Timeline recomendada

**Gaps identificados:**
- ❌ **Falta:** Owner claro para cada PEND (quem no time do usuário?)
- ❌ **Falta:** SLA esperado para resolução (ex: "GM-002 deve responder em 3 dias úteis")
- ❌ **Falta:** Escalation path — se PEND-004 atrasa 1 mês, o que fazemos?
- ❌ **Falta:** Dependências cruzadas — ex: PEND-004 depende de PEND-010 (ownership)
- ❌ **Falta:** Mock strategy — como testamos M2 sem PEND-004?

**Otimizações propostas:**
1. Adicionar "Owner" — quem do lado do usuário é responsável
2. Adicionar "SLA" — "Resolve em X dias ou escalado para Y"
3. Adicionar seção "Plano de Contingência" — se PEND-004 atrasa, ativa este plano
4. Mapear dependências cruzadas: PEND-010 → PEND-004 (ownership precisa estar claro)
5. Detalhar mock strategy: "Sem PEND-004, usar stubs typados; M2 roda com mock 100%"
6. Adicionar "Go/No-Go Criteria" — em que ponto bloqueador vira "não mais problema"

---

## II. Otimizações Estruturais Propostas

### A. Consolidação de Memória (.claude/.codex)

**Estado atual:**
- ✅ CODEX.md, MATRIX.md, ADRs.md, BLOCKERS.md criados
- ❌ Falta: MEMORY.md atualizado com dashboard-context
- ❌ Falta: Skills catalog consolidado
- ❌ Falta: Rastreabilidade FR↔agente↔UI↔QA

**Otimizações:**
1. **MEMORY.md** — Adicionar entradas para:
   - Dashboard Context (versão, decisões, stack, fases)
   - Agent Briefs (resumo 1-linha de cada A00-A10)
   - Risk Registry (top 10 riscos + mitigação)

2. **Skills Catalog** — Centralizar em `skills/CATALOG.md`:
   - 30+ skills mapeados por categoria (design, eng, qa, devops, security)
   - Quando usar cada skill
   - Trigger pattern para cada skill
   - Skill obrigatório vs. opcional por agente

3. **Rastreabilidade** — `specs/RASTREABILIDADE.md`:
   - Matriz: FR-001 → A04 → UI-05 → QA-007/008
   - Cada FR mapeado para agente responsável
   - Cada agente mapeado para UI necessária
   - Cada UI mapeada para QA que valida

---

### B. Estrutura de Repositório Otimizada

**Recomendação de estrutura monorepo:**

```
gpt-maker-dashboard/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-prod.yml
│   └── CODEOWNERS
│
├── .claude/
│   ├── specs/
│   │   ├── CODEX.md
│   │   ├── RASTREABILIDADE.md
│   │   └── AUDIT-PHASE1.md
│   ├── agents/
│   │   ├── MATRIX.md
│   │   └── BRIEF-*.md (A00-A10)
│   ├── decisions/
│   │   ├── ADRs.md
│   │   └── BLOCKERS.md
│   ├── skills/
│   │   └── CATALOG.md
│   ├── checklist/
│   │   ├── GO-NO-GO.md
│   │   └── GATES.md
│   └── setup/
│       └── BOOTSTRAP-CHECKLIST.md
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── logout/
│   │   │   │   └── app/
│   │   │   │       └── [orgSlug]/
│   │   │   │           ├── dashboard/
│   │   │   │           ├── agents/
│   │   │   │           ├── knowledge/
│   │   │   │           ├── inbox/
│   │   │   │           ├── channels/
│   │   │   │           ├── reports/
│   │   │   │           ├── contacts/
│   │   │   │           └── settings/
│   │   │   ├── api/app/
│   │   │   │   ├── agents/
│   │   │   │   ├── knowledge/
│   │   │   │   ├── inbox/
│   │   │   │   ├── channels/
│   │   │   │   ├── reports/
│   │   │   │   ├── audit/
│   │   │   │   └── capabilities/
│   │   │   ├── features/
│   │   │   ├── messages/pt-BR/
│   │   │   └── middleware/
│   │   ├── public/
│   │   └── tests/e2e/
│   │
│   └── worker/
│       ├── src/
│       │   ├── jobs/
│       │   │   ├── sync-agents.ts
│       │   │   ├── sync-channels.ts
│       │   │   ├── process-training.ts
│       │   │   ├── send-message.ts
│       │   │   └── reconcile-operations.ts
│       │   ├── webhooks/
│       │   │   ├── training-webhook.ts
│       │   │   ├── message-webhook.ts
│       │   │   └── channel-webhook.ts
│       │   └── main.ts
│       └── tests/
│
├── packages/
│   ├── contracts/
│   │   └── index.ts (tipos compartilhados)
│   ├── domain/
│   │   ├── gptmaker-adapter/
│   │   │   ├── agents.ts
│   │   │   ├── training.ts
│   │   │   ├── channels.ts
│   │   │   ├── messages.ts
│   │   │   └── fixtures/
│   │   ├── auth/
│   │   │   ├── guards.ts
│   │   │   └── permissions.ts
│   │   └── operations/
│   │       ├── outbox.ts
│   │       └── reconciliation.ts
│   ├── data/
│   │   ├── schema.ts (Drizzle)
│   │   └── migrations/
│   └── ui/
│       ├── components/
│       ├── hooks/
│       ├── design-tokens/
│       └── styles/
│
├── db/
│   ├── schema.ts
│   └── migrations/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── RUNBOOKS.md
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
├── eslintrc.json
├── prettier.config.js
├── vitest.config.ts
├── playwright.config.ts
└── README.md
```

**Justificativa:**
- `.claude/` centraliza todas as decisões + roadmap (versionável)
- `apps/` separado por propósito (web BFF + worker async)
- `packages/` compartilha tipos + domínio + UI
- `db/` junto a root para migrações centralizadas
- GitHub workflows em `.github/workflows/`

---

### C. CI/CD & Tooling

**Recomendação:**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm format:check

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test:e2e

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit (bloqueador se risco crítico)
      - run: dependabot check (semanal)
```

---

### D. Padrões de Código & Arquitetura

**Recomendações:**

1. **Isolamento por Organização:**
   ```typescript
   // SEMPRE include organization_id em queries
   const chats = await db.select()
     .from(chatsTable)
     .where(and(
       eq(chatsTable.organizationId, orgId),
       eq(chatsTable.agentId, agentId)
     ))
   ```

2. **Server-Only Modules:**
   ```typescript
   // lib/gptmaker/client.ts
   'use server'
   
   const GPTMAKER_API_KEY = process.env.GPTMAKER_API_KEY!
   export const gptmakerClient = new GPTMakerClient(GPTMAKER_API_KEY)
   ```

3. **Operação/Outbox Pattern:**
   ```typescript
   // Nunca:
   await gptmakerClient.createAgent(...) // ❌ pode falhar, timeout, etc
   
   // Sempre:
   const op = await operations.create({
     type: 'CREATE_AGENT',
     organizationId,
     payload: { name, instructions }
   })
   
   // Worker processa:
   const result = await gptmakerClient.createAgent(op.payload)
   await operations.updateResult(op.id, result, status)
   ```

4. **Validação Zod:**
   ```typescript
   // packages/contracts/index.ts
   export const CreateAgentSchema = z.object({
     name: z.string().min(1).max(100),
     instructions: z.string().min(1).max(5000),
     organizationId: z.string().uuid()
   })
   
   // apps/web/src/app/api/app/agents/route.ts
   export async function POST(req) {
     const body = CreateAgentSchema.parse(await req.json())
     // TypeScript agora sabe que body é tipado
   }
   ```

---

## III. Skills Necessários & Catálogo Completo

### Skills por Fase

**M0 (Bootstrap):**
- `superpowers:writing-plans` — Detalhar M0 em tarefas
- `code-review` — Revisar schema inicial, contratos
- `superpowers:test-driven-development` — Teste de isolamento cross-org

**M1-M2 (Implementação):**
- `design:design-system` — A02 wireframes, tokens
- `code-review` — Todo PR (A03/A04/A05/A06/A07)
- `security-review` — A09 valida tenant guards, segredos
- `superpowers:systematic-debugging` — Debug de integração GPT Maker

**M3-M4 (Integração):**
- `claude-api` — Entender limites de modelos (para observability)
- `superpowers:test-driven-development` — Teste de webhook, retry

**M5 (QA & Piloto):**
- `code-review` — Revisão final antes de G5
- `security-review` — Validação final de compliance

**Contínuo:**
- `sc:analyze` — Análise de código quality
- `sc:document` — Manutenção de specs/docs

### 30+ Skills Catalog

```markdown
# Categoria: Produto
- superpowers:brainstorming
- superpowers:writing-plans
- sc:analyze
- sc:document
- design:ux-copy

# Categoria: Design
- design:design-system
- design:accessibility-review
- ui-ux-pro-max

# Categoria: Engenharia
- code-review
- superpowers:test-driven-development
- superpowers:systematic-debugging
- claude-api
- superpowers:using-git-worktrees

# Categoria: Segurança
- security-review
- security-auditor (built-in)
- superpowers:verification-before-completion

# Categoria: DevOps
- devops-architect (built-in)
- superpowers:requesting-code-review
- land-and-deploy
```

---

## IV. Gaps Críticos & Otimizações Finais

### Gaps Identificados

| Gap | Severidade | Impacto | Solução |
|---|---|---|---|
| Falta RASTREABILIDADE.md | 🟡 Médio | Sem rastreio FR→agente→UI→QA | Criar em Phase 1 Step 6 |
| Falta AGENT-BRIEF.md template | 🔴 Crítico | Agentes não sabem o quê fazer | Criar template em Phase 2 |
| Falta Skill Catalog centralizado | 🟡 Médio | Skills fragmentadas | Criar `skills/CATALOG.md` em Phase 2 |
| Falta Reversibilidade em ADRs | 🟡 Médio | Não sabemos custo de trocar | Adicionar coluna em ADRs |
| Falta escalação de PEND | 🔴 Crítico | Se bloqueador atrasa, sem plano | Adicionar "escalation path" em BLOCKERS |
| Falta coordenação semanal | 🔴 Crítico | Agentes trabalham isolados | Definir sync points em MATRIX |

### Otimizações Finais Recomendadas

1. **Quick Win (hoje):**
   - Adicionar seção "Reversibilidade" em ADRs.md (30 min)
   - Adicionar "SLA + Escalation" em BLOCKERS.md (30 min)
   - Mapear sync points em MATRIX.md (30 min)

2. **Medium Priority (Phase 2):**
   - Criar AGENT-BRIEF.md template (1h)
   - Criar `skills/CATALOG.md` com 30+ skills (2h)
   - Criar RASTREABILIDADE.md (2h)

3. **Strategic (Phase 2-3):**
   - Definir "Contingency Plan" para cada PEND crítica (2h)
   - Criar "Decision Registry" com reversibilidade + custo de mudança (3h)
   - Documentar "Weekly Sync Points" + responsáveis (1h)

---

## V. Métricas de Sucesso para Phase 1

| Métrica | Target | Status |
|---|---|---|
| **Documentos criados** | 4 (CODEX, MATRIX, ADRs, BLOCKERS) | ✅ 4/4 |
| **Agentes definidos** | 11 (A00-A10) com clarity | ✅ 11/11 |
| **Decisões congeladas** | 10 (DEC-001-010) | ✅ 10/10 |
| **Bloqueadores mapeados** | 20 (PEND + GM) | ✅ 20/20 |
| **FRs rastreáveis** | 40 (FR-001-040) mapeados para agente | ⚠️ Parcial (RASTREABILIDADE.md pendente) |
| **QAs definidos** | 21 (QA-001-021) associados a agentes | ⚠️ Parcial (precisa validação) |
| **Gaps identificados** | 6+ (documentados acima) | ✅ Identificados |
| **Próximos passos claros** | Phase 2 escopo definido | ✅ Claro |

---

## VI. Recomendação Final

**Para maximizar valor antes de M0 kickoff:**

1. **Hoje:** Revisar CODEX/MATRIX/ADRs/BLOCKERS com usuário
   - Validar que agentes fazem sentido
   - Validar que bloqueadores são realistas
   - Validar que decisões são aceitáveis

2. **Amanhã:** Phase 2 kickoff
   - Criar AGENT-BRIEF.md para cada A00-A10
   - Desdobrar M0-M6 em tarefas sequenciais
   - Catalogar 30+ skills necessários

3. **G0 Gate (fim de Phase 1-2):** Approval para kickoff
   - Todos os 11 agentes têm brief assinado
   - Roadmap M0-M2 desdobrado em issues
   - Skills mapeados para cada agente

---

**Conclusão:**
Phase 1 consolidou 80% do necessário. Gaps são menores e bem mapeados. **Recomendo executar otimizações Quick Win hoje e avançar para Phase 2 amanhã.**

---

**Última atualização:** 2026-10-11 · **Owner:** A00 · **Status:** Auditoria Pós-Consolidação · **Ação:** Revisar com usuário + Phase 2
