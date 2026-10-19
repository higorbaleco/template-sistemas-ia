# 📋 SPECS & REQUISITOS COMPLETOS
## Solução Automação WhatsApp + Simples Dental

**Versão:** 1.0  
**Data:** 2026-10-19  
**Status:** Especificação Completa  
**Autor:** Claude Haiku + Higor Plens

---

## 📑 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Requisitos Funcionais](#requisitos-funcionais)
3. [Requisitos Técnicos](#requisitos-técnicos)
4. [Arquitetura](#arquitetura)
5. [Componentes](#componentes)
6. [Fluxos Detalhados](#fluxos-detalhados)
7. [Banco de Dados](#banco-de-dados)
8. [APIs e Integrações](#apis-e-integrações)
9. [Estrutura de Arquivos](#estrutura-de-arquivos)
10. [Implementação](#implementação)
11. [Testes](#testes)
12. [Deployment](#deployment)

---

## 🎯 VISÃO GERAL

### Objetivo
Automatizar comunicação com pacientes via WhatsApp usando inteligência artificial (GPT Maker) para confirmar agendamentos, enviar lembretes de aniversário, negociar orçamentos e agendar follow-ups baseado em dados do Simples Dental.

### Escopo
- ✅ Confirmação diária de agendamentos
- ✅ Lembrete de aniversariantes
- ✅ Alerta de orçamentos em aberto
- ✅ Follow-up de procedimentos (6 meses)
- ✅ Retorno periódico (profilaxia)
- ✅ Respostas conversacionais via IA
- ✅ Histórico de conversas
- ✅ Logs e monitoramento

### Não Está no Escopo (v1.0)
- ❌ Agendamento direto via WhatsApp
- ❌ Pagamento via WhatsApp
- ❌ Interface administrativa
- ❌ Análise preditiva
- ❌ Machine learning de preferências

---

## ✅ REQUISITOS FUNCIONAIS

### RF-1: Confirmação de Agendamento (Diário)

**Trigger:** 09:00 AM todos os dias

**Fluxo:**
1. Sistema busca agendamentos de hoje (status = não confirmado)
2. Para cada agendamento:
   - Dispara mensagem no WhatsApp
   - Aguarda resposta do paciente
   - Agente IA processa resposta
   - Se SIM: marca como confirmado
   - Se NÃO: oferece remarcar
   - Se sem resposta: reenviar em 1h e 30min antes

**Mensagem:**
```
"Olá {paciente_nome}! 👋 Confirme sua presença na consulta 
de hoje às {horario} com {profissional_nome} para {procedimento}. 
Responda SIM ou NÃO"
```

**Resultado Esperado:**
- Agendamento marcado como confirmado em Simples Dental
- Histórico de conversa persistido
- Resposta conversacional enviada

**Sucesso:** Taxa de confirmação ≥ 70%

---

### RF-2: Lembrete de Aniversariante (Diário)

**Trigger:** 08:00 AM todos os dias

**Fluxo:**
1. Sistema busca pacientes aniversariantes de hoje
2. Para cada paciente:
   - Dispara mensagem de parabéns
   - Oferece agendamento/promoção
   - Se responde: pode agendar
   - Se não responde: nenhuma ação adicional

**Mensagem:**
```
"🎉 Feliz Aniversário {paciente_nome}! 
Aproveite o dia especial! 

Que tal agendar uma avaliação? 
Temos super promoção pra você este mês! 🎁"
```

**Resultado Esperado:**
- Mensagem enviada
- Se paciente responde: agente oferece agendamento
- Novo agendamento criado se paciente aceitar

**Sucesso:** Taxa de resposta ≥ 30%, Conversão para agendamento ≥ 20%

---

### RF-3: Alerta de Orçamento em Aberto (Semanal)

**Trigger:** Toda segunda-feira 10:00 AM

**Fluxo:**
1. Sistema busca orçamentos abertos há 7+ dias
2. Para cada orçamento:
   - Dispara mensagem com contexto
   - Agente oferece parcelamento
   - Se paciente aprova: status = aprovado
   - Se quer negociar: agente oferece opções
   - Se rejeita: log para vendedor

**Mensagem:**
```
"Oi {paciente_nome}! 👋 Seu orçamento de {procedimento} 
no valor de R$ {valor} está aguardando sua aprovação.

Quer conversar sobre as opções de pagamento?"
```

**Resultado Esperado:**
- Orçamento pode ser aprovado via WhatsApp
- Agente oferece parcelamento
- Histórico de negociação registrado

**Sucesso:** Taxa de aprovação ≥ 50%

---

### RF-4: Follow-up de Procedimento (Automático)

**Trigger:** 6 meses após procedimento registrado

**Fluxo:**
1. Sistema detecta procedimento (clareamento, implante, etc)
2. Agenda job para 6 meses depois
3. Quando chega a data:
   - Dispara mensagem de retorno
   - Oferece agendamento
   - Agente cria novo agendamento se aceitar

**Mensagem:**
```
"Olá {paciente_nome}! 👋 Você fez {procedimento} com a gente 
há 6 meses. Como está o resultado? 😁

Que tal agendar um retorno pra verificar como ficou? 
Aproveita que estamos com cupom de R$ 100 de desconto! 🎁"
```

**Resultado Esperado:**
- Follow-up disparo automático em data correta
- Agendamento criado se paciente aceitar
- Desconto aplicado

**Sucesso:** Taxa de retorno ≥ 40%

---

### RF-5: Retorno Periódico (Profilaxia)

**Trigger:** Configurável (ex: 6 meses após última limpeza)

**Fluxo:**
1. Sistema cria reminder 30 dias antes
2. Dispara mensagem inicial
3. Se não responde: reenviar 1 semana depois
4. Se venceu: último aviso urgente

**Mensagem (30 dias antes):**
```
"Oi {paciente_nome}! 👋 Sua profilaxia vence em 1 mês ({data}).
Quer agendar agora pra não atrasar a manutenção do seu sorriso?"
```

**Resultado Esperado:**
- Aviso antecipado
- Fácil agendamento via WhatsApp
- Taxa de adesão ≥ 60%

---

## 🔧 REQUISITOS TÉCNICOS

### RT-1: Integrações Obrigatórias

- **Simples Dental API**
  - ✅ GET /consultas (listar agendamentos)
  - ✅ GET /pacientes/{id} (dados paciente)
  - ✅ GET /dashboard/ver/pacientes (aniversariantes)
  - ✅ GET /pacientes/{id}/orcamentos (orçamentos)
  - ✅ Autenticação via sessão Playwright
  - ❌ PATCH /consultas/{id} (confirmar) - A IMPLEMENTAR
  - ❌ POST /consultas (criar agendamento) - A IMPLEMENTAR

- **Evolution API (WhatsApp)**
  - ✅ POST /message/sendText (enviar mensagem)
  - ✅ Webhook para receber mensagens
  - ✅ Bearer token authentication

- **GPT Maker**
  - ✅ POST /chat (chamar agente)
  - ✅ Passar contexto e tools
  - ✅ Processar tool_calls

### RT-2: Linguagem & Runtime

- **Runtime:** Node.js v18+
- **Linguagem:** JavaScript (ES6+)
- **Package Manager:** npm

### RT-3: Dependências

```json
{
  "axios": "^1.6.0",
  "dotenv": "^16.4.5",
  "node-schedule": "^2.1.1",
  "express": "^4.18.2",
  "better-sqlite3": "^11.3.0",
  "playwright": "^1.47.0"
}
```

### RT-4: Armazenamento de Dados

**Opção 1 (Recomendada para MVP):** JSON local
- Dados em arquivos JSON
- Sem dependência de servidor
- Custo R$ 0

**Opção 2 (Escalabilidade):** PostgreSQL
- BD relacional
- Melhor para múltiplas clínicas
- Custo R$ 20-50/mês

### RT-5: Deployment

**Opção 1:** Local (seu PC/servidor)
- Cron job agendado
- Precisa estar ligado
- Custo R$ 0

**Opção 2:** Google Cloud Functions
- Roda 24/7
- Gratuito até 2M invocações/mês
- Custo R$ 0-50/mês

### RT-6: Segurança

- ✅ Variáveis de ambiente (.env)
- ✅ API keys nunca em código
- ✅ HTTPS para webhooks
- ✅ Verificação de token em webhook
- ✅ Logs sem dados sensíveis

### RT-7: Performance

- ✅ Processamento de até 100 mensagens/dia
- ✅ Resposta da IA em < 5 segundos
- ✅ Webhook response em < 3 segundos

### RT-8: Disponibilidade

- ✅ 99% uptime desejado
- ✅ Retry automático em falhas
- ✅ Alertas por email em erro

---

## 🏗️ ARQUITETURA

### Componentes Principais

```
┌──────────────────────────────────┐
│   SIMPLES DENTAL RPA             │
│   (Existente)                    │
│   - 75+ endpoints documentados   │
│   - 13+ funções prontas          │
│   - Autenticação automática      │
└──────────────────────────────────┘
           ⬇️ (HTTPS)
┌──────────────────────────────────┐
│   SCHEDULER (Node.js)            │
│   - Cron Jobs                    │
│   - 5 triggers diários           │
└──────────────────────────────────┘
           ⬇️
┌──────────────────────────────────┐
│   API PROCESSOR (Express)        │
│   - Webhook receiver             │
│   - Contexto enrichment          │
│   - Tool executor                │
└──────────────────────────────────┘
           ⬇️ (HTTPS)
┌──────────────────────────────────┐
│   GPT MAKER                      │
│   - Agente IA                    │
│   - Processamento conversacional │
│   - Tool calls                   │
└──────────────────────────────────┘
           ⬇️ (HTTPS)
┌──────────────────────────────────┐
│   EVOLUTION API                  │
│   - Disparador WhatsApp          │
│   - Webhook para respostas       │
└──────────────────────────────────┘
           ⬇️
          PACIENTE (WhatsApp)
```

### Fluxo de Dados

```
1. SCHEDULER
   Cron: 09:00 AM
   → Busca dados (Simples Dental API)
   → Dispara mensagens (Evolution API)
   → Salva estado (JSON local)

2. EVOLUTION WEBHOOK
   Webhook recebe resposta
   → POST /api/webhook
   → Enriquece contexto
   → Chama GPT Maker

3. GPT MAKER
   Processa mensagem
   → Entende intenção
   → Executa tools
   → Retorna resposta

4. API PROCESSOR
   Executa tools
   → Confirma agendamento (Simples Dental)
   → Atualiza estado (JSON)
   → Envia resposta (Evolution API)

5. EVOLUTION API
   Envia resposta
   → Volta para paciente
   → Conversa continua
```

---

## 📦 COMPONENTES

### 1. Scheduler (Node.js + node-schedule)

**Arquivo:** `src/scheduler.js`

**Responsabilidades:**
- Agendar 5 jobs diários
- Executar em horário exato
- Logging de execução
- Tratamento de erros

**Jobs:**
```
09:00 - confirmar-agendamentos
08:00 - enviar-aniversariantes
10:00 (segunda) - alerta-orcamentos
automático - disparar-follow-ups
automático - alertar-retorno-periodico
```

### 2. API Processor (Express.js)

**Arquivo:** `src/api-processor.js`

**Endpoints:**

#### POST /webhook/evolution
```
Body:
{
  "data": {
    "messagesData": {
      "messages": [{...}]
    }
  }
}

Response:
{
  "success": true,
  "message": "Webhook processado"
}
```

#### POST /api/disparar-mensagem
```
Body:
{
  "pacienteId": 26926607,
  "telefone": "5511987654321",
  "tipo": "confirmacao_agendamento",
  "contexto": {...}
}

Response:
{
  "sessionId": "conv_26906607_...",
  "messageId": "msg_123",
  "sent": true
}
```

### 3. Data Storage (JSON local)

**Arquivos:**

```
data/
├─ conversas.json
│  {
│    "2026-10-19T09:30Z": {
│      "pacienteId": 26906607,
│      "telefone": "5511987654321",
│      "tipo": "confirmacao_agendamento",
│      "historico": [
│        { "role": "assistant", "content": "Olá João..." },
│        { "role": "user", "content": "Sim, vou sim!" }
│      ],
│      "status": "resolvido"
│    }
│  }
│
├─ agendamentos_confirmados.json
│  {
│    "2026-10-19T09:30Z": [
│      {
│        "agendamentoId": 324826659,
│        "pacienteId": 26906607,
│        "confirmado": true,
│        "data_confirmacao": "2026-10-19T09:35Z"
│      }
│    ]
│  }
│
├─ follow_ups.json
│  {
│    "2026-10-19T09:30Z": [
│      {
│        "pacienteId": 26906607,
│        "tipo": "clareamento",
│        "data_procedimento": "2026-04-19",
│        "data_seguimento": "2026-10-19",
│        "status": "enviado"
│      }
│    ]
│  }
│
└─ log.json
   {
     "2026-10-19T09:00Z": {
       "job": "confirmar-agendamentos",
       "status": "sucesso",
       "agendamentos": 5,
       "enviados": 5,
       "tempo_ms": 2345,
       "erros": 0
     }
   }
```

### 4. GPT Maker Integration

**Função:** `src/integrations/gptmaker.js`

**Responsabilidades:**
- Chamar API GPT Maker
- Passar contexto correto
- Processar tool_calls
- Tratar erros

---

## 🔄 FLUXOS DETALHADOS

### Fluxo 1: Confirmação de Agendamento (Completo)

```
[09:00 AM]
SCHEDULER inicia job: confirmar-agendamentos
  ↓
Busca agendamentos de hoje
  GET /consultas?startDh=TODAY&status=pending
  ← Array com 5 agendamentos
  ↓
Para cada agendamento:
  Busca dados paciente
    GET /pacientes/{id}
    ← { nome, telefone, email, ... }
  ↓
  Monta mensagem
    "Olá João! 👋 Confirme sua presença..."
  ↓
  Dispara no WhatsApp
    POST evolution/message/sendText
    ← { messageId, sent: true }
  ↓
  Salva estado (data/agendamentos_confirmados.json)
    { agendamentoId: 324826659, confirmado: false, tentativas: 1, ... }

[Paciente responde no WhatsApp ~30 minutos depois]

EVOLUTION WEBHOOK
  POST /api/webhook/evolution
  Body: { messagesData: { messages: [{...}] } }
  ↓
API PROCESSOR processa
  Extrai: telefone, mensagem, timestamp
  Busca contexto em data/conversas.json
    ← { tipo: "confirmacao_agendamento", agendamentoId: 324826659, ... }
  Busca dados paciente (Simples Dental)
    GET /pacientes/26906607
    ← { nome: "João Silva", ... }
  ↓
Chama GPT MAKER
  POST https://api.gptmaker.ai/chat
  Body: {
    sessionId: "conv_26906607_agendamento_324826659",
    message: "Sim, vou sim!",
    context: {
      pacienteId: 26906607,
      agendamentoId: 324826659,
      tipo: "confirmacao_agendamento",
      dados_paciente: { nome: "João Silva", ... },
      historico: [...]
    },
    tools: [confirmar_agendamento, criar_agendamento, ...]
  }
  ↓
GPT MAKER processa
  Entende: "SIM" = confirmação positiva
  Prepara tool_call: confirmar_agendamento(324826659, true)
  Gera resposta: "Ótimo João! Te esperamos..."
  ↓
API PROCESSOR executa tool
  confirmar_agendamento(324826659, true)
  → Chama: Simples Dental RPA
  → Executa: PATCH /consultas/324826659 { status: "confirmado" }
  → Atualiza: data/agendamentos_confirmados.json
  ↓
Envia resposta
  POST evolution/message/sendText
  message: "Ótimo João! Te esperamos hoje às 14:00..."
  ↓
Salva histórico
  data/conversas.json
  { ..., historico: [..., { role: "user", "Sim, vou sim!" }, { role: "assistant", "Ótimo..." }] }

[FIM - Agendamento confirmado!]
```

### Fluxo 2: Lembrete Aniversariante

```
[08:00 AM]
SCHEDULER inicia job: enviar-aniversariantes
  ↓
Busca aniversariantes de hoje
  GET /dashboard/ver/pacientes?ver=ANIVERSARIANTES&date=TODAY
  ← Array com 3 pacientes
  ↓
Para cada paciente:
  Monta mensagem
    "🎉 Feliz Aniversário {nome}!..."
  ↓
  Dispara no WhatsApp
    POST evolution/message/sendText
  ↓
  Cria conversação inicial
    data/conversas.json
    { tipo: "aniversario", pacienteId: ..., historico: [...] }

[Paciente responde ou não - Agente vai responder]

EVOLUTION WEBHOOK
  [Mesmo fluxo anterior]
  Agente oferece agendamento/promoção
  Se aceita: criar_agendamento(...)
```

### Fluxo 3: Alerta Orçamento

```
[10:00 AM - Segunda]
SCHEDULER inicia job: alerta-orcamentos
  ↓
Busca orçamentos abertos há 7+ dias
  GET /pacientes/{id}/orcamentos?status=aberto&dias_abertos=7+
  ← Array com 2 orçamentos
  ↓
Para cada orçamento:
  Busca contexto: valor, procedimento, data criação
  ↓
  Dispara mensagem
    "Oi {nome}! Seu orçamento de {proc} no valor de R$ {valor}..."
  ↓
  Cria conversação
    { tipo: "orcamento", orcamentoId: 987654, ... }

[Paciente responde]
Agente oferece: parcelamento, negocia, ou escalona
Se aprova: atualizar_orcamento(orcamentoId, "aprovado", parcelas=12)
```

### Fluxo 4: Follow-up Procedimento

```
[Procedimento registrado: 2026-04-19 - Clareamento]

Sistema detecta
  → Cria job agendado para 2026-10-19 (6 meses depois)
  → Salva em data/follow_ups.json
  { pacienteId: 64052121, tipo: "clareamento", data_agendada: "2026-10-19", status: "pendente" }

[2026-10-19 09:00 AM]
SCHEDULER inicia job: disparar-follow-ups
  ↓
Busca follow-ups de hoje
  data/follow_ups.json → filtrar status: pendente && data_agendada: TODAY
  ← { pacienteId: 64052121, tipo: "clareamento", ... }
  ↓
Para cada follow-up:
  Busca dados paciente
  Dispara mensagem
    "Olá Ana! Você fez clareamento com a gente há 6 meses...
     Quer agendar um retorno? Cupom de R$ 100! 🎁"
  ↓
  Salva: { status: "enviado", data_envio: "2026-10-19T09:00Z" }

[Paciente responde: "Sim, quero agendar"]
Agente: criar_agendamento(pacienteId, profissionalId, data, horario)
Resultado: Novo agendamento criado com desconto aplicado
```

---

## 💾 BANCO DE DADOS

### Estrutura JSON

**Conversas:**
```json
{
  "2026-10-19T09:30:00Z": {
    "paciente_id": 26906607,
    "paciente_nome": "João Silva",
    "telefone": "5511987654321",
    "tipo_interacao": "confirmacao_agendamento",
    "agendamento_id": 324826659,
    "orcamento_id": null,
    "session_id": "conv_26906607_agendamento_324826659",
    "historico": [
      {
        "role": "assistant",
        "content": "Olá João! 👋 Confirme sua presença na consulta de hoje..."
      },
      {
        "role": "user",
        "content": "Sim, vou sim!"
      },
      {
        "role": "assistant",
        "content": "Ótimo João! Te esperamos hoje às 14:00..."
      }
    ],
    "status": "resolvido",
    "data_inicio": "2026-10-19T09:30:00Z",
    "ultima_atualizacao": "2026-10-19T09:35:00Z",
    "metadata": {
      "confirmou": true,
      "tempo_resposta_segundos": 300
    }
  }
}
```

**Agendamentos Confirmados:**
```json
{
  "2026-10-19": [
    {
      "agendamento_id": 324826659,
      "paciente_id": 26906607,
      "confirmado": true,
      "data_confirmacao": "2026-10-19T09:35:00Z",
      "tentativas": 1
    }
  ]
}
```

**Follow-ups:**
```json
{
  "2026-10-19": [
    {
      "paciente_id": 64052121,
      "tipo": "clareamento",
      "data_procedimento": "2026-04-19",
      "data_agendada_para": "2026-10-19",
      "status": "enviado",
      "tentativas": 1,
      "data_envio": "2026-10-19T09:15:00Z"
    }
  ]
}
```

**Logs:**
```json
{
  "2026-10-19T09:00:00Z": {
    "job": "confirmar-agendamentos",
    "status": "sucesso",
    "agendamentos_encontrados": 5,
    "agendamentos_enviados": 5,
    "tempo_ms": 2345,
    "erros": 0
  }
}
```

---

## 🔌 APIS E INTEGRAÇÕES

### 1. Simples Dental RPA

**Funções Necessárias:**

```javascript
// Já implementadas:
listAppointments(context, startDh, endDh, pageNumber, pageSize)
listPatients(context, query, pageNumber, pageSize)
getPatient(context, patientId)
getPatientAppointments(context, patientId)
getPatientEvolutions(context, patientId)
getPatientTreatments(context, patientId)
getPatientBudgets(context, patientId)
getPatientPayments(context, patientId)

// Precisam ser implementadas:
confirmAppointment(context, appointmentId, confirmed)
createAppointment(context, patientId, professionalId, data, horario)
updateBudget(context, budgetId, status, valuePaid)
getAvailableHours(context, professionalId, data)
```

### 2. Evolution API

**Endpoints:**

```
POST /message/sendText
{
  "number": "5511987654321",
  "text": "Olá João..."
}

Webhook POST /api/webhook/evolution
{
  "data": {
    "messagesData": {
      "messages": [{
        "key": { "remoteJid": "5511987654321@c.us" },
        "message": { "conversation": "Sim, vou sim!" },
        "messageTimestamp": 1697759400,
        "pushName": "João Silva"
      }]
    }
  }
}
```

### 3. GPT Maker

**Endpoint:**

```
POST /chat
{
  "sessionId": "conv_26906607_agendamento_324826659",
  "message": "Sim, vou sim!",
  "context": {
    "paciente_id": 26906607,
    "tipo_interacao": "confirmacao_agendamento",
    "agendamento_id": 324826659,
    "historico": [...]
  },
  "tools": [
    {
      "name": "confirmar_agendamento",
      "parameters": { "agendamento_id": "number", "confirmacao": "boolean" }
    },
    ...
  ]
}

Response:
{
  "response": "Ótimo João! Te esperamos...",
  "tool_calls": [
    {
      "name": "confirmar_agendamento",
      "parameters": { "agendamento_id": 324826659, "confirmacao": true }
    }
  ]
}
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
seu-projeto/
├─ src/
│  ├─ scheduler.js           # Cron jobs
│  ├─ api-processor.js       # Express + webhooks
│  ├─ jobs/
│  │  ├─ confirmar-agendamentos.js
│  │  ├─ enviar-aniversariantes.js
│  │  ├─ alerta-orcamentos.js
│  │  ├─ disparar-follow-ups.js
│  │  └─ alertar-retorno-periodico.js
│  ├─ integrations/
│  │  ├─ gptmaker.js
│  │  ├─ evolution-api.js
│  │  └─ simples-dental-rpa.js
│  └─ utils/
│     ├─ logger.js
│     ├─ data-manager.js
│     └─ helpers.js
│
├─ data/
│  ├─ conversas.json
│  ├─ agendamentos_confirmados.json
│  ├─ follow_ups.json
│  └─ log.json
│
├─ config/
│  ├─ config.json            # Configurações
│  └─ templates.json         # Templates de mensagens
│
├─ .env                       # Variáveis de ambiente
├─ .env.example              # Template .env
├─ .gitignore
├─ package.json
├─ README.md
└─ SPECS.md                  # Este arquivo
```

---

## 🏗️ IMPLEMENTAÇÃO

### Fase 1: Foundation (1 semana)

**Semana 1 - Dia 1-2:**
- [ ] Setup Node.js project
- [ ] Criar config.json
- [ ] Criar estrutura de pastas
- [ ] Setup .env
- [ ] Integração Simples Dental RPA

**Semana 1 - Dia 3:**
- [ ] Implementar data-manager.js
- [ ] Criar estrutura JSON
- [ ] Logger setup

**Semana 1 - Dia 4-5:**
- [ ] API Processor básico (Express)
- [ ] Webhook receiver
- [ ] Teste manual

**Semana 1 - Dia 6-7:**
- [ ] Evolution API integration
- [ ] Teste de disparo de mensagem
- [ ] Primeiro job: confirmar-agendamentos

### Fase 2: GPT Maker Integration (1 semana)

**Semana 2 - Dia 1-2:**
- [ ] Integração GPT Maker
- [ ] Passar contexto correto
- [ ] Processar responses

**Semana 2 - Dia 3-4:**
- [ ] Implementar tool executor
- [ ] Confirmar agendamento via tool
- [ ] Testar fluxo completo

**Semana 2 - Dia 5-7:**
- [ ] Job: enviar-aniversariantes
- [ ] Job: alerta-orcamentos
- [ ] Testes de ambos

### Fase 3: Scheduler & Follow-ups (1 semana)

**Semana 3 - Dia 1-3:**
- [ ] Scheduler com cron jobs
- [ ] Job: disparar-follow-ups
- [ ] Job: alertar-retorno-periodico

**Semana 3 - Dia 4-7:**
- [ ] Testes de timing
- [ ] Retry logic
- [ ] Error handling

### Fase 4: Deploy & Monitoramento (1 semana)

**Semana 4 - Dia 1-3:**
- [ ] Deploy (Windows Task Scheduler ou cron)
- [ ] Logging em produção
- [ ] Alertas por email

**Semana 4 - Dia 4-7:**
- [ ] Monitoramento
- [ ] Ajustes baseado em feedback
- [ ] Documentação

---

## ✅ TESTES

### Testes Unitários

```javascript
// tests/jobs.test.js
describe('confirmar-agendamentos', () => {
  it('deve buscar agendamentos de hoje', async () => {
    const agends = await buscarAgendamentosDia();
    expect(agends).toBeDefined();
    expect(agends.length).toBeGreaterThan(0);
  });
  
  it('deve disparar mensagem para cada agendamento', async () => {
    // Mock Evolution API
    // Verificar que foi chamado N vezes
  });
});
```

### Testes de Integração

```javascript
// tests/integration.test.js
describe('Fluxo Completo', () => {
  it('Paciente responde SIM e agendamento é confirmado', async () => {
    // Disparar mensagem
    // Simular resposta do paciente
    // Verificar se foi confirmado
    // Verificar se histórico foi salvo
  });
});
```

### Testes de Carga

```
Objetivo: Testar com 100+ conversas/dia
- ✅ Throughput mínimo 10 mensagens/segundo
- ✅ Latência máxima 5 segundos por mensagem
- ✅ Taxa de erro < 1%
```

### Testes Manuais

**Checklist:**

```
[ ] Login no Simples Dental (npm run login)
[ ] Buscar agendamentos (node src/jobs/confirmar-agendamentos.js)
[ ] Enviar WhatsApp (test manual)
[ ] Receber resposta (via webhook simulado)
[ ] GPT Maker processa (verificar logs)
[ ] Agendamento confirmado (verificar Simples Dental)
[ ] Histórico salvo (verificar JSON)
[ ] Job agendado corre (verificar Cron/Task Scheduler)
```

---

## 🚀 DEPLOYMENT

### Opção 1: Local (seu PC/servidor)

**Windows:**
```powershell
1. npm install
2. Criar .env com credenciais
3. node src/scheduler.js (teste manual)
4. Task Scheduler → Criar tarefa
   Program: node.exe
   Arguments: C:\projeto\src\scheduler.js
   Schedule: Daily 09:00 AM
```

**Linux/Mac:**
```bash
1. npm install
2. Criar .env
3. node src/scheduler.js (teste)
4. crontab -e
   0 9 * * * cd /projeto && node src/scheduler.js >> log.txt 2>&1
```

### Opção 2: Google Cloud Functions

```bash
1. gcloud functions deploy simples-dental-automation \
   --runtime nodejs18 \
   --entry-point scheduler \
   --trigger-topic daily-scheduler

2. Cloud Scheduler:
   Criar job que publica em daily-scheduler topic
   Executar: 09:00 AM diariamente
```

### Variáveis de Ambiente (.env)

```bash
# Simples Dental
SIMPLESDENTAL_EMAIL=seu-email@example.com
SIMPLESDENTAL_PASSWORD=sua-senha
SIMPLESDENTAL_BASE_URL=https://app.simplesdental.com

# Evolution API
EVOLUTION_API_URL=https://evolution.sua-instancia.com
EVOLUTION_API_KEY=seu-api-key

# GPT Maker
GPTMAKER_API_URL=https://api.gptmaker.ai
GPTMAKER_API_KEY=seu-api-key

# Seu servidor
API_PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Notificações
NOTIFICATION_EMAIL=seu-email@example.com
SMTP_PASSWORD=senha-smtp
```

---

## 📊 MÉTRICAS & MONITORAMENTO

### Métricas Principais

```
1. Taxa de Confirmação de Agendamento
   = (agendamentos_confirmados / agendamentos_enviados) * 100
   Target: ≥ 70%

2. Taxa de Resposta Aniversário
   = (respostas / mensagens_enviadas) * 100
   Target: ≥ 30%

3. Taxa de Conversão Aniversário → Agendamento
   = (agendamentos_criados / respostas) * 100
   Target: ≥ 20%

4. Taxa de Aprovação Orçamento
   = (orcamentos_aprovados / orcamentos_enviados) * 100
   Target: ≥ 50%

5. Tempo Médio de Resposta Agente
   = Average((timestamp_resposta - timestamp_mensagem))
   Target: < 5 segundos

6. Taxa de Erro
   = (mensagens_com_erro / mensagens_totais) * 100
   Target: < 1%
```

### Logs

Cada ação deve gerar log:

```json
{
  "timestamp": "2026-10-19T09:00:00Z",
  "tipo": "confirmacao_agendamento",
  "agendamento_id": 324826659,
  "paciente_id": 26906607,
  "acao": "enviada",
  "status": "sucesso",
  "tempo_ms": 345,
  "mensagem_id": "msg_123"
}
```

---

## ✨ CONSIDERAÇÕES FINAIS

### Segurança
- ✅ API keys em .env (nunca no código)
- ✅ HTTPS para todos os webhooks
- ✅ Validação de token em webhook
- ✅ Logs sem dados sensíveis

### Performance
- ✅ Processamento assíncrono
- ✅ Retry com backoff exponencial
- ✅ Cache de dados paciente

### Escalabilidade
- ✅ JSON adequado para até 100k conversas
- ✅ Se mais: migrar para PostgreSQL
- ✅ Se muitos jobs: mover para Cloud Functions

### Manutenibilidade
- ✅ Código bem estruturado
- ✅ Funções pequenas e testáveis
- ✅ Documentação completa
- ✅ Logs detalhados

---

**FIM DA ESPECIFICAÇÃO**

**Próximos passos:** Implementar seguindo as 4 fases (4 semanas total)

**Estimativa:**
- Desenvolvimento: 4 semanas
- Testes: 1 semana
- Deploy: 2-3 dias
- **Total: 5-6 semanas de ponta a ponta**

**Custo:**
- Desenvolvimento: R$ 2-3k (sua equipe)
- Infraestrutura: R$ 0-50/mês

**ROI:**
- Taxa de confirmação 70% = menos ninguém-aparece
- 100+ agendamentos/mês × 70% = 70 clientes confirmados
- Economia contact center: ~10 horas/mês de ligações
- **Payoff: < 1 mês**
