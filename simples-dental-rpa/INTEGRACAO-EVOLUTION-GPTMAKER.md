# 🔗 Integração: Evolution API + GPT Maker + Simples Dental

Fluxo completo de automação com **Evolution API** como WhatsApp, **GPT Maker** como agente IA e **Simples Dental RPA** como fonte de dados.

---

## 🏗️ Arquitetura Atualizada

```
┌────────────────────────────────────────────────────────────────┐
│                    SIMPLES DENTAL (Fonte)                      │
│  - Agendamentos, Pacientes, Orçamentos, Procedimentos         │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│              WORKER QUEUE (pg-boss) - Node.js                  │
│  - check-agendamentos-dia                                      │
│  - enviar-lembrete-aniversario                                 │
│  - alerta-orcamento-aberto                                     │
│  - follow-up-procedimento                                      │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│          EVOLUTION API - Disparador de Mensagens               │
│  POST https://evolution.sua-instancia.com/message/sendText    │
│  {                                                              │
│    "chatId": "5511987654321@c.us",                            │
│    "text": "Olá João! Confirme sua presença..."               │
│  }                                                              │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
                    PACIENTE (WhatsApp)
                          ⬇️ (Responde)
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│       EVOLUTION WEBHOOK - Recebe Mensagem do Paciente          │
│  POST https://sua-api.com/evolution-webhook                   │
│  {                                                              │
│    "data": {                                                    │
│      "messagesData": {                                          │
│        "messages": [{                                           │
│          "key": { "remoteJid": "5511987654321@c.us" },        │
│          "message": { "conversation": "Sim, vou sim!" }        │
│        }]                                                       │
│      }                                                          │
│    }                                                            │
│  }                                                              │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│     API PROCESSOR (Node.js) - Enriquece Contexto              │
│  - Busca paciente no Simples Dental                           │
│  - Busca histórico de conversa                                 │
│  - Monta payload para GPT Maker                               │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│         GPT MAKER - Agente IA Inteligente                      │
│  POST https://api.gptmaker.ai/chat                             │
│  {                                                              │
│    "sessionId": "conversa_26926607_agendamento",              │
│    "message": "Sim, vou sim!",                                │
│    "context": {                                                │
│      "paciente_id": 26926607,                                  │
│      "agendamento_id": 324826659,                             │
│      "tipo_interacao": "confirmacao_agendamento",             │
│      "dados_paciente": {...},                                 │
│      "historico": [...]                                        │
│    },                                                          │
│    "tools": [                                                  │
│      "confirmar_agendamento",                                 │
│      "criar_agendamento",                                     │
│      "consultar_disponibilidade",                             │
│      "atualizar_orcamento"                                    │
│    ]                                                           │
│  }                                                              │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│       GPT MAKER - Executa Tools (via API Processor)            │
│  Tool Call: confirmar_agendamento                             │
│  └─ Chama: API Processor → Simples Dental RPA                │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│    API PROCESSOR - Executa Ação no Simples Dental              │
│  - Chama: RPA → Simples Dental API                            │
│  - Atualiza BD local (whatsapp_conversations, etc)            │
│  - Retorna resultado para GPT Maker                           │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│       GPT MAKER - Gera Resposta Conversacional                 │
│  Response:                                                      │
│  "Ótimo João! Te esperamos hoje às 14:00. Qualquer           │
│   dúvida, é só chamar! 😊"                                    │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
┌────────────────────────────────────────────────────────────────┐
│         API PROCESSOR - Envia Resposta via Evolution           │
│  POST https://evolution.sua-instancia.com/message/sendText    │
│  {                                                              │
│    "chatId": "5511987654321@c.us",                            │
│    "text": "Ótimo João! Te esperamos hoje às 14:00..."       │
│  }                                                              │
└──────────────────────────────┬─────────────────────────────────┘
                               ⬇️
                    PACIENTE RECEBE RESPOSTA
                         (WhatsApp)
```

---

## 📡 Evolution API - Detalhes de Integração

### Webhook Configuration (Evolution API)

**Você precisa configurar no Evolution API:**

```bash
POST https://evolution.sua-instancia.com/webhook
Authorization: Bearer {EVOLUTION_API_KEY}

{
  "url": "https://sua-api.com/evolution-webhook",
  "events": [
    "MESSAGES_UPSERT",      # Receber mensagens
    "MESSAGES_UPDATE",       # Status de mensagens (entregue, lido)
    "CONNECTION_UPDATE",     # Status da conexão
    "PRESENCE_UPDATE"        # Quando paciente está digitando
  ]
}
```

### Receber Mensagem (Webhook POST)

**O Evolution API vai fazer POST na sua API:**

```javascript
// POST /evolution-webhook
// Body:
{
  "data": {
    "messagesData": {
      "messages": [
        {
          "key": {
            "remoteJid": "5511987654321@c.us",  // Telefone do paciente
            "fromMe": false,                      // False = mensagem recebida
            "id": "BAE5XX_XXXXX"                 // ID único da mensagem
          },
          "message": {
            "conversation": "Sim, vou sim!"     // Texto da mensagem
          },
          "messageTimestamp": 1697759400,
          "pushName": "João Silva"              // Nome do contato
        }
      ]
    }
  }
}
```

### Enviar Mensagem (Evolution API)

```javascript
// Seu código vai chamar Evolution API para responder:

const axios = require('axios');

async function enviarMensagemWhatsApp(telefone, texto) {
  const response = await axios.post(
    'https://evolution.sua-instancia.com/message/sendText',
    {
      number: telefone,  // ou: "5511987654321@c.us"
      text: texto
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.EVOLUTION_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
}

// Usar:
await enviarMensagemWhatsApp('5511987654321', 'Ótimo João! Te esperamos hoje às 14:00');
```

---

## 🤖 GPT Maker Integration

### Estrutura que GPT Maker vai Receber

```javascript
// POST https://api.gptmaker.ai/chat (ou seu endpoint)

{
  "sessionId": "conversa_26926607_agendamento_324826659",
  
  "message": "Sim, vou sim!",
  
  "context": {
    // Identificação
    "paciente_id": 26926607,
    "paciente_telefone": "5511987654321",
    "paciente_nome": "João Silva",
    
    // Motivo da interação
    "tipo_interacao": "confirmacao_agendamento",  // ou "aniversario", "orcamento", etc
    
    // Dados relevantes do negócio
    "agendamento_id": 324826659,
    "data_consulta": "2026-10-19 14:00",
    "profissional": "Dr. Carlos",
    "tipo_procedimento": "Limpeza",
    
    // Histórico de conversa (para contexto)
    "historico": [
      {
        "role": "assistant",
        "content": "Olá João! 👋 Confirme sua presença na consulta de hoje às 14:00 com Dr. Carlos para Limpeza. Responda SIM ou NÃO"
      },
      {
        "role": "user",
        "content": "Sim, vou sim!"
      }
    ],
    
    // Dados do paciente (referência)
    "paciente_dados": {
      "id": 26926607,
      "nome": "João Silva",
      "email": "joao@example.com",
      "telefone": "11987654321",
      "plano": { "id": 1, "nome": "Convênio XYZ" },
      "data_criacao": "2025-01-15"
    }
  },
  
  // Tools que o GPT Maker pode usar
  "tools": [
    {
      "name": "confirmar_agendamento",
      "description": "Marca um agendamento como confirmado",
      "parameters": {
        "agendamento_id": "number",
        "confirmacao": "boolean"
      }
    },
    {
      "name": "criar_agendamento",
      "description": "Cria novo agendamento",
      "parameters": {
        "paciente_id": "number",
        "profissional_id": "number",
        "data": "string (YYYY-MM-DD)",
        "horario": "string (HH:MM)"
      }
    },
    {
      "name": "consultar_disponibilidade",
      "description": "Consulta horários disponíveis",
      "parameters": {
        "profissional_id": "number",
        "data": "string (YYYY-MM-DD)"
      }
    },
    {
      "name": "atualizar_orcamento",
      "description": "Aprova/rejeita orçamento",
      "parameters": {
        "orcamento_id": "number",
        "status": "string (aprovado|parcial|negado)",
        "valor_pago": "number (opcional)"
      }
    }
  ],
  
  // System prompt para o agente
  "system_prompt": `Você é um agente de atendimento de uma clínica odontológica.
  
Seu objetivo é ajudar pacientes com:
- Confirmação de agendamentos
- Aprovação de orçamentos  
- Agendamento de procedimentos
- Dúvidas sobre saúde dental

Paciente: ${paciente_nome}
Tipo de interação: ${tipo_interacao}

Sempre seja amável, profissional e conversacional.
Use as tools disponíveis quando necessário.
Se não souber, ofereça contato com recepção.`
}
```

### GPT Maker Response

**GPT Maker vai responder assim:**

```javascript
{
  "response": "Ótimo João! Te esperamos hoje às 14:00. Qualquer dúvida, é só chamar! 😊",
  
  "tool_calls": [
    {
      "name": "confirmar_agendamento",
      "parameters": {
        "agendamento_id": 324826659,
        "confirmacao": true
      }
    }
  ],
  
  "session_update": {
    "historico_adicionar": {
      "role": "assistant",
      "content": "Ótimo João! Te esperamos hoje às 14:00. Qualquer dúvida, é só chamar! 😊"
    }
  },
  
  "metadata": {
    "confidence": 0.98,
    "action_type": "confirmacao",
    "next_action": "enviar_resposta"
  }
}
```

---

## 📝 Fluxo Detalhado: Confirmação de Agendamento

```
1. JOB: check-agendamentos-dia (09:00 AM)
   └─ Busca agendamentos de hoje (Simples Dental API)
   └─ Para cada agendamento não confirmado:
      └─ Envia via Evolution API (disparador)

2. EVOLUTION WEBHOOK recebe resposta do paciente
   └─ POST /evolution-webhook
      └─ Paciente: "Sim, vou sim!"

3. API PROCESSOR processa webhook
   ├─ Extrai telefone: 5511987654321
   ├─ Busca contexto no BD local:
   │  ├─ Qual agendamento?
   │  ├─ Qual paciente?
   │  └─ Histórico de conversa
   └─ Monta payload para GPT Maker

4. GPT MAKER recebe chamada
   ├─ Processa mensagem com contexto
   ├─ Entende que é confirmação
   ├─ Prepara tool_call: confirmar_agendamento
   └─ Gera resposta conversacional

5. API PROCESSOR executa tool
   ├─ Chama: confirmar_agendamento(324826659, true)
   │  └─ Faz: await context.cookies() → Simples Dental API
   ├─ Atualiza BD local:
   │  └─ INSERT agendamentos_confirmados (agendamento_id, true)
   └─ Retorna resultado para GPT Maker

6. GPT MAKER finaliza
   └─ Retorna resposta: "Ótimo João! Te esperamos..."

7. API PROCESSOR envia resposta
   └─ POST Evolution API /message/sendText
      └─ Texto: "Ótimo João! Te esperamos..."

8. PACIENTE recebe no WhatsApp
   └─ ✅ Conversa completa!

9. BD LOCAL atualizado
   ├─ whatsapp_conversations (mensagens)
   ├─ agendamentos_confirmados (confirmação registrada)
   └─ Histórico salvo para próxima interação
```

---

## 🗄️ Banco de Dados - Tabelas Necessárias

```sql
-- Tabela 1: Contexto de Conversas
CREATE TABLE whatsapp_conversations (
  id INTEGER PRIMARY KEY,
  paciente_id INTEGER NOT NULL,
  telefone TEXT UNIQUE,
  tipo_interacao TEXT,  -- "confirmacao", "aniversario", "orcamento", etc
  agendamento_id INTEGER,
  orcamento_id INTEGER,
  session_id TEXT UNIQUE,  -- ID da sessão no GPT Maker
  historico JSONB,  -- Array de { role, content }
  status TEXT,  -- "ativo", "resolvido", "escalado"
  data_inicio DATETIME,
  ultima_atualizacao DATETIME,
  metadata JSONB
);

-- Tabela 2: Confirmações de Agendamento
CREATE TABLE agendamentos_confirmados (
  id INTEGER PRIMARY KEY,
  agendamento_id INTEGER,
  paciente_id INTEGER,
  confirmado BOOLEAN,
  data_confirmacao DATETIME,
  tentativas INTEGER,
  ultima_tentativa DATETIME
);

-- Tabela 3: Follow-ups Agendados
CREATE TABLE follow_ups (
  id INTEGER PRIMARY KEY,
  paciente_id INTEGER,
  tipo TEXT,  -- "profilaxia", "implante", "clareamento"
  data_criacao DATETIME,
  data_agendada_para DATETIME,
  status TEXT,  -- "pendente", "enviado", "confirmado", "agendado"
  tentativas INTEGER
);

-- Tabela 4: Orçamentos em Negociação
CREATE TABLE orcamentos_negociacao (
  id INTEGER PRIMARY KEY,
  orcamento_id INTEGER,
  paciente_id INTEGER,
  status TEXT,  -- "aberto", "em_negociacao", "aprovado", "negado"
  parcelas_oferecidas INTEGER,
  data_criacao DATETIME,
  data_aprovacao DATETIME,
  valor_aprovado DECIMAL
);
```

---

## 🔧 Node.js API Processor

```javascript
// worker/api-processor.js

import express from 'express';
import axios from 'axios';
import { openContext } from '../src/browser.js';
import { 
  listPatients, 
  getPatient,
  getPatientAppointments 
} from '../src/actions/patients.js';

const app = express();
app.use(express.json());

// === RECEBER WEBHOOK DO EVOLUTION ===
app.post('/evolution-webhook', async (req, res) => {
  try {
    const { data } = req.body;
    const message = data.messagesData.messages[0];
    
    const telefone = message.key.remoteJid.split('@')[0];
    const textoMensagem = message.message.conversation;
    const nomeContato = message.pushName;
    
    console.log(`📨 Mensagem recebida de ${nomeContato} (${telefone}): "${textoMensagem}"`);
    
    // 1. Buscar contexto da conversa no BD
    const conversa = await db.query(
      `SELECT * FROM whatsapp_conversations 
       WHERE telefone = ? AND status = 'ativo'
       ORDER BY ultima_atualizacao DESC LIMIT 1`,
      [telefone]
    );
    
    if (!conversa) {
      console.error('❌ Conversa não encontrada para:', telefone);
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }
    
    const pacienteId = conversa.paciente_id;
    const tipoInteracao = conversa.tipo_interacao;
    const agendamentoId = conversa.agendamento_id;
    const orcamentoId = conversa.orcamento_id;
    
    // 2. Buscar dados do paciente
    const { browser, context } = await openContext();
    const paciente = await getPatient(context, pacienteId);
    
    // 3. Preparar contexto para GPT Maker
    const contextParaGPTMaker = {
      sessionId: conversa.session_id,
      message: textoMensagem,
      context: {
        paciente_id: pacienteId,
        paciente_telefone: telefone,
        paciente_nome: paciente.nome,
        tipo_interacao: tipoInteracao,
        agendamento_id: agendamentoId,
        orcamento_id: orcamentoId,
        historico: conversa.historico || [],
        paciente_dados: paciente
      },
      tools: [
        {
          name: 'confirmar_agendamento',
          description: 'Marca um agendamento como confirmado'
        },
        {
          name: 'criar_agendamento',
          description: 'Cria novo agendamento'
        },
        {
          name: 'consultar_disponibilidade',
          description: 'Consulta horários disponíveis'
        },
        {
          name: 'atualizar_orcamento',
          description: 'Aprova/rejeita orçamento'
        }
      ]
    };
    
    // 4. Chamar GPT Maker
    console.log('🤖 Chamando GPT Maker...');
    const gptMakerResponse = await axios.post(
      'https://api.gptmaker.ai/chat',  // Ajustar URL real
      contextParaGPTMaker,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GPTMAKER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const { response: respostaTexto, tool_calls } = gptMakerResponse.data;
    
    // 5. Executar tools (se houver)
    if (tool_calls && tool_calls.length > 0) {
      console.log('🔧 Executando tools:', tool_calls);
      
      for (const toolCall of tool_calls) {
        const toolResult = await executarTool(toolCall, context, pacienteId);
        console.log(`✅ Tool ${toolCall.name} executada:`, toolResult);
      }
    }
    
    // 6. Atualizar histórico na conversa
    await db.query(
      `UPDATE whatsapp_conversations 
       SET historico = json_array_append(historico, '$', ?),
           ultima_atualizacao = NOW()
       WHERE id = ?`,
      [
        JSON.stringify({ role: 'user', content: textoMensagem }),
        conversa.id
      ]
    );
    
    await db.query(
      `UPDATE whatsapp_conversations 
       SET historico = json_array_append(historico, '$', ?)
       WHERE id = ?`,
      [
        JSON.stringify({ role: 'assistant', content: respostaTexto }),
        conversa.id
      ]
    );
    
    // 7. Enviar resposta via Evolution API
    console.log('📤 Enviando resposta via Evolution API...');
    await axios.post(
      'https://evolution.sua-instancia.com/message/sendText',
      {
        number: telefone,
        text: respostaTexto
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.EVOLUTION_API_KEY}`
        }
      }
    );
    
    await browser.close();
    res.json({ success: true, response: respostaTexto });
    
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// === EXECUTAR TOOL ===
async function executarTool(toolCall, context, pacienteId) {
  const { name, parameters } = toolCall;
  
  if (name === 'confirmar_agendamento') {
    return await confirmarAgendamento(context, parameters.agendamento_id, parameters.confirmacao);
  } else if (name === 'criar_agendamento') {
    return await criarAgendamento(context, parameters);
  } else if (name === 'consultar_disponibilidade') {
    return await consultarDisponibilidade(context, parameters);
  } else if (name === 'atualizar_orcamento') {
    return await atualizarOrcamento(context, parameters);
  }
}

// === DISPARAR MENSAGEM INICIAL (do Job) ===
app.post('/disparar-mensagem', async (req, res) => {
  try {
    const { pacienteId, telefone, tipo, contexto } = req.body;
    
    // 1. Definir template baseado no tipo
    const templates = {
      confirmacao_agendamento: `Olá ${contexto.paciente_nome}! 👋 Confirme sua presença na consulta de hoje às ${contexto.horario} com ${contexto.profissional}. Responda SIM ou NÃO`,
      aniversario: `🎉 Feliz Aniversário ${contexto.paciente_nome}! Aproveite o dia especial. Quer agendar uma avaliação? 🎁`,
      orcamento_aberto: `Oi ${contexto.paciente_nome}! Seu orçamento de ${contexto.procedimento} está aguardando aprovação. Quer conversar sobre parcelamento?`
    };
    
    const mensagem = templates[tipo];
    
    // 2. Criar registro na DB
    const sessionId = `conversa_${pacienteId}_${tipo}_${Date.now()}`;
    await db.query(
      `INSERT INTO whatsapp_conversations 
       (paciente_id, telefone, tipo_interacao, session_id, historico, status, data_inicio, ultima_atualizacao)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        pacienteId,
        telefone,
        tipo,
        sessionId,
        JSON.stringify([{ role: 'assistant', content: mensagem }]),
        'ativo'
      ]
    );
    
    // 3. Enviar via Evolution API
    await axios.post(
      'https://evolution.sua-instancia.com/message/sendText',
      {
        number: telefone,
        text: mensagem
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.EVOLUTION_API_KEY}`
        }
      }
    );
    
    res.json({ success: true, sessionId });
    
  } catch (error) {
    console.error('❌ Erro ao disparar mensagem:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('✅ API Processor rodando na porta 3000'));
```

---

## 📊 Fluxo Completo de um Caso Real

### Caso: João Silva - Confirmação de Agendamento

**09:00 AM - Job dispara**
```
Job: check-agendamentos-dia
→ Busca agendamentos de 2026-10-19
→ Encontra: João Silva, 14:00, Dr. Carlos, Limpeza
→ POST /disparar-mensagem:
  {
    "pacienteId": 26926607,
    "telefone": "5511987654321",
    "tipo": "confirmacao_agendamento",
    "contexto": { "paciente_nome": "João", "horario": "14:00", ... }
  }
```

**Evolution API envia no WhatsApp**
```
Mensagem: "Olá João! 👋 Confirme sua presença na consulta de hoje às 14:00 com Dr. Carlos. Responda SIM ou NÃO"
```

**14:30 (30 minutos depois) - João responde**
```
WhatsApp: "Sim, vou sim!"
↓
Evolution Webhook POST /evolution-webhook
↓
API Processor processa
↓
Busca contexto: tipo="confirmacao_agendamento", agendamento_id=324826659
↓
Busca paciente: João Silva, dados completos
↓
Monta contexto para GPT Maker
↓
GPT Maker processa:
  - Entende: "SIM" = confirmação positiva
  - Prepara tool: confirmar_agendamento(324826659, true)
  - Gera resposta: "Ótimo João! Te esperamos hoje às 14:00..."
↓
API Processor executa tool:
  - Chama: simples-dental-rpa/src/actions/appointments.js
  - Faz: PATCH /consultas/324826659 (marcar como confirmado)
  - Atualiza BD: INSERT agendamentos_confirmados
↓
Envia resposta via Evolution API
↓
João recebe: "Ótimo João! Te esperamos hoje às 14:00. Qualquer dúvida, é só chamar! 😊"
```

**Resultado:**
- ✅ Agendamento confirmado no Simples Dental
- ✅ Conversa registrada no BD local
- ✅ João recebeu resposta conversacional
- ✅ Tudo automatizado!

---

## 🚀 Implementação - Passos

### Fase 1: Setup Evolution API (1 semana)
- [ ] Criar conta Evolution API
- [ ] Configurar webhook URL
- [ ] Testar envio/recebimento mensagens
- [ ] Integrar autenticação

### Fase 2: API Processor (1 semana)
- [ ] Criar Express server
- [ ] Implementar webhook receiver
- [ ] Implementar disparador de mensagens
- [ ] Criar tabelas de BD

### Fase 3: GPT Maker Integration (1 semana)
- [ ] Integrar com API do GPT Maker
- [ ] Passar contexto correto
- [ ] Receber e processar tool calls
- [ ] Testar fluxo completo

### Fase 4: Worker Queue (1 semana)
- [ ] Implementar jobs (5 tipos)
- [ ] Integrar com scheduler
- [ ] Testes de carga
- [ ] Logs e monitoring

### Fase 5: Produção (1 semana)
- [ ] Deploy em servidor
- [ ] Testes com usuários reais
- [ ] Ajustes baseado em feedback
- [ ] Documentação final

---

## 📋 Checklist de Configuração

```
EVOLUTION API:
[ ] Account criada em evolution.sua-instancia.com
[ ] API Key gerada
[ ] Webhook configurado: https://sua-api.com/evolution-webhook
[ ] Número WhatsApp conectado
[ ] Teste: consegue enviar/receber mensagens

GPT MAKER:
[ ] Account ativo
[ ] API Key disponível
[ ] Endpoint documentado
[ ] Tools documentadas
[ ] Test_request funcionando

NODE.JS API:
[ ] Servidor rodando em production
[ ] HTTPS configurado
[ ] Environment variables setadas
[ ] Banco de dados em produção
[ ] Backups automáticos

SIMPLES DENTAL RPA:
[ ] Session ativa (npm run login rodado)
[ ] API endpoints acessíveis
[ ] BD local criado (simples-dental.db)
[ ] Funções prontas testadas
```

---

**Status:** ✅ Arquitetura 100% documentada para Evolution API + GPT Maker

**Próximo passo:** Quer que eu comece a implementar qual fase primeiro?
