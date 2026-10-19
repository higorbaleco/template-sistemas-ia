# BRIEF: A04 — Agente Backend, BFF & Domínio

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Responsável** por toda lógica de negócio, autorização e persistência. Constrói route handlers REST tipados, services de domínio, middleware de guard organization/role, schemas Drizzle, operações assíncronas via outbox pattern, auditoria sem vazamento de segredo, e integra contratos com A03. Garante que zero query escape da organização e trata corretamente estados de operação pendente (OUTCOME_UNKNOWN).

**Dono:** A04 (você designa)

---

## Responsabilidades Principais

1. ✅ **Route Handlers & Autorização**
   - Implementar endpoints REST em `apps/web/src/app/api/app/` (POST /api/app/orgs, GET /api/app/members)
   - Aplicar middleware de guard: `withOrgContext`, `withRoleCheck` em cada handler
   - Validar organização (organization_id) em todas as queries SELECT/UPDATE/DELETE
   - Rejeitar requisições cross-org com erro 403 Forbidden (QA-001/002/003)

2. ✅ **Serviços de Domínio & Operações**
   - Estruturar `packages/domain/` com services por agregado (OrgService, MemberService, InviteService)
   - Implementar operações não-síncronas via outbox + worker (A07): mudar status = 'processing' no response
   - Tratar OUTCOME_UNKNOWN corretamente: retry automático, webhook poll com backoff (QA-007/008)
   - Manter todos os estados transitórios em `operations` table com `organization_id`

3. ✅ **Schemas Drizzle & Migrations**
   - Validar que schema de A06 inclui `organization_id` em todas as tabelas
   - Escrever migrations incrementais (M1-001 até M4-XXX)
   - Criar índices em (organization_id, status) para queries rápidas
   - Garantir que foreign keys não violam isolamento multi-tenant

4. ✅ **Validação & Contratos**
   - Mapear todas as validações com Zod schemas em `packages/contracts/`
   - Implementar error mapping: Drizzle errors → ApiError humanizado
   - Redigir logs: zero segredo (senha, token, email em bruto) em audit logs (QA-009)
   - Tipificar response com `ApiSuccess<T>` e `ApiError`

5. ✅ **Testes de Segurança & Assinatura**
   - Testar cada endpoint com requisição cross-org (expect 403)
   - Validar assinatura de organização na criação (QA-020)
   - Testar casos negativos: DELETE member ausente, UPDATE permission inválida
   - Garantir idempotência em operações via outbox (retry seguro)

---

## Entrada Crítica

- ✅ Especificação de FRs de A01 (05-CONTRATOS.md consolidado)
- ✅ Schema Drizzle de A06 com `organization_id` em todas as tabelas
- ✅ Contratos REST de 05-CONTRATOS (ApiSuccess, ApiError, OperationRef)
- ✅ Wireframes de A02 (para entender fluxo de negócio)
- ✅ CODEX.md com mapping de endpoints para FRs

---

## Saída Esperada

**M1 (10 dias):**
- 3 endpoints REST implementados (POST /orgs, GET /members, DELETE /member/:id)
- Middleware de guard organization/role aplicado
- Testes de cross-org rejection (QA-001 preliminar)
- Schema base validado com migrations

**M2-M3 (14 dias):**
- 8+ endpoints REST completos
- Operações via outbox + polling de OUTCOME_UNKNOWN
- Audit logs redigidos (zero segredo)
- Testes negativos de todas as permissões

**M4 (7 dias):**
- Todos os endpoints de CODEX.md implementados
- QA-001/002/003 (tenant guards) 100%
- QA-007/008 (OUTCOME_UNKNOWN) 100%
- QA-009 (audit) 100%
- QA-020 (assinatura org) ✓

---

## Fase & Timeline

- **M1:** 10 dias (endpoints base, guard, schema)
- **M2-M3:** 14 dias (lógica completa, outbox, audit)
- **M4:** 7 dias (testes finais, refinamento)
- **Paralelo com A03:** Contratos fixos em CODEX.md guiam ambos

---

## Gate de Saída (M4)

✅ **Pós-M1:**
- [ ] 3 endpoints REST implementados
- [ ] Middleware withOrgContext aplicado
- [ ] Teste cross-org rejeita (403 Forbidden)
- [ ] Schema migrations M1-001 a M1-008 aplicadas
- [ ] CI pipeline verde (lint + build + testes unit)

✅ **Pós-M2:**
- [ ] 8+ endpoints implementados
- [ ] Outbox pattern implementado
- [ ] Webhook poll de OUTCOME_UNKNOWN funcional
- [ ] Audit logs redigidos (grep -v "password|email|token" no output)
- [ ] 20+ testes de segurança cross-org passando

✅ **Pós-M3:**
- [ ] Todos os endpoints de CODEX.md implementados
- [ ] QA-001/002/003 100% (zero vazamento cross-org)
- [ ] QA-007/008 100% (OUTCOME_UNKNOWN com retry)
- [ ] QA-009 100% (audit logs limpos)
- [ ] Error handling homogêneo (ApiError com código + mensagem)

✅ **Pós-M4:**
- [ ] QA-020 (assinatura org) ✓ — cada org validada na criação
- [ ] Testes negativos cobrem: DELETE ausente, UPDATE permission negada, POST sem auth
- [ ] Nenhuma query sem `WHERE organization_id = $1`
- [ ] Idempotência em operações (outbox deduplica)
- [ ] Code coverage >80%

---

## QAs Associados

- **QA-001:** Requisição com org_id=999 retorna 403 em GET/POST/DELETE
- **QA-002:** User de org A não vê membros de org B
- **QA-003:** RBAC: role=guest não pode DELETE
- **QA-007:** OUTCOME_UNKNOWN inicia polling automático
- **QA-008:** Retry com backoff exponencial (1s, 2s, 4s, 8s)
- **QA-009:** Audit logs não contêm password, email, token em bruto
- **QA-020:** Assinatura de organização validada na criação

---

## Skills Necessários

1. **API Design** — REST conventions, HTTP status codes, versioning
2. **Authorization & Middleware** — context injection, RBAC, tenant guard
3. **Drizzle ORM** — queries tipadas, transactions, migrations
4. **Error Mapping** — standardized ApiError, logging sanitization
5. **Observability** — structured logging, trace correlation, debugging
6. **Testing** — unit tests (vitest), integration tests, security tests
7. **TypeScript** — strict mode, utility types, mapped types para contracts

---

## Critério de Aceite

✅ **A04 terminou quando:**
- Nenhuma query SELECT/UPDATE/DELETE sem `WHERE organization_id = $context.orgId`
- Todos os endpoints validam `organization_id` do contexto vs. request
- Testes negativos cobrem todas as permissões (RBAC, tenant, recurso ausente)
- Error handling padronizado com ApiError(code, message, statusCode)
- Audit logs redigidos: grep não encontra password, email, token
- Operações assíncronas via outbox com webhook poll (não polling infinito)
- OUTCOME_UNKNOWN tratado com retry automático e backoff
- Assinatura de organização validada em POST /orgs
- Testes 100% verdes em CI (unit + integration + security)
- Contratos REST espelham exatamente os de CODEX.md

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| Query escapa do organization_id | 🔴 Alta | **Bloqueia release** — audit todas com grep, adicionar `withOrgContext` middleware global |
| OUTCOME_UNKNOWN entra loop infinito | 🔴 Alta | Implementar max_retries + timeout em worker (A07), escalate a A07 |
| Audit log vazando segredo | 🔴 Alta | Implementar sanitizer Zod, testar grep -v antes de release |
| Permission check inconsistente | 🟡 Média | Centralizar RBAC em `packages/domain/rbac.ts`, testar matriz de permissões |
| Migration travando em produção | 🟡 Média | Testar rollback em staging, documentar em RUNBOOKS.md |
| Teste security flaky | 🟡 Média | Adicionar seed fixtures, usar container de test database |

---

**Próximo passo:** Leia CODEX.md + 05-CONTRATOS.md, sincronize com A03 em query-keys.ts, crie estrutura de services em M1-001.

**Última atualização:** 2026-10-11 · **Owner:** A04 · **Status:** Pronto para Execução
