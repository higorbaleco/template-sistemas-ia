# Design — Módulo de Aquecimento (Warming Module)

Versão: 1.0 | Última atualização: 2026-08-20

## Introdução

Este documento descreve o design do **Módulo de Aquecimento**, um subsistema dedicado à maturação (aquecimento) de números de WhatsApp conectados via Baileys, para reduzir o risco de banimento por falta de atividade. O módulo se integra à plataforma maior de orquestração de agentes já especificada em `spec.md`, reaproveitando arquitetura, modelo de dados, e fluxos existentes.

O módulo é baseado na lógica de negócio do repositório de referência (`github.com/JonasCaetanoSz/maturador-de-chips`), mas **reimplementado sobre Baileys** (não Selenium + WhatsApp Web), o que exige adaptações significativas de orquestração e detecção de bloqueio.

---

## 1. Encaixe Arquitetural

### 1.1 Novo Serviço: `Serviço de Aquecimento` (Warming Service)

Na seção "Arquitetura sugerida" de `spec.md`, o Backend lista sete serviços: API principal, Orquestrador de eventos, Serviço de regras, Serviço de memória, Serviço de LLM, Serviço de webhooks, Worker de processamento.

**Decisão de design: o Serviço de Aquecimento é um serviço **novo e dedicado**, não uma responsabilidade do Serviço de regras.**

**Justificativa:**

- O **Serviço de regras** (fluxo de conversa em `spec.md`) decide *se um agente responde a uma mensagem recebida de um humano*, operando de forma reativa sobre eventos de entrada. Sua máquina de estados é simples: recebido → verifica regra → responde ou não.
- O **Serviço de Aquecimento** é **proativo e não conversacional-com-humano**: gera tráfego sintético entre instâncias do próprio operador, com sua própria máquina de estados complexa (CONNECTING → WARMING → READY → OPERATIONAL → BLOCKED), seus próprios limites de frequência/volume independentes do `rate limit` operacional do agente, seu próprio ciclo de vida (roda até a instância atingir um estado apto e depois fica dormente), e sua própria orchestração de quando/quem/quanto envia.
- Misturar aquecimento no Serviço de regras acopla duas semânticas ortogonais e dificulta desligar/pausar o aquecimento sem tocar no motor de regras do fluxo operacional principal.

### 1.2 Topologia de Consumo

```
┌─────────────────────────────────────────────────────────────┐
│                      Dashboard / Painel                      │
│  (mostra saúde de instâncias, métricas de aquecimento)      │
└────────────┬────────────────────────────────────────────────┘
             │ lê
             │
┌────────────▼──────────────┐
│ Warming Service           │  ◄──── SERVIÇO NOVO
│                           │
│ - Orquestra ciclos        │
│ - Máquina de estados      │
│ - Scheduler central       │
│ - Detecção de bloqueio    │
└────────┬──────────┬───────┘
         │ chama    │ consulta (cache LLM)
         │          │
    ┌────▼──┐  ┌───▼──────────┐
    │Baileys│  │ Serviço LLM  │
    │Service│  │ (spec.md)    │
    └───────┘  └──────────────┘
         │ publica eventos
         │
    ┌────▼─────────────────────────┐
    │ Orquestrador de eventos +    │
    │ Serviço de webhooks          │
    │ (spec.md, reaproveitado)     │
    └──────────────────────────────┘
```

Interações-chave:

1. **Warming Service → Baileys Service**: enfileira jobs de envio (via fila interna, ex.: Redis), onde cada job é `{from_instance, to_instance/group, message_content, send_timestamp}`. O Baileys Service executa o envio e retorna `{delivery_status, error_code}` — sem decisões de timing, só execução delegada.

2. **Warming Service ↔ Serviço LLM** (opcional): quando `warming_profile.use_llm_content = true`, o Warming Service pede ao Serviço de LLM uma mensagem gerada (cacheable), usando um agente técnico interno dedicado a aquecimento (ver seção 6). Se o LLM falhar, fallback para template fixo.

3. **Warming Service → Orquestrador de eventos + Webhooks**: publica eventos novos (`instance.warming_started`, `instance.warming_completed`, `instance.blocked`) e eventos existentes adaptados (`error.raised` quando uma instância bloqueia). Isso alimenta alertas no dashboard via o mesmo pipeline já previsto em `spec.md`.

4. **Serviço de regras → Warming Service** (checagem unidirecional): antes de deixar o fluxo de conversa privada processar uma mensagem para um agente, o motor de regras consulta o `lifecycle_status` da instância (via cache + banco de dados) para confirmar que não está `CONNECTING` ou `WARMING` — se estiver, nega a resposta com mensagem clara (ver seção 3.2).

---

## 2. Modelo de Dados

### 2.1 Nova Entidade: `whatsapp_instance`

Representa a **sessão Baileys de um número específico**, distinto do agente (persona/comportamento) que pode estar vinculado a ela.

```sql
-- Campos principais
id                              UUID PRIMARY KEY
phone_number                    VARCHAR (masked/hashed em produção)
label                           VARCHAR (ex: "instância numero 1", "chip de teste")
session_ref                     TEXT (auth state Baileys persistido em arquivo/blob)

-- Estados de transporte/conexão
connection_status               ENUM ('disconnected', 'connecting', 'qr_pending', 'connected')
connection_updated_at           TIMESTAMP

-- Estados de ciclo de vida de negócio (ver seção 3)
lifecycle_status                ENUM ('CONNECTING', 'WARMING', 'READY', 'OPERATIONAL', 'BLOCKED')
lifecycle_updated_at            TIMESTAMP

-- Vínculo com agente (nullable — instância pode existir sem agente)
linked_agent_id                 UUID NULLABLE FK agents.id

-- Rampa de aquecimento
warming_profile_id              UUID NULLABLE FK warming_profiles.id
warming_started_at              TIMESTAMP NULLABLE
warming_completed_at            TIMESTAMP NULLABLE

-- Contadores operacionais (zeram diariamente)
daily_message_limit_target      INT (ex: 30, o limite final conservador)
daily_message_limit_current     INT (resultado da rampa — aumenta gradualmente)
messages_sent_today             INT (counter de uso do dia)
messages_sent_total             INT (counter cumulativo)
last_reset_at                   DATE (última vez que counters diários foram zerados)

-- Configuração de aquecimento
excluded_from_group_warming     BOOLEAN (se true, ignora em rodadas de aquecimento de grupo)
risk_score                      FLOAT [0, 1] (calculado, 0=seguro, 1=bloqueado/iminente)

-- Metadados
created_at                      TIMESTAMP
created_by_user_id              UUID FK users.id (se multi-tenant, de contexto solo desconsidera)
deleted_at                      TIMESTAMP NULLABLE (soft delete)
```

**Índices críticos:**
- `(lifecycle_status, linked_agent_id)` — consultado frequentemente para validar antes de processar conversas.
- `(created_at, lifecycle_status)` — para dashboards/listas.
- `(connection_status, daily_message_limit_current)` — para validar se ainda pode enviar.

### 2.2 Nova Entidade: `warming_profile`

Representa o **perfil de rampa de aquecimento** — configuração de como uma instância progressivamente escalona seu volume de mensagens, de ninguém até o teto operacional conservador.

```sql
id                              UUID PRIMARY KEY
name                            VARCHAR (ex: "conservador 7 dias", "agressivo 3 dias")
workspace_id                    UUID FK (se multi-tenant, de contexto solo passa a ser constant)

-- Configuração de rampa (steps ordenados)
steps                           JSON / relação warming_profile_step (ver abaixo)
promote_to_ready_criteria       ENUM ('days', 'total_messages', 'either')
promote_to_ready_days           INT (ex: 7, após N dias na rampa → READY)
promote_to_ready_total_messages INT (ex: 100, após N mensagens trocadas → READY)

-- Limites por rodada de aquecimento
switch_partner_after_n_messages INT (ex: 10, rotaciona par de instâncias)
stop_after_n_messages           INT (ex: 50, encerra a warming_session após N)

-- Configuração de conteúdo
use_llm_content                 BOOLEAN (true → pede ao Serviço LLM, false → template)
template_messages               JSON array de strings fixas, sorteadas aleatoriamente

-- Parâmetros de intervalo (aplicado a toda a sessão)
min_interval_seconds            INT (ex: 30)
max_interval_seconds            INT (ex: 120)

created_at                      TIMESTAMP
updated_at                      TIMESTAMP
```

**Perfil conservador padrão embutido** (não editável para menos restritivo sem confirmação explícita):
- `steps`: rampa de 7 dias, começando 5 msgs/dia, dobrando a cada 2 dias, até 30 msgs/dia no dia 7.
- `promote_to_ready_criteria`: 'days' com `promote_to_ready_days = 7` (ou X mensagens sem bloqueio, o que vier primeiro).
- `switch_partner_after_n_messages`: 10 (rotaciona par a cada 10 trocas).
- `stop_after_n_messages`: 50 (encerra rodada após 50 mensagens).
- `use_llm_content`: true (tenta LLM, fallback para template se indisponível).
- `min_interval_seconds`: 30, `max_interval_seconds`: 120 (intervalo aleatório 30-120s entre mensagens).

### 2.3 Tabela auxiliar: `warming_profile_step`

Detalha os estágios progressivos de uma rampa.

```sql
id                              UUID PRIMARY KEY
warming_profile_id              UUID FK warming_profiles.id
step_order                      INT (ex: 0, 1, 2, ... ordenação)
day_offset                      INT (ex: 0 = dia 1, 1 = dia 2, etc.)
max_messages_per_day            INT (ex: 5 no dia 1, 10 no dia 2, etc.)
min_interval_seconds            INT NULLABLE (pode variar por step)
max_interval_seconds            INT NULLABLE

UNIQUE(warming_profile_id, step_order)
```

Exemplo de rampa conservadora:
- Step 0: dia 1, 5 msgs/dia.
- Step 1: dia 2-3, 10 msgs/dia.
- Step 2: dia 4-5, 20 msgs/dia.
- Step 3: dia 6-7, 30 msgs/dia (teto final).

### 2.4 Nova Entidade: `warming_session`

Registra **uma rodada de aquecimento** — uma execução do ciclo de trocas entre instâncias (privado ou grupo).

```sql
id                              UUID PRIMARY KEY
mode                            ENUM ('private', 'group')
started_at                      TIMESTAMP
ended_at                        TIMESTAMP NULLABLE

-- Participantes (private = 2, group = N)
-- Opção A: tabela join warming_session_participant (recomendado para flexibilidade)
-- Opção B: array JSON (mais simples, menos queryable)

status                          ENUM ('running', 'completed', 'stopped_by_limit', 'stopped_by_block', 'stopped_manually')
stop_reason                     VARCHAR NULLABLE (motivo textual)

messages_exchanged_count        INT (tally de mensagens trocadas nesta sessão)
created_at                      TIMESTAMP
```

**Tabela auxiliar:** `warming_session_participant`
```sql
id                              UUID PRIMARY KEY
warming_session_id              UUID FK warming_sessions.id
instance_id                     UUID FK whatsapp_instances.id
join_order                      INT (ordem de entrada na sessão; para private sempre 1 e 2)

UNIQUE(warming_session_id, instance_id)
```

### 2.5 Nova Entidade: `warming_message_log`

Log granular de cada mensagem sintética trocada — pode reutilizar a entidade de `message` já prevista em `spec.md` (módulo "Conversas"), com um campo novo `origin_type`.

```sql
id                              UUID PRIMARY KEY
warming_session_id              UUID FK warming_sessions.id

from_instance_id                UUID FK whatsapp_instances.id
to_instance_id                  UUID NULLABLE FK whatsapp_instances.id (null se modo grupo)
to_group_id                     UUID NULLABLE FK groups.id (null se modo privado)

content                         TEXT
content_source                  ENUM ('template', 'llm_generated')
llm_model_used                  VARCHAR NULLABLE (ex: "gpt-4", "claude-opus")

sent_at                         TIMESTAMP
delivery_status                 ENUM ('pending', 'sent', 'failed', 'timeout')
delivery_error_code             VARCHAR NULLABLE (ex: "TIMEOUT", "INVALID_NUMBER")

interval_since_last_ms          INT (duração em ms desde a anterior mensagem da sessão)

created_at                      TIMESTAMP
```

**Indexação crítica:**
- `(warming_session_id, sent_at)` — query histórico de uma sessão.
- `(from_instance_id, sent_at)` — auditoria por instância.

### 2.6 Nova Entidade: `instance_block_event`

Histórico de detecções de bloqueio/ban de um número.

```sql
id                              UUID PRIMARY KEY
instance_id                     UUID FK whatsapp_instances.id

detected_at                     TIMESTAMP
detection_source                ENUM ('disconnect_code', 'send_error', 'manual', 'heuristic')

raw_signal                      JSON (payload/código exato do Baileys, ex: {"code": 403, "message": "..."}
action_taken                    ENUM ('session_stopped', 'instance_marked_blocked', 'alert_raised')

triggered_by_user_id            UUID NULLABLE (se 'manual', quem marcou)
notes                           TEXT NULLABLE

created_at                      TIMESTAMP
```

**Índice crítico:**
- `(instance_id, detected_at DESC)` — histórico recente de um número para risco_score.

### 2.7 Extensão de Entidades Existentes

**Tabela `agents` (`spec.md`):**
- Campo novo: `risk_level` (já mencionado em `spec.md`, agora define melhor) — FLOAT [0, 1], calculado como função de:
  - `whatsapp_instance.risk_score` da instância vinculada (se existe).
  - Taxa de erro de envio recente (últimas 100 mensagens).
  - Número de bloqueios na histórico da instância.
  - Tempo desde conexão (instâncias novas têm risco mais alto).
  - Adesão à rampa de aquecimento (progresso sem anomalias = risco menor).

**Tabela `groups` (`spec.md`, "Tela de grupos"):**
- Campo novo: `purpose` VARCHAR (ex: "warming", "operational", "mixed") — permite filtrar grupos técnicos de aquecimento do painel operacional sem criar uma tabela nova.
- Campo novo: `warming_participant_count` INT (cache do tamanho do grupo para dashboards).

---

## 3. Máquina de Estados

### 3.1 Eixo 1: `connection_status` (Transporte)

Representa o estado da sessão Baileys em si — não é responsabilidade do Warming Service, mas do serviço de conector.

```
disconnected
    ↓ (scanner inicializa QR)
qr_pending
    ↓ (usuário escaneia QR com sucesso)
connected
    ↑↓ (pode desconectar/reconectar a qualquer momento por rede/WhatsApp)
disconnected
```

Estados:
- `disconnected`: Baileys não tem sessão ativa (auth state inválido ou não carregado).
- `connecting`: sessão está se re-estabelecendo.
- `qr_pending`: esperando usuário escanear QR no primeiro pareamento.
- `connected`: sessão Baileys ativa e saudável.

### 3.2 Eixo 2: `lifecycle_status` (Negócio)

Representa o **estado de maturidade operacional** — isto é, se a instância está apta a participar da operação (responder a humanos).

```
┌─────────────────────────────────────────────────────────────┐
│                  Máquina de Estados Principal               │
└─────────────────────────────────────────────────────────────┘

[nova instância Baileys conectada]
        │
        ▼
   CONNECTING  ◄────── [desconexão ou erro]
        │ (QR escaneado + sessão stable por N segundos)
        ▼
    WARMING  ◄────── [detecção de bloqueio]
        │ (rodando ciclos de aquecimento)
        │ (critério atingido: N dias + 0 bloqueios)
        ▼
      READY  ◄────── [detecção de bloqueio]
        │ (operador pode vincular agente, ativar)
        │ (agente ativado, começa receber requisições)
        ▼
  OPERATIONAL
        │
        └──────────────────────────────▶ [bloqueio detectado]
                                         │
                                         ▼
                                      BLOCKED (TERMINAL)
                                      (sem automação até ação manual)
```

**Transições detalhadas:**

1. **CONNECTING → WARMING**
   - Pré-condição: `connection_status = connected` stável por ≥60s, instância não deletada.
   - Ação: Warming Service inicia ciclos de aquecimento se `warming_profile` está configurado.
   - Nota: se não há `warming_profile`, instância salta direto para `READY` (aquecimento opcional).

2. **WARMING → READY**
   - Pré-condição: Critério de saída da rampa é atingido (ex.: 7 dias sem bloqueio E ≥80 mensagens trocadas).
   - Ação: Warming Service marca `lifecycle_status = READY`, registra `warming_completed_at`.

3. **READY / WARMING → OPERATIONAL**
   - Pré-condição: Operador vincula um agente (`linked_agent_id` ← agente_id) e seta `agent.active = true`.
   - Ação: Serviço de regras, ao receber mensagem, agora permite resposta (por que `lifecycle_status ≠ WARMING/CONNECTING`).

4. **[Qualquer estado ativo] → BLOCKED**
   - Pré-condição: Detecção de bloqueio acontece (ver seção 4.6).
   - Ação: Marca `lifecycle_status = BLOCKED`, gera `instance_block_event`, cancela `warming_session` em andamento, emite webhook, alerta no dashboard.
   - Saída: apenas por ação manual do operador (ex.: tentar reconectar, arquivar número).

### 3.3 Relação com `agent.active` e `agent.risk_level`

**`agent.active` (spec.md, "Tela de agentes"):**

Hoje, `agent.active` é a flag que o painel toggle para ligar/desligar automação de um agente. Com múltiplas instâncias e aquecimento, o comportamento é refinado:

- **Semântica de `agent.active = true`**: "o agente está autenticado para automatizar respostas".
- **Semântica de `lifecycle_status`**: "a instância subjacente é segura para operar".

Regra nova no Serviço de Regras (fluxo de conversa privada, passo 2):

```
if (agent.active == true) {
  if (linked_instance.lifecycle_status in [READY, OPERATIONAL]) {
    // Deixa processar resposta
    proceed_with_response()
  } else {
    // Instância está CONNECTING, WARMING, ou BLOCKED
    deny_response_with_reason(lifecycle_status)
  }
}
```

Isso garante que mesmo que o operador sete `agent.active = true` durante o aquecimento, o agente não responde até a instância estar pronta.

**`agent.risk_level` (spec.md, "Conceito de agente"):**

Algoritmo proposto (calculado diariamente ou ao eventos de bloqueio):

```
risk_level = weighted_sum(
  0.4 * instance.risk_score,
  0.3 * recent_error_rate,  // últimas 100 mensagens
  0.2 * block_events_count_7d,
  0.1 * (1 - days_since_connection / 30)
)

onde:
- instance.risk_score = f(histórico de bloqueios, taxas de erro, aderência à rampa)
- recent_error_rate = falhas / total_attempts (últimas 100)
- block_events_count_7d = # eventos de bloqueio nos últimos 7 dias
- days_since_connection = quantos dias a instância existe (novos números = risco maior)

Resultado: [0, 1] mapeado para color-coded dashboard e alertas.
```

---

## 4. Regras de Negócio Portadas do Repositório de Referência

### 4.1 Intervalo Mínimo/Máximo entre Mensagens

**Configuração:** `warming_profile.min_interval_seconds` e `warming_profile.max_interval_seconds` (ou por `warming_profile_step` se variar).

**Implementação:** O Warming Service **nunca dorme localmente no worker**. Em vez disso:

1. Scheduler central (job periódico, ex.: a cada 1 segundo) consulta todas as `warming_session` ativas.
2. Para cada sessão, calcula o próximo envio como `now + random(min_interval, max_interval)`.
3. Enfileira um job `send_warming_message` com timestamp de agendamento (`scheduled_at`).
4. Um worker dedicado processa a fila, executando jobs que atingiram `scheduled_at ≤ now`.

**Por quê?** Com Baileys paralelo, N sessões rodando ao mesmo tempo podem não respeitar intervalos se cada uma dorme localmente — o scheduler centralizado garante coordenação.

**Exemplo de fila (Redis):**
```
warming:messages:queue
  └─ job: {
       id: UUID,
       from_instance_id: UUID,
       to_instance_id: UUID,
       message_content: "...",
       scheduled_at: unix_timestamp,
       warming_session_id: UUID
     }
```

### 4.2 Rotação de Conta (switch_partner_after_n_messages)

**Configuração:** `warming_profile.switch_partner_after_n_messages` (ex.: 10).

**Fluxo:**

1. Warming Service cria uma `warming_session` com dois `whatsapp_instance` selecionados aleatoriamente (ou round-robin), ambos não-`BLOCKED` e não-`excluded_from_group_warming`.
2. Incrementa `warming_session.messages_exchanged_count` a cada envio bem-sucedido.
3. Quando `messages_exchanged_count >= switch_partner_after_n_messages`:
   - Marca `warming_session.status = completed`.
   - Registra `warming_session_log` com tally final.
   - Inicia nova `warming_session` com novo par (exclui o par anterior por um curto período, ex.: 2 minutos, para evitar repetição imediata).

### 4.3 Máximo de Mensagens por Instância/Dia (Teto Compartilhado)

**Configuração:** `whatsapp_instance.daily_message_limit_current` (materialização diária da rampa).

**Implementação:**

- O contador `messages_sent_today` é compartilhado entre **tráfego de aquecimento e operacional**. Uma mensagem é uma mensagem, independente de origem.
- Scheduler consulta `messages_sent_today < daily_message_limit_current` antes de enfileirar qualquer job de envio (aquecimento ou operacional).
- Se o teto é atingido, qualquer novo job fica em fila aguardando reset diário (meia-noite UTC ou timezone do operador).

**Exemplo:** Uma instância tem `daily_message_limit_target = 30` (limite conservador final). No dia 1 da rampa, `daily_message_limit_current = 5`. Se às 13h a instância já trocou 5 mensagens de aquecimento, qualquer novo envio (de aquecimento ou operacional) fica em fila até meia-noite.

### 4.4 Parar após X Mensagens por Sessão (stop_after_n_messages)

**Configuração:** `warming_profile.stop_after_n_messages` (ex.: 50).

**Fluxo:**

1. `warming_session.messages_exchanged_count` é incrementado a cada envio bem-sucedido.
2. Se `messages_exchanged_count >= stop_after_n_messages`:
   - Marca `warming_session.status = completed`.
   - Fecha a sessão (sem iniciar nova automaticamente — deixa passar tempo antes de próxima rodada, configurável).

**Diferença vs. 4.2:** `switch_partner` é rotação de par (sessão pode continuar com outro par); `stop_after_n_messages` é término da sessão (repouso).

### 4.5 Ignorar Instância durante Aquecimento em Grupo (excluded_from_group_warming)

**Configuração:** `whatsapp_instance.excluded_from_group_warming` (boolean).

**Implementação:**

- Quando Warming Service seleciona participantes para uma `warming_session (mode = 'group')`, filtra instâncias que têm essa flag = `true`.
- Operador pode toggle essa flag via painel, instance-by-instance.

**Exemplo:** Instância A está fazendo aquecimento em privado com Instância B, mas não deve ser incluída no grupo técnico de aquecimento → seta `excluded_from_group_warming = true`.

### 4.6 Detecção de Bloqueio/Ban e Parada Automática

Este é o ponto **mais crítico de adaptação** entre Selenium (DOM-based) e Baileys (protocol-based).

**Sinais disponíveis via Baileys:**

1. **Evento de `connection.update` com `lastDisconnect`:**
   - Alguns códigos de erro (ex: `DisconnectReason.loggedOut`, `DisconnectReason.connectionClosed` repetido) indicam desconexão forçada, possivelmente por ban.
   - Baileys expõe uma estrutura `lastDisconnect: { error: {status, reason}, wasClean, willReconnect }` — estudar a versão da lib usada para mapear os códigos exatos.

2. **Falhas de envio (sendMessage exception):**
   - Padrão: após sucesso contínuo, de repente 100% de falha (ex.: `ERROR_SENDING_MESSAGE`, `INVALID_RECIPIENT`, `RATE_LIMITED`).
   - Heurística: se taxa de falha salta de <10% para >80% em 5 minutos (10 tentativas consecutivas), sinal potencial de bloqueio local ou de número (rate limit severo).

3. **Reconexões anômalas:**
   - Quedas de socket repetidas em janela curta (ex.: 3+ desconexões em 10 minutos), enquanto rede parece ok (ex.: outro número da pool está fine).
   - Heurística: em vez de reconectar automaticamente (requisito 5 de `requirements.md` se refere à reconexão resiliente, mas essa é para queda isolada), marcar para revisão manual.

**Algoritmo de Detecção:**

```
function check_block_signal(instance_id, signal) {
  // signal pode ser: disconnect_event, send_failure_rate, manual_report
  
  if (signal.type == 'disconnect_code') {
    if (signal.code in KNOWN_BAN_CODES) {  // ex: loggedOut, 401, 403
      trigger_block(instance_id, 'disconnect_code', signal)
      return
    }
  }
  
  if (signal.type == 'send_failure') {
    if (signal.recent_failure_rate > 0.8 && signal.prior_success_rate > 0.8) {
      // Taxa de falha saltou
      trigger_block(instance_id, 'send_error', signal)
      return
    }
  }
  
  if (signal.type == 'manual') {
    trigger_block(instance_id, 'manual', signal)
    return
  }
}

function trigger_block(instance_id, source, signal) {
  instance = find_instance(instance_id)
  
  // Registra o evento
  create(instance_block_event, {
    instance_id: instance_id,
    detected_at: now(),
    detection_source: source,
    raw_signal: signal,
    action_taken: 'instance_marked_blocked'
  })
  
  // Muda estado
  instance.lifecycle_status = 'BLOCKED'
  instance.save()
  
  // Cancela sessões em andamento
  for session in active_warming_sessions(instance_id) {
    session.status = 'stopped_by_block'
    session.stop_reason = "Instância bloqueada: " + source
    session.ended_at = now()
    session.save()
  }
  
  // Se há agente vinculado, marca como inativo (safety)
  if (instance.linked_agent) {
    instance.linked_agent.active = false
    instance.linked_agent.save()
  }
  
  // Publica evento webhook
  publish_webhook('instance.blocked', {
    event_id: uuid(),
    instance_id: instance_id,
    detected_at: now(),
    detection_source: source,
    raw_signal: signal
  })
  
  // Cria alerta em tempo real
  broadcast_alert({
    level: 'critical',
    title: "Instância bloqueada: " + instance.label,
    message: "Detecção: " + source,
    instance_id: instance_id,
    dismiss_action: "archive_instance | try_reconnect"
  })
}
```

**Importante:** `trigger_block` é **idempotente** (pode ser chamado 2x para a mesma instância sem efeito) e **atomic** — se falhar meio-caminho (ex.: erro ao salvar estado), deixa o banco em estado consistente (ex: bloqueia a instância mesmo que o webhook falhe).

**Risco:** A heurística de detecção é imprecisa (pode gerar falso positivo em caso de falta de rede local, falso negativo em caso de ban silencioso onde a conta fica online mas rejeita mensagens). **Spike técnico prioritário na Fase 1**: validar contra versão real de Baileys quais eventos/códigos são distinguíveis e confiáveis.

---

## 5. Orquestração N-para-N: Instâncias Conversando entre Si

O núcleo do módulo: **instâncias trocam mensagens entre si**, não reagindo a terceiros.

### 5.1 Fluxo do Ciclo de Aquecimento (Modo Privado)

```
┌──────────────────────────────────────────────────────────────┐
│  Warming Scheduler Tick (ex: a cada 10 segundos)             │
└──────────────────────────────────────────────────────────────┘
  │
  ├─ Query: instâncias elegíveis
  │  (lifecycle_status IN [WARMING, READY, OPERATIONAL],
  │   não em warming_session ativa,
  │   daily_message_limit_current não atingido)
  │
  ├─ Para cada par de instâncias elegíveis (A, B):
  │    │
  │    ├─ Cria warming_session (mode='private', participants=[A, B])
  │    │
  │    ├─ Calcula intervalo aleatório [min, max]
  │    │
  │    ├─ Enfileira job send_warming_message:
  │    │  {
  │    │    from: A,
  │    │    to: B,
  │    │    message: template ou LLM,
  │    │    scheduled_at: now + intervalo,
  │    │    session_id: UUID
  │    │  }
  │    │
  │    └─ Retorna ao scheduler (não bloqueia)
  │
  ├─ Query: warming_sessions ativas, procura contadores que atingiram limites
  │
  ├─ Para cada sessão que atingiu switch_partner_after_n_messages:
  │    │
  │    ├─ Marca status = 'completed'
  │    └─ Próximo tick pode iniciar novo par
  │
  └─ Retorna ao sleep até próximo tick
```

Fluxo do **Worker de Envio** (processa fila):

```
┌──────────────────────────────────────────────────────────────┐
│  Worker de Fila (monitorando warming:messages:queue)          │
└──────────────────────────────────────────────────────────────┘
  │
  ├─ Poll: jobs com scheduled_at <= now
  │
  ├─ Para cada job:
  │    │
  │    ├─ Lock na instância origem (redis lock, TTL 30s)
  │    │
  │    ├─ Valida:
  │    │  - instância origem não foi BLOCKED desde enfileiramento
  │    │  - messages_sent_today < daily_message_limit_current
  │    │
  │    ├─ Se válido, chama Baileys Service sendMessage:
  │    │  └─ Await response {status: sent|failed, error_code?}
  │    │
  │    ├─ Registra warming_message_log:
  │    │  {
  │    │    from_instance: job.from,
  │    │    to_instance: job.to,
  │    │    content: job.message,
  │    │    sent_at: now,
  │    │    delivery_status: response.status,
  │    │    delivery_error_code: response.error_code
  │    │  }
  │    │
  │    ├─ Incrementa contadores:
  │    │  - warming_session.messages_exchanged_count
  │    │  - from_instance.messages_sent_today
  │    │  - from_instance.messages_sent_total
  │    │
  │    ├─ Se envio falhou (response.status = failed):
  │    │  └─ Checa heurística de bloqueio (seção 4.6)
  │    │     └─ Se dispara, chama trigger_block()
  │    │
  │    ├─ Se sucesso, calcula próximo intervalo e enfileira
  │    │  novo job (ping-pong entre A e B)
  │    │
  │    ├─ Release lock
  │    │
  │    └─ Move job para completed/acked
  │
  └─ Volta ao sleep até próximo poll
```

### 5.2 Fluxo do Ciclo de Aquecimento (Modo Grupo)

Equivalente ao modo privado, mas:

1. Warming Session envolve **N instâncias** (ex: 5 números) num **grupo real** (não privado).
2. Grupo deve ser provisionado previamente pelo operador e ter `purpose = 'warming'` no banco.
3. Todas as instâncias devem ser membros do grupo (checagem antes de criação de sessão).
4. Jobs são `{from: A, to: group_id, message: ...}` em vez de `to: specific_instance`.
5. Contadores são os mesmos (`daily_message_limit_current` compartilhado).

**Vantagem:** testa comportamento de uma instância em um ambiente mais realista (grupo com múltiplas pessoas/bots).

---

## 6. Papel do LLM no Conteúdo das Mensagens

O módulo **não acopla a nenhum provedor de LLM diretamente** — delega integralmente ao `Serviço de LLM` já especificado em `spec.md`.

### 6.1 Desenho

```
┌────────────────────────────────────┐
│  Warming Service                   │
│  (decide: enviar agora? com quê?)  │
└────────┬─────────────────────────────┘
         │
         ├─ if warming_profile.use_llm_content:
         │     │
         │     └─ Chama Serviço LLM com prompt:
         │        "Gere uma mensagem casual de continuidade de conversa
         │         entre dois amigos, tom neutro, sem tópicos sensíveis,
         │         2-3 linhas. Evite patterns robotizados."
         │
         ├─ else:
         │     │
         │     └─ Sorteia string do template fixo
         │        (warming_profile.template_messages array)
         │
         └─ Enfileira job com message_content resolvido
```

### 6.2 Implementação com Agente Técnico Interno

Para reaproveitar 100% da infraestrutura de agente já existente (modelo de dados, cache de LLM, limite de custo, métricas), o Warming Service pode usar um **agente técnico dedicado a aquecimento**:

```sql
-- Agente técnico interno
INSERT INTO agents (
  id, name, username, role,
  personality, tone, writing_style,
  llm_provider, llm_model, llm_api_key_ref,
  temperature, max_tokens,
  active, risk_level,
  created_at
) VALUES (
  'warming-agent-uuid', 'Aquecimento', 'warming_bot',
  'warming_message_generator',
  'Casual e natural', 'Neutro', 'Conversacional',
  'openai', 'gpt-4-turbo', 'key_ref_openai_shared',
  0.7, 150,
  true, 0.0,
  now()
);
```

**Vantagem:** Chamadas ao LLM usam a mesma pipeline: `Serviço de LLM` consulta o provedor, cacheia resultado (prompt + response), e o custo é registrado no mesmo sistema de métricas de agente.

**Fallback:** Se o LLM falhar ou não estiver configurado, o Warming Service cai para `template` — garantindo que o aquecimento nunca para por indisponibilidade de IA.

---

## 7. Integração com Dashboard/Painel

### 7.1 Alterações ao Dashboard (spec.md, módulo 1)

Novo cartão: **"Instâncias em Aquecimento"**

```
┌─────────────────────────────────────────┐
│ INSTÂNCIAS EM AQUECIMENTO               │
├─────────────────────────────────────────┤
│ Aquecendo:       3                       │
│ Prontas:         1                       │
│ Bloqueadas:      0                       │
│ Operacionais:    5                       │
│                                          │
│ Progresso de Rampa (Instância A)         │
│ ████░░░░░░░░░░░░░░ Dia 4 de 7           │
│ 23 / 30 mensagens do teto de hoje        │
│                                          │
│ ⚠️  Instância D: Detectado bloqueio há 2h │
│ 🔴 Instância E desconectada (reconectar?) │
└─────────────────────────────────────────┘
```

### 7.2 Nova Tela: "Instâncias WhatsApp" (dentro de Agentes ou Integrações)

**Gap identificado em `spec.md`:** não há tela dedicada a gerir instâncias de conexão. Proposta: viver como sub-seção da "Tela de agentes" ou como nova tela em "Integrações".

Layout sugerido:

- **Lista de instâncias:** tabela com colunas:
  - Label (nome da instância)
  - Número (masked, ex: +55 11 9****-5678)
  - Status de Conexão (connected, qr_pending, disconnected)
  - Lifecycle Status (CONNECTING, WARMING, READY, OPERATIONAL, BLOCKED)
  - Agente vinculado (ex: "Bot de Suporte" ou "-")
  - Mensagens hoje / limite diário
  - Ações: [Pausar] [Reiniciar] [Excluir] [Detalhes]

- **Painel de instância (detail view):**
  - Informações básicas: label, número, datas de criação/conexão.
  - Warming profile aplicado (nome, critério de saída, progresso).
  - Histórico de `instance_block_event` (últimos 10 eventos).
  - Graph: taxa de erro por dia (últimos 7 dias).
  - Toggle: `excluded_from_group_warming`.
  - Botão: "Marcar como bloqueado" (manual override, se needed).

### 7.3 Novas Métricas (spec.md, módulo 7 "Métricas")

Adicionar à seção "Métricas avançadas":

- **Mensagens de aquecimento por dia** (por instância, por grupo técnico, total).
- **Distribuição de instâncias por estágio de rampa** (X em CONNECTING, Y em WARMING, Z em READY, ...).
- **Taxa de sucesso de aquecimento** (% de instâncias que chegam a READY sem bloqueio).
- **Tempo médio até READY** (duração média da rampa, em dias).
- **Taxa de bloqueio** (% de instâncias que foram bloqueadas em N dias).
- **Custo de LLM de aquecimento** (substring de "Custos de LLM", se `use_llm_content = true`).

### 7.4 Novos Eventos de Webhook

Seguindo o padrão de `spec.md` (13 eventos já definidos):

- **`instance.warming_started`**
  ```json
  {
    "event_id": "evt_...",
    "event_type": "instance.warming_started",
    "timestamp": "2026-08-20T10:30:00Z",
    "instance_id": "inst_...",
    "warming_profile_id": "prof_...",
    "lifecycle_status": "WARMING"
  }
  ```

- **`instance.warming_completed`**
  ```json
  {
    "event_id": "evt_...",
    "event_type": "instance.warming_completed",
    "timestamp": "2026-08-20T14:45:00Z",
    "instance_id": "inst_...",
    "days_elapsed": 7,
    "total_messages": 156,
    "lifecycle_status": "READY"
  }
  ```

- **`instance.blocked`**
  ```json
  {
    "event_id": "evt_...",
    "event_type": "instance.blocked",
    "timestamp": "2026-08-20T13:22:00Z",
    "instance_id": "inst_...",
    "detection_source": "send_error",  // ou "disconnect_code", "manual"
    "raw_signal": { "code": 403, "message": "Rate Limited" },
    "lifecycle_status": "BLOCKED"
  }
  ```

Payload mínimo (reutilizando campos de `spec.md`):
- `event_id`, `event_type`, `timestamp` — já padrão.
- `instance_id` — em vez de `agent_id` (ou ambos, se agente vinculado).
- `workspace_id` — se multi-tenant (contexto solo: constant).

---

## 8. Riscos Específicos de Baileys Paralelo (vs. Selenium) e Mitigações

### 8.1 Race Conditions entre Sessões Paralelas

**Risco:** Dois jobs decidindo enviar pela mesma instância simultaneamente, estourando `daily_message_limit_current`.

**Mitigação:** Scheduler central com **lock por instância** antes de enfileirar qualquer job:

```python
def enqueue_warming_job(instance_id, ...):
    lock = redis.lock(f"warming:lock:{instance_id}", timeout=30)
    if not lock.acquire(blocking=True, timeout=5):
        log_warn(f"Couldn't acquire lock for {instance_id}, skip this tick")
        return
    
    try:
        instance = db.get_instance(instance_id)
        if instance.messages_sent_today < instance.daily_message_limit_current:
            queue.enqueue(send_job, ...)
            instance.messages_sent_today += 1
            db.save(instance)
    finally:
        lock.release()
```

Lock é curto (30s) — só garante atomicidade da checagem + incremento, não bloqueia o envio real.

### 8.2 Detecção de Bloqueio Menos Determinística que DOM

**Risco:** Heurística de detecção (taxa de falha, códigos de erro) pode gerar falso positivo (marcar BLOCKED por queda de rede comum) ou falso negativo (não detectar ban silencioso).

**Mitigação:**

1. **Spike técnico prioritário na Fase 1:** validar contra versão real de Baileys quais eventos/códigos são confiáveis. Exemplo: se `DisconnectReason.loggedOut` é sempre ban, ou pode ser logout local?
2. **Feedback manual:** operador pode marcar instância como bloqueada manualmente (via painel), sem depender só de heurística automática.
3. **Conservative default:** errar para bloqueio (falso positivo) é mais seguro que não bloqueiar (falso negativo, risco de ban da conta). Se operador acha que foi falso positivo, pode tentar reconectar via painel.
4. **Audit trail:** `instance_block_event.raw_signal` registra a estrutura exata do erro — permite refinar heurística retrospectivamente com dados reais.

### 8.3 Escalabilidade de Infraestrutura por Sessão

**Risco:** Cada sessão Baileys ativa é um processo/conexão persistente com estado em disco (auth state) — N instâncias em paralelo = N×(memória, CPU, I/O), mais pesado que N abas de um único navegador Selenium.

**Mitigação:** Pergunta em aberto de `requirements.md` (hospedagem, quantidade real de números). Design deste módulo suporta N sem limite artificial no schema. Escalabilidade real depende:
- Se backend + Baileys rodarem no mesmo processo: limite é memória local + conexões Baileys.
- Se Baileys rodar como serviço separado: pode escalar horizontalmente (ex: 2-3 instâncias de `Serviço Baileys` + load balancer, cada uma com seu pool de conexões).

**Spike técnico:** dimensionamento (Fase 1) — quantas instâncias Baileys cabem em 1 processo/VPS antes de saturar?

### 8.4 Padrão de Tráfego Sintético Detectável

**Risco:** Mensagens trocadas apenas dentro do pool do próprio operador, em intervalos programáticos mesmo com jitter, formam padrão estatístico fechado — pode ser reconhecível como bot/automação por análise de MetaData.

**Mitigação:**

- Variar conteúdo (LLM gera coisas diferentes, não template fixo).
- Variar pares (rotação frequente de parceiros).
- Respeitar limites baixos (poucas dezenas/dia = menor footprint estatístico).
- **Não prometendo segurança formal** — é redução de risco, não eliminação. Documentação deve deixar explícito: "o aquecimento reduz probabilidade de detecção, mas não garante que o número não será banido por análise comportamental."

### 8.5 Acoplamento do Teto Diário Operacional + Aquecimento

**Risco:** Se teto diário não for compartilhado, o sistema pode permitir que aquecimento + operação juntos excedam o limite conservador pretendido.

**Mitigação:** Um único contador `daily_message_limit_current` por instância/dia, compartilhado entre todas as fontes de mensagem. Já especificado na seção 2.1 e implementado via lock + guardrail no worker.

---

## 9. Decisões de Produto Deixadas em Aberto

Perguntas que **não** precisam ser resolvidas neste documento de design, mas aparecem como scope creep em conversas futuras:

1. **Manutenção passiva de instâncias operacionais:** depois que uma instância atinge `READY` e entra em operação (recebendo mensagens de humanos), deve ela continuar recebendo "dose leve" de aquecimento para manter saúde? Design permite, produto não decidiu.

2. **Failover automático em bloqueio:** se número A é bloqueado, há expectativa de reconectar automático número B? Design registra o evento, dashboard sinaliza, mas ação é manual por padrão. Exceção: se `warmup_profile.fallback_instance_pool` está configurado, implementar lógica de round-robin automático (produto não decidiu ainda).

3. **Contenção de aquecimento em operação:** se o operador está muito ativo (muitas respostas manuais), deve o aquecimento pausar temporariamente para não competir? Design permite via flag, produto não decidiu default.

---

## 10. Referências Cruzadas

Este design se apoia em e expande três documentos:

- [spec.md](spec.md) — Especificação original da plataforma (seções críticas: "Arquitetura sugerida", "Fluxo de conversa", "Campos do agente").
- [requirements.md](requirements.md) — Requisitos e decisões fechadas (conector Baileys, apetite de risco conservador, requisito não-funcional 3 de aquecimento).
- [maturador-de-chips](https://github.com/JonasCaetanoSz/maturador-de-chips) — Repositório de referência (lógica de negócio portada, regras de intervalo/rotação/bloqueio).

---

## Próximo Passo

Com este design aprovado, o próximo passo é `/sc:design` ou `/sc:workflow`:

- **`/sc:design`**: desenhar schema de banco de dados concreto, contrato de API/fila entre serviços.
- **`/sc:workflow`**: quebrar em épicos/histórias de implementação e sequenciar dentro do plano de 4 fases de `spec.md`.
