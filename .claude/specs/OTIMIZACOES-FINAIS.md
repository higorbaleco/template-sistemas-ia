# OTIMIZAÇÕES FINAIS: O que Precisamos Para Otimizar o Sistema

**Versão 1.0** · 2026-10-11 · Status: Auditoria Completa + Roadmap de Otimização · Owner: A00

Consolidação de tudo que foi consolidado (specs, PRD, requisitos, agentes) + o que precisa ser otimizado + skills e repositórios necessários.

---

## I. Estado Atual: O Que Temos

### ✅ Consolidado em Phase 1

**5 documentos principais criados:**
1. `specs/CODEX.md` — Índice consolidado das 11 specs
2. `agents/MATRIX.md` — Matriz de 11 agentes (A00-A10)
3. `decisions/ADRs.md` — 10 decisões arquiteturais
4. `decisions/BLOCKERS.md` — 20 pendências (PEND + GM)
5. `specs/AUDIT-PHASE1.md` — Revisão crítica + otimizações

**Estrutura de agentes:**
- ✅ **14 agentes operacionais** em `.claude/agents/` (planner, architect, executor, reviewer, test-runner, security-auditor, etc.)
- ✅ **6 agentes conceituais** para GPT Maker Dashboard:
  - Valdis (Requirements Validator) — Fr/requisitos
  - Arquitetos (Architecture Auditor) — Backend design
  - Vera (Design & UX Optimizer) — UX/design
  - Plano (Roadmap Orchestrator) — Roadmap
  - Orquestra (Agent & Skills Mapper) — Orchestration
  - Guarda (Security & QA Lead) — Security + QA

**15+ documentações em `/docs/`** (arquitetura, operação, qualidade gates, etc.)

**5 memory files** para 3 projetos (Catálogo, Astraeus, Abertura Comercial)

---

## II. O Que Falta Otimizar

### A. Consolidação de Memória (Crítico)

**Gaps:**
- ❌ MEMORY.md não mapeia dashboard-context
- ❌ Sem catalog de skills centralizado (.claude/skills/)
- ❌ Sem rastreabilidade bidirecionais (FR ↔ agente ↔ UI ↔ QA)
- ❌ Sem agent briefs formais (AGENT-BRIEF.md para A00-A10)

**Otimização proposta:**

```
.claude/
├── specs/
│   ├── CODEX.md ........................... ✅ Criado
│   ├── RASTREABILIDADE.md ................ ⬜ Criar (FR→agente→UI→QA matrix)
│   ├── SCHEMA-SNAPSHOT.md ................ ⬜ Criar (tabelas, schema visual)
│   └── AUDIT-PHASE1.md ................... ✅ Criado
│
├── agents/
│   ├── MATRIX.md .......................... ✅ Criado
│   ├── BRIEF-A00.md ...................... ⬜ Criar (Coordenador)
│   ├── BRIEF-A01.md ...................... ⬜ Criar (Produto)
│   ├── BRIEF-A02.md ...................... ⬜ Criar (UX/Design)
│   ├── BRIEF-A03.md ...................... ⬜ Criar (Frontend)
│   ├── BRIEF-A04.md ...................... ⬜ Criar (Backend)
│   ├── BRIEF-A05.md ...................... ⬜ Criar (GPT Maker Adapter)
│   ├── BRIEF-A06.md ...................... ⬜ Criar (Dados/Auth)
│   ├── BRIEF-A07.md ...................... ⬜ Criar (Worker)
│   ├── BRIEF-A08.md ...................... ⬜ Criar (QA)
│   ├── BRIEF-A09.md ...................... ⬜ Criar (Segurança)
│   └── BRIEF-A10.md ...................... ⬜ Criar (DevOps)
│
├── decisions/
│   ├── ADRs.md ............................ ✅ Criado
│   ├── BLOCKERS.md ........................ ✅ Criado
│   └── CONTINGENCIES.md .................. ⬜ Criar (plano B para PEND críticas)
│
├── skills/
│   └── CATALOG.md ......................... ⬜ Criar (30+ skills catalogados)
│
├── checklist/
│   ├── GO-NO-GO.md ........................ ⬜ Criar (G0 criteria)
│   ├── GATES.md ........................... ⬜ Criar (G0-G5 gates)
│   └── DEPENDENCIES.md ................... ⬜ Criar (matriz de dependências)
│
├── roadmap/
│   ├── M0-M6.md ........................... ⬜ Criar (marcos desdobrados)
│   ├── CRITICAL-PATH.md .................. ⬜ Criar (caminho crítico M0-M2)
│   └── WEEKLY-SPRINTS.md ................. ⬜ Criar (milestones semanais)
│
├── templates/
│   ├── ISSUE-TEMPLATE.md ................. ⬜ Criar
│   ├── PR-TEMPLATE.md .................... ⬜ Criar
│   └── AGENT-BRIEF-TEMPLATE.md ........... ⬜ Criar
│
└── memory/
    └── DASHBOARD-CONTEXT.md .............. ⬜ Criar (atualizar MEMORY.md)
```

**Tamanho da consolidação:**
- ✅ **Criado:** 5 documentos (~20KB)
- ⬜ **Falta:** 20 documentos (~30KB)
- **Total esperado:** ~50KB de documentação em `.claude/`

---

### B. Estrutura de Repositório (Crítico)

**Não temos:**
- ❌ Repositório no GitHub (PEND-002)
- ❌ Estrutura de monorepo definida no código
- ❌ Pipeline CI/CD configurado
- ❌ Padrões de código documentados

**Otimização proposta:**

**Criar `docs/REPO-STRUCTURE.md`:**
```
gpt-maker-dashboard/
├── .github/workflows/ (CI/CD)
├── .claude/ (tudo que consolidamos)
├── apps/
│   ├── web/ (Next.js BFF + UI)
│   └── worker/ (Node jobs)
├── packages/
│   ├── contracts/ (tipos)
│   ├── domain/ (lógica)
│   ├── data/ (Drizzle)
│   └── ui/ (componentes)
├── db/ (Drizzle migrations)
└── docs/ (arquitetura + runbooks)
```

**Criar `.claude/setup/REPO-BOOTSTRAP.md`:**
```bash
# Sequência para criar repo
1. mkdir gpt-maker-dashboard && cd $_
2. git init
3. pnpm init -w (monorepo)
4. mkdir -p apps/{web,worker} packages/{contracts,domain,data,ui} db/migrations docs
5. pnpm install
6. pnpm add -w -D typescript vitest playwright eslint prettier
```

---

### C. Documentação de Padrões (Médio)

**Não temos:**
- ❌ Padrão de isolamento por organização explicado
- ❌ Padrão de operação/outbox explicado
- ❌ Padrão de validação Zod explicado
- ❌ Padrão de error handling explicado
- ❌ Guia de escrita de testes

**Otimização proposta:**

Criar em `docs/PATTERNS.md`:
```markdown
## Isolamento por Organização
## Operação/Outbox para Mutações Assíncronas
## Validação com Zod
## Error Handling & Logging
## Teste Pyramid (unit/integration/e2e)
```

---

## III. Skills Necessários Para Otimizar

### Por Prioridade

**🔴 CRÍTICOS (sem estes, M0 não kicka):**

1. **`superpowers:writing-plans`** — Desdobrar M0-M6 em tarefas sequenciais
   - Entrada: MATRIX.md + BLOCKERS.md
   - Saída: M0-M6.md com issues, donos, dependências
   - Duração: 1-2 dias (Phase 2)

2. **`code-review`** — Revisar CODEX/MATRIX/ADRs antes de G0
   - Entrada: 4 documentos criados
   - Saída: Feedback + approval
   - Duração: 4 horas

3. **`design:design-system`** — A02 precisa para wireframes P0
   - Duração: Contínuo em M0-M1

4. **`security-review`** — A09 valida tenant guards
   - Duração: Contínuo em M1-M6

**🟡 IMPORTANTES (Phase 2):**

5. **`sc:analyze`** — Qualidade de specs/docs
6. **`sc:document`** — Manutenção de CODEX/MATRIX
7. **`superpowers:test-driven-development`** — A08 testes cross-org
8. **`superpowers:systematic-debugging`** — Integração GPT Maker
9. **`claude-api`** — Entender limites de modelos

**🟢 OPCIONAIS (Phase 3+):**

10. **`ui-ux-pro-max`** — Design premium (se quer ultra-high-end)
11. **`devops-architect`** — A10 CI/CD avançado
12. **`superpowers:requesting-code-review`** — Review workflow formal

---

## IV. Repositórios Necessários

### GitHub Org & Repos

**PEND-002 resolução:**
```
Organização GitHub: [seu-nome-org] (ex: avraham-io)
Repositórios:
├── gpt-maker-dashboard (principal)
│   ├── .claude/ (todo projeto fica aqui versionado)
│   ├── apps/ (Next.js + worker)
│   ├── packages/ (tipos + domínio)
│   └── db/ (Drizzle)
│
└── [opcional] gpt-maker-dashboard-docs (wiki separada)
```

**CODEOWNERS recomendado:**
```
# .github/CODEOWNERS
* @your-username
/db/ @A06-owner-name
/apps/web/src/app/api/ @A04-owner-name
/apps/web/src/app/*/[orgSlug]/ @A03-owner-name
/apps/worker/ @A07-owner-name
/.claude/ @A00-owner-name
```

---

## V. Roadmap de Otimização (Next 10 Days)

### Hoje (10-11)
- ✅ Phase 1 consolidação (CODEX, MATRIX, ADRs, BLOCKERS)
- ✅ AUDIT-PHASE1.md criado
- ⬜ **Revisar com usuário** (1h)

### Amanhã (10-12)
**Phase 2 Kickoff: Orquestração**

- [ ] Criar AGENT-BRIEF.md para A00-A10 (10h, paralelo)
  - Template: objective, entradas, saídas, fase, gate, QAs, skills, critério de aceite
  
- [ ] Invocar `superpowers:writing-plans` para desdobrar M0-M6 (2h)
  - Saída: M0-M6.md com ~60 issues detalhadas
  
- [ ] Criar `skills/CATALOG.md` com 30+ skills (3h)
  - Catalogação: categoria, quando usar, trigger, obrigatório?

- [ ] Criar `RASTREABILIDADE.md` (2h)
  - Matriz: 40 FRs → agentes → UIs → QAs

### 10-13 a 10-15 (Dia 3-5)
**Phase 2 Detalhamento:**

- [ ] Criar M0-M2 em detail com sprint weekly (4h)
  - Cada sprint é 1 semana com ~10-15 issues

- [ ] Criar CONTINGENCIES.md (2h)
  - Para cada PEND crítica: "Se atrasa, ativa plano B"

- [ ] Criar GO-NO-GO.md com 30+ critérios (2h)
  - G0, G1, G2, etc com checklist automática

- [ ] Criar SCHEMA-SNAPSHOT.md (1h)
  - Visual do banco esperado

- [ ] Atualizar MEMORY.md com dashboard-context (1h)

### 10-16 a 10-18 (Dia 6-8)
**Phase 3: Readiness Check**

- [ ] Executar GO-NO-GO checklist (2h)
  - Validar: stack, repo, agentes, security, bootstrap
  
- [ ] Criar DEPENDENCIES.md matrix (1h)
  - Quem bloqueia quem? Quando sincronizar?

- [ ] Validar que **zero FR é órfã** (1h)
  - Cada FR-001 a 040 tem agente responsável

- [ ] **G0 GATE APPROVAL** (30 min)
  - A00 + usuário confirmam readiness

### 10-19 (Dia 9)
**M0 Kickoff**
- A00 distribui issues BK-001 a BK-045
- 11 agentes começam em paralelo máximo

---

## VI. Métricas de Sucesso (Otimização Completa)

| Métrica | Target | Atual | Falta |
|---|---|---|---|
| Documentação em `.claude/` | 25+ docs | 5 | 20 |
| Agentes com brief formal | 11 | 0 | 11 |
| Rastreabilidade completa | 40 FRs mapped | 0 | 40 |
| Skills catalogados | 30+ | 0 | 30 |
| Phase 2 desdobrada | M0-M6 com 60 issues | 0 | 60 |
| Contingencies definidas | 20 PENDs com plano B | 0 | 20 |
| Repository estruturado | Monorepo pronto | 0 | 1 repo |
| CI/CD template | .github/workflows/ | 0 | 3 workflows |
| Padrões documentados | `docs/PATTERNS.md` | 0 | 1 doc |
| Memory consolidada | DASHBOARD-CONTEXT.md | 0 | 1 doc |

---

## VII. Resposta Final: O Que Otimizar?

**Prioridade 1 (Bloqueadores para M0):**
1. Criar AGENT-BRIEF.md para A00-A10
2. Desdobrar M0-M6 em issues (60+ tarefas)
3. Validar GO-NO-GO criteria (30+ itens)
4. Resolver PEND-002 (repo GitHub)
5. Resolver PEND-010 (ownership)

**Prioridade 2 (Antes de G0 gate):**
6. Criar `skills/CATALOG.md` (30+ skills)
7. Criar RASTREABILIDADE.md (FR↔agente↔UI↔QA)
8. Criar CONTINGENCIES.md (plano B para PEND)
9. Criar M0-M2 sprints semanais
10. Atualizar MEMORY.md

**Prioridade 3 (Antes de M1):**
11. Criar `docs/PATTERNS.md` (padrões de código)
12. Criar `docs/REPO-STRUCTURE.md` (estrutura monorepo)
13. Criar SCHEMA-SNAPSHOT.md
14. Criar DEPENDENCIES.md matrix
15. Setup repositório GitHub + CI template

---

## VIII. Recomendação Final

**Você tem:**
- ✅ Specs completas (11 docs)
- ✅ 14 agentes operacionais
- ✅ 4 documentos consolidados (CODEX, MATRIX, ADRs, BLOCKERS)
- ✅ Roadmap claro (M0-M6)

**Para otimizar antes de M0:**
1. **Criar 20 docs em `.claude/`** (briefs, roadmap, skills catalog, etc.)
2. **Desdobrar roadmap em 60+ issues**
3. **Validar readiness com GO-NO-GO**
4. **Resolver PEND-002 + PEND-010** (repo + ownership)

**Timeline:** 7-8 dias até G0 gate aprovado.

**Skills necessários:** `superpowers:writing-plans` (crítico) + `code-review` + `design:design-system` + `security-review`

---

**Próximo passo:** Quer que eu comece com AGENT-BRIEF.md para A00-A10 agora?

---

**Última atualização:** 2026-10-11 · **Owner:** A00 · **Status:** Auditoria + Recomendação Final
