# BRIEF: A07 — Agente de Worker & Jobs

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Arquiteto de fila assíncrona** responsável por processamento robusto de jobs, webhooks e sincronização de estado. Implementa pg-boss, handlers tipados, estratégia de retry idempotente e reconciliação de OUTCOME_UNKNOWN. Garante zero perda de mensagem e rastreabilidade completa de operações assíncronas.

**Dono:** A07 (você designa)

---

## Responsabilidades Principais

1. ✅ **Setup & Configuração de pg-boss (M0)**
   - Instalar pg-boss como dependência do worker
   - Configurar schema de fila (`jobs`, `job_states`, `job_logs`)
   - Implementar connection pooling e health checks
   - Documentar estratégia de retention e cleanup de histórico
   - Testar failover e recuperação após crash

2. ✅ **Implementação de Job Handlers (M2-M3)**
   - Criar handlers base para operações de A06 (training, model export, webhook)
   - Tipificar payload e resultado de cada handler com Zod/TypeScript
   - Implementar retry logic com backoff exponencial (3 tentativas, sem retry cego)
   - Adicionar contexto de trace (jobId, tenantId, timestamp) em cada execução
   - Escrever testes de handler com inject de timeout, duplicação, atraso

3. ✅ **Webhook Receivers & Dispatcher (M2-M4)**
   - Implementar receiver para webhooks de operações externas (modelo, treinamento)
   - Validar assinatura de webhook antes de processar
   - Mapear webhook payload para estado de operação em A04
   - Dispatchar jobs para handlers apropriados com prioridade
   - Retornar 202 Accepted antes de processar (não bloquear chamador)

4. ✅ **Reconciliação & OUTCOME_UNKNOWN (M3-M4)**
   - Implementar reconciliador para jobs com estado OUTCOME_UNKNOWN > 2h
   - Consultar endpoint externo de status sem duplicar chamada
   - Atualizar operation_state conforme resposta (sucesso, falha, timeout)
   - Registrar evento de reconciliação em job_logs com motivo
   - Garantir idempotência: reconciliação de já-reconciliado é no-op

5. ✅ **Observabilidade & Testes de Resiliência (M4)**
   - Instrumentar job handlers com métricas (inicio, fim, duração, erro)
   - Implementar dead-letter queue para jobs com > 3 retries falhos
   - Criar testes de caos: inject timeout, network error, duplicate job, out-of-order
   - Documentar playbook de operação (onde checar job status, como reprocessar)
   - Validar que zero mensagens são perdidas em crash de worker

---

## Entrada Crítica

- ✅ Contratos de A04 (OperationRef, status transitions, payload schema)
- ✅ Schema de A06 (operations table, job_logs, estados de treino)
- ✅ Operações definidas em CODEX.md (training_start, model_export, webhook_deliver)
- ✅ ADRs.md com decisão de retry strategy (exponencial vs fixo)
- ✅ Aprovação em MATRIX.md que A07 só começa após A04+A06

---

## Saída Esperada

**M0 (2 dias):**
- pg-boss instalado e schema criado
- Health check funcional
- Documentação de setup
- 2-3 commits

**M2-M3 (3-4 dias):**
- 5+ handlers tipados (training, export, webhook_deliver, sync, reconcile)
- Retry logic com backoff + contexto de trace
- Webhook receiver com validação de assinatura
- Testes unitários de handler (mock deps, inject faults)
- 8-10 commits

**M4 (2-3 dias):**
- Reconciliador de OUTCOME_UNKNOWN completo
- Métricas de job (Prometheus ou datadog format)
- Dead-letter queue com alerta
- Testes de caos (timeout, duplicate, out-of-order)
- Playbook de operação
- 4-5 commits

---

## Fase & Timeline

- **M0:** 2 dias (pg-boss setup)
- **M2-M3:** 3-4 dias (handlers + webhooks)
- **M4:** 2-3 dias (reconciliação + resiliência)
- **Total:** 4-5 dias (paralelo com A03, A04, A06)

---

## Gate de Saída

✅ **Pré-M2 (após M0):**
- [ ] pg-boss schema em produção (migrations ok)
- [ ] Health check retorna 200 OK
- [ ] Documentação de setup (README + playbook)
- [ ] A04 contratos finalizados (OperationRef, status schema)
- [ ] A06 schema de operations + job_logs pronto

✅ **Pós-M4 (fim M4):**
- [ ] 5+ handlers tipados, zero `any` em payload/result
- [ ] Todos handlers testados com inject de timeout, duplicate, delay
- [ ] Reprocessamento é idempotente (handler-level ou job-level idempotency token)
- [ ] Sem retry cego: max 3 tentativas, backoff obedecido, log em cada tentativa
- [ ] Reconciliação de OUTCOME_UNKNOWN > 2h implementada e testada
- [ ] Zero mensagens perdidas: verificado em testes de crash + recovery
- [ ] Métricas de job: iniciado, completado, erro registrados
- [ ] Dead-letter queue com alerta configurado
- [ ] Webhook receiver valida assinatura e retorna 202 Accepted
- [ ] QA-007/008 pass (OUTCOME_UNKNOWN handling)
- [ ] QA-012 pass (training state transitions via job)
- [ ] QA-014 pass (job exclusividade por operation_id)

---

## QAs Associados

- **QA-007:** Reconhecimento de webhook + status actualizado sem perder estado anterior
- **QA-008:** OUTCOME_UNKNOWN reconciliado corretamente após 2h+ sem timeout
- **QA-012:** Training states (pending → processing → success/failed) refletem job state
- **QA-014:** Nenhum dois jobs processam a mesma operation_id simultaneamente

---

## Skills Necessários

1. **pg-boss** — Instalação, configuração, health check
2. **Webhook handling** — Validação de assinatura, retry, 202 Accepted pattern
3. **Idempotency** — Idempotency tokens, handler-level guards
4. **Error handling** — Retry strategy, backoff, dead-letter queue
5. **Job patterns** — Dispatcher, context propagation, observability hooks

---

## Critério de Aceite

✅ **A07 terminou quando:**
- Todos 5+ handlers rodam com timeout/duplicate/delay injetado, testes passam
- Reprocessamento é idempotente: rodá-lo 2x em sequência tem mesmo efeito que 1x
- Sem retry cego: cada tentativa registrada em job_logs, backoff respeitado
- OUTCOME_UNKNOWN reconciliado em < 5 min após 2h de espera
- Zero mensagens perdidas: verificado em teste de worker restart
- Webhook receiver retorna 202 Accepted imediatamente, processa em background
- QA-007/008/012/014 implementadas e passando
- Documentação de operação inclui: "Como debugar job travado", "Como reprocessar manualmente"
- Code review de A09 (segurança de jobs) não bloqueia merge

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| pg-boss schema incompatível com migration | 🔴 Alta | Rollback para versão anterior; consultar A06 antes de atualizar schema |
| Retry sem idempotency causa duplicação | 🔴 Alta | Implementar idempotency token em handler antes de mesclar; bloqueia QA-007 |
| OUTCOME_UNKNOWN reconciliador chama endpoint 2x | 🟡 Média | Adicionar check de "já reconciliado" no handler; refaz como idempotente |
| Dead-letter queue acumula sem alerta | 🟡 Média | Configurar alerta em Prometheus/datadog; notificar A00 se > 10 jobs dead-letter |
| Webhook receiver não valida assinatura | 🔴 Alta | Bloqueia QA-009; revisar com A09 (segurança) antes de deploy |

---

**Próximo passo:** Ler CODEX.md para listar operações, validar schema de A06, começar M0 (pg-boss setup) amanhã; sincronizar com A04 + A06 para contratos + schema.

**Última atualização:** 2026-10-11 · **Owner:** A07 · **Status:** Pronto para Execução
