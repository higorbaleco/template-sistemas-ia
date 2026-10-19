# BRIEF: A08 — Agente QA & Testes

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Guardiã de qualidade** responsável por cobertura de testes (unit, integration, E2E), validação de gates e rastreabilidade de QAs. Implementa test pyramid, fixtures reutilizáveis, BDD e testes negativos cross-org. Fornece relatório de cobertura e checklist automático para cada gate. A08 valida que A03-A07 entregam código testado; A00 aprova gates que A08 valida.

**Dono:** A08 (você designa)

---

## Responsabilidades Principais

1. ✅ **Test Pyramid & Estrutura (M0-M1)**
   - Configurar Vitest para unit tests (rápido, mock-heavy)
   - Configurar Playwright para E2E tests (navegador real, fluxo completo)
   - Criar fixtures base: tenant, user, operation, training data
   - Implementar helper de mock (API, webhook, job queue)
   - Documentar convenção de teste (unit/ vs e2e/, naming)

2. ✅ **Unit & Integration Tests para A03-A07 (M0-M6 contínuo)**
   - Escrever testes para API handlers de A03 (auth, tenancy, CRUD)
   - Escrever testes para contratos de A04 (payload validation, state transition)
   - Escrever testes para schema/database de A06 (migrations, constraints, queries)
   - Escrever testes para job handlers de A07 (retry, idempotency, reconciliation)
   - Atingir ≥80% cobertura em código P0 (auth, security, state machine)

3. ✅ **QA-001 a QA-021: Casos de Teste & Cobertura (M1-M6)**
   - QA-001/002/003 (bloqueadores): testes negativos cross-org, vazamento, permissão
   - QA-004/005/006: API contract (tipo, status code, erro)
   - QA-007/008: OUTCOME_UNKNOWN handling (webhook, reconciliação)
   - QA-009: Audit log sem segredo ou transcrição integral
   - QA-010: Webhook validado antes de mudar estado
   - QA-011 a QA-021: Training states, model export, tenancy, rate limit, etc.
   - Cada QA tem fixture, test suite, expected output documentado
   - Testes são executáveis automaticamente (sem manual steps)

4. ✅ **E2E & Testes Negativos (M2-M4)**
   - Fluxo de treinamento completo: criar operação → webhook chega → status atualiza
   - Fluxo de modelo: export requisitado → job processado → arquivo entregue
   - Teste negativo cross-org: User A não vê training de User B, mesmo endpoint
   - Teste timeout: job não retorna em 5s, operação passa para OUTCOME_UNKNOWN
   - Teste out-of-order: webhook chega antes de job iniciar, estado é consistente
   - Teste duplicate: mesmo job roda 2x, idempotência garante resultado único

5. ✅ **Gate Checklist & Relatório (M1-M6 contínuo)**
   - Manter GATE-CHECKLIST.md com status de QA-001 a QA-021
   - Implementar script de validação automática (exit code 0 = gates ok)
   - Relatório de cobertura: % P0, % P1, linhas não cobertas por módulo
   - Dashboard de testes: total, passed, failed, skipped (Vitest ou CI)
   - CI bloqueia merge se QA bloqueadora falha ou cobertura < 80% P0

---

## Entrada Crítica

- ✅ Código implementado de A03 (API + handlers)
- ✅ Código implementado de A04 (contratos + estado)
- ✅ Código implementado de A05 (frontend + navegação)
- ✅ Código implementado de A06 (schema + queries)
- ✅ Código implementado de A07 (job handlers + webhooks)
- ✅ CODEX.md com 11 specs (FRs) finalizadas
- ✅ ADRs.md com decisões arquiteturais congeladas
- ✅ QA-001 a QA-021 definidas em CODEX.md ou documento separado

---

## Saída Esperada

**M0 (3 dias):**
- Vitest + Playwright configurados
- Fixtures base criadas (tenant, user, operation)
- Helpers de mock (API, webhook, job)
- Convenção de teste documentada
- 2-3 commits

**M1 (4-5 dias):**
- Unit tests para A03 (auth, tenancy) — bloqueadores QA-001/002/003
- Integration tests para A04 (contratos, estado)
- QA-001/002/003 implementadas e passando
- Cobertura inicial ≥80% em auth (bloqueador)
- GATE-CHECKLIST.md criado
- 6-8 commits

**M2-M4 (8-10 dias):**
- Unit tests para A06 (schema, migrations, queries)
- Unit tests para A07 (job handlers, retry, idempotency)
- E2E tests para treinamento, modelo, webhook completos
- QA-004 a QA-021 implementadas e passando
- Testes negativos cross-org, timeout, out-of-order, duplicate
- Cobertura ≥80% P0 mantida
- 15-20 commits

**M5-M6 (4-5 dias):**
- Testes de performance (treino, export, webhook latência)
- Testes de resiliência (job retry, worker crash recovery)
- Relatório final de cobertura
- Dashboard de testes em CI
- 5-8 commits

---

## Fase & Timeline

- **M0-M1:** 7 dias (setup + bloqueadores)
- **M2-M4:** 8-10 dias (E2E + cobertura completa)
- **M5-M6:** 4-5 dias (performance + resiliência)
- **Total:** Paralelo com A03-A07 (crescimento incremental, não sequencial)

---

## Gate de Saída

✅ **Pré-M0 Kickoff:**
- [ ] Vitest + Playwright instalados e CI configurado
- [ ] Fixtures base criadas (tenant, user, operation)
- [ ] Mock helpers (API, webhook, job queue) funcionais
- [ ] Convenção de teste (naming, diretorios) documentada
- [ ] A03 + A04 prontos para testes (código escrito, schemas finalizados)

✅ **G0 (fim M0) - Bloqueadores:**
- [ ] QA-001 pass: Zero vazamento entre organizações (test data isolado por tenant)
- [ ] QA-002 pass: Permissão: User A não pode acessar training de User B
- [ ] QA-003 pass: Auth obrigatório: endpoint sem token retorna 401 Unauthorized
- [ ] Unit tests para A03 (auth, tenancy) com cobertura ≥80%
- [ ] GATE-CHECKLIST.md criado e atualizado
- [ ] CI pipeline executa testes e gera relatório de cobertura

✅ **G1-G2 (fim M1-M2):**
- [ ] QA-004/005/006 pass: API contracts (tipo, status code, erro correct)
- [ ] Unit tests para A04 (estado, transições) com cobertura ≥80%
- [ ] Integration tests para A06 (queries, constraints) com cobertura ≥80%
- [ ] Cobertura P0 mantida ≥80%

✅ **G3-G4 (fim M3-M4):**
- [ ] QA-007/008 pass: OUTCOME_UNKNOWN reconhecido, reconciliado sem duplicar
- [ ] QA-009 pass: Audit log não contém segredo ou transcrição integral
- [ ] QA-010 pass: Webhook validado (assinatura, payload) antes de mudar estado
- [ ] Unit tests para A07 (job handlers, retry, idempotency) com cobertura ≥80%
- [ ] E2E tests para treino, modelo, webhook completos — passando
- [ ] Testes negativos cross-org, timeout, out-of-order, duplicate — passando
- [ ] Cobertura P0 ≥80%, P1 ≥70% mantida

✅ **Pós-M6 (fim M6):**
- [ ] QA-011 a QA-021 pass (training states, model export, tenancy, rate limit, etc.)
- [ ] Todos testes executáveis no CI (zero manual steps)
- [ ] Relatório de cobertura: % por módulo, linhas não cobertas identificadas
- [ ] Dashboard de testes em CI: total, passed, failed, skipped, trend
- [ ] Testes de performance (latência, throughput) com limites aceitos
- [ ] Testes de resiliência (job retry, crash recovery) passando
- [ ] Zero flaky tests: cada teste passa 10/10 vezes em sequência
- [ ] Code review de A09 (segurança) não encontra gaps em cobertura

---

## QAs Associados

- **Bloqueadores (M0-M1):** QA-001 (zero vazamento), QA-002 (permissão), QA-003 (auth obrigatório)
- **P0 (M1-M4):** QA-004/005/006 (API contract), QA-007/008 (OUTCOME_UNKNOWN), QA-009/010 (security + webhook)
- **P1 (M2-M6):** QA-011 a QA-021 (training states, model export, tenancy, rate limit, input validation, webhook retry, audit log)
- **A08 é responsável** por implementar e manter todos QA-001 a QA-021; A00 aprova gates que A08 valida

---

## Skills Necessários

1. **Vitest** — Unit tests, mocking, fixtures, coverage reports
2. **Playwright** — E2E tests, browser automation, wait strategies
3. **Fixture management** — Factories, setup/teardown, test data isolation
4. **Test pyramid** — Proporção unit/integration/E2E, velocidade vs cobertura
5. **BDD** — Gherkin syntax (opcional), test naming (Given/When/Then)

---

## Critério de Aceite

✅ **A08 terminou quando:**
- QA-001/002/003 (bloqueadores) têm cobertura 100%, testes passam em CI
- Cobertura P0 ≥80%, P1 ≥70%, nenhum módulo crítico (auth, tenancy, state) < 80%
- Todos 21 QAs implementados como testes executáveis (exit code = success/failure)
- E2E fluxos (treino, modelo, webhook) rodam in-process, sem manual setup
- Testes negativos (cross-org, timeout, out-of-order, duplicate) cobertos
- Zero flaky tests: cada teste passa 10/10 em sequência
- Relatório de cobertura disponível por módulo (A03, A04, A05, A06, A07)
- GATE-CHECKLIST.md sincronizado com status real (atualizado a cada PR)
- CI bloqueia merge se bloqueador falha ou P0 < 80%
- Documentação de teste incluir: "Como rodar suite", "Como adicionar novo teste", "Como debugar flaky test"

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| Fixture nãoisolada por tenant causa vazamento | 🔴 Alta | Bloqueia QA-001; rever factory, adicionar tenantId explícito em cada setup |
| Teste flaky (passa 9/10 vezes) bloqueia deploy | 🔴 Alta | Investigar com A03/A07 (possível race condition); não mesclar até determinístico |
| Cobertura salta de 82% para 65% após PR | 🔴 Alta | Investigar qual código novo não foi testado; exigir testes antes de merge |
| Job timeout teste não injeciona delay real | 🟡 Média | Mock job queue com delay real; sincronicar com A07 sobre implementação |
| QA-009 (audit log) encontra segredo em transcrição | 🔴 Alta | Bloqueia deploy; editar handler de A03 para redact; re-testar |

---

**Próximo passo:** Ler CODEX.md para listar QA-001 a QA-021, configurar Vitest + Playwright em CI, criar fixtures base; sincronizar com A03-A07 para receber código pronto para testes.

**Última atualização:** 2026-10-11 · **Owner:** A08 · **Status:** Pronto para Execução
