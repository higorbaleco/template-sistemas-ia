# MATRIX: Matriz de Agentes (A00-A10)

**Versão 1.0** · 2026-10-11 · Status: Consolidação Phase 1 · Owner: A00 (Coordenador)

Matriz executável de 11 agentes com responsabilidades, dependências, gates de saída e critérios de aceite. Este documento define quem faz o quê, quem bloqueia quem, quando cada agente pode começar, e quando terminou com sucesso.

---

## Legenda

- **ID:** A00-A10 (agentes)
- **Responsabilidade:** O agente é dono deste aspecto
- **Arquivos-alvo:** Módulos/diretórios que este agente é responsável
- **Entrada crítica:** O que o agente precisa ter antes de começar
- **Saída esperada:** Entregável(ies) do agente
- **Bloqueia:** Quais agentes dependem de conclusão deste
- **Bloqueado por:** Quais agentes precisam terminar antes deste começar
- **Fase:** Qual(ais) marco(s) (M0-M6) este agente trabalha
- **Gate:** G0-G5 - critérios de saída para aprovação
- **QAs:** Testes que validam trabalho do agente

---

## Matriz de 11 Agentes

### A00 — Coordenador Técnico & Produto

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Manter coerência da entrega, priorização, roadmap, ADRs, gates, integração de PRs |
| **Arquivos-alvo** | `.claude/`, `/docs/`, backlog, ADRs, CODEX.md, plano de roadmap |
| **Entrada crítica** | 11 specs completas, decisões comerciais, aprovação de stack |
| **Saída esperada** | Backlog BK-001 a BK-045, roadmap M0-M6, issues priorizadas, ADRs DEC-001-010, gate checklist G0-G5 |
| **Bloqueia** | **TODOS** (A01-A10) — nada pode começar sem A00 distribuir escopo |
| **Bloqueado por** | Nenhum (inicia assim que specs aprovadas) |
| **Fase** | M0-M6 (todas as fases) |
| **Gate de saída (G0)** | ✓ Stack aprovada ✓ Repo autorizado ✓ Agentes leem briefs ✓ Backlog priorizado |
| **QAs** | QA-001 (zero FR órfã), QA-009 (audit logs), QA-010 (webhook validation) |
| **Skills** | `sc:document`, `superpowers:writing-plans`, `code-review`, `design:ux-copy` (opcional) |
| **Duração estimada** | Contínuo (coordenação) |
| **Critério de aceite** | Nenhum requisito P0 sem owner; roadmap reflete estado real, não desejo; gates validados |

---

### A01 — Agente de Produto & Requisitos

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Transformar objetivos em requisitos, cenários de aceite, prioridades, matriz papel/ação |
| **Arquivos-alvo** | `docs/product/*`, issues funcionais, textos de aceite, matriz FR-001 a FR-040 |
| **Entrada crítica** | 02-REQUISITOS.md lido; aprovação de escopo P0/P1/P2 |
| **Saída esperada** | Issues detalhadas (FR-001 a FR-040) com cenários Dado/Quando/Então, matriz papel/ação atualizada |
| **Bloqueia** | A02 (wireframes), A03 (rotas), A04 (endpoints) — todos precisam de FRs claros |
| **Bloqueado por** | A00 (escopo aprovado) |
| **Fase** | M0 (requisitos), M1-M6 (refinamento) |
| **Gate de saída** | ✓ Cada issue P0 cita FR e UI ✓ Permissões papel testáveis ✓ Fora de escopo continua fora |
| **QAs** | QA-001 (organizações/papéis), QA-003 (revogação), QA-004 (onboarding retomável) |
| **Skills** | `sc:brainstorm`, `design:ux-copy`, `superpowers:test-driven-development` |
| **Duração estimada** | 3-4 dias (M0) + manutenção contínua |
| **Critério de aceite** | Zero ambiguidade em FR; cada comportamento testável com papel específico |

---

### A02 — Agente UX, Design System & Conteúdo

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Wireframes, telas, componentes, estados, tokens, microcopy, acessibilidade |
| **Arquivos-alvo** | `apps/web/src/app/app/[orgSlug]/*`, `packages/ui/*`, `apps/web/src/messages/pt-BR/*`, Figma/design files |
| **Entrada crítica** | 03-TELAS-E-DESIGN.md, FRs de A01 (UI-001 a UI-022 mapeados) |
| **Saída esperada** | Wireframes desktop/mobile, design tokens pt-BR, componentes com states (loading, error, empty, conflict) |
| **Bloqueia** | A03 (implementação frontend usa wireframes) |
| **Bloqueado por** | A00 (brief), A01 (FRs claros) |
| **Fase** | M0-M1 (wireframes), M2-M6 (refinamento) |
| **Gate de saída** | ✓ UI P0 sem dados falsos ✓ Acessibilidade WCAG AA ✓ Mobile funciona ✓ Português não quebra layout |
| **QAs** | QA-016 (mobile executável), QA-017 (acessibilidade: teclado, contraste, leitor) |
| **Skills** | `design:design-system`, `design:accessibility-review`, `design:ux-copy` |
| **Duração estimada** | 4-5 dias (M0-M1) |
| **Critério de aceite** | Componentes definidos com estados; WCAG AA validado em ferramenta + manual |

---

### A03 — Agente Frontend Web

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Implementar rotas, componentes, formulários, tabelas, query keys, polling, estados assíncronos |
| **Arquivos-alvo** | `apps/web/src/app/(auth)/*`, `apps/web/src/app/app/[orgSlug]/*`, `packages/ui/*`, `packages/contracts/*` |
| **Entrada crítica** | Wireframes de A02, contratos de A04, Drizzle schema de A06 |
| **Saída esperada** | Rotas funcionais, componentes com assinatura de dados, Playwright tests das jornadas |
| **Bloqueia** | A09 (security review), A08 (testes E2E) |
| **Bloqueado por** | A00 (brief), A02 (wireframes), A04 (contratos/endpoints) |
| **Fase** | M0 (setup), M1-M4 (implementação paralela com A04) |
| **Gate de saída** | ✓ Build/typecheck passam ✓ Troca de org limpa cache ✓ Sem segredo no bundle |
| **QAs** | QA-005 (troca org limpa cache), QA-015 (duplo clique → conflito), QA-016 (mobile), QA-017 (acessibilidade) |
| **Skills** | Next.js, Tailwind, shadcn/ui, Playwright, React Query, Zod |
| **Duração estimada** | Paralelo com A04 (11-14 dias por marco) |
| **Critério de aceite** | Zero props não mapeados; tipos compartilhados com A04; todas as rotas tipadas |

---

### A04 — Agente Backend, BFF & Domínio

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Route handlers, services, guards, schemas, operações, auditoria, validação |
| **Arquivos-alvo** | `apps/web/src/app/api/app/*`, `packages/domain/*`, `packages/contracts/*`, `packages/data/*` |
| **Entrada crítica** | Contratos de 05-CONTRATOS, FRs de A01, schema de A06 |
| **Saída esperada** | Endpoints REST tipados, guards de organização, operações assíncronas via outbox, testes negativos |
| **Bloqueia** | A03 (frontend precisa endpoints), A05 (adapter precisa de endpoints), A07 (worker precisa de contracts) |
| **Bloqueado por** | A00 (brief), A01 (FRs), A06 (schema, guards) |
| **Fase** | M0 (setup), M1-M4 (implementação paralela com A03) |
| **Gate de saída** | ✓ Cada endpoint tem teste negativo cross-org ✓ Sem mutação síncrona com GPT Maker ✓ OUTCOME_UNKNOWN tratado |
| **QAs** | QA-001/002/003 (tenant guards), QA-007/008 (OUTCOME_UNKNOWN), QA-009 (audit), QA-020 (assinatura org) |
| **Skills** | API design, authorization, middleware, Drizzle queries, error mapping, observability |
| **Duração estimada** | Paralelo com A03 (11-14 dias por marco) |
| **Critério de aceite** | Zero query sem `organization_id`; testes negativos cobrem todas as permissões; logs redigidos |

---

### A05 — Agente de Integração GPT Maker

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Adaptador OpenAPI, mapeamento operações, normalização erros, homologação capabilities |
| **Arquivos-alvo** | `packages/domain/gptmaker-adapter/*`, fixtures reais sanitizadas, teste de capabilities |
| **Entrada crítica** | API-MATRIX.md (72 operações), creds GPT Maker staging, FR-006 a FR-020 (operações necessárias) |
| **Saída esperada** | Cliente HTTP tipado, mapeamento de operações, testes com fixtures, capabilities por org/canal |
| **Bloqueia** | A04 (endpoints chamam adapter), A07 (worker chama adapter), A02 labs (testar com adapter real) |
| **Bloqueado por** | A00 (brief), A04 (contratos upstream), PEND-004 (creds GPT Maker) |
| **Fase** | M0 (stub), M2 (integração real com mock), M3 (credenciais reais) |
| **Gate de saída** | ✓ Operações críticas testadas em staging ✓ Capabilities documentadas por org ✓ Erros normalizados |
| **QAs** | QA-011 (capabilities by org), QA-012/013 (training states) |
| **Skills** | OpenAPI, HTTP client design, error mapping, fixture management, API testing |
| **Duração estimada** | 3-4 dias (M0-M2) |
| **Critério de aceite** | Todos os 72 endpoints mapeados ou rejeitados com razão; sem credenciais em código |

---

### A06 — Agente de Dados & Auth

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Schema Drizzle, migrations, constraints, guards, RLS, autorização por organização |
| **Arquivos-alvo** | `db/schema.ts`, `db/migrations/*`, `packages/data/*`, Auth.js config |
| **Entrada crítica** | Requisitos de isolamento (NFR-001), FRs de A01, decisões DEC-002/003/004 |
| **Saída esperada** | Schema tipado, migrations versionadas, testes cross-org, documentação de constraints |
| **Bloqueia** | A04 (queries), A03 (dados), A07 (outbox) — nada roda sem schema pronto |
| **Bloqueado por** | A00 (brief) |
| **Fase** | M0 (schema base), M1-M4 (iterativo com A04) |
| **Gate de saída** | ✓ Constraints obrigam `organization_id` ✓ Testes validam zero vazamento ✓ Migrations automatizadas |
| **QAs** | QA-001/002/003 (tenant guards), QA-005 (cache limpo), QA-008 (reconciliação) |
| **Skills** | Drizzle, PostgreSQL, migrations, RLS, Auth.js, database testing |
| **Duração estimada** | 3-4 dias (M0) + manutenção (M1-M6) |
| **Critério de aceite** | Schema reflete 11 agentes sem ambiguidade; constraints FK compostas validadas |

---

### A07 — Agente de Worker & Jobs

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Filas (pg-boss), webhooks, sincronização, processamento assíncrono, reconciliação |
| **Arquivos-alvo** | `apps/worker/src/*`, operações, job handlers, webhook receivers |
| **Entrada crítica** | Contratos de A04, schema de A06, operações definidas |
| **Saída esperada** | Worker code funcional, job handlers tipados, tests de retry/idempotência |
| **Bloqueia** | A08 (testes de jobs), A09 (segurança de jobs) |
| **Bloqueado por** | A00 (brief), A04 (contracts), A06 (schema) |
| **Fase** | M0 (setup pg-boss), M2-M4 (job handlers) |
| **Gate de saída** | ✓ Reprocessamento idempotente ✓ Sem retry cego ✓ Reconciliação de OUTCOME_UNKNOWN |
| **QAs** | QA-007/008 (OUTCOME_UNKNOWN), QA-012 (training states), QA-014 (atribuição exclusiva) |
| **Skills** | pg-boss, webhook handling, idempotency, error handling, job patterns |
| **Duração estimada** | 4-5 dias (M0-M2) |
| **Critério de aceite** | Zero perda de mensagem; testes injetam timeout, duplicação, atraso, out-of-order |

---

### A08 — Agente QA & Testes

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Testes (unit, integration, E2E), gate validations, cobertura QA-001 a QA-021 |
| **Arquivos-alvo** | `tests/`, `apps/web/e2e/*`, fixtures, test pyramid |
| **Entrada crítica** | Código implementado de A03, A04, A05, A06, A07; critérios QA definidos |
| **Saída esperada** | Suites de testes, gate checklist automático, relatório de cobertura |
| **Bloqueia** | **A00 (gates)** — A00 aprova gates que A08 valida |
| **Bloqueado por** | A00 (brief), A01-A07 (código para testar) |
| **Fase** | M0-M6 (contínuo) |
| **Gate de saída** | ✓ QA-001 a QA-021 implementados ✓ Cobertura >80% P0 ✓ Testes negativos cross-org |
| **QAs** | **Todas** QA-001 a QA-021 — A08 é responsável por validar |
| **Skills** | Vitest, Playwright, fixture management, test pyramid, BDD |
| **Duração estimada** | Paralelo com A03-A07 (crescimento incremental) |
| **Critério de aceite** | Bloqueadores (QA-001/002/003) 100% cobertura; P0 ≥80%; gates validáveis automaticamente |

---

### A09 — Agente Segurança

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | Vulnerabilidades, vault, auditoria, secrets management, compliance |
| **Arquivos-alvo** | Segredos (env vars), logs (redação), tenant guards (validação), RBAC |
| **Entrada crítica** | Código de A03-A07, critérios de segurança (09-QUALIDADE...) |
| **Saída esperada** | Security review, ADRs, vault documentation, secrets scanning CI |
| **Bloqueia** | **A00 (gates)** — segurança bloqueia G0/G1/G5 |
| **Bloqueado por** | A00 (brief), A03-A07 (código para revisar) |
| **Fase** | M0 (setup), M1-M6 (contínuo) |
| **Gate de saída** | ✓ Zero segredo em client ✓ Logs redigidos ✓ Tenant guards validados ✓ Vault documentado |
| **QAs** | QA-002 (guards), QA-009 (audit sem segredo), NFR-002 (segredos server-only) |
| **Skills** | `security-review`, OWASP, secrets scanning, threat modeling, compliance |
| **Duração estimada** | Paralelo com A03-A07 (code review contínuo) |
| **Critério de aceite** | Zero achados OWASP P0; cobertura de secrets scanning; auditoria sem PII |

---

### A10 — Agente DevOps

| Propriedade | Valor |
|---|---|
| **Responsabilidade** | CI/CD pipeline, deploy, observabilidade, runbooks, alertas |
| **Arquivos-alvo** | `.github/workflows/*`, `docker-compose.yml`, docs de operação |
| **Entrada crítica** | Código de A03-A07, repo autorizado (PEND-002) |
| **Saída esperada** | CI template, deploy playbooks, observabilidade stack, alertas configurados |
| **Bloqueia** | **A00 (gates)** — deploy bloqueia G0/G1 |
| **Bloqueado por** | A00 (brief), PEND-002 (repo), PEND-003 (hospedagem) |
| **Fase** | M0 (setup), M1-M6 (manutenção) |
| **Gate de saída** | ✓ CI verde ✓ Deploy staging automático ✓ Observabilidade por org ✓ Alertas testados |
| **QAs** | QA-019 (observabilidade sem conteúdo excessivo) |
| **Skills** | GitHub Actions, Docker, PostgreSQL ops, observability (Datadog/New Relic), alerting |
| **Duração estimada** | 3-4 dias (M0) + manutenção (M1-M6) |
| **Critério de aceite** | CI pipeline roda em <5 min; deploy pode rodar manualmente; observabilidade ligada |

---

## Dependências & Paralelismo

### Sequência Obrigatória (Caminho Crítico)

```
A00 (brief aprovado)
  ├─→ A01 (FRs)  ─→ A02 (wireframes) ─→ A03 (implementação)
  │
  ├─→ A04 (endpoints) ←─┬─ A06 (schema)
  │                      └─ A05 (adapter)
  │
  ├─→ A07 (worker) ← A04, A06
  │
  ├─→ A08 (QA) ← A03, A04, A05, A06, A07
  │
  ├─→ A09 (segurança) ← A03, A04
  │
  └─→ A10 (DevOps) ← A03, A04
```

### Paralelismo Máximo Recomendado

- **M0-M1:** A00 + 2-3 (ex: A02, A04, A06)
- **M2-M4:** A00 + 3-4 (ex: A03, A04, A05, A07)
- **M5+:** Full team (A01-A10) — gates são checkpoint de sincronização

### Pontos de Sincronização (Gates)

| Gate | Agentes que precisam estar prontos |
|---|---|
| G0 | A00 ✓ (brief), A10 ✓ (CI base) |
| G1 | A03 ✓, A04 ✓, A06 ✓, A08 ✓ (tenant guards) |
| G2 | A05 ✓, A07 ✓ (jobs), A02 ✓ (labs UI) |
| G3 | A05 ✓ (canal real), A04 ✓ (webhook) |
| G4 | A03 ✓, A07 ✓ (sync), A08 ✓ (metrics) |
| G5 | A08 ✓, A09 ✓, A10 ✓ (go/no-go final) |

---

## Briefs & Ownership

Cada agente A00-A10 recebe um **AGENT-BRIEF.md** com:

- Entrada crítica (o que precisa antes de começar)
- Saída esperada (entregável concreto)
- Fase e duração
- Gate de saída (quando terminou com sucesso)
- Bloqueadores (quem precisa terminar antes)
- QAs que validam (testes que aprovam trabalho)
- Skills recomendados
- Critério de aceite
- Contato de coordenação (A00)

---

## Métricas de Sucesso

Para cada agente:

- **Entrega on-time:** Dentro do estimado (±1 dia)
- **Zero defeito crítico:** QAs passam
- **Rastreabilidade:** Cada entrega mapeia para FR/UI/QA
- **Documentação:** Brief, ADR, decisões documentadas
- **Ownership claro:** Nenhuma ambiguidade de quem é dono

---

## Status Tracking

| Agente | Phase | Status | Gate | Bloqueado? | Notas |
|---|---|---|---|---|---|
| A00 | M0 | ⬜ Aguardando brief | G0 | — | — |
| A01 | M0 | ⬜ Aguardando A00 | G0 | A00 | — |
| A02 | M0 | ⬜ Aguardando A01 | G0 | A00,A01 | — |
| A03 | M0 | ⬜ Aguardando A02 | G0 | A00,A02,A04 | — |
| A04 | M0 | ⬜ Aguardando A06 | G0 | A00,A06 | — |
| A05 | M0 | ⬜ Aguardando creds | G0 | A00,PEND-004 | — |
| A06 | M0 | ⬜ Aguardando A00 | G0 | A00 | — |
| A07 | M0 | ⬜ Aguardando A04 | G0 | A00,A04,A06 | — |
| A08 | M0 | ⬜ Aguardando código | G0 | A00,A03-A07 | — |
| A09 | M0 | ⬜ Aguardando código | G0 | A00,A03-A07 | — |
| A10 | M0 | ⬜ Aguardando repo | G0 | A00,PEND-002 | — |

---

**Última atualização:** 2026-10-11 · **Owner:** A00 · **Status:** Consolidação Phase 1 · **Próxima revisão:** Após G0 aprovado
