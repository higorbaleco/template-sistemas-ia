# BRIEF: A06 — Agente de Dados & Auth

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Guardian** do schema de dados, autorização e isolamento multi-tenant. Responsável por desenhar schema Drizzle tipado, migrations versionadas, constraints que forçam `organization_id`, Row-Level Security (RLS), integração com Auth.js, e testes que garantem zero vazamento cross-org. Toda query e mutação passa por schema de A06.

**Dono:** A06 (você designa)

---

## Responsabilidades Principais

1. ✅ **Design do Schema Drizzle & Constraints**
   - Desenhar 11+ tabelas refletindo todos os agentes (A01-A10)
   - Forçar `organization_id` em **todas** tabelas com constraint NOT NULL
   - Implementar Foreign Keys compostas (org_id + record_id) onde apropriado
   - Definir índices para isolamento: (organization_id, id), (organization_id, created_at)
   - Documentar cada tabela e coluna; marcar sensíveis (secret, training_state)

2. ✅ **Migrations & Versionamento**
   - Criar migrations versionadas (001_initial_schema.sql, 002_add_audit_log.sql, etc.)
   - Cada migration idempotente e testável independentemente
   - Documentar rollback para cada migration
   - Suportar zero-downtime deployments (não dropar colunas, marcar como deprecated)
   - Testes de migration: seed dados, migrate, validar integridade

3. ✅ **Row-Level Security (RLS) & Auth.js**
   - Configurar RLS policies no PostgreSQL: qualquer SELECT/INSERT/UPDATE/DELETE valida org_id
   - Integrar Auth.js: user.organizationId fluir para contexto de query
   - Implementar guard function: `ensureOrgContext(req) -> organizationId`
   - Testes: tentar ler dados de outra org, validar rejeição (QA-001)

4. ✅ **Autorização por Tabela & Operação**
   - Desenhar matriz: tabela × (SELECT, INSERT, UPDATE, DELETE) × role (owner, admin, user)
   - Marcar quais tabelas são read-only para não-admins
   - Implementar validação em layer de dados (Drizzle select filters) e API (middleware)
   - Testes parametrizados: cada role, cada operação, validar sucesso/erro

5. ✅ **Documentação & Testes de Integridade**
   - README de schema: tabelas, relações, constraints
   - Documentação de RLS policies e regras de autorização
   - Testes cross-org: 3+ organizações, dados isolados, sem vazamento
   - Performance tests: índices funcionam, queries não fazem full table scan
   - Audit trail: quem alterou o quê, quando (table: audit_log)

---

## Entrada Crítica

- ✅ Requisitos de isolamento (NFR-001): zero vazamento cross-org, RLS obrigatório
- ✅ FRs de A01 (usuários, orgs, convites): qual dado vira tabela, quais campos
- ✅ Decisões arquiteturais (DEC-002/003/004): tenant model, auth strategy, secret storage
- ✅ Tipos de dados sensíveis: GPT Maker creds, webhook secrets, training_state
- ✅ Requisitos de auditoria (FR-019): qual acesso logar, qual omitir

---

## Saída Esperada

**M0 (Schema Base):**
- Schema Drizzle tipado com ~11+ tabelas
- Constraints NOT NULL em organization_id
- Migrations básicas (create tables, índices, FKs)
- Testes de isolamento básicos (2 orgs, validar zero vazamento)
- Documentação inicial de schema

**M1-M4 (Iterativo):**
- RLS policies no PostgreSQL
- Auth.js integrado em contexto de query
- Testes cross-org amplos (QA-001/002/003 verdes)
- Migrations de ajustes (adicionar coluna, índice, RLS policy)
- Audit log estruturado

**M5-M6:**
- Schema estável, migrations automáticas em deploy
- Performance validada (índices, query plans)
- Documentação sincronizada com código
- Zero débito técnico de constraints/autorização

---

## Fase & Timeline

- **M0:** 3-4 dias (schema, constraints, testes básicos)
- **M1-M4:** Contínuo (2-3 horas/dia) — ajustes conforme A04/A03 evoluem
- **M5-M6:** Manutenção (1-2 horas/semana) — otimizações, novas tabelas raras
- **Total M0:** 3-4 dias work; suporte em M1-M6

---

## Gate de Saída (M0)

✅ **Pós-M0 (fim 3-4 dias):**
- [ ] Schema Drizzle com ~11+ tabelas (user, organization, campaign, channel, training, webhook, audit, etc.)
- [ ] Constraints: organization_id NOT NULL, FK compostas validadas
- [ ] Índices: (organization_id, id), (organization_id, created_at), natural keys
- [ ] Migrations: 001_initial.sql testada, idempotente, rollback documentado
- [ ] RLS policies preparadas (comentadas, prontas para M1)
- [ ] Testes passando: 3+ orgs, zero vazamento, validar isolamento (QA-001 preliminar)
- [ ] Documentação: schema.md com tabelas, relações, constraints
- [ ] CI verde: testes de migration, integridade, isolamento
- [ ] ADRs.md atualizado com decisões: tenant model, RLS strategy, secret storage

✅ **Pós-M1:**
- [ ] RLS policies ativas no PostgreSQL
- [ ] Auth.js integrado: organizationId flui para Drizzle context
- [ ] QA-001/002/003 verdes: tenant guards, cache limpo, cross-org queries rejeitadas
- [ ] Testes de autorização: cada role, cada tabela, validar sucesso/erro
- [ ] Audit log: INSERT/UPDATE/DELETE auditado, sem cred visível

---

## QAs Associados

- **QA-001:** Zero vazamento entre organizações — tenant guards em Drizzle + RLS
- **QA-002:** Limpeza de cache entre reqs de orgs diferentes
- **QA-003:** Mutações de usuário não vazam dados cross-org
- **QA-005:** Cache de capabilities limpo em rotação de segredo
- **QA-008:** Reconciliação de dados após GPT Maker sync preserva isolamento

---

## Skills Necessários

1. **Drizzle & TypeScript** — Schema tipado, migrations fluidas
2. **PostgreSQL & RLS** — Row-level security, índices, query plans
3. **Migrations & Versioning** — Zero-downtime deployments, rollback strategies
4. **Auth.js Integration** — Contexto de autenticação em queries
5. **Database Testing** — Testes de integridade, performance, isolamento
6. **Audit & Compliance** — Logging sem exposição de sensível

---

## Critério de Aceite

✅ **A06 terminou quando:**
- Schema Drizzle reflete 11+ agentes sem ambiguidade de relacionamento
- Constraints FK compostas validam `(organization_id, id)` onde apropriado
- RLS policies forçam isolamento: SELECT/INSERT/UPDATE/DELETE validam org_id
- Testes cross-org cobrem 3+ organizações: zero vazamento (QA-001 passa)
- Migrations são idempotentes, testáveis, com rollback documentado
- Audit log estruturado: user, action, timestamp, delta (sem cred/transcription)
- A04 consegue chamar `db.query.user.findMany()` e recebe apenas dados da org
- A03 consegue fazer upsert com garantia de isolamento
- Performance: índices funcionam, não há N+1 queries

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| Constraint FK quebra migrate em produção | 🔴 Alta | Testes de migration primeiro; validar em staging |
| RLS policy muito lenta (N+1 policies) | 🟡 Média | Query plan analysis; simplificar policies ou usar triggers |
| A04 ignora organizationId | 🔴 Alta | Validação em schema (NOT NULL constraint) + middleware + testes |
| Schema muda entre M1-M2, quebra queries | 🟡 Média | ADRs.md congelado; zero breaking changes sem deprecation warning |
| Nova tabela necessária em M2 | 🟡 Média | Extensão de schema em migration, backward compatible |

---

**Próximo passo:** Leia NFR-001 + FRs de A01, desenhe 11+ tabelas, implemente schema Drizzle com constraints, comece M0-002.

**Última atualização:** 2026-10-11 · **Owner:** A06 · **Status:** Pronto para Execução
