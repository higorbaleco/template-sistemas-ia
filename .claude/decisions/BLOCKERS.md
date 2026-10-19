# BLOCKERS: Pendências & Decisões Externas (PEND + GM)

**Versão 1.0** · 2026-10-11 · Status: Consolidação Phase 1 · Owner: A00 (Coordenador)

Consolidação de 20 itens pendentes: 10 decisões do usuário (PEND-001 a 010) e 10 homologações técnicas com GPT Maker (GM-001 a 010). Cada item é categorizado por impacto (bloqueia M0? M1? M2?) e plano de mitigação.

---

## Pendências do Usuário (PEND-001 a PEND-010)

### PEND-001: Nome Final, Logo & Paleta da Marca

| Propriedade | Valor |
|---|---|
| **Descrição** | Identidade visual final (nome comercial, logotipo, cores primárias/secundárias, tipografia) |
| **Bloqueador?** | Não bloqueia código, bloqueia comunicação pública |
| **Impacto técnico** | Design tokens precisam cores finais; CSS/Tailwind precisam paleta; assets precisam logo |
| **Bloqueador para qual fase?** | Design tokens em M0 podem usar paleta mock; marca real para G5 (piloto real) |
| **Quando resolve?** | Ideal antes de M1 (para UI consistente) |
| **Plano B** | Usar placeholder "Acme Panel" + cores neutras (cinza/azul) até aprovação |
| **Ação responsável** | Usuário (comercial) |
| **Impacto se não resolver para M0** | ⚠️ Design tokens com mock (refatoração em M1) |
| **Impacto se não resolver para M5** | 🔴 **BLOQUEADOR para piloto real** — não posso lançar com branding errado |

**Status:** ⬜ Aguardando

---

### PEND-002: Organização GitHub & Repositório Privado

| Propriedade | Valor |
|---|---|
| **Descrição** | Organização GitHub oficial + nome definitivo do repositório (ex: `avraham-io/gpt-maker-dashboard`) |
| **Bloqueador?** | Bloqueia remoto, CI remoto, CODEOWNERS real |
| **Impacto técnico** | A10 (DevOps) precisa repo para workflow GitHub Actions; A00 precisa CODEOWNERS |
| **Bloqueador para qual fase?** | M0 pode rodar local; M1 precisa remoto para CI |
| **Quando resolve?** | Antes de fim de M0 |
| **Plano B** | Repo local com git puro (sem GitHub Actions); transferir para GitHub em M1 |
| **Ação responsável** | Usuário (infraestrutura) |
| **Impacto se não resolver para M1** | ⚠️ Sem CI remoto; testes rodando apenas local |
| **Impacto se não resolver para M3** | 🔴 **BLOQUEADOR** — staging deploy exigirá repo remoto |

**Status:** ⬜ Aguardando

---

### PEND-003: Hospedagem Final (Railway/Render/Self-Hosted) & PostgreSQL Gerenciado

| Propriedade | Valor |
|---|---|
| **Descrição** | Decisão de hospedagem (Railway, Render.com, AWS RDS, self-hosted) + PostgreSQL gerenciado ou local |
| **Bloqueador?** | Bloqueia deploy staging/prod |
| **Impacto técnico** | A10 (DevOps) precisa alvo de deploy; Drizzle migrations precisam compatibilidade |
| **Bloqueador para qual fase?** | M0-M2 podem rodar local; M3 precisa staging; M5 precisa prod |
| **Quando resolve?** | Ideal antes de fim M1 (para testar deploy) |
| **Plano B** | Usar Railway (compatível, suporta pnpm) para staging + local para dev |
| **Ação responsável** | Usuário (infraestrutura) |
| **Impacto se não resolver para M2** | ⚠️ Sem staging; testes de prod rodam local |
| **Impacto se não resolver para M5** | 🔴 **BLOQUEADOR** — não posso fazer piloto sem prod |

**Status:** ⬜ Aguardando (Railway recomendado como padrão)

---

### PEND-004: Credencial GPT Maker de Homologação

| Propriedade | Valor |
|---|---|
| **Descrição** | Token/chave de API GPT Maker para conta de teste/staging (não produção) |
| **Bloqueador?** | Bloqueia integração real com GPT Maker |
| **Impacto técnico** | A05 precisa testar adapter; testes de capacidades (knowledge training, message sending) |
| **Bloqueador para qual fase?** | M0-M1 podem mockar; M2 precisa integração real para labs; M3 precisa webhook real |
| **Quando resolve?** | Ideal antes de M2 (para testar trainings em labs) |
| **Plano B** | Stub todas as operações GPT Maker com mocks typados até credencial real |
| **Ação responsável** | Usuário (comercial) + GPT Maker (issuing) |
| **Impacto se não resolver para M2** | ⚠️ Testes de training/conhecimento com stubs (sem validação real) |
| **Impacto se não resolver para M3** | 🔴 **BLOQUEADOR** — não posso conectar canal real sem credenciais |

**Status:** ⬜ Aguardando (crítico para M2)

---

### PEND-005: Workspace GPT Maker de Teste/Piloto

| Propriedade | Valor |
|---|---|
| **Descrição** | Workspace já provisionado em conta GPT Maker para teste/piloto (vinculado a credencial PEND-004) |
| **Bloqueador?** | Bloqueia teste real de onboarding assistido |
| **Impacto técnico** | A09 testa que workspace pode ser vinculado via API |
| **Bloqueador para qual fase?** | M0-M2 podem mockar workspace; M3 precisa workspace real |
| **Quando resolve?** | Ideal com PEND-004 |
| **Plano B** | Operação (platform_admin) cria workspace a cada teste (sem persistência) |
| **Ação responsável** | Usuário (infraestrutura GPT Maker) |
| **Impacto se não resolver para M3** | ⚠️ Onboarding é fluxo guiado sem workspace persistido |
| **Impacto se não resolver para M5** | 🔴 **BLOQUEADOR** — piloto precisa workspace persistido |

**Status:** ⬜ Aguardando (depende de PEND-004)

---

### PEND-006: Canal Piloto & Conta/Número de Teste Autorizado

| Propriedade | Valor |
|---|---|
| **Descrição** | Canal homologado (WhatsApp/Telegram/outro) + conta de teste/número para receber mensagens |
| **Bloqueador?** | Bloqueia teste real de envio/recepção de mensagens |
| **Impacto técnico** | A05 mapeia canal real; A04 testa envio; A07 testa webhook |
| **Bloqueador para qual fase?** | M0-M3 podem mockar; M4 precisa canal real |
| **Quando resolve?** | Ideal antes de M4 |
| **Plano B** | Mock de canal com respostas pré-gravadas |
| **Ação responsável** | Usuário (comercial) + GPT Maker |
| **Impacto se não resolver para M4** | ⚠️ Inbox/handoff testado com simulação |
| **Impacto se não resolver para M5** | 🔴 **BLOQUEADOR** — piloto operacional exigirá canal real |

**Status:** ⬜ Aguardando (critério de G4)

---

### PEND-007: Confirmação Comercial White-Label/Licenciamento

| Propriedade | Valor |
|---|---|
| **Descrição** | Confirmação contratual de que painel pode usar marca própria, remover marca GPT Maker, etc. |
| **Bloqueador?** | Bloqueia comunicação pública |
| **Impacto técnico** | Nenhum (contratual) |
| **Bloqueador para qual fase?** | Não bloqueia código; bloqueia promessa pública |
| **Quando resolve?** | Antes de qualquer comunicação pública ou piloto com cliente |
| **Plano B** | Lançar como "Powered by GPT Maker" até confirmação legal |
| **Ação responsável** | Usuário (legal) |
| **Impacto se não resolver antes de piloto** | 🔴 **BLOQUEADOR legal** — não posso fazer piloto com cliente sem confirmação white-label |

**Status:** ⬜ Aguardando

---

### PEND-008: Política de Retenção, Exclusão & Conformidade

| Propriedade | Valor |
|---|---|
| **Descrição** | Decisão sobre quanto tempo guardar dados de cliente (chats, logs, arquivos), como excluir, conformidade LGPD/GDPR |
| **Bloqueador?** | Bloqueia piloto com dados reais |
| **Impacto técnico** | A04 implementa endpoint de exclusão (FR-036); A06 implementa RLS; A09 valida conformidade |
| **Bloqueador para qual fase?** | M0-M4 podem mockar; M5 bloqueia com dados reais |
| **Quando resolve?** | Antes de M5 |
| **Plano B** | Política default: 30 dias retenção, exclusão imediata local (fornecedor gerencia backup) |
| **Ação responsável** | Usuário (legal/compliance) |
| **Impacto se não resolver para M5** | 🔴 **BLOQUEADOR** — piloto com dados reais viola LGPD sem política |

**Status:** ⬜ Aguardando

---

### PEND-009: Volume Esperado & Horário de Operação

| Propriedade | Valor |
|---|---|
| **Descrição** | Estimativa de volume (msgs/dia, picos, usuários simultâneos) + horário de suporte 24/7 ou comercial |
| **Bloqueador?** | Bloqueia metas de carga e alertas |
| **Impacto técnico** | A10 calibra alertas; A04 calibra timeout; A08 testa com volume esperado |
| **Bloqueador para qual fase?** | Não bloqueia código; bloqueia testes de carga reais (M5) |
| **Quando resolve?** | Antes de M5 |
| **Plano B** | Assumir baseline: 10 orgs, 50 operadores, 20k msgs/dia (NFR-006) |
| **Ação responsável** | Usuário (operação) |
| **Impacto se não resolver antes de M5** | ⚠️ Alertas baseados em suposição, não realidade |

**Status:** ⬜ Aguardando

---

### PEND-010: Responsáveis por Produto, Suporte & Incidente

| Propriedade | Valor |
|---|---|
| **Descrição** | Designação formal de responsável técnico (daily), suporte (L2), incidente (on-call) |
| **Bloqueador?** | Bloqueia go/no-go de piloto |
| **Impacto técnico** | Nenhum (organizacional) |
| **Bloqueador para qual fase?** | Não bloqueia código; bloqueia G5 (piloto) |
| **Quando resolve?** | Antes de M5 |
| **Plano B** | Usuário é responsável por tudo até escalação |
| **Ação responsável** | Usuário (RH/operação) |
| **Impacto se não resolver antes de G5** | 🔴 **BLOQUEADOR** — não posso fazer piloto sem ownership claro |

**Status:** ⬜ Aguardando

---

## Homologações Técnicas com GPT Maker (GM-001 a GM-010)

### GM-001: Retorno de Treinamento Contém ID em Conta Real?

| Propriedade | Valor |
|---|---|
| **Pergunta** | Quando criamos treinamento de uma fonte, API retorna ID confiável? |
| **Por que importa?** | Sem ID, não conseguimos correlacionar estado local com estado remoto (fonte → training ID) |
| **Risco mitigado** | Treinamento "fantasma" com estado UNKNOWN duradouro |
| **Bloqueador para qual fase?** | M2 (testes de training) |
| **Como valida?** | A05 testa em staging: criar source → obter training ID → GET /training/{id} retorna status |
| **Quando resolve?** | Antes de M2 |
| **Plano B** | Se API não retorna ID, usar timestamp + source ID como proxy (menos confiável) |
| **Ação responsável** | GPT Maker (documentação) |

**Status:** ⬜ Aguardando resposta

---

### GM-002: Webhook Tem Assinatura, Segredo ou ID Confiável?

| Propriedade | Valor |
|---|---|
| **Pergunta** | Webhook de training/message/channel tem assinatura HMAC ou bearer token? |
| **Por que importa?** | Sem assinatura, qualquer pessoa pode forjar webhook e alterar estado |
| **Risco mitigado** | Atacante forja webhook "training complete" → UI mostra pronto mas não está |
| **Bloqueador para qual fase?** | M3 (webhook de verdade) |
| **Como valida?** | A07 testa: valida assinatura, rejeita webhook sem assinatura |
| **Quando resolve?** | Antes de M3 |
| **Plano B** | Se sem assinatura, webhook = "hint only" — sempre valida com releitura autenticada (DEC-007) |
| **Ação responsável** | GPT Maker (security) |

**Status:** ⬜ Aguardando resposta (crítico para segurança)

---

### GM-003: Limites Reais de DOCUMENT, WEBSITE e VIDEO

| Propriedade | Valor |
|---|---|
| **Pergunta** | Tamanho máximo de documento, URL website (timeout de ingestão), duração de vídeo? |
| **Por que importa?** | Sem limites, usuário tenta upload de 1GB → timeout → erro confuso |
| **Risco mitigado** | UX incorreta, erro de ingestão imprevisto |
| **Bloqueador para qual fase?** | M2 (implementação de upload) |
| **Como valida?** | A05 documenta limites; A02 coloca no UI ("máx 10MB"); A08 testa boundary |
| **Quando resolve?** | Antes de M2 |
| **Plano B** | Assumir 10MB doc, 10MB website, 100MB video (conservador) |
| **Ação responsável** | GPT Maker (documentação) |

**Status:** ⬜ Aguardando resposta

---

### GM-004: Semântica Real de `start-human` e `stop-human` por Canal

| Propriedade | Valor |
|---|---|
| **Pergunta** | Comportamento de start-human/stop-human por canal: como mudança de estado? Mensagem de confirmação? |
| **Por que importa?** | Sem semântica clara, operador assume controle mas IA continua respondendo |
| **Risco mitigado** | Confusão de controle, resposta duplicada |
| **Bloqueador para qual fase?** | M3 (handoff real) |
| **Como valida?** | A04 testa: enviar start-human → esperar confirmação → enviar msg → receber só de IA |
| **Quando resolve?** | Antes de M3 |
| **Plano B** | Assumir semântica: start-human → IA não responde mais neste chat até stop-human |
| **Ação responsável** | GPT Maker (product) |

**Status:** ⬜ Aguardando resposta (crítico para UX)

---

### GM-005: Canal Piloto Permite Criação, Conexão e QR via API?

| Propriedade | Valor |
|---|---|
| **Pergunta** | Posso criar canal, conectar (copiar chave etc) e receber QR via API sem browser manual? |
| **Por que importa?** | Onboarding assistido precisa saber se pode provisionar via API ou se exigir manual |
| **Risco mitigado** | Onboarding fica completamente manual (UX pobre) |
| **Bloqueador para qual fase?** | M3 (onboarding real) |
| **Como valida?** | A05 testa: POST /channels {"type": "whatsapp"} → { id, connectionUrl, qrCode? } |
| **Quando resolve?** | Antes de M3 |
| **Plano B** | Se não via API, onboarding is completely manual + operação cria no painel GPT Maker |
| **Ação responsável** | GPT Maker (API) |

**Status:** ⬜ Aguardando resposta (impacta DEC-009)

---

### GM-006: Rate Limits e Retry-After por Endpoint

| Propriedade | Valor |
|---|---|
| **Pergunta** | Quais são rate limits por endpoint? Existe header Retry-After? |
| **Por que importa?** | A07 precisa saber quando fazer backoff de retry |
| **Risco mitigado** | Hammering API em retry; ban de IP |
| **Bloqueador para qual fase?** | M2 (primeiros calls) |
| **Como valida?** | A07 simula: exceder limit → receber 429 + Retry-After → respeitar backoff |
| **Quando resolve?** | Antes de M2 |
| **Plano B** | Assumir rate limit conservador (10 req/s), backoff exponencial 1-30s |
| **Ação responsável** | GPT Maker (documentação) |

**Status:** ⬜ Aguardando resposta

---

### GM-007: IDs de Mensagens em Respostas/Listagens de Envio?

| Propriedade | Valor |
|---|---|
| **Pergunta** | Quando envio mensagem, API retorna message ID? Listagens retornam IDs? |
| **Por que importa?** | Sem message ID, não conseguo reconciliar OUTCOME_UNKNOWN |
| **Risco mitigado** | Envio com timeout deixa estado UNKNOWN permanente |
| **Bloqueador para qual fase?** | M3 (envio de mensagens) |
| **Como valida?** | A04 testa: POST /messages {"text": "..."} → { messageId, ... } |
| **Quando resolve?** | Antes de M3 |
| **Plano B** | Se sem ID, usar timestamp + content hash como proxy (menos confiável) |
| **Ação responsável** | GPT Maker (API) |

**Status:** ⬜ Aguardando resposta (crítico para DEC-010)

---

### GM-008: Eventos de Webhook Trazem IDs, Ordem e Reentrega?

| Propriedade | Valor |
|---|---|
| **Pergunta** | Webhook event contém ID próprio? Garantia de ordem? Reentrega se falhar? |
| **Por que importa?** | Sem ID, não consigo deduplicar eventos duplicados |
| **Risco mitigado** | Evento processado 2x → mensagem duplicada em inbox |
| **Bloqueador para qual fase?** | M3 (webhook processamento) |
| **Como valida?** | A07 testa: injetar evento duplicado → sistema deduplica baseado em event ID |
| **Quando resolve?** | Antes de M3 |
| **Plano B** | Se sem ID de evento, usar (chat_id, timestamp_ms) como dedup key (menos confiável) |
| **Ação responsável** | GPT Maker (webhook design) |

**Status:** ⬜ Aguardando resposta

---

### GM-009: `maxDailyMessages` é Realmente por Atendimento/Conversa?

| Propriedade | Valor |
|---|---|
| **Pergunta** | Limite de mensagens é por chat/conversation ou por organização/dia global? |
| **Por que importa?** | UI precisa mostrar quota corretamente |
| **Risco mitigado** | UI promete capacidade errada |
| **Bloqueador para qual fase?** | M4 (relatórios de consumo) |
| **Como valida?** | A05 testa: enviar N mensagens em chat A → verificar se count afeta chat B |
| **Quando resolve?** | Antes de M4 |
| **Plano B** | Assumir global/dia (conservador) |
| **Ação responsável** | GPT Maker (documentação) |

**Status:** ⬜ Aguardando resposta

---

### GM-010: Condições Comerciais de Marca, Widget e Painel Próprio

| Propriedade | Valor |
|---|---|
| **Pergunta** | White-label é permitido? Widget próprio precisa de aprovação? Licensing model? |
| **Por que importa?** | Sem permissão, não posso fazer painel próprio |
| **Risco mitigado** | Investimento em vão |
| **Bloqueador para qual fase?** | M0 (decisão arquitetural) |
| **Como valida?** | Usuário valida contrato |
| **Quando resolve?** | Antes de kickoff |
| **Plano B** | Não há plano B — bloqueador da arquitetura |
| **Ação responsável** | Usuário (legal) + GPT Maker (product) |

**Status:** ⬜ Aguardando resposta (crítico para viabilidade)

---

## Matriz de Impacto & Bloqueadores

### Bloqueadores por Fase

| Fase | PEND | GM | Impacto |
|---|---|---|---|
| **M0** | PEND-002 (repo) | GM-010 (white-label) | Sem estes, M0 não kicka |
| **M1** | PEND-003 (hosting) | — | Sem hosting, sem CI/staging |
| **M2** | PEND-004 (creds) | GM-001/003/004 | Sem creds, sem integração real |
| **M3** | PEND-005/006 (workspace/canal) | GM-002/005/007/008 | Sem canal real, sem envio real |
| **M4** | — | GM-006/009 | Rate limits + quotas |
| **M5** | PEND-007/008/009/010 | — | Compliance + ownership |

### Riscos Críticos (Bloqueia GO/NO-GO)

| Pendência | Risco | Severidade | Mitigação |
|---|---|---|---|
| **PEND-004** (creds) | Sem integração GPT Maker real | 🔴 Crítico | Mock até creds chegar |
| **PEND-006** (canal real) | Sem envio/recepção real | 🔴 Crítico | Mock canal até autorização |
| **GM-002** (webhook assinatura) | Segurança — webhook forjado | 🔴 Crítico | Webhook = hint only (DEC-007) |
| **GM-007** (message IDs) | OUTCOME_UNKNOWN sem resolução | 🔴 Crítico | Usar timestamp + hash proxy |
| **PEND-010** (ownership) | Sem suporte em produção | 🔴 Crítico | Usuário assume suporte |

---

## Timeline Recomendada

```
Agora (M0 kickoff)
  ├─ PEND-010 (ownership) — CRÍTICO
  ├─ PEND-002 (repo) — CRÍTICO
  └─ GM-010 (white-label) — CRÍTICO

Fim de M0
  ├─ PEND-003 (hosting) — para staging
  └─ PEND-001 (marca) — para design tokens mock

Fim de M1
  └─ PEND-004 (creds) — para M2 integração

Fim de M2
  ├─ PEND-005 (workspace) — para M3 onboarding
  └─ PEND-006 (canal) — para M3 envio real

Fim de M3
  └─ PEND-007/008/009 — para piloto com dados reais

Fim de M4
  └─ PEND-007 (white-label legal) — para promessa pública
```

---

## Ações Imediatas

- [ ] **A00:** Validar com usuário quais PEND podem ser resolvidas antes de M0 kickoff
- [ ] **A05:** Abrir issues técnicas com GPT Maker sobre GM-001 a 010 (todas críticas)
- [ ] **A00:** Escrever mock stubs para todos os 72 endpoints (para trabalhar em paralelo até PEND-004)
- [ ] **A08:** Preparar testes com fixtures sintéticas até creds reais chegar

---

**Última atualização:** 2026-10-11 · **Owner:** A00 · **Status:** Consolidação Phase 1 · **Próxima revisão:** Weekly durante M0
