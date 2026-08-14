# DASHBOARD CENTRAL - AVRAHAM DIGITAL

**Objetivo:** Uma única página (digital) onde você vê tudo que importa sobre seu funil de vendas em tempo real. Sem ter que abrir 5 abas diferentes.

---

## 1. ESTRUTURA DO DASHBOARD

```
┌─────────────────────────────────────────────────────────────────┐
│                    FUNIL VENDAS - AVRAHAM                       │
│                   Semana de 29/Jul - 04/Ago                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┬─────────────────┬──────────┐
│   HOJE - STATS  │    QUENTES      │   MORNOS        │  FRIOS   │
├─────────────────┼─────────────────┼─────────────────┼──────────┤
│ Leads entrada:6 │ Qtd: 5          │ Qtd: 12         │ Qtd: 25  │
│ Demos agend: 2  │ Faturamento     │ Faturamento     │ Faturamento
│ Propostas: 1    │ esperado: 45K   │ esperado: 80K   │ esp: 150K│
│ Closings esp: 1 │                 │                 │          │
│ Receita esp/sem │ PRÓXIMAS AÇÕES  │ PRÓXIMAS AÇÕES  │ AUTOMADO │
│ (se fechar): 50K│                 │                 │          │
│                 │ Roberto         │ Camila          │          │
│ Taxa conv: 18%  │ → Call: 14h     │ → Proposta: 2d  │          │
│ Ciclo médio:21d │                 │                 │          │
│                 │ Fernando        │ Lucas           │          │
│                 │ → Demo: 16h     │ → Follow-up: 1d │          │
│                 │                 │                 │          │
│                 │ Ana             │ Pedro           │          │
│                 │ → Nego: sim     │ → Email seq: 5d │          │
└─────────────────┴─────────────────┴─────────────────┴──────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    AUTOMAÇÕES RODANDO                            │
├──────────────────────────────────────────────────────────────────┤
│ Email seq (Restaurantes):     ✓ Ativa (12 pessoas em nurture)   │
│ Email seq (Imobiliárias):     ✓ Ativa (8 pessoas em nurture)    │
│ WhatsApp follow-up (Mornos):  ✓ Ativa (12 conversas)            │
│ Triggers de score:            ✓ Ativa (real-time)              │
│ Reativação (Frios 90d+):      ✓ Próximo: 15/Ago                │
│ Reminders pra você:           ✓ Ativa (Slack 08h)              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                   PIPELINE VISUAL (Funil)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   LEADS ENTRADA        QUALIFICADOS       EM CONVERSA   FECHADO │
│   (60/semana)          (35/semana)        (8/semana)   (1-2/sem)│
│       ▓▓                   ▓▓▓▓                ▓▓         ▓      │
│       ▓▓                   ▓▓▓▓                ▓▓         ▓      │
│       ▓▓                   ▓▓▓▓                ▓▓         ▓      │
│   Conv: 58%             Conv: 23%           Conv: 25%  Conversão
│                                                         geral:16%
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. COMO CONSTRUIR (Plataforma)

### Opção 1: Google Sheets (Mais simples)
- Grátis
- Sincroniza com WhatsApp/Zapier
- Atualiza em tempo real
- Você vê tudo em uma aba

### Opção 2: CRM Simples (Notion/Airtable)
- Mais profissional
- Melhor para relatorios
- Customização total
- Automação nativa

### Opção 3: CRM Pago (Pipedrive/HubSpot)
- Mais robusto
- Múltiplos usuários
- Relatórios avançados
- Caro (300-500/mês)

**Recomendação:** Começar com Google Sheets (Opção 1). Quando crescer, migra pro Notion.

---

## 3. GOOGLE SHEETS - SETUP PASSO A PASSO

### ABA 1: "HOJE" (Seu dashboard diário)

```
┌─────────────────────────────────────────────────────────────────┐
│ A         B            C            D          E       F        │
├─────────────────────────────────────────────────────────────────┤
│ DATA      STATUS       NOME         SEGMENTO   SCORE   PRÓX AÇ  │
├─────────────────────────────────────────────────────────────────┤
│ 29/Jul    QUENTE       Roberto      Rest       95      Call 14h │
│ 29/Jul    QUENTE       Camila       Imob       88      Call 14h │
│ 29/Jul    MORNO        Fernando     Concess    72      Proposta │
│ 29/Jul    MORNO        Lucas        Ecom       68      Follow-up│
│ 29/Jul    FRIO         Pedro        Rest       45      Email seq│
│ 28/Jul    QUENTE       Ana          Imob       92      Nego     │
│                                                                  │
│ ═════════════════════════════════════════════════════════════   │
│ RESUMO DE HOJE:                                                 │
│ Entrada hoje:     6                                             │
│ Quentes:          3 (leads que você vai ligar hoje)            │
│ Mornos:           3 (propostas/follow-up)                       │
│ Demos agendadas:  2 (Roberto, Fernando)                        │
│ Propostas:        1 (Fernando)                                 │
│ Closings esp.:    1 (Ana - negoação)                           │
│ Receita esp/sem:  50K                                           │
│                                                                 │
│ Automações ativas: 6 (todas rodando bem)                       │
│ Problemas: NENHUM                                              │
│ Status: FUNIL SAUDÁVEL ✓                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

### ABA 2: "PIPELINE" (Todos os leads)

```
┌────────────────────────────────────────────────────────────────┐
│ A        B         C        D         E      F       G    H    │
├────────────────────────────────────────────────────────────────┤
│ ID   DATA NOME    SEGMENTO CANAL    SCORE  STATUS  VALOR PROX │
├────────────────────────────────────────────────────────────────┤
│ 001  15/7 Roberto  REST    LinkedIn  95    DEMO    5K    14h   │
│ 002  16/7 Camila   IMOB    LinkedIn  88    DEMO    8K    14h   │
│ 003  17/7 Fernando  CON    Call      72    PROP    6K    2d    │
│ 004  18/7 Lucas    ECOM    Ref       68    SEQU    3K    1d    │
│ 005  19/7 Pedro    REST    Email     45    EMAIL   5K    5d    │
│ ...                                                             │
│ 050  29/7 [Novo]   REST    LinkedIn  10    QUAL    2.5K  0     │
│                                                                 │
│ TOTAIS:                                                         │
│ Leads em pipeline: 50                                          │
│ Valor total: 200K+                                             │
│ Quentes (80+): 5  → Valor: 40K                                │
│ Mornos (60-79): 12 → Valor: 80K                               │
│ Frios (40-59): 25 → Valor: 150K                               │
│ Muito frios (<40): 8 → Valor: 20K                             │
│                                                                 │
│ Média por lead: 4K                                             │
│ Taxa conversão esperada: 18% = 36K/mês                        │
└────────────────────────────────────────────────────────────────┘
```

---

### ABA 3: "AUTOMAÇÕES" (Status de cada automação)

```
┌────────────────────────────────────────────────────────────────┐
│ AUTOMAÇÃO              STATUS    LEADS        PRÓX      NOTA   │
├────────────────────────────────────────────────────────────────┤
│ Email Seq Rest         ✓ ATIVA   12 pessoas   29/Jul    OK     │
│ Email Seq Imob         ✓ ATIVA   8 pessoas    30/Jul    OK     │
│ WhatsApp Follow (Morno)✓ ATIVA   12 conversas 29/Jul    OK     │
│ Triggers Score         ✓ ATIVA   Real-time    24/7      OK     │
│ Reminders (seu celular)✓ ATIVA   Diário 08h   29/Jul    OK     │
│ Reativação (90d+)      ✓ AGEND.  0 (próx 15)  15/Ago    OK     │
│                                                                 │
│ SAÚDE GERAL: 100% FUNCIONANDO ✓✓✓                             │
└────────────────────────────────────────────────────────────────┘
```

---

### ABA 4: "MÉTRICAS SEMANA" (KPIs)

```
┌────────────────────────────────────────────────────────────────┐
│                      SEMANA 29/Jul - 04/Ago                   │
├────────────────────────────────────────────────────────────────┤
│                   ESTA SEMANA    META      VAR   TREND        │
│ Leads entrada      42            40        +5%   ↑ Bom        │
│ Taxa qualif        85%           80%       +5%   ↑ Bom        │
│ Demos agend        6             5         +20%  ↑ Ótimo      │
│ Propostas enviadas 3             3         0%    → Esperado   │
│ Closings           1             1         0%    → Esperado   │
│ Receita fechada    10K           10K       0%    → Esperado   │
│ Taxa conversão     18%           15%       +3pp  ↑ Bom        │
│ Ciclo vendas       21d           25d       -4d   ↑ Rápido     │
│ Avg ticket         4.2K          4K        +200  ↑ Bom        │
│ No-show demos      5%            10%       -5pp  ↑ Ótimo      │
│                                                                 │
│ STATUS GERAL: FUNIL ACIMA DA META ✓✓✓                        │
│ Está em ritmo de fechar 40K/mês (meta: 35K)                   │
└────────────────────────────────────────────────────────────────┘
```

---

### ABA 5: "SEGMENTOS" (Performance por tipo)

```
┌────────────────────────────────────────────────────────────────┐
│         REST   IMOB   CON   ECOM   TOTAL                       │
├────────────────────────────────────────────────────────────────┤
│ Qtd leads  15    20     8     7      50                         │
│ Quentes    2     2      1     0      5                          │
│ Mornos     5     5      2     0      12                         │
│ Frios      8     13     5     7      33                         │
│                                                                 │
│ Taxa conv  20%   18%    12%   25%    18%                       │
│ Ciclo(dias)18    24     28    14     21                         │
│ Avg ticket 3.5K  5K     7K    2K     4.2K                      │
│ Receita esp 10.5K 18K  6.7K  3.5K   38.7K                     │
│                                                                 │
│ SEGMENTO + QUENTE:  IMOB (5 quentes, 18K receita)            │
│ SEGMENTO + RÁPIDO:  ECOM (14 dias ciclo)                     │
│ SEGMENTO + CARO:    CONC (7K ticket médio)                   │
│ SEGMENTO + VOLUME:  IMOB (20 leads)                           │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. SETUP NO ZAPIER (Automação do Dashboard)

### Zapier Zap 1: Novo Lead no WhatsApp → Atualiza Google Sheets

```
TRIGGER:  Novo mensagem no WhatsApp
ACTION:   Adicionar linha no Google Sheets
          Colunas: Data, Nome, Segmento, Mensagem, Próx ação
```

---

### Zapier Zap 2: Email Aberto → Score Aumenta

```
TRIGGER:  Email aberto (via Mailchimp)
ACTION:   Atualizar célula Score no Google Sheets (+5 pontos)
          Se Score >= 80: Notificação Slack pra você
```

---

### Zapier Zap 3: Link Clicado → Score Aumenta

```
TRIGGER:  Link clicado no email
ACTION:   Score +10
          Se é video: Score +15
          Notificação: "[Nome] assistiu seu video!"
```

---

### Zapier Zap 4: Calendly Agendado → Atualiza Tudo

```
TRIGGER:  Evento agendado no Calendly
ACTION:   Atualizar Google Sheets (status = "DEMO AGENDADA")
          Score para 95
          Notificação urgente: "[Nome] agendou demo em [data/hora]"
          Adicionar ao seu calendário
          Enviar email confirmação
```

---

### Zapier Zap 5: 14 Dias sem Resposta → Move pra Nurture

```
TRIGGER:  Lead não respondeu por 14 dias
ACTION:   Mudar status pra "FRIO"
          Score -20
          Enviar email reativação
```

---

## 5. EXEMPLO: Um Dia No Dashboard

### 08h: Você abre o Google Sheets (ABA "HOJE")

```
Roberto (REST, QUENTE, 95):
→ PRÓXIMA AÇÃO: Call 14h (já está no seu calendário)
→ Valor: 5K
→ Status: Pronto pra converter

Camila (IMOB, QUENTE, 88):
→ PRÓXIMA AÇÃO: Call 14h
→ Valor: 8K

Fernando (CON, MORNO, 72):
→ PRÓXIMA AÇÃO: Enviar proposta (Zapier já enviou ontem)
→ Valor: 6K
→ Status: Aguardando resposta

[6 leads totais]
[Receita esperada semana: 50K]
[Todos os sistemas verdes ✓]

Você sente: Controle total. Sabe exatamente o que fazer.
```

---

### 09h: Email chega no Slack

```
"🔔 Novo lead: Pedro (REST)
Respondeu seu email de prospecting
Score inicial: 10
Próxima ação: Qualificação via WhatsApp"
```

**Você:** Manda first message no WhatsApp pra Pedro.

---

### 11h: Notificação no celular

```
"🚀 Lucas (ECOM) assistiu seu video (4:32 de 5min)
Score subiu: 52 → 67 (MORNO agora!)
Próxima ação: Follow-up WhatsApp"
```

**Automação:** Já enviou WhatsApp automático pra Lucas.
**Você:** Não fez nada, mas está sabendo em tempo real.

---

### 14h: Você tem calls agendadas

```
14h - Roberto (REST, 95)
→ Vai fechar demo
→ Vai combinar data de início

15h - Camila (IMOB, 88)
→ Vai tirar dúvidas sobre proposta
→ Vai combinar teste de 7 dias
```

**Resultado esperado:** 2 closings essa semana.

---

### 17h: Fim de dia - Você revisa dashboard

```
ABA "HOJE":
Leads entrada hoje:  4 (abaixo da meta de 6, mas ok)
Demos agendadas:     2 (na meta)
Quentes:             3 (na meta)
Receita esperada:    50K (na meta)

ABA "AUTOMAÇÕES":
Tudo funcionando ✓

Status geral: FUNIL SAUDÁVEL ✓
Próxima ação amanhã: Ligar pra Fernando (follow-up proposta)
```

**Você:** Desloga. Sabe exatamente como está o funil. Sem estresse.

---

## 6. MÉTRICAS QUE VOCÊ VÊ TODA HORA

### Diárias
- Leads entrada (vs meta)
- Demos agendadas (vs meta)
- Quentes (vs meta)

### Semanais
- Taxa conversão
- Ciclo de venda
- Ticket médio
- Receita esperada

### Mensais
- Closings
- Receita realizada
- Taxa de churn (leads que desistem)
- Performance por segmento

---

## 7. ALERTAS AUTOMÁTICOS (Quando algo dá errado)

### ALERTA 1: Sem leads por 2 dias
```
"⚠️  Nenhum lead novo em 48h. Aumentar prospecting."
Automação: Notificação Slack
Ação sua: Ligar mais no LinkedIn, aumentar email sequence
```

---

### ALERTA 2: Demo não confirmada (24h antes)
```
"⚠️  Demo com Roberto em 24h. Ele não confirmou ainda."
Automação: Email + WhatsApp automático de confirmação
Ação sua: Ligar de novo se não responder
```

---

### ALERTA 3: Lead quente ficou 3 dias sem responder
```
"⚠️  Roberto (QUENTE) silencioso por 3 dias. Ligar agora!"
Automação: Notificação urgente
Ação sua: Ligar imediatamente
```

---

### ALERTA 4: Taxa conversão abaixo de meta
```
"⚠️  Taxa conversão semana: 12% (meta: 15%)"
Automação: Relatório com análise
Ação sua: Revisar leads que caíram, melhorar abordagem
```

---

## 8. TEMPLATES PARA COPIAR/COLAR

### Google Sheets Template (Copiar daqui)

**Crie uma cópia em seu Google Drive:**

```
Abra: https://docs.google.com/spreadsheets
Menu: File > New > Spreadsheet
Nome: "Funil Avraham Digital"

ABA 1: "HOJE"
├─ Coluna A: Data
├─ Coluna B: Status (QUENTE/MORNO/FRIO)
├─ Coluna C: Nome
├─ Coluna D: Segmento
├─ Coluna E: Score (0-100)
├─ Coluna F: Próxima ação
└─ Coluna G: Valor

ABA 2: "PIPELINE"
├─ Coluna A: ID (001, 002, 003...)
├─ Coluna B: Data entrada
├─ Coluna C: Nome
├─ Coluna D: Segmento
├─ Coluna E: Canal (LinkedIn, Email, Call, Ref)
├─ Coluna F: Score
├─ Coluna G: Status
├─ Coluna H: Valor esperado
└─ Coluna I: Próxima ação

ABA 3: "AUTOMAÇÕES"
├─ Coluna A: Automação (nome)
├─ Coluna B: Status (✓ ATIVA / ⏸ PAUSADA)
├─ Coluna C: Leads envolvidos
├─ Coluna D: Próxima execução
└─ Coluna E: Nota

ABA 4: "MÉTRICAS SEMANA"
├─ Coluna A: Métrica (nome)
├─ Coluna B: Essa semana (número)
├─ Coluna C: Meta (número)
├─ Coluna D: Variação (% ou +/-)
└─ Coluna E: Trend (↑/→/↓)

ABA 5: "SEGMENTOS"
├─ Linhas: REST, IMOB, CON, ECOM
├─ Colunas: Qtd, Quentes, Mornos, Frios, Taxa conv, Ciclo, Avg ticket
```

---

## 9. PRÓXIMOS PASSOS

1. **Criar Google Sheets com template acima**
2. **Integrar com Zapier (6 zaps básicos)**
3. **Adicionar seus leads atuais**
4. **Configurar reminders no seu celular**
5. **Revisar dashboard 2x por dia (manhã + fim de dia)**

---

**RESULTADO FINAL:**

Você não precisa de CRM caro. Não precisa gerenciar tudo na cabeça. Não precisa perder leads.

Você só precisa de um lugar centralizado onde:
- Vê tudo em tempo real
- Sabe exatamente o que fazer a cada hora
- As automações fazem o trabalho pesado
- Você só toca em quente

**Isso é o Dashboard. Isso muda tudo.**
