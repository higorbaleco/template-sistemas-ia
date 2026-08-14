# Guia de Implementação: Prospecção Automatizada
## Passo-a-passo funcional

---

## FASE 1: SETUP GOOGLE SHEETS

### 1.1 Criar planilha

1. Abrir Google Sheets
2. Criar nova planilha "Pipeline Prospecção 2026"
3. Renomear primeira aba para "PROSPECTOS_ATIVOS"

### 1.2 Colunas (copie exatamente)

```
A: Data_Coletada
B: Empresa
C: Segmento
D: Nome_Contato
E: Cargo
F: Email
G: LinkedIn_URL
H: Website
I: Status
J: Fit_Score
K: MEDDPICC_Score
L: Recomendacao
M: Motivo_Descarte
N: Abordagem_LinkedIn
O: Email_Assunto
P: Email_Corpo
Q: WhatsApp_Mensagem
R: Data_Proximo_Contato
S: Notas
T: Criado_Por
U: Ultima_Atualizacao
```

### 1.3 Formatação

**Linha 1:** Inserir > Validação de dados

```
Coluna C (Segmento):
- SaaS
- Ecommerce
- Manufatura
- Consultoria
- Healthcare
- Educação
- Financeiro
- Varejo
- Outro

Coluna I (Status):
- Pendente
- Qualificado
- Em_Pesquisa
- Descartado
- Contato_Enviado

Coluna K (Score):
- Tipo: Número
- Intervalo: 0-100
```

### 1.4 Cores e filtros

**Linha 1:** Formatar > Cor de fundo = Cinza escuro
**Linha 1:** Formatar > Cor de texto = Branco

**Filtro automático:**
1. Dados > Criar filtro
2. Clique nos três pontos > Filtro avançado

**Views (optional):**
- View "Hoje": Filtro (Status = Qualificado E Data_Proximo_Contato = Hoje)
- View "Priority": Filtro (Fit_Score >= 7)

---

## FASE 2: CONFIGURAR ZAPIER

### 2.1 Criar conta Zapier (se não tiver)
1. zapier.com/sign-up
2. Logar ou criar
3. Dashboard > Create Zap

### 2.2 Zap 1: Webhook → Sheets (Manual Test First)

**Trigger:**
- Escolha: Webhooks by Zapier > Catch Raw Hook
- Salve o URL do webhook (você vai usar)

**Action 1:**
- Escolha: OpenAI (ou Claude via API)
- Prompt: [copie PROSP-002 - Normalizador]
- Input: {{raw_body}} (do webhook)
- Role: Você é um normalizador de dados

**Action 2:**
- Escolha: Google Sheets > Create Spreadsheet Row
- Spreadsheet: Pipeline Prospecção 2026
- Worksheet: PROSPECTOS_ATIVOS
- Mapeamento de campos:
  ```
  A (Data_Coletada) ← {{now}}
  B (Empresa) ← {{output OpenAI - empresa}}
  C (Segmento) ← {{output OpenAI - segmento}}
  D (Nome_Contato) ← {{output OpenAI - contato.nome}}
  E (Cargo) ← {{output OpenAI - contato.cargo}}
  F (Email) ← {{output OpenAI - contato.email}}
  G (LinkedIn_URL) ← {{output OpenAI - contato.linkedin_profile}}
  H (Website) ← {{output OpenAI - empresa.site}}
  I (Status) ← Pendente
  J (Fit_Score) ← {{output OpenAI - fit_score}}
  K (MEDDPICC_Score) ← [vazio por enquanto]
  L (Recomendacao) ← [vazio por enquanto]
  M (Motivo_Descarte) ← [vazio por enquanto]
  T (Criado_Por) ← {{extensao_user}}
  U (Ultima_Atualizacao) ← {{now}}
  ```

**Teste:**
1. Clique "Send Test Data"
2. Cole este JSON:
```json
{
  "empresa": "Acme Corp",
  "site": "https://acme.com",
  "linkedin_url": "https://linkedin.com/company/acme",
  "segmento": "SaaS",
  "tamanho": "101-500",
  "contato": {
    "nome": "João Silva",
    "cargo": "CEO",
    "email": "joao@acme.com",
    "linkedin_profile": "https://linkedin.com/in/joaosilva"
  },
  "source": "linkedin"
}
```
3. Clique "Test Action"
4. Verificar que linha foi adicionada ao Sheets

**Publicar o Zap:**
1. Clique "Publish"
2. Copie o Webhook URL

---

### 2.3 Zap 2: Daily Qualification (9am)

**Trigger:**
- Escolha: Schedule > Every day at
- Horário: 09:00 (seu timezone)

**Action 1:**
- Escolha: Google Sheets > Get All Spreadsheet Rows
- Spreadsheet: Pipeline Prospecção 2026
- Worksheet: PROSPECTOS_ATIVOS
- Filtro: Status = "Pendente"

**Action 2:**
- Escolha: Looping > Loop Over Line Items
- Items: {{data}} (das linhas acima)

**Action 3:** (dentro do loop)
- Escolha: OpenAI (Claude)
- Prompt: [copie PROSP-003 - MEDDPICC]
- Input: 
```
Empresa: {{item - B}}
Cargo: {{item - E}}
Segmento: {{item - C}}
Tamanho: {{item - H}}
```

**Action 4:** (dentro do loop)
- Escolha: Google Sheets > Update Spreadsheet Row
- Spreadsheet: Pipeline Prospecção 2026
- Worksheet: PROSPECTOS_ATIVOS
- Row Index: {{item - Row Number}}
- Mapeamento:
```
K (MEDDPICC_Score) ← {{output OpenAI - score}}
L (Recomendacao) ← {{output OpenAI - recomendacao}}
M (Motivo) ← {{output OpenAI - motivo}}
I (Status) ← {{output OpenAI - fase}}
```

**Publicar:** Clique Publish

---

### 2.4 Zap 3: Gerar Abordagens (quando qualificado)

**Trigger:**
- Escolha: Google Sheets > New Spreadsheet Row
- Spreadsheet: Pipeline Prospecção 2026
- Worksheet: PROSPECTOS_ATIVOS
- Filtro: Status = "Qualificado"

**Action:**
- Escolha: OpenAI (Claude)
- Prompt: [copie PROSP-004 - Abordagem Personalizada]
- Input:
```
empresa: {{B}}
nome: {{D}}
cargo: {{E}}
email: {{F}}
segmento: {{C}}
fit_score: {{J}}
meddpicc_score: {{K}}
```

**Action 2:**
- Escolha: Google Sheets > Update Spreadsheet Row
- Row Index: {{Row Number}}
- Mapeamento:
```
N (Abordagem_LinkedIn) ← {{output.linkedin}}
O (Email_Assunto) ← {{output.email.assunto_opcao_a}}
P (Email_Corpo) ← {{output.email.corpo}}
Q (WhatsApp_Mensagem) ← {{output.whatsapp[0]}} + {{output.whatsapp[1]}} + {{output.whatsapp[2]}}
```

**Publicar:** Clique Publish

---

## FASE 3: CONFIGURAR EXTENSÃO CLAUDE

### 3.1 Código da Extensão (manifest.json)

```json
{
  "manifest_version": 3,
  "name": "Prospect Finder",
  "version": "1.0",
  "description": "Extrai dados de prospect com um clique",
  "permissions": ["scripting", "activeTab"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "host_permissions": [
    "<all_urls>"
  ]
}
```

### 3.2 Popup HTML (popup.html)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            width: 400px;
            padding: 15px;
            font-family: sans-serif;
            background: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h2 {
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        button {
            width: 100%;
            padding: 10px;
            background: #2d9d78;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }
        button:hover {
            background: #24a070;
        }
        .status {
            margin-top: 10px;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
        }
        .status.success {
            background: #e8f5e9;
            color: #2e7d32;
            display: block;
        }
        .status.error {
            background: #ffebee;
            color: #c62828;
            display: block;
        }
        .status.loading {
            background: #e3f2fd;
            color: #1565c0;
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Prospect Finder</h2>
        <button id="extractBtn">Extrair Dados deste Prospect</button>
        <div id="status" class="status"></div>
    </div>
    <script src="popup.js"></script>
</body>
</html>
```

### 3.3 Logic (popup.js)

```javascript
document.getElementById('extractBtn').addEventListener('click', () => {
    const statusDiv = document.getElementById('status');
    
    statusDiv.className = 'status loading';
    statusDiv.textContent = 'Extraindo dados...';
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const url = tabs[0].url;
        
        // Executar script no page para extrair dados
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: extractData
        }, (results) => {
            const data = results[0].result;
            
            // Enviar para Zapier webhook
            const webhookUrl = "https://hooks.zapier.com/hooks/catch/YOUR-ZAPIER-ID/";
            
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    url_pagina: url,
                    timestamp: new Date().toISOString()
                })
            })
            .then(response => {
                statusDiv.className = 'status success';
                statusDiv.textContent = '✓ Dados enviados! Verifique o Sheets em alguns segundos.';
                setTimeout(() => window.close(), 2000);
            })
            .catch(error => {
                statusDiv.className = 'status error';
                statusDiv.textContent = '✗ Erro: ' + error.message;
            });
        });
    });
});

function extractData() {
    // Função que roda no contexto da página
    
    // Extrair dados do LinkedIn (se estiver em LinkedIn)
    if (window.location.hostname.includes('linkedin.com')) {
        const nome = document.querySelector('[data-field="profileName"]')?.textContent || 
                    document.querySelector('h1')?.textContent || '';
        const cargo = document.querySelector('[data-field="headline"]')?.textContent || 
                     document.querySelector('.headline')?.textContent || '';
        const email = document.querySelector('[data-field="email"]')?.textContent || '';
        const linkedin = window.location.href;
        
        // Extrair empresa da URL ou do perfil
        const urlParams = new URL(window.location).searchParams;
        const empresa = document.querySelector('[data-field="company"]')?.textContent || 
                       document.querySelector('.company')?.textContent || '';
        
        return {
            empresa: empresa,
            contato: {
                nome: nome.trim(),
                cargo: cargo.trim(),
                email: email.trim(),
                linkedin_profile: linkedin
            },
            source: 'linkedin',
            conteudo_pagina: document.body.innerText.substring(0, 1000)
        };
    }
    
    // Extrair dados de website genérico
    const meta = {
        description: document.querySelector('meta[name="description"]')?.content || '',
        keywords: document.querySelector('meta[name="keywords"]')?.content || '',
        og_title: document.querySelector('meta[property="og:title"]')?.content || ''
    };
    
    // Procurar email no HTML
    const emailMatch = document.body.innerHTML.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Procurar nome de empresa (h1, title, etc)
    const h1 = document.querySelector('h1')?.textContent || '';
    const title = document.title;
    
    return {
        empresa: h1 || title.split('|')[0],
        website: window.location.origin,
        email: email,
        source: 'website',
        meta_tags: meta,
        conteudo_pagina: document.body.innerText.substring(0, 1000)
    };
}
```

### 3.4 Instalação da Extensão

1. Crie pasta `prospect-finder/`
2. Crie arquivos: `manifest.json`, `popup.html`, `popup.js`, `icon.png` (16x16 pixel)
3. Chrome > Configurações > Extensões > Ativar modo de desenvolvedor
4. Clique "Carregar extensão" e selecione a pasta
5. Substitua "YOUR-ZAPIER-ID" pelo ID real do seu webhook Zapier

---

## FASE 4: TESTE END-TO-END

### Teste 1: Manual (sem extensão)

1. **Zapier:** Abra o Zap 1 (Webhook → Sheets)
2. **Zapier:** Clique "Send Test Data"
3. **Zapier:** Cole o JSON de teste
4. **Sheets:** Abra "Pipeline Prospecção 2026"
5. **Sheets:** Verifique se linha foi adicionada

### Teste 2: Verificar Qualificação

1. **Sheets:** Mude Status da linha para "Pendente"
2. **Zapier:** Abra o Zap 2 (Daily Qualification)
3. **Zapier:** Clique "Run Now"
4. **Sheets:** Aguarde 30 segundos
5. **Sheets:** Verifique se MEDDPICC_Score foi preenchido

### Teste 3: Verificar Abordagens

1. **Sheets:** Mude Status para "Qualificado"
2. **Zapier:** Abra o Zap 3
3. **Zapier:** Clique "Run Now"
4. **Sheets:** Aguarde 30 segundos
5. **Sheets:** Verifique colunas N, O, P, Q foram preenchidas

### Teste 4: Extensão (se instalada)

1. Abra LinkedIn
2. Vá para um perfil de prospect
3. Clique ícone da extensão
4. Clique "Extrair Dados deste Prospect"
5. Aguarde status de sucesso
6. Verifique Sheets

---

## FASE 5: AJUSTES E OTIMIZAÇÃO

### 5.1 Feedback Loop

Após 10-20 prospects processados:

1. Revise a accuracy:
   - Fit Score está acurado?
   - MEDDPICC Score está útil?
   - Abordagens estão boas?

2. Ajuste prompts:
   - Se Fit Score muito alto/baixo: ajuste pesos
   - Se Abordagem genérica: adicione mais contexto
   - Se muitos descartados: tighten critério

3. Adicione dados históricos:
   - Se você tem prospects anteriores, normalize e adicione
   - Isso dará mais contexto ao modelo

### 5.2 Escalas

Passo 1: 5-10 prospects/dia (teste)
Passo 2: 20-30 prospects/dia (estável)
Passo 3: 50+ prospects/dia (automação completa)

### 5.3 Métricas para acompanhar

```
A: Leads processados (semana)
B: Leads qualificados (% de A)
C: Contatos iniciados (% de B)
D: Respostas recebidas (% de C)
E: Reuniões agendadas (% de D)
F: Taxa de conversão final (% de A)
```

---

## CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Google Sheets criada com todas as colunas
- [ ] Validações de dados aplicadas
- [ ] Zapier Zap 1 (Webhook → Sheets) ativo
- [ ] Zapier Zap 2 (Daily Qualification) ativo
- [ ] Zapier Zap 3 (Gerar Abordagens) ativo
- [ ] Teste manual com JSON de teste bem-sucedido
- [ ] Extensão Claude instalada e configurada
- [ ] Webhook URL copiado corretamente na extensão
- [ ] 10 prospects testados end-to-end
- [ ] Prompts ajustados baseado em feedback
- [ ] Dashboard de métricas criado
- [ ] Time treinado no processo

---

## TROUBLESHOOTING

### "Zap não dispara"
- Verifique se está Publicado (not Draft)
- Verificar logs no Zapier > Task History
- Verificar se filtros estão corretos

### "Dados não aparecem no Sheets"
- Abrir Zapier > Task History
- Procurar por erros na action "Create Row"
- Verificar se nomes de coluna estão exatamente iguais

### "Abordagem está vazia"
- Verificar que Status = "Qualificado" antes de rodar Zap 3
- Verificar se OpenAI/Claude API está conectada no Zapier
- Verificar credenciais de API

### "Extensão não envia dados"
- Abrir Console do Chrome (F12 > Console)
- Procurar por erros de fetch ou CORS
- Verificar Webhook URL está correto
- Verificar se Zap 1 está ativo

---

## SUPORTE E ITERAÇÃO

1. **Semana 1:** Setup e teste
2. **Semana 2:** Processamento manual de 20 prospects
3. **Semana 3:** Feedback e ajuste de prompts
4. **Semana 4:** Automação completa (9am daily)
5. **Mês 2:** Escalar volume e medir conversão
