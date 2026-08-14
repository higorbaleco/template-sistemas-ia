# ZAPIER - FLUXO DE AUTOMAÇÃO INTELIGENTE

## Objetivo
Automação que nÃO parece spam. Baseada em comportamento do lead.

---

## SETUP INICIAL

### 1. Conectar suas contas no Zapier
- [ ] WhatsApp Business (seu número)
- [ ] Google Sheets (pipeline)
- [ ] Gmail (optional, pra propostas)
- [ ] Calendly (optional, pra confirmações)

Link Zapier: https://zapier.com/

---

## ZAP 1: Lead respondeu positivo no WhatsApp → Iniciar cadência

**Nome:** "WhatsApp positivo → Agendar call"

**Trigger:** Nova mensagem no WhatsApp + contém keywords positivas
- "sim", "claro", "vamos conversar", "posso sim", "tá bom"

**Ações:**
1. Enviar mensagem (You) via WhatsApp:
```
"Perfeito! Qual dia você consegue bater um papo de 20 min?
(seg/qua/sex que funciona melhor?)"
```

2. Adicionar coluna no Google Sheets:
- Coluna: "Status" = "AGUARDANDO CALL"
- Coluna: "Última ação" = Data de hoje
- Coluna: "Próximo toque" = +2 dias

3. Enviar notificação seu WhatsApp (pessoal):
```
🔥 LEAD POSITIVO
[Nome]: respondeu com interesse
Próximo: agendar call
```

---

## ZAP 2: Lead não respondeu em 2 dias → Toque leve (Zapier)

**Nome:** "Sem resposta 2 dias → Lembrança leve"

**Trigger:** 2 dias após "AGUARDANDO CALL" no Google Sheets

**Ação:**
Enviar mensagem automática via WhatsApp:
```
"Oi, chegou? Sem pressa, mas achei que poderia fazer sentido pra vocês.

Se depois tiver interesse é só chamar.

Abs"
```

**Atualizar Google Sheets:**
- "Status" = "REMINDER_1"
- "Tentativas" = +1

**Importante:** Use BOT indicator ou tom que deixe claro que é automático
(Exemplo: "Opa, vendo minha msg anterior... Achei...")

---

## ZAP 3: Lead não respondeu em 5 dias → Enviar case

**Nome:** "Sem resposta 5 dias → Enviar case"

**Trigger:** 5 dias após "REMINDER_1"

**Ações:**

1. Se lead é E-COMMERCE:
   Enviar PDF case E-commerce via WhatsApp

2. Se lead é SOFTWARE HOUSE:
   Enviar PDF case SH

3. Se lead é EDUCAÇÃO:
   Enviar PDF case Educação

(Usar coluna "Segmento" no Google Sheets pra decidir qual case enviar)

**Mensagem antes do case:**
```
"Achei que esse case poderia fazer mais sentido pra vocês.

Depois tá aberto pra conversar?"
```

**Atualizar Google Sheets:**
- "Status" = "CASE_SENT"
- "Tentativas" = +1
- "Data case" = data

---

## ZAP 4: Lead não respondeu em 7 dias → Arquivar (reativar depois)

**Nome:** "Sem resposta 7 dias → Arquivo"

**Trigger:** 7 dias após "CASE_SENT"

**Ações:**

1. Enviar última mensagem:
```
"Sem pressa! Se depois tiver interesse, é só chamar. Fico por aqui."
```

2. Atualizar Google Sheets:
- "Status" = "COLD" (arquivo)
- "Data archive" = data
- "Reativar em" = +30 dias

3. Mover pra aba "LEADS FRIOS" (outro sheet)

---

## ZAP 5: Lead confirmou call → Preparar para você

**Nome:** "Call confirmado → Preparação"

**Trigger:** Mensagem contém "seg", "qua", "sex" (confirmação de dia)

**Ações:**

1. Enviar pra você via WhatsApp (seu número pessoal):
```
📞 CALL CONFIRMADO
[Nome]: [empresa]
[Segmento]: [qual]
[Dia/Hora]: [quando]
[Prep]: ver case [segmento], perguntar sobre [pain point]
```

2. No Google Sheets:
- "Status" = "CALL_SCHEDULED"
- "Data call" = [dia confirmado]

3. Enviar link Zoom/Meet automático:
```
"Perfeito! Vamos usar esse link: [seu link Zapier automático]

Sexta às 14h então. Até já!"
```

---

## ZAP 6: Call feito + Lead positivo → Propor diagnóstico

**Trigger:** MANUAL (você marca no Google Sheets "CALL_DONE" + "RESULTADO: POSITIVO")

**Ações:**

1. Enviar pra WhatsApp:
```
"Ótima conversa hoje!

Achei que faz bastante sentido pra vocês.

Próximo passo: a gente faz um diagnóstico técnico de 30 min 
(você + seu tech lead, sem compromisso).

Mapeamos tudo, propomos solução, vocês veem se faz sentido.

Qual dia essa semana?"
```

2. Google Sheets:
- "Status" = "DIAGNÓSTICO_PROPOSTO"
- "Data call" = preenchido
- "Resultado" = "Positivo"

---

## ZAP 7: Diagnóstico confirmado → Preparação técnica

**Trigger:** MANUAL (você marca "DIAGNÓSTICO_CONFIRMADO" + data)

**Ações:**

1. Notificação sua:
```
📋 DIAGNÓSTICO CONFIRMADO
[Nome]: [empresa]
[Data]: [quando]
[Prepare]: 
- Perguntas técnicas (doc)
- Fluxo operação deles
- Números KPI (se tiver)
```

2. WhatsApp pra lead:
```
"Ótimo! Diagnóstico então:

[Data/hora]
Você + seu tech lead

Vou mandar link Zoom com antecedência.

Grande abraço!"
```

---

## ZAP 8: Diagnóstico feito + Positivo → Proposta comercial

**Trigger:** MANUAL (você marca "DIAGNÓSTICO_FEITO" + "POSITIVO")

**Ações:**

1. Enviar proposta via PDF + WhatsApp:
```
"Excelente o diagnóstico!

Conforme conversamos, a solução seria:

[SUMÁRIO DE 3 LINHAS]

Próximo passo: se vocês concordarem, marcamos kick-off.

Quer que a gente fale de novo ou você avalia e me chama?"
```

2. Google Sheets:
- "Status" = "PROPOSTA_ENVIADA"
- "Data diagnóstico" = preenchido
- "Valor" = [preço da proposta]

---

## ZAP 9: Proposta enviada + Sem resposta em 3 dias → Toque

**Nome:** "Proposta + 3 dias → Follow-up"

**Trigger:** 3 dias após "PROPOSTA_ENVIADA"

**Ação:**
```
"Oi, tudo bem? Chegou certo a proposta?

Alguma dúvida sobre os números ou escopo? Posso ajudar."
```

---

## ZAP 10: Proposta aceita → Kick-off

**Trigger:** MANUAL (você marca "PROPOSTA_ACEITA")

**Ações:**

1. Notificação sua:
```
🎉 FECHOU!

[Nome]: [empresa]
[Valor]: R$ [X]
[Próximo]: Kick-off [data]
```

2. WhatsApp pra lead:
```
"Que isso! Parabéns! Vamos começar!

Kick-off na [dia/hora].

Agende suas pessoas-chave, vou enviar agenda."
```

3. Google Sheets:
- "Status" = "FECHADO"
- "Data fechamento" = hoje
- "Valor" = R$ [X]

---

## DASHBOARD NO GOOGLE SHEETS

### Aba "PIPELINE" - Visão geral

| Nome | Empresa | Segmento | Status | Tentativas | Última ação | Próximo toque | Dias em pipeline | Valor |
|------|---------|----------|--------|-----------|------------|---------------|-----------------|--------|
| João | E-com Inc | E-commerce | CALL_SCHEDULED | 1 | WhatsApp | 15/ago | 8 | - |
| Maria | SH Tech | Software | DIAGNÓSTICO_FEITO | 2 | Diagnostic call | 20/ago | 15 | 12K |
| Pedro | Edu Online | Educação | PROPOSTA_ENVIADA | 1 | Proposta | 25/ago | 10 | 8K |

### Aba "MÉTRICAS"

| Métrica | Valor | Meta | % |
|---------|-------|------|---|
| Leads entrada (mês) | 25 | 30 | 83% |
| Taxa resposta | 45% | 40% | ✓ |
| Leads qualificados (call confirmado) | 8 | 8 | ✓ |
| Diagnósticos feitos | 3 | 4 | 75% |
| Propostas enviadas | 2 | 2 | ✓ |
| Taxa conversão proposta → fechamento | 50% | 40% | ✓ |
| Vendas (mês) | 1 | 1 | ✓ |

---

## CONFIGURAÇÃO PASSO A PASSO

### Step 1: Criar Google Sheet "Pipeline Avraham"

Abas:
- "HOJE" (hoje = leads quentes)
- "PIPELINE" (todos em andamento)
- "COLD" (arquivados)
- "FECHADOS" (wins)
- "MÉTRICAS" (KPIs)

### Step 2: Conectar WhatsApp no Zapier

- Ir em: zapier.com → apps → WhatsApp
- Conectar seu número
- Autorizar integração

### Step 3: Criar Zap 1 (resposta positiva)

- Trigger: "Zapier WhatsApp" + "New Direct Message"
- Filtro: Message contains ("sim", "claro", "vamos")
- Action 1: "Zapier WhatsApp" + "Send Direct Message"
- Action 2: "Google Sheets" + "Add Row" (atualizar status)
- Action 3: "Zapier Slack/Email" + notificação sua

### Step 4: Criar Zap 2-4 (automações de follow-up)

Para cada Zap, seguir padrão:
- Trigger: Data/evento no Google Sheets
- Ação 1: Enviar mensagem WhatsApp
- Ação 2: Atualizar status Google Sheets

### Step 5: Configurar delays

Zapier permite delays:
- Zap 2: 2 dias após trigger
- Zap 3: 5 dias
- Zap 4: 7 dias
- Zap 9: 3 dias

---

## WEBHOOK ALTERNATIVO (Se Zapier não conseguir)

Se Zapier tiver limitação, usar Google Sheets + Apps Script (automação nativa):

1. Criar função no Google Sheets
2. Trigger: Daily (ou manual)
3. Verificar datas na coluna "Próximo toque"
4. Enviar mensagem (integração WhatsApp API)

Código básico:
```javascript
function checkFollowUps() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("PIPELINE");
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const proximoToque = new Date(data[i][7]); // Coluna "Próximo toque"
    const hoje = new Date();
    
    if (proximoToque <= hoje) {
      const status = data[i][3];
      const leadName = data[i][0];
      const phoneNumber = data[i][10]; // Assumindo coluna telefone
      
      // Enviar msg baseado em status
      if (status === "REMINDER_1") {
        sendWhatsApp(phoneNumber, "Oi, chegou minha msg? Sem pressa...");
      }
    }
  }
}
```

---

## MANUAL vs AUTOMÁTICO (Decidir por Zap)

| Ação | Manual | Automático |
|------|--------|-----------|
| Resposta positiva | Automático (Zap 1) | ✓ |
| Reminder dia 2 | Automático (Zap 2) | ✓ |
| Enviar case dia 5 | Automático (Zap 3) | ✓ |
| Arquivo dia 7 | Automático (Zap 4) | ✓ |
| Call confirmado | Automático + sua notif (Zap 5) | ✓ |
| Propor diagnóstico | VOCÊ marca resultado call | Manual |
| Enviar proposta | VOCÊ marca diagnóstico positivo | Manual |
| Toque proposta +3d | Automático (Zap 9) | ✓ |

**Regra:** Tudo que é "lembrete sem decisão" = Automático. Tudo que precisa de julgamento = Manual.

---

## CHECKLIST ANTES DE ATIVAR

- [ ] 10 WhatsApp templates preparados
- [ ] Google Sheets criada (5 abas)
- [ ] Zapier account criada
- [ ] WhatsApp conectada no Zapier
- [ ] Google Sheets conectada no Zapier
- [ ] 10 Zaps criados (Zap 1-9)
- [ ] Cada Zap testado com lead fictício
- [ ] Notificação sua configurada (SMS/Slack/Email)
- [ ] Delay dos Zaps confirmado (2, 5, 7 dias)
- [ ] Google Sheets compartilhada com você
- [ ] Dashboard "MÉTRICAS" preenchida com metas

---

## IMPORTANTE

🔔 **Não ative todas as automações de uma vez**

Comece com Zap 1 (resposta positiva) testado.
Depois ativa Zap 2, 3, 4 (reminders).

Assim você não manda 10 mensagens automáticas pra ninguém sem querer.

💡 **Teste com você mesmo ANTES**

Mande mensagem pra você que contém "sim" e veja se Zap 1 funciona.

🎯 **Log de tudo**

Sempre adicione ao Google Sheets qual Zap rodou.
Coluna: "Último automação" = qual Zap disparou

---

## MÉTRICAS ZAPIER

Monitorar no dashboard Zapier:
- Zaps criados
- Task runs/mês (consumo)
- Taxa de sucesso (devem ser 95%+)
- Erros (se tiver, debugar)

Se muito volume de task runs (limite Zapier é limited), considerar upgrade de plano.

