# BRIEF: A05 — Agente de Integração GPT Maker

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Adaptador** entre a plataforma GPT Maker e os agentes A04 (endpoints) e A07 (worker). Responsável por mapear 72 operações OpenAPI da GPT Maker, normalizar erros, validar capabilities por organização/canal, e fornecer cliente HTTP tipado. Isola a complexidade do OpenAPI upstream e torna a integração testável sem credenciais reais em M0-M2.

**Dono:** A05 (você designa)

---

## Responsabilidades Principais

1. ✅ **Design do Adaptador OpenAPI**
   - Ler API-MATRIX.md (72 operações) e catalogar por categoria (envio, treinamento, webhook)
   - Desenhar cliente HTTP tipado com retry logic, timeout, rate-limiting
   - Definir contrato de erro: normalizar 400/401/403/429/500 para enum interno
   - Documentar quais operações são críticas (FR-006 a FR-020) vs. opcionais

2. ✅ **Mapeamento de Operações & Capabilities**
   - Implementar função `resolveCapabilities(orgId, channel)` que lê creds e retorna subset de 72 ops
   - Validar que cada org não acessa ops fora de seu tier/contrato
   - Mapear limites de rate, batch size, webhook timeout por operação
   - Testes parametrizados cobrindo 3+ organizações mock

3. ✅ **Fixtures & Testes de Integração**
   - Criar fixtures sanitizadas de requests/responses reais (sem creds, sem PIIs)
   - Implementar mock server (ou usar nock) que simula 72 endpoints
   - Testes unitários de cada operação crítica: envio, treinamento, webhook
   - Testes de erro: validar normalização para cada código HTTP listado

4. ✅ **Normalização de Erros & Logging**
   - Definir `class AdapterError` com tipo (ApiError, RateLimited, Timeout, Unknown)
   - Repassar erros para contexto sem expor credencial ou request body sensível
   - Audit log de operações: quem, qual op, timestamp, status (sem transcription)
   - Warnings de deprecação se GPT Maker sinalizar

5. ✅ **Integração com A04 & A07**
   - Exposar `GptMakerClient` como singleton com `async execute(op, params)`
   - Oferecer builder para testes: `createTestClient(orgId, overrides)`
   - Documentar como A04 chamar operações por ID (p.ex., `SEND_MESSAGE`)
   - Validar que A07 (worker) consegue retentar sem ficar em loop infinito

---

## Entrada Crítica

- ✅ API-MATRIX.md com 72 operações mapeadas (OpenAPI spec ou documentação)
- ✅ Credenciais GPT Maker staging (PEND-004 resolvido)
- ✅ Decisão de error handling (DEC-005 ou equivalente em ADRs.md)
- ✅ Contrato upstream de A04 (quais ops são mandatórias)
- ✅ Requisitos de audit (FR-019, NFR-002)
- ✅ Rate limits, batch sizes, timeouts por operação

---

## Saída Esperada

**M0 (Stub):**
- Cliente tipado com 72 operações mocked
- Fixtures mock com requests/responses
- Testes passando para operações críticas (subset 5-10 ops)
- Documentação de como usar GptMakerClient

**M2 (Integração Real com Mock):**
- Integração contra staging da GPT Maker com creds em env vars
- Todos os 72 endpoints mapeados ou rejeitados com razão documentada
- Testes de capabilities por org (3+ orgs mock)
- Normalização de erros completa
- QA-011 verde (capabilities report)

**M3 (Credenciais Reais):**
- Suporte a credenciais por org em banco de dados
- Rotação segura de tokens/secrets (sem tocar em código)
- Logging auditável sem exposição de sensível
- Performance validada em carga simulada

---

## Fase & Timeline

- **M0:** 2 dias (stub + mocks)
- **M2:** 1-2 dias (integração real com staging)
- **M3:** 1 dia (creds reais, rotação, audit)
- **Total M0-M3:** 3-4 dias work

---

## Gate de Saída (M2)

✅ **Pós-M0:**
- [ ] GptMakerClient tipado com 72 operações (mocked)
- [ ] Fixtures mock validadas para críticas (FR-006 a FR-020)
- [ ] Testes unitários passando (operações críticas)
- [ ] Documentação de uso para A04 + A07
- [ ] Contrato de erro normalizado

✅ **Pós-M2 (fim 3-4 dias):**
- [ ] Integração contra staging testada e verde
- [ ] Todas as 72 operações mapeadas: "suportada", "futura", ou "rejeitada com razão"
- [ ] QA-011 verde: capabilities report por org gerado automaticamente
- [ ] QA-012/013 verde: training state transitions testados contra staging
- [ ] Normalização de erro cobrindo 400/401/403/429/500/timeout
- [ ] Rate limiting e retry logic funcionando
- [ ] Audit log estruturado (sem cred/transcription)
- [ ] ADRs.md atualizado com decisões de retry, timeout, circuit breaker

---

## QAs Associados

- **QA-011:** Capabilities report por org — cada org vê apenas ops autorizadas
- **QA-012:** Training state transitions testados contra staging (modelo treinando, concluído, erro)
- **QA-013:** Webhook validation — A05 simula callback e A04 processa corretamente
- **QA-009:** Audit logs sem transcription ou credencial visível

---

## Skills Necessários

1. **OpenAPI & HTTP Client Design** — Desenhar cliente limpo para 72 endpoints
2. **Error Mapping & Normalization** — Traduzir erros upstream para domínio local
3. **Fixture Management** — Sanitizar dados reais para testes reproduzíveis
4. **API Testing (staging)** — Validar integração sem credenciais em git
5. **Rate Limiting & Retry Logic** — Exponential backoff, circuit breaker patterns

---

## Critério de Aceite

✅ **A05 terminou quando:**
- Todas as 72 operações mapeadas: suportadas, futuras, ou rejeitadas com doc
- GptMakerClient é singleton, tipado, testável sem creds
- Nenhuma credencial ou secret em código (todas em env vars)
- Audit log estruturado e validado por A09 (segurança)
- QA-011 verde: relatório automático de capabilities por org
- A04 consegue chamar `client.execute('SEND_MESSAGE', {...})` sem saber OpenAPI
- A07 consegue retentar operações sem ficar em loop infinito
- Documentação clara de quais ops são bloqueadores para M1 vs. futuro

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| Creds GPT Maker atrasadas (PEND-004) | 🔴 Alta | Usar mock 100% em M0-M1; PEND-004 desbloqueador de M2 |
| OpenAPI spec incompleta (API-MATRIX) | 🟡 Média | Pedir clarificação ao usuário/GPT Maker; marcar como "future" |
| Rate limits apertados quebram testes | 🟡 Média | Implementar backoff + jitter; validar em staging, não em prod |
| Operação deprecada entre M0 e M3 | 🟡 Média | ADRs.md com changelog; deprecation warning no cliente |
| A04/A07 chamam op antes de capabilities validado | 🔴 Alta | Validação no cliente: lançar erro se org não autorizada |

---

**Próximo passo:** Leia API-MATRIX.md, mapeie 72 operações por categoria, desenhe GptMakerClient e comece M0-005 (stub).

**Última atualização:** 2026-10-11 · **Owner:** A05 · **Status:** Pronto para Execução
