# 🆓 Solução 100% Gratuita & Local

Arquitetura minimalista rodando no seu PC/servidor local, sem custos, consumindo dados diariamente.

---

## 📊 Opções de Solução FREE

| Opção | Custo | Setup | Complexidade | 24/7 | Melhor Para |
|-------|-------|-------|-------------|------|------------|
| **Local Node.js (Cron)** | R$ 0 | 1 dia | Baixa | Se máquina ligada | MVP testando |
| **Google Cloud Functions** | R$ 0 | 2 dias | Média | ✅ SIM | Produção light |
| **AWS Lambda** | R$ 0 | 2 dias | Média | ✅ SIM | Escala |
| **N8N Self-hosted** | R$ 0 | 2 dias | Muito Baixa | Se máquina ligada | Sem código |
| **Zapier** | R$ 10-30/mês | 3h | Muito Baixa | ✅ SIM | Mais fácil |

---

## ✅ RECOMENDAÇÃO: Local Node.js + Cron (MAIS SIMPLES)

```
Seu PC/Servidor
├─ Node.js script
├─ Cron Job (agendado)
├─ JSON local (histórico)
└─ Evolution API (disparador WhatsApp)

Fluxo:
09:00 AM → Cron executa script
         → Busca agendamentos (Simples Dental API)
         → Dispara no WhatsApp (Evolution API)
         → Salva em JSON local
         → Pronto! Espera próximo dia
```

**Custo:** R$ 0  
**Tempo:** 1 dia para setup  
**Complexidade:** Muito baixa

---

## 🏗️ Arquitetura Local (Solução Gratuita)

```
┌──────────────────────────────┐
│   SEU PC/SERVIDOR LOCAL      │
│  (Pode ser até Raspberry Pi) │
│                              │
│  ┌────────────────────────┐  │
│  │  Node.js Script        │  │
│  │  - index.js            │  │
│  │  - config.json         │  │
│  └────────────┬───────────┘  │
│               │              │
│  ┌────────────▼───────────┐  │
│  │  Cron Job              │  │
│  │  (Windows Task         │  │
│  │   ou Linux cron)       │  │
│  └────────────┬───────────┘  │
│               │              │
│  ┌────────────▼───────────┐  │
│  │  JSON Local            │  │
│  │  - conversas.json      │  │
│  │  - agendamentos.json   │  │
│  │  - log.json            │  │
│  └────────────────────────┘  │
│                              │
└──────────────┬───────────────┘
               │ (HTTPS)
      ┌────────▼────────┐
      │  Evolution API  │
      │  (WhatsApp)     │
      └────────┬────────┘
               │
         ┌─────▼─────┐
         │  Paciente │
         │  WhatsApp │
         └───────────┘
```

---

## 💾 Estrutura de Arquivos (Local)

```
seu-projeto/
├─ index.js              # Script principal
├─ config.json           # Configurações (Evolution API key, etc)
├─ data/
│  ├─ conversas.json     # Histórico de conversas
│  ├─ agendamentos.json  # Agendamentos confirmados
│  ├─ follow_ups.json    # Follow-ups agendados
│  └─ log.json           # Log de execuções
├─ .env                  # (NÃO versiona!) Senhas
└─ package.json          # Dependências
```

---

## 🔧 Script Simples (index.js)

```javascript
// solucao-local-gratis/index.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 1. CARREGAR CONFIG
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// 2. CARREGAR/CRIAR DADOS LOCAIS
const dataDir = './data';
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const convFile = path.join(dataDir, 'conversas.json');
const agendFile = path.join(dataDir, 'agendamentos.json');

let conversas = fs.existsSync(convFile) ? JSON.parse(fs.readFileSync(convFile)) : {};
let agendamentos = fs.existsSync(agendFile) ? JSON.parse(fs.readFileSync(agendFile)) : [];

// 3. BUSCAR AGENDAMENTOS DO SIMPLES DENTAL
async function buscarAgendamentosDia() {
  console.log('📅 Buscando agendamentos de hoje...');
  
  const hoje = new Date();
  const startDh = hoje.toISOString();
  
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const endDh = amanha.toISOString();
  
  try {
    // Usar a RPA que você já criou
    const { openContext } = require('./simples-dental-rpa/src/browser.js');
    const { listAppointments } = require('./simples-dental-rpa/src/actions/appointments.js');
    
    const { browser, context } = await openContext();
    
    const agends = await listAppointments(context, startDh, endDh);
    
    await browser.close();
    
    return agends;
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos:', error.message);
    return [];
  }
}

// 4. DISPARAR NO WHATSAPP (Evolution API)
async function dispararWhatsApp(telefone, mensagem) {
  console.log(`📤 Enviando WhatsApp para ${telefone}...`);
  
  try {
    await axios.post(
      `${config.evolution_api_url}/message/sendText`,
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
    
    console.log(`✅ Enviado para ${telefone}`);
  } catch (error) {
    console.error(`❌ Erro ao enviar para ${telefone}:`, error.message);
  }
}

// 5. SALVAR HISTÓRICO LOCAL
function salvarDado(tipo, dados) {
  const file = path.join(dataDir, `${tipo}.json`);
  
  let conteudo = {};
  if (fs.existsSync(file)) {
    conteudo = JSON.parse(fs.readFileSync(file));
  }
  
  conteudo[new Date().toISOString()] = dados;
  
  fs.writeFileSync(file, JSON.stringify(conteudo, null, 2));
  console.log(`💾 Salvo em ${tipo}.json`);
}

// 6. EXECUTAR DIARIAMENTE
async function executar() {
  console.log('\n========================================');
  console.log(`🚀 Executando: ${new Date().toLocaleString()}`);
  console.log('========================================\n');
  
  // Buscar agendamentos
  const agends = await buscarAgendamentosDia();
  console.log(`📊 Encontrados ${agends.length} agendamentos\n`);
  
  // Para cada agendamento, disparar no WhatsApp
  for (const agend of agends) {
    const { id, paciente, data, profissional } = agend;
    const telefone = paciente.telefone;
    
    // Não enviar duplicado
    if (agendamentos.find(a => a.id === id && a.data_envio)) {
      console.log(`⏭️  ${paciente.nome} já foi contatado hoje, pulando...`);
      continue;
    }
    
    // Montar mensagem
    const hora = new Date(data).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const mensagem = `Olá ${paciente.nome}! 👋 Confirme sua presença na consulta de hoje às ${hora} com ${profissional.nome}. Responda SIM ou NÃO`;
    
    // Enviar
    await dispararWhatsApp(telefone, mensagem);
    
    // Registrar localmente
    agendamentos.push({
      id,
      paciente_nome: paciente.nome,
      telefone,
      data_envio: new Date().toISOString(),
      confirmado: false
    });
  }
  
  // Salvar dados
  salvarDado('agendamentos', agendamentos);
  
  console.log('\n✅ Execução concluída!');
}

// 7. EXECUTAR E AGENDAR PRÓXIMA VEZ
if (require.main === module) {
  executar().catch(console.error);
}

module.exports = { executar };
```

---

## ⏰ Como Agendar para Rodar Diariamente

### **Windows (Task Scheduler)**

```powershell
# 1. Abra Task Scheduler
tasksched.msc

# 2. Create Basic Task
# Nome: Simples Dental Automação
# Trigger: Daily at 09:00 AM
# Action: 
#   Program: C:\Program Files\nodejs\node.exe
#   Arguments: C:\seu-projeto\index.js
#   Start in: C:\seu-projeto
```

### **Mac/Linux (Cron)**

```bash
# 1. Abra crontab
crontab -e

# 2. Adicione linha (09:00 AM diariamente)
0 9 * * * cd /seu/projeto && node index.js >> log.txt 2>&1

# 3. Salve (Ctrl+X, Y, Enter se for nano)
```

---

## 📋 config.json (Configurações)

```json
{
  "simples_dental": {
    "email": "contato@avrahamdigital.com.br",
    "base_url": "https://app.simplesdental.com"
  },
  "evolution_api": {
    "url": "https://evolution.sua-instancia.com",
    "key": "USAR VARIÁVEL DE AMBIENTE"
  },
  "horarios": {
    "confirmacao": "09:00",
    "aniversario": "08:00",
    "orcamento": "10:00"
  },
  "templates": {
    "confirmacao_agendamento": "Olá {nome}! Confirme sua presença na consulta de hoje às {hora} com {profissional}. Responda SIM ou NÃO",
    "aniversario": "🎉 Feliz Aniversário {nome}! Aproveite o dia especial. Quer agendar uma avaliação? 🎁",
    "orcamento": "Oi {nome}! Seu orçamento de {procedimento} está aguardando sua aprovação. Quer conversar sobre parcelamento?"
  }
}
```

---

## 🌐 Alternativa: Google Cloud Functions (Também FREE)

Se você quer que rode **24/7 sem sua máquina ligada**:

```javascript
// Deploy no Google Cloud Functions (gratuito)
const functions = require('@google-cloud/functions-framework');

functions.http('agendarConfirmacao', async (req, res) => {
  // Mesmo código acima
  await executar();
  res.send('✅ Executado');
});

// Dispara via Cloud Scheduler (1 job/dia = grátis)
```

**Vantagem:** Roda 24/7, sem sua máquina
**Desvantagem:** Setup mais complexo

---

## 🎯 Plano MINIMALISTA (Recomendado)

### **Semana 1: Setup Local**

```
✅ Dia 1:
  - Copiar script index.js
  - Criar config.json
  - npm install (axios, fs, path)

✅ Dia 2:
  - Integrar com Simples Dental RPA
  - Testar: node index.js (manual)
  - Verificar se mensagem chega no WhatsApp

✅ Dia 3-5:
  - Agendar com Cron/Task Scheduler
  - Deixar rodar automaticamente
  - Verificar logs

✅ Resultado:
  - Confirmação de agendamentos automática
  - Custo: R$ 0
  - Seu PC/servidor rodando script
```

### **Semana 2-4: Adicione Mais Fluxos**

```
✅ Aniversariante (8:00 AM)
✅ Orçamento aberto (10:00 AM Segunda)
✅ Follow-up (automático quando criado)

Sempre salvando em JSON local para histórico.
```

---

## 📊 Dados Salvos Localmente

### **conversas.json**
```json
{
  "2026-10-19T09:30:00Z": {
    "paciente_id": 26926607,
    "paciente_nome": "João Silva",
    "telefone": "5511987654321",
    "tipo": "confirmacao_agendamento",
    "mensagem_enviada": "Olá João! Confirme sua presença...",
    "status": "enviado"
  }
}
```

### **agendamentos.json**
```json
{
  "2026-10-19T09:30:00Z": [
    {
      "agendamento_id": 324826659,
      "paciente_nome": "João Silva",
      "telefone": "5511987654321",
      "data_envio": "2026-10-19T09:30:00Z",
      "confirmado": false
    }
  ]
}
```

### **log.json**
```json
{
  "2026-10-19T09:00:00Z": {
    "status": "iniciado",
    "agendamentos_encontrados": 5,
    "agendamentos_enviados": 5,
    "erros": 0,
    "tempo_ms": 2345
  }
}
```

---

## ✅ Checklist para Começar

```
SETUP:
[ ] Clonar/baixar o repo simples-dental-rpa
[ ] npm install (axios, dotenv)
[ ] Criar config.json
[ ] Criar .env com EVOLUTION_API_KEY
[ ] Criar pasta data/

TESTE:
[ ] Rodar: node index.js (manual)
[ ] Verificar se busca agendamentos
[ ] Verificar se dispara WhatsApp
[ ] Verificar se salva em JSON

DEPLOY:
[ ] Windows: Agendar em Task Scheduler
[ ] Mac/Linux: Adicionar em crontab
[ ] Deixar rodando
[ ] Verificar logs diariamente

OPCIONAL (depois):
[ ] Adicionar mais templates
[ ] Adicionar mais horários
[ ] Integrar com GPT Maker (respostas)
```

---

## 💰 Custo Total

```
Inicial: R$ 0
Mensal: R$ 0

Se quiser rodar 24/7 sem máquina:
  Google Cloud Functions: R$ 0 (até 2M invocações/mês gratuitas)
  + Cloud Scheduler: R$ 0 (até 3 jobs grátis)
```

---

## 🚀 COMEÇAR AGORA?

**Quer que eu:**

1. ✅ **Crie o script completo** (index.js pronto pra rodar)
2. ✅ **Configure tudo** (config.json + .env template)
3. ✅ **Teste localmente** (você roda uma vez, vê funcionando)
4. ✅ **Explique como agendar** (Task Scheduler ou cron)

**Resultado:** Sistema rodando em **1 dia**, **R$ 0**, sem servidor pago

**Topou?** 🎯
