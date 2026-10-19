# Arquitetura: Agente IA de WhatsApp para Simples Dental

## 🎯 Objetivo Final

Sistema de automação que:
1. **Escuta** eventos do Simples Dental (agendamentos, aniversários, orçamentos, follow-ups)
2. **Processa** lógica de negócio (quem contactar, com qual mensagem)
3. **Dispara** mensagens no WhatsApp
4. **Agente IA** responde nas conversas (conversacional, contextualizável)

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    SIMPLES DENTAL (Fonte)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ - Agendamentos (data, paciente, profissional)        │   │
│  │ - Pacientes (dados, aniversário)                     │   │
│  │ - Orçamentos (status: aberto/aprovado/pago)          │   │
│  │ - Procedimentos (tipo, data, acompanhamento)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ⬇️
┌─────────────────────────────────────────────────────────────┐
│                 WORKER QUEUE (pg-boss)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Job: check-agendamentos-dia                          │   │
│  │ Job: enviar-lembrete-aniversario                     │   │
│  │ Job: alerta-orcamento-aberto                         │   │
│  │ Job: follow-up-procedimento                          │   │
│  │ Job: agendar-retorno-periodico                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ⬇️
┌─────────────────────────────────────────────────────────────┐
│            API PROCESSOR (Lógica de Negócio)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ - Buscar pacientes a contactar                       │   │
│  │ - Verificar preferências de comunicação              │   │
│  │ - Montar contexto (dados do paciente, etc)           │   │
│  │ - Determinar tipo de mensagem                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ⬇️
┌─────────────────────────────────────────────────────────────┐
│          WHATSAPP API (Disparador de Mensagens)            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ - Enviar template (confirmação, aniversário, etc)    │   │
│  │ - Receber webhook (respostas do paciente)            │   │
│  │ - Manter contexto da conversa                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ⬇️
┌─────────────────────────────────────────────────────────────┐
│         AGENTE IA (Claude via API Anthropic)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ - Recebe: mensagem do paciente + contexto            │   │
│  │ - Processa: com tools de confirmação/agendamento     │   │
│  │ - Responde: conversacionalmente                      │   │
│  │ - Atualiza: Simples Dental se necessário             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ⬇️
                    PACIENTE (WhatsApp)
```

---

## 📋 Casos de Uso (5 Fluxos Principais)

### 1️⃣ Confirmação de Agendamento (Diário)

**Trigger:** Todos os dias às 09:00 AM

**Fluxo:**
```
1. Job: check-agendamentos-dia
   → Busca agendamentos de hoje via API Simples Dental
   → Filter: status = agendado, não confirmado

2. Para cada agendamento:
   → Busca dados do paciente (nome, telefone, whatsapp)
   → Cria contexto: "João tem consulta hoje 14:00 com Dr. Silva"

3. Dispara no WhatsApp:
   Template: "Olá João! 👋 Confirme sua presença na consulta de hoje às 14:00 com Dr. Silva. Responda SIM ou NÃO"

4. Agente IA aguarda resposta:
   Paciente: "Sim, vou sim"
   Agente: "Ótimo! Te esperamos. Qualquer dúvida, avise. 😊"
   → Marca agendamento como "confirmado" no Simples Dental

5. Se não responder:
   → Reenviar lembretes em 1h, 30min antes
   → Log para contact center ligar
```

**Dados necessários:**
- ✅ `GET /consultas?startDh=TODAY&status=pending`
- ✅ `GET /pacientes/{id}?includes=telefone,whatsapp`
- ❌ `PATCH /consultas/{id}` (atualizar status) - IMPLEMENTAR

---

### 2️⃣ Lembrete de Aniversariante (Diário)

**Trigger:** Todos os dias às 08:00 AM

**Fluxo:**
```
1. Job: enviar-lembrete-aniversario
   → Busca pacientes aniversariantes de hoje

2. Para cada paciente:
   → Busca dados completos (nome, data aniversário)
   → Cria contexto personalizado

3. Dispara no WhatsApp:
   Template: "🎉 Feliz Aniversário [Nome]! 
   Aproveite o dia especial. Conte com a gente para cuidar do seu sorriso! 
   Quer agendar uma avaliação? Temos super promoção pra você!"

4. Se paciente responder:
   Agente: Conversa para agendar, buscar sobre saúde dental, etc
   Tool: Criar novo agendamento se necessário
```

**Dados necessários:**
- ✅ `GET /dashboard/ver/pacientes?ver=ANIVERSARIANTES`
- ✅ `GET /pacientes/{id}`
- ❌ `POST /consultas` (criar novo agendamento) - IMPLEMENTAR

---

### 3️⃣ Alerta de Orçamento em Aberto (Semanal)

**Trigger:** Toda segunda-feira às 10:00 AM

**Fluxo:**
```
1. Job: alerta-orcamento-aberto
   → Busca pacientes com orçamentos abertos há 7+ dias

2. Para cada orçamento:
   → Busca contexto: tipo procedimento, valor, data criação
   → Verifica se foi aprovado parcialmente

3. Dispara no WhatsApp:
   Template: "Oi [Nome]! 👋 Seu orçamento de [procedimento] 
   no valor de R$ [valor] está aguardando sua aprovação. 
   Gostaria de conversar sobre as opções de pagamento?"

4. Se paciente responder:
   Agente: Tira dúvidas, oferece parcelamento, agenda consulta
   Tool: Atualizar status do orçamento
   → Se aprova: marca como aprovado
   → Se quer pensar: agendar follow-up em 3 dias
```

**Dados necessários:**
- ✅ `GET /pacientes/{id}/orcamentos?status=aberto`
- ✅ `GET /pacientes/{id}/recebimentos`
- ❌ `PATCH /orcamentos/{id}` (atualizar status) - IMPLEMENTAR

---

### 4️⃣ Follow-up de Procedimento (Automático)

**Trigger:** Disparado quando procedimento é registrado

**Fluxo:**
```
1. Listener: detecta novo procedimento (exemplo: limpeza, clareamento, implante)
   → Cria job agendado para 6 meses depois (ou tempo configurável)
   → Armazena no DB: { pacienteId, procedimento, dataRetorno }

2. Quando chegar a data:
   Job: follow-up-procedimento
   → Busca dados do paciente
   → Cria contexto: "você fez [procedimento] em [data]"

3. Dispara no WhatsApp:
   Template: "Olá [Nome]! 👋 Você fez [procedimento] com a gente há 6 meses.
   Que tal agendar um retorno para avaliar como está? 
   Enviamos um cupom de R$ 100 de desconto! 🎁"

4. Se responder sim:
   Agente: Agenda, busca disponibilidade, confirma
   Tool: Cria novo agendamento
```

**Dados necessários:**
- ✅ `GET /pacientes/{id}/tratamentos`
- ✅ `GET /profissionais` (encontrar disponibilidade)
- ❌ Follow-up scheduler (tabela no BD local) - CRIAR
- ❌ `POST /consultas` (criar agendamento) - IMPLEMENTAR

---

### 5️⃣ Agendar Retorno Periódico (Profilaxia)

**Trigger:** Pode ser manual ou automático

**Fluxo:**
```
1. Dentista finaliza procedimento (profilaxia/limpeza)
   → Sistema captura: paciente precisa voltar em 6 meses

2. Job agenda automático:
   Job: agendar-retorno-periodico
   → Em 5 meses: enviar lembrante
   → "Sua profilaxia vence em 1 mês. Que tal agendar agora?"
   → Em 6 meses: alerta urgente se não agendou

3. Agente IA facilita agendamento no WhatsApp
   Tool: Consulta disponibilidade, confirma, atualiza Simples Dental
```

**Dados necessários:**
- ✅ `GET /pacientes/{id}/tratamentos`
- ❌ Follow-up scheduler (persistir em BD local) - CRIAR
- ❌ Consultas de disponibilidade de profissionais - EXPANDIR

---

## 🗄️ Banco de Dados (Tabelas Adicionais Necessárias)

### Tabela: `follow_ups`
```sql
CREATE TABLE follow_ups (
  id INTEGER PRIMARY KEY,
  paciente_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,  -- 'profilaxia', 'implante', 'clareamento', etc
  procedimento TEXT,
  data_criacao DATETIME,
  data_agendada_para DATETIME,
  data_enviado DATETIME,
  status TEXT,  -- 'pendente', 'enviado', 'confirmado', 'agendado'
  tentativas INTEGER DEFAULT 0
);

CREATE TABLE whatsapp_conversations (
  id INTEGER PRIMARY KEY,
  paciente_id INTEGER NOT NULL,
  telefone TEXT UNIQUE,
  mensagem_id TEXT,  -- ID no WhatsApp
  contexto JSONB,    -- { agendamento_id, orcamento_id, procedimento, etc }
  historico TEXT,    -- Histórico de conversa
  status TEXT,       -- 'ativo', 'resolvido', 'abandonado'
  ultima_atualizacao DATETIME
);

CREATE TABLE agendamentos_confirmados (
  id INTEGER PRIMARY KEY,
  agendamento_id INTEGER,
  paciente_id INTEGER,
  data_consulta DATETIME,
  confirmado BOOLEAN,
  data_confirmacao DATETIME,
  tentativas_confirmacao INTEGER
);
```

---

## 🛠️ Implementação em Fases

### Fase 1: Foundation (Semana 1-2)
- [ ] Estrutura do worker queue (pg-boss)
- [ ] Tabelas de BD para follow-ups e conversas
- [ ] Scaffold dos 5 jobs
- [ ] Integração com WhatsApp API (básico)

### Fase 2: Agente IA (Semana 3-4)
- [ ] Agente Claude com tools para:
  - Confirmar agendamento
  - Aprovar orçamento
  - Criar novo agendamento
  - Consultar disponibilidade
- [ ] Persistência de contexto de conversa
- [ ] Tratamento de erros e fallbacks

### Fase 3: Regras de Negócio (Semana 5-6)
- [ ] Lógica de confirmação (retries, horários)
- [ ] Lógica de orçamentos (parcelamento, negociação)
- [ ] Lógica de follow-ups (tempos configuráveis)
- [ ] Regras de preferência do cliente

### Fase 4: Otimizações (Semana 7-8)
- [ ] Analytics (taxa de confirmação, conversão, etc)
- [ ] A/B testing de mensagens
- [ ] Escalabilidade para múltiplas clínicas
- [ ] Dashboard de monitoramento

---

## 🔌 API WhatsApp (Referência)

### Assumindo: Meta WhatsApp Business API (ou Twilio)

```javascript
// Disparar mensagem
POST https://graph.instagram.com/v18.0/{PHONE_NUMBER_ID}/messages
{
  "messaging_product": "whatsapp",
  "to": "5511999999999",
  "type": "template",
  "template": {
    "name": "confirmacao_agendamento",
    "language": { "code": "pt_BR" },
    "components": [{
      "type": "body",
      "parameters": [
        { "type": "text", "text": "João" },
        { "type": "text", "text": "14:00" },
        { "type": "text", "text": "Dr. Silva" }
      ]
    }]
  }
}

// Webhook receber resposta
POST https://seu-dominio.com/whatsapp-webhook
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5511999999999",
          "id": "wamid.XXX",
          "timestamp": "1234567890",
          "text": { "body": "Sim, vou sim" },
          "type": "text"
        }],
        "contacts": [{ "profile": { "name": "João Silva" }, "wa_id": "5511999999999" }]
      }
    }]
  }]
}
```

---

## 🤖 Agente Claude (Estrutura)

```javascript
// worker/agents/dental-whatsapp-agent.js
import Anthropic from "@anthropic-ai/sdk";
import { 
  confirmAgendar, 
  criarAgendamento, 
  atualizarOrcamento,
  consultarDisponibilidade 
} from "../src/actions/appointments.js";

const client = new Anthropic();

const tools = [
  {
    name: "confirmar_agendamento",
    description: "Marca um agendamento como confirmado",
    input_schema: {
      type: "object",
      properties: {
        agendamento_id: { type: "number", description: "ID do agendamento" },
        confirmacao: { type: "boolean", description: "true/false" }
      },
      required: ["agendamento_id", "confirmacao"]
    }
  },
  {
    name: "criar_agendamento",
    description: "Cria novo agendamento",
    input_schema: {
      type: "object",
      properties: {
        paciente_id: { type: "number" },
        profissional_id: { type: "number" },
        data: { type: "string", description: "YYYY-MM-DD" },
        horario: { type: "string", description: "HH:MM" }
      },
      required: ["paciente_id", "profissional_id", "data", "horario"]
    }
  },
  {
    name: "atualizar_orcamento",
    description: "Aprova/rejeita orçamento",
    input_schema: {
      type: "object",
      properties: {
        orcamento_id: { type: "number" },
        status: { 
          type: "string",
          enum: ["aprovado", "parcial", "negado"]
        },
        valor_pago: { type: "number", description: "Se parcial" }
      },
      required: ["orcamento_id", "status"]
    }
  },
  {
    name: "consultar_disponibilidade",
    description: "Consulta horários disponíveis",
    input_schema: {
      type: "object",
      properties: {
        profissional_id: { type: "number" },
        data: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["profissional_id", "data"]
    }
  }
];

export async function processarMensagem(pacienteId, mensagem, contexto) {
  const systemPrompt = `
    Você é um agente de atendimento de uma clínica odontológica.
    Seu objetivo é ajudar pacientes com:
    - Confirmação de agendamentos
    - Aprovação de orçamentos
    - Agendamento de procedimentos
    - Dúvidas sobre saúde dental
    
    Contexto do paciente:
    - Nome: ${contexto.paciente.nome}
    - Próximo agendamento: ${contexto.proximo_agendamento || "Nenhum"}
    - Orçamentos em aberto: ${contexto.orcamentos_abertos?.length || 0}
    
    Regras:
    - Sempre seja amável e profissional
    - Se ofereça para agendar quando apropriado
    - Confirme ações antes de executar
    - Se não souber, ofereça contato com recepção
  `;

  const messages = [
    ...contexto.historico.map(m => ({
      role: m.role,
      content: m.content
    })),
    { role: "user", content: mensagem }
  ];

  const response = await client.messages.create({
    model: "claude-opus-5-5",  // ou claude-sonnet-5-5 para custo menor
    max_tokens: 1024,
    system: systemPrompt,
    tools,
    messages
  });

  // Processar tool calls
  for (const block of response.content) {
    if (block.type === "tool_use") {
      const toolName = block.name;
      const toolInput = block.input;

      let toolResult;
      if (toolName === "confirmar_agendamento") {
        toolResult = await confirmAgendar(context, toolInput.agendamento_id, toolInput.confirmacao);
      } else if (toolName === "criar_agendamento") {
        toolResult = await criarAgendamento(context, toolInput);
      } else if (toolName === "atualizar_orcamento") {
        toolResult = await atualizarOrcamento(context, toolInput);
      } else if (toolName === "consultar_disponibilidade") {
        toolResult = await consultarDisponibilidade(context, toolInput);
      }

      // Continuar processamento com resultado da tool
      console.log(`Tool ${toolName} result:`, toolResult);
    }
  }

  // Extrair texto da resposta
  const textResponse = response.content
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("\n");

  return textResponse;
}
```

---

## 📊 Job Schedule (Cron Jobs no pg-boss)

```javascript
// worker/jobs/scheduler.js
import pgboss from "pg-boss";

const boss = new pgboss("postgresql://...");

// Diariamente às 09:00 - Confirmar agendamentos
await boss.schedule("check-agendamentos-dia", {}, "0 9 * * *");

// Diariamente às 08:00 - Lembrete aniversário
await boss.schedule("enviar-lembrete-aniversario", {}, "0 8 * * *");

// Toda segunda às 10:00 - Alerta orçamento
await boss.schedule("alerta-orcamento-aberto", {}, "0 10 * * 1");

// Follow-ups são agendados dinamicamente conforme necessário
```

---

## 🔄 Fluxo de Implementação Recomendado

1. **Comece pelo Job mais simples:** `enviar-lembrete-aniversario`
   - Apenas busca dados, envia no WhatsApp
   - Sem interação do agente ainda

2. **Depois:** `check-agendamentos-dia`
   - Já com Agente IA respondendo
   - Confirma/nega agendamento

3. **Então:** `alerta-orcamento-aberto`
   - Agente negocia pagamento
   - Tools para atualizar status

4. **Finalmente:** Follow-ups automáticos
   - Mais complexo, mas framework já existe

---

## 📈 Métricas a Acompanhar

```
Taxa de confirmação de agendamento
Taxa de aprovação de orçamento
Taxa de agendamento por aniversário
Taxa de resposta a follow-ups
Tempo médio de conversa
Satisfação (ratings)
Receita por automação
```

---

## ⚠️ Considerações Importantes

### LGPD
- ✅ Dados de pacientes precisam consentimento para WhatsApp
- ✅ Direito de optar por não receber mensagens
- ✅ Histórico de conversas deve ser auditável

### Qualidade
- ⚠️ Agente IA pode não resolver 100% dos casos
- ✅ Sempre oferecer escalação para humano
- ✅ Monitorar taxa de abandono de conversas

### Integração
- ⚠️ API Simples Dental pode ter rate limits
- ✅ Implementar retry e queue de mensagens
- ✅ Logs detalhados para debugging

---

## 🚀 Próximos Passos

1. **Confirmação:** Você quer implementar tudo isso?
2. **Priorização:** Por qual job começamos? (recomendo: aniversário primeiro)
3. **Credenciais:** Qual API WhatsApp vocês usam? (Meta, Twilio, outra?)
4. **Agente:** Quer que seja Claude ou outra IA?

**Estou pronto para implementar qualquer dessas partes!** 🚀
