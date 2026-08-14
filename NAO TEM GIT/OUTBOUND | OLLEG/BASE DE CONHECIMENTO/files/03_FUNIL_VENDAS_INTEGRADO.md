# FUNIL DE VENDAS INTEGRADO - AVRAHAM DIGITAL

**Objetivo:** Criar um funil omnichannel onde QUALQUER contato do prospect (LinkedIn, Email, Call, Referência, Inbound) entra no sistema de forma centralizada, é qualificado automaticamente, e flui para WhatsApp como canal unificado.

---

## 1. VISÃO GERAL DO FUNIL

```
                    PROSPECTING (Ativo)
                    
LinkedIn            Email            Call            Referência      Inbound
(5-15/dia)      (50-100/dia)    (20-30/dia)      (3-8/mês)    (website, form)
                          |                             |
                          v                             v
                          └────────────────┬────────────┘
                                           |
                    CAPTURA INICIAL (Resposta positiva)
                                           |
                          ┌────────────────┴────────────┐
                          |                             |
                          v                             v
                    Mensagem Email/           Ligação transformada
                    LinkedIn respondida       em conversa WhatsApp
                                           |
                          ┌────────────────┴────────────┐
                          |                             |
                          v                             v
                    QUALIFICAÇÃO AUTOMÁTICA (via IA no WhatsApp)
                    - Segmento/Tamanho
                    - Budget
                    - Urgência/Timeline
                    - Fit com solução
                          |
                          v
                    SCORING DO LEAD (0-100)
                          |
        ┌─────────────────┼─────────────────┐
        |                 |                 |
        v                 v                 v
     80-100           60-79             <60
   (Quente)      (Morno/Qualificado)  (Frio)
        |                 |                 |
        v                 v                 v
   DEMO/CALL         PROPOSTA        NURTURE
   Hoje ou amanhã    COMERCIAL      (Email sequence)
                    (2-3 dias)      (6-12 meses)
        |                 |                 |
        v                 v                 v
   NEGOCIAÇÃO      NEGOCIAÇÃO      REATIVAÇÃO
   (5-10 dias)      (10-15 dias)    (verificação
                                      mensal)
        |                 |
        v                 v
   FECHAMENTO    FECHAMENTO
   (Contrato)    (Contrato)
        |                 |
        └────────┬────────┘
                 |
                 v
            ONBOARDING
            (Implementação)
```

---

## 2. ENTRADA NO FUNIL: PONTOS DE CAPTURA

### PONTO 1: LinkedIn (Message/Comment)
**O que traz:** Leads iniciam conversa no LinkedIn
**Ação imediata:** 
- Responder em <1h (sempre)
- Se houver interesse: transferir para WhatsApp com número
- Mensagem padrão: "Vamos conversar melhor por WhatsApp pra eu não incomodar sua inbox?"
**Automação:** Trigger no CRM (seu sistema interno) que marca "Lead LinkedIn"

---

### PONTO 2: Email (Reply)
**O que traz:** Prospect responde sequência de email
**Ação imediata:**
- Responder em <2h
- Chamar para WhatsApp ou ligar
- Se responde positivamente: recolher número e enviar mensagem de boas-vindas via WhatsApp
**Automação:** Trigger no CRM marca "Lead Email"

---

### PONTO 3: Call (Interesse demonstrado)
**O que traz:** Prospect não recusa ligar
**Ação imediata:**
- Durante a call: mapear interesse e tempo
- Ao final: pedir número de WhatsApp ("Vou mandar alguns detalhes por lá")
- Enviar primeiro mensagem em <10 min depois da call
**Automação:** Trigger no CRM marca "Lead Call"

---

### PONTO 4: Referência (Indicação)
**O que traz:** Cliente atual recomenda prospect
**Ação imediata:**
- Cliente atual pasa número ou permite que você ligue
- Ligação: "Seu amigo [Cliente] me indicou porque acha que ajudo com [problema]"
- Se interesse: trazer pra WhatsApp
**Automação:** Trigger no CRM marca "Lead Referência" + Score boost (+15 pontos)

---

### PONTO 5: Inbound (Website, Form, Google)
**O que traz:** Prospect vem buscar você (melhor lead!)
**Ação imediata:**
- Resposta automática em email confirmando recebimento
- Ligar em <30 min (se informação de telefone)
- Chamar pra WhatsApp pra conversa mais ágil
**Automação:** Trigger automático + notificação urgente pro seu celular

---

## 3. QUALIFICAÇÃO AUTOMÁTICA (IA no WhatsApp)

**Quando:** Assim que o prospect chega no WhatsApp pela primeira vez
**Como:** Você treina uma IA (ou usa a sua já existente) pra fazer perguntas estruturadas
**Objetivo:** Coletar dados essenciais pra scoring

---

### FLUXO DE QUALIFICAÇÃO (Restaurante como exemplo)

```
Você: "Oi [Nome]! Tudo bem? Vimos seu interesse em automação de atendimento.
      Vou fazer algumas perguntas pra entender melhor seu caso.
      
      1. Qual é o seu restaurante?"
      
Lead: "[Nome Restaurante]"

Você (IA): "Legal! Quantos atendimentos vocês têm por dia via WhatsApp 
           (pedidos, dúvidas, etc)?"
           
Lead: " Uns 50-80 por dia"

Você (IA): "E fora do horário (21h-8h), quanto chegam?"

Lead: "Uns 20-30"

Você (IA): "Quando é que mais dói? Quando perde essas vendas fora do horário,
           qual é o impacto financeiro? (tipo, quanto deixa de faturar/mês?)"
           
Lead: "Umas 3-4K por mês provavelmente"

Você (IA): "E qual é sua prioridade agora? Aumentar receita fora do horário,
           ou reduzir erro de atendimento no horário de pico?"
           
Lead: "Os dois, mas prioridade é reduzir erro"

Você (IA): "Perfeito! Uma última coisa: vocês já tentaram algo assim antes?
           Se sim, o que não funcionou?"
           
Lead: "Não, nunca tentamos"

[SISTEMA GERA SCORE AUTOMÁTICO]

Você: "Ótimo! Vi que vocês têm um case que combina demais com o de vocês.
     Quando você consegue conversar por 20 min pra eu detalhar como funciona?
     [Link calendly]"
```

---

### PERGUNTAS DE QUALIFICAÇÃO (Adaptadas por segmento)

**RESTAURANTE:**
- Nome do restaurante
- Volume de atendimento WhatsApp/dia
- Atendimento fora do horário (perdido)
- Impacto financeiro (quanto deixa de faturar)
- Principal dor (demora vs erro)
- Já tentou automação antes
- Quando quer resolver

**IMOBILIÁRIA:**
- Nome da empresa
- Volume de leads/mês
- Canais de entrada (Instagram, WhatsApp, site)
- Quanto cai por falta de qualificação rápida
- Timeline de decisão típico (quanto tempo leva pra fechar)
- Já tentou qualificação automática
- Urgência pra resolver

**CONCESSIONÁRIA:**
- Nome da concessionária
- Volume de test-drives/mês
- Taxa de no-show (quantos não aparecem)
- Perda de vendas por isso (quanto custa)
- Qual modelo mais procura
- Já automatizou agendamento
- Budget pra automação

**E-COMMERCE:**
- Nome da loja
- Volume de vendas/mês
- Dúvidas mais comuns de cliente
- Tamanho do time de atendimento
- Custo de atender cada cliente
- Já tentou chatbot
- Urgência pra escalar

---

## 4. SCORING DE LEAD (0-100)

### Critério 1: FIT COM SOLUÇÃO (0-30)

**Segmento alvo (0-10)**
- Restaurante/Imobiliária/Concessionária/E-commerce: +10
- Outro segmento: +5

**Tamanho/Volume (0-10)**
- Fit ticket (2.5K-30K): +10
- Muito pequeno ou muito grande: +5

**Fit geográfico (0-10)**
- Região que focamos: +10
- Outra região: +5

---

### Critério 2: INTERESSE DEMONSTRADO (0-40)

**Respondeu de forma positiva (0-10)**
- Mostrou interesse explícito: +10
- Respondeu neutro: +5
- Respondeu negativo: 0

**Engajamento com mensagens (0-15)**
- Responde rápido (em <2h): +15
- Responde em <24h: +10
- Demora pra responder: +5

**Mencionou problema específico (0-15)**
- Identificou a mesma dor que você sabe resolver: +15
- Mencionou dor relacionada: +10
- Nenhuma menção de problema: 0

---

### Critério 3: URGÊNCIA/OPORTUNIDADE (0-30)

**Timeline (0-10)**
- Quer resolver agora/próximas 2 semanas: +10
- Próximo mês: +7
- "Mais pra frente": +3

**Impacto financeiro (0-10)**
- Deixa de faturar K+ por mês (alto custo): +10
- Impacto médio: +7
- Impacto baixo: +3

**Momento do negócio (0-10)**
- Em crescimento/expansion: +10
- Estável: +5
- Em crise: +10 (urgência pode levar a venda rápida)

---

### FÓRMULA DE SCORE

```
Score Total = (Fit com Solução) + (Interesse Demonstrado) + (Urgência/Oportunidade)
```

---

### AÇÕES POR SCORE

| Score | Classificação | Ação Imediata | Timeline |
|-------|---------------|---------------|----------|
| 80-100 | QUENTE | Ligar hoje, agendar demo urgente | 24-48h |
| 60-79 | MORNO | Enviar proposta, agendar call próximos 2-3 dias | 3-5 dias |
| 40-59 | FRIO | Sequência de email nurture, 1 follow-up | 7-14 dias |
| 0-39 | MUITO FRIO | Arquivar, revisar em 3-6 meses | 6 meses |

---

## 5. ROTEAMENTO INTELIGENTE (Onde cada lead vai)

### LEADS 80-100 (QUENTE)

```
Recebe: 1º contato pessoal seu (call ou WhatsApp)
Objetivo: Agendar demo/call
Frequência: Contato a cada 24-48h até fechar ou rejeitar
Local: WhatsApp + Calendar (demo)
Tempo médio: 3-7 dias até decisão

Seu papel: Lidar pessoalmente
Automação: Reminder pra você não cair em cima, nada mais
```

---

### LEADS 60-79 (MORNO/QUALIFICADO)

```
Recebe: Proposta comercial estruturada (customizada)
Objetivo: Levar a demo em 3-5 dias
Frequência: Contato a cada 2 dias até resposta
Local: Email (proposta) + WhatsApp (follow-up)
Tempo médio: 7-14 dias até decisão

Seu papel: Enviar proposta, 1 call explicativo, acompanhar
Automação: Email com proposta, follow-up automático se não responde
```

---

### LEADS 40-59 (FRIO/INTERESSADO)

```
Recebe: Sequência de email sobre educação + 1 follow-up
Objetivo: Agendar conversa em 2-4 semanas
Frequência: Email a cada 3-5 dias
Local: Email nurture
Tempo médio: 30-90 dias

Seu papel: Minimal (automação faz tudo)
Automação: Sequência automática, revisão manual 1x por semana
```

---

### LEADS 0-39 (MUITO FRIO)

```
Recebe: Arquivado
Objetivo: Revisar em 3-6 meses
Frequência: Check-up ocasional
Local: CRM arquivado
Tempo médio: 6 meses + reabordagem

Seu papel: Nenhum até reabordagem
Automação: Trigger automático de 6 meses pro revisit
```

---

## 6. FLUXO COMPLETO NO WHATSAPP

### ATO 1: Boas-vindas + Qualificação (Minuto 0-15)

```
Você: "Oi [Nome]! Tudo bem?
      Vi seu interesse em automação de atendimento.
      Pra entender melhor seu caso, vou fazer umas perguntas rápidas.
      Tá bem?"

Lead: "Tá"

Você: "[Sequência de perguntas de qualificação]"
      → Recolhe respostas, gera score automático

[SISTEMA MARCA: Score = 75, Classificação = "Morno/Qualificado"]
```

---

### ATO 2: Proposta Customizada (Minuto 15-30)

```
Você: "Perfeito [Nome]. Vi que vocês têm um case que combina muito.

      Aqui no [Restaurante similar], tínhamos o mesmo desafio:
      20-30 pedidos fora do horário sendo perdidos.
      
      Colocamos IA respondendo esses pedidos em segundos.
      Resultado? 3K extra por mês que não estava sendo capturado.
      
      Pro seu case, imagino um impacto similar.
      
      Faz sentido conversar por 20 minutos pra eu detalhar exatamente como?
      
      [Link calendly com horários seus]"

Lead: "Faz sentido"

[SISTEMA MARCA: Pronta pra demo]
```

---

### ATO 3: Demo/Apresentação (Dia 1-2)

```
Você (na call): 
1. Confirmar o problema (5 min)
2. Mostrar como funciona (10 min)
3. Tirar dúvidas (5 min)
4. Próximos passos (2 min)

Fim da call: 
- Se gostou: enviar proposta comercial
- Se não: entender objeção, seguir em nurture
- Se quer testar: colocar IA funcionando grátis por 7 dias
```

---

### ATO 4: Proposta Comercial (Dia 2-3)

```
Você (por email): Enviar documento com:
- Diagnóstico (o que viu no call)
- Solução proposta (como vai funcionar)
- Implementação (timeline 30 dias)
- Acompanhamento (timeline 60 dias)
- Investimento (valor)
- Próximos passos

Follow-up WhatsApp (24h depois):
"Oi [Nome], recebi sua proposta? Ficou alguma dúvida?"
```

---

### ATO 5: Negociação (Dia 5-15)

```
Se sim, segue:
- Alinhamento final de detalhes
- Assinatura de contrato
- Coleta de informações (pra treinar IA)
- Data de início

Se "vou pensar":
- Agendado follow-up em 2-3 dias
- Enviar material adicional (vídeo, case)
- Ligar de novo pra esclarecer objections
```

---

### ATO 6: Assinatura + Início (Dia 15-20)

```
Você (por email + WhatsApp):
- Contrato assinado
- Data exata de início
- Pessoas de contato
- Próximos passos (descoberta, treinamento IA)
- Cronograma de 30 dias
```

---

## 7. AUTOMAÇÕES ESSENCIAIS (O QUE CONFIGURAR)

### Automação 1: Trigger de Entrada
**Quando:** Lead responde qualquer canal
**Ação:** Criar registro no seu CRM, enviar notificação pra você

---

### Automação 2: Qualificação Automática
**Quando:** Lead chega no WhatsApp
**Ação:** IA faz perguntas, coleta respostas, gera score automático

---

### Automação 3: Roteamento
**Quando:** Score é gerado
**Ação:** Automaticamente marca próxima ação (call você, proposta, nurture)

---

### Automação 4: Follow-up de Proposta
**Quando:** Proposta enviada
**Ação:** 24h depois, remind você pra ligar + enviar follow-up automático se não respondeu

---

### Automação 5: Reativação
**Quando:** Lead frio fica 90 dias sem responder
**Ação:** Move pra nurture, reabordagem em 6 meses

---

## 8. MÉTRICAS DO FUNIL

| Métrica | Meta | Como Medir |
|---------|------|-----------|
| Leads que entram/dia | 5-10 | LinkedIn + Email + Call |
| Taxa de qualificação | 70%+ | (Leads que respondem perguntas / Leads que chegam) |
| Leads quentes (80+) | 20-30% | Score automático |
| Taxa de conversão geral | 15-25% | (Clientes novos / Leads qualificados) |
| Tempo do funil | 14-30d | De 1º contato até assinatura |
| No-show em demo | <10% | Leads que agendaram mas não apareceram |

---

## 9. EXEMPLO PRÁTICO: Um Lead Percorre o Funil

```
DIA 0 - 09h: Você envia mensagem no LinkedIn pra Roberto (gerente restaurante)
- "Vi que você gerencia [Restaurante]. Achei interessante porque temos 
  solução pra atendimento 24/7..."

DIA 0 - 14h: Roberto responde "Oi, legal! Me manda mais infos"
- TRIGGER: Novo lead detectado. Você recebe notificação.
- AÇÃO: Você pede número WhatsApp dele

DIA 0 - 15h: Roberto manda número
- TRIGGER: Você envia primeira mensagem de boas-vindas
- "Oi Roberto! Recebi seu número. Vou fazer umas perguntas..."

DIA 0 - 16h: IA qualifica Roberto
- Respostas: 60 pedidos/dia, 25 fora do horário, 4K impacto/mês, urgência média
- SCORE GERADO: 72 (Morno/Qualificado)
- AUTOMAÇÃO: Marca "Enviar proposta customizada"

DIA 1: Você envia proposta no email com case do restaurante similar
- AUTOMAÇÃO: Reminder pra você fazer follow-up

DIA 2 - 09h: Você liga pra Roberto
- Conversa 20min
- Roberto quer testar

DIA 2 - 10h: Você ativa IA testando por 7 dias, grátis
- AUTOMAÇÃO: Marca "Acompanhamento de teste"

DIA 5: Você faz check-in
- "Como tá a experiência?"

DIA 7: Você liga de novo
- Roberto: "Funcionou bem, gostei"
- Vocês discutem investimento e timeline

DIA 10: Contrato assinado
- Data de início: 15 de próximo mês

DIA 15: IA começa a funcionar em produção
- 30 dias de implementação
- 60 dias de acompanhamento

DIA 45: Resultado real
- Roberto: "70% menos pedidos fora do horário caindo"
- Receita: 2.5K/mês capturado

RESULTADO FINAL: De lead frio a cliente satisfeito em 45 dias
```

---

**Próximo documento:** Automações Inteligentes (Sequências, Triggers, Follow-ups)
