# SETUP PRÁTICO PASSO A PASSO
## Sistema Comercial Previsível - Configuração Real

**Tempo total:** 6-8 horas (Semana 1)
**Ferramenta:** Google Sheets, Zapier, Mailchimp, Gmail, WhatsApp Business
**Resultado:** Sistema 100% rodando

---

## PARTE 1: GOOGLE SHEETS (Dashboard Central)
**Tempo:** 1 hora | **Dificuldade:** Fácil

### PASSO 1.1: Criar Planilha

1. Abra https://sheets.google.com
2. Clique em "+" (Criar nova planilha)
3. Nome: `Funil Avraham Digital`
4. Salve

### PASSO 1.2: Criar ABA 1 - "HOJE"

Sua primeira aba. Isso é seu dashboard diário.

**Cabeçalhos (primeira linha):**
```
A: Data
B: Status
C: Nome
D: Segmento
E: Score
F: Próxima Ação
G: Valor
H: Notas
```

**Dados de exemplo (copie e adapte):**
```
Data: 30/07/2026
Status: QUENTE
Nome: Roberto Silva
Segmento: REST (ou IMOB, CONC, ECOM)
Score: 95
Próxima Ação: Call 14h
Valor: 5000
Notas: Demo agendada
```

**Formatação (pra ficar bonito):**
- Primeira linha: **negrito** + fundo azul
- Coluna B (Status): cor vermelha se QUENTE, laranja se MORNO, cinza se FRIO
- Coluna E (Score): números grandes (16pt)

**Resumo abaixo (linha 20):**
```
RESUMO DO DIA (30/07)
Entrada: 6 (meta: 6-10)
Quentes: 3
Mornos: 5
Frios: 12
Demos: 2
Propostas: 1
```

### PASSO 1.3: Criar ABA 2 - "PIPELINE"

Todos os leads em um lugar.

**Cabeçalhos:**
```
A: ID
B: Data Entrada
C: Nome
D: Segmento
E: Canal (LinkedIn/Email/Call/Ref)
F: Score
G: Status
H: Valor
I: Próxima Ação
J: Última Atualização
```

**Dados de exemplo:**
```
001 | 15/07 | Roberto | REST | LinkedIn | 95 | QUENTE | 5K | Call hoje | 30/07
002 | 16/07 | Camila | IMOB | LinkedIn | 88 | QUENTE | 8K | Demo 14h | 30/07
003 | 17/07 | Fernando | CONC | Call | 72 | MORNO | 6K | Proposta | 30/07
...
```

**Resumo (embaixo):**
```
TOTAL PIPELINE
Leads: 50
Valor Total: 200K
Quentes (80+): 5 → 40K
Mornos (60-79): 12 → 80K
Frios (<60): 33 → 80K
```

### PASSO 1.4: Criar ABA 3 - "AUTOMACOES"

Status de cada automação rodando.

**Cabeçalhos:**
```
A: Automação
B: Status (✓ ATIVA / ⏸ PAUSADA)
C: Leads Envolvidos
D: Próxima Execução
E: Nota
```

**Dados:**
```
Email Seq REST | ✓ ATIVA | 12 | 30/07 | OK
Email Seq IMOB | ✓ ATIVA | 8 | 30/07 | OK
WhatsApp Follow | ✓ ATIVA | 12 | 30/07 | OK
Triggers Score | ✓ ATIVA | Real-time | 24/7 | OK
Reminders | ✓ ATIVA | Diário 08h | 30/07 | OK
```

### PASSO 1.5: Criar ABA 4 - "METRICAS_SEMANA"

KPIs atualizados semanalmente.

**Cabeçalhos:**
```
A: Métrica
B: Essa Semana
C: Meta
D: Variação
E: Trend
```

**Dados:**
```
Leads entrada | 42 | 40 | +5% | ↑
Taxa qualif | 85% | 80% | +5% | ↑
Demos agend | 6 | 5 | +20% | ↑
Propostas | 3 | 3 | 0% | →
Closings | 1 | 1 | 0% | →
Receita esp | 50K | 50K | 0% | →
```

### PASSO 1.6: Criar ABA 5 - "SEGMENTOS"

Performance por segmento (REST, IMOB, CONC, ECOM).

**Estrutura:**
```
         REST  IMOB  CONC  ECOM  TOTAL
Qtd      15    20    8     7     50
Quentes  2     2     1     0     5
Mornos   5     5     2     0     12
Frios    8     13    5     7     33

Taxa conv   20%   18%   12%   25%   18%
Ciclo(d)    18    24    28    14    21
Ticket      3.5K  5K    7K    2K    4.2K
Receita     10.5K 18K   6.7K  3.5K  38.7K
```

### RESULTADO PASSO 1:
✅ Google Sheets com 5 abas estruturadas
✅ Dashboard pronto pra dados
✅ Métricas visuais

---

## PARTE 2: CRIAR CONTA ZAPIER + INTEGRAÇÕES
**Tempo:** 1.5 hora | **Dificuldade:** Médio

### PASSO 2.1: Criar Conta Zapier

1. Abra https://zapier.com
2. Clique "Sign Up" (canto superior direito)
3. Email: seu email
4. Senha: senha forte
5. Confirme email (clique link que vai chegar)

### PASSO 2.2: Conectar Gmail

1. Dashboard Zapier → "My Apps"
2. Procure "Gmail"
3. Clique "Connect"
4. Selecione sua conta Google
5. Autorize Zapier acessar Gmail
6. ✅ Conectado

### PASSO 2.3: Conectar Google Sheets

1. "My Apps" → Procure "Google Sheets"
2. "Connect"
3. Autorize a conta
4. ✅ Conectado

### PASSO 2.4: Conectar WhatsApp Business

**Se você tiver WhatsApp Business API conectada:**
1. "My Apps" → Procure "WhatsApp"
2. "Connect"
3. Coloque seu Token da API
4. ✅ Conectado

**Se não tiver ainda:**
→ Vamos fazer isso depois (é mais complexo, pode ser manual por enquanto)

### PASSO 2.5: Criar Zap 1 - "Email Aberto = Score +5"

**Criar Zap:**
1. Dashboard → "Create Zap"
2. Trigger: Procure "Gmail"
3. Selecione "Email opened"
4. Conecte sua conta
5. Selecione: qualquer email (ou especifique lista)
6. Continuar

**Action:**
1. Procure "Google Sheets"
2. Selecione "Update Spreadsheet Row"
3. Conecte conta Google
4. Spreadsheet: `Funil Avraham Digital`
5. Worksheet: `PIPELINE`
6. Lookup column: F (Score)
7. Lookup value: [Score do email - você coloca manualmente conforme recebe]

**Problema:** Isso é meio manual porque Gmail não sabe quem é o lead.

**Solução melhor:** Vamos fazer por Email Marketing (Mailchimp) depois.

**Por enquanto:** Desativa esse Zap e vamos pro Mailchimp.

### RESULTADO PASSO 2:
✅ Zapier configurado
✅ Gmail, Google Sheets conectados
✅ Pronto pra próximos Zaps

---

## PARTE 3: MAILCHIMP - EMAIL SEQUENCES
**Tempo:** 1.5 hora | **Dificuldade:** Médio

### PASSO 3.1: Criar Conta Mailchimp

1. Abra https://mailchimp.com
2. "Sign Up"
3. Email + Senha
4. Confirme email

### PASSO 3.2: Criar Lista de Emails

**Pra Restaurantes:**
1. Dashboard → "Audience"
2. "Create Audience"
3. Nome: `Prospecting Restaurantes`
4. Descrição: `Emails de restaurantes pra prospecting`
5. Salve

**Repita pra:**
- `Prospecting Imobiliárias`
- `Prospecting E-commerce`

### PASSO 3.3: Criar Email Sequence - RESTAURANTES

**Email 1 (Disparar: Dia 0 - Imediatamente):**

1. Dashboard → "Campaigns"
2. "Create Campaign"
3. Selecione: "Email" → "Automation"
4. Selecione audience: `Prospecting Restaurantes`
5. Nome: `Email Seq REST - Template 1`
6. Salve

**Conteúdo Email 1:**
```
Assunto: 40% menos ligações pra [Nome Restaurante]?

Corpo (copiar do doc 02_SCRIPTS_ABORDAGEM):

Oi [Nome],

Tem um número que intriga bastante: 62% dos clientes desistem de pedir 
por WhatsApp se não responder em menos de 5 minutos.

Achei relevante porque vi que vocês têm [tipo de restaurante] e crescimento constante.

A gente coloca uma IA que responde esses pedidos em 3 segundos, mesmo fora do horário.

Resultado? Clientes que iam pra concorrência agora viraram receita extra.

Quer ver como funciona em 10 minutos?

[Link calendly seu]

[Seu nome]
```

7. Salve como Rascunho
8. **NÃO ENVIE AINDA** (vamos fazer manualmente na semana 1)

**Email 2 (Disparar: Dia 3):**

Faça igual Email 1, mas com conteúdo do Email 2 (doc 02).

**Email 3, 4, 5:** Faça igual (dias 7, 11, 14)

### PASSO 3.4: Repetir pra IMOBILIÁRIAS e E-COMMERCE

Faça exatamente igual, mas com templates de cada segmento (doc 02).

### RESULTADO PASSO 3:
✅ Mailchimp configurado
✅ 3 listas criadas (REST, IMOB, ECOM)
✅ Email sequences prontas (15 emails total)
✅ Prontas pra disparar na semana 1

---

## PARTE 4: WHATSAPP BUSINESS (Se aplicável)
**Tempo:** 1-2 horas | **Dificuldade:** Alto

### PASSO 4.1: Você JÁ tem WhatsApp Business?

**Opção A: Usar WhatsApp Business que você já tem**
1. Abra WhatsApp Business no celular
2. Vá em Configurações → API Business
3. Gere um token (salve em um lugar seguro)
4. Depois vamos conectar no Zapier

**Opção B: Criar WhatsApp Business novo**
1. Abra https://www.whatsapp.com/business
2. Baixe app WhatsApp Business
3. Configure conta business
4. Depois gere token

**Se não quer complicar:**
→ Por enquanto, use WhatsApp normal seu pessoal
→ Vamos manualizar contato inicial até WhatsApp Business estar setup

### RESULTADO PASSO 4:
✅ WhatsApp pronto
✅ Token salvo (pra depois)

---

## PARTE 5: ZAPIER - AUTOMAÇÕES FINAIS
**Tempo:** 1.5 horas | **Dificuldade:** Médio

### PASSO 5.1: Zap 2 - "Novo WhatsApp = Adiciona no Sheet"

**Trigger:**
1. Novo Zap
2. Procure "WhatsApp"
3. Selecione "New Message"
4. Conecte WhatsApp Business (se tiver)
5. Selecione seu número WhatsApp
6. Continuar

**Action:**
1. Google Sheets
2. "Add Spreadsheet Row"
3. Spreadsheet: `Funil Avraham Digital`
4. Worksheet: `PIPELINE`
5. Mapeie campos:
   - Data Entrada: TODAY
   - Nome: [Nome de quem mandou mensagem]
   - Segmento: [deixe em branco por enquanto]
   - Canal: WhatsApp
   - Score: 10 (iniciante)
   - Status: NOVO
   - Próxima Ação: Qualificação
6. Teste: mande uma mensagem pro seu WhatsApp
7. Salve o Zap

### PASSO 5.2: Zap 3 - "Calendly Agendado = Notificação"

**Trigger:**
1. Novo Zap
2. Procure "Calendly"
3. "New Event Scheduled"
4. Conecte Calendly (clique link pra autorizar)
5. Continuar

**Action:**
1. Procure "Slack" (se tiver) OU "Gmail"
2. Se Slack:
   - "Send Channel Message"
   - Canal: seu canal pessoal
   - Mensagem: "🚀 [Nome] agendou demo em [data/hora]"
3. Se Gmail:
   - "Send Email"
   - Destinatário: seu email
   - Assunto: "ALERTA: [Nome] agendou demo!"
   - Corpo: Detalhes do agendamento
4. Salve

### PASSO 5.3: Zap 4 - "Atualizar Score no Sheet"

**Manual por enquanto:**

Quando um lead responder positivamente no WhatsApp:
1. Vá pro Sheet
2. Coluna E (Score)
3. Mude score manualmente
4. Depois automatizamos com IA

**Nota:** Isso fica melhor quando você treinar sua IA própria.

### RESULTADO PASSO 5:
✅ 3 Zaps principais criados
✅ WhatsApp → Google Sheets automático
✅ Calendly → Notificação automática
✅ Sistema de automação básico rodando

---

## PARTE 6: SETUP DE LINKEDIN (Manual)
**Tempo:** 30 min | **Dificuldade:** Fácil

### PASSO 6.1: Preparar Templates

1. Abra seu Google Drive
2. Crie documento: "Templates LinkedIn"
3. Copie do doc 02_SCRIPTS:
   - Template 1 Restaurante
   - Template 1 Imobiliária
   - Template 1 E-commerce
4. Personalize com seus dados
5. Salve

### PASSO 6.2: Preparar Lista de Contatos

1. Abra Google Sheets
2. Nova aba: "LinkedIn Contatos"
3. Colunas:
   ```
   A: Nome
   B: Título
   C: Empresa
   D: URL LinkedIn
   E: Segmento
   F: Status (Não enviado/Enviado/Respondeu/Negativo)
   G: Data Envio
   H: Resposta
   ```

4. Busque 20-30 contatos por segmento
5. Copie dados (nome, empresa, URL)
6. Salve

### RESULTADO PASSO 6:
✅ Templates prontos pra copiar
✅ Lista de contatos organizada
✅ Pronto pra começar Monday

---

## PARTE 7: TESTE TUDO
**Tempo:** 1 hora | **Dificuldade:** Fácil

### PASSO 7.1: Teste Google Sheets

1. Abra sua planilha
2. Adicione 3 leads fictícios
3. Veja se as abas estão funcionando
4. Revise formatação

### PASSO 7.2: Teste Zapier

1. Dashboard Zapier → "Zaps"
2. Veja se todos aparecem
3. Cada Zap: clique "Test"
4. Mande um teste (ex: mensagem WhatsApp fictícia)
5. Veja se aparece no Sheet

### PASSO 7.3: Teste Mailchimp

1. Dashboard Mailchimp
2. Vá pra cada campaign
3. Simule envio (envie pra seu email)
4. Receba email, veja se chegou
5. Clique links pra confirmar

### PASSO 7.4: Teste WhatsApp

1. Mande mensagem pro seu WhatsApp Business
2. Veja se Zapier captou
3. Veja se adicionou no Sheet automaticamente
4. ✅ Se tudo funcionou

### RESULTADO PASSO 7:
✅ Tudo testado e funcionando
✅ Sistema 100% pronto

---

## RESUMO DO QUE VOCÊ TEM AGORA

```
✅ Google Sheets (5 abas, dashboard pronto)
✅ Mailchimp (3 listas, 15 email sequences prontas)
✅ Zapier (4 Zaps automáticos configurados)
✅ LinkedIn (Templates + Lista de contatos)
✅ WhatsApp (Pronto, Zaps conectados)
✅ Calendly (Conectado, notificações automáticas)
```

**Total:** Sistema de automação 100% operacional.

---

## PRÓXIMO PASSO (Segunda-feira)

1. Comece PROSPECTING (20 msgs LinkedIn)
2. Dispare Email Sequence pra 100 restaurantes (Mailchimp)
3. Faça 4-5 cold calls
4. Preencha CHECKLIST_DIARIO
5. Atualizar Dashboard conforme leads chegam

---

## SUPORTE RÁPIDO

**Zap não tá funcionando?**
→ Clique "Test" pra ver erro exato
→ Reconecte ferramenta (as vezes desconecta)

**Sheet não recebe dados?**
→ Veja se Zap tá ativo (azul)
→ Teste manualmente (Test)

**Email não chega?**
→ Procure spam
→ Veja se template tá em rascunho, não agendado

---

**Pronto! Sistema 100% configurado. Bora começar segunda?**

