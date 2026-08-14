# AUTOMAÇÕES INTELIGENTES - AVRAHAM DIGITAL

**Objetivo:** Configurar um sistema de automações que:
1. Não deixa lead cair (follow-up automático)
2. Poupa seu tempo (você só toca em quente)
3. Personaliza por segmento e score
4. Aprende com resultado (ajusta templates)

---

## 1. ARQUITETURA DE AUTOMAÇÕES

```
ENTRADA              QUALIFICAÇÃO        ROTEAMENTO         AÇÃO
Lead responde   →   Score gerado    →   Por score      →   Automação
(qualquer canal)    (0-100)             (80+/60-79/etc)    específica
                                                            |
                                                            v
                                        FOLLOW-UP AUTOMÁTICO
                                        (Sem sua intervenção)
                                                            |
                                                            v
                                        VOCÊ SÓ TOCA EM QUENTE
                                        (Leads 80-100)
```

---

## 2. AUTOMAÇÃO 1: EMAIL SEQUENCE (Frio/Nurture)

**Quando ativa:** Score < 60 OU lead não responde por 3 dias
**Plataforma:** Zapier + Gmail OU Mailchimp OU similar
**Frequência:** 3-5 emails em 14 dias

---

### SEQUÊNCIA RESTAURANTE (Cold Nurture)

**Email 1 (Dia 0 - Imediatamente)**
```
Assunto: Só pra você saber: como reduzir 30% das ligações perdidas

Oi [Nome],

Passei seu contato e vi que você gerencia [Restaurante].

Queria deixar bem claro o que a gente faz (sem querer vender agora):

A gente coloca uma IA no WhatsApp dos restaurantes que responde pedidos 24/7.
Tipo: cliente manda pedido 23h, IA responde, classifica se é delivery/local/retirada.

Resultado? Restaurantes capturam 2-4K extras por mês que iam pra concorrência.

Se um dia fizer sentido pra você, a gente tá aqui.

[Seu nome]
[Link: "Saiba mais"]
```

**Email 2 (Dia 3)**
```
Assunto: 3 restaurantes que viraram referência com isso

Oi [Nome],

Seguindo...

Aqui tem alguns cases de restaurantes que fizeram diferença:

1. Surubim (Recife) - 35% menos ligações perdidas
2. Pizza do Gordo - Reduziu caos de pico porque IA qualifica
3. Della Panificadora - Conseguiu expandir horário porque IA cobre

Sempre a mesma estrutura: IA no WhatsApp. Nada de chatbot genérico.

Se quiser ver uma demo, bora conversar.

Se não der agora, tudo bem. Volto a chamar em alguns meses.

[Seu nome]
```

**Email 3 (Dia 7)**
```
Assunto: Velocidade de resposta = conversão (dados)

Oi [Nome],

Rápido: 62% dos clientes desistem de pedir se a resposta demora mais de 5 minutos.

Traduzindo em grana: se você tem 60 pedidos fora do horário/mês, 37 deles podem virar 
receita se você responder rápido.

A gente automatiza isso.

Se quiser testar por 7 dias sem pagar nada, bora.

[Link calendly]

[Seu nome]
```

**Email 4 (Dia 11)**
```
Assunto: Teste de 7 dias (zero risco)

Oi [Nome],

Vou ser bem direto: a gente coloca a IA funcionando pro seu WhatsApp por 7 dias, 
grátis, sem contrato.

Você vê na prática se funciona.

Se funcionar, a gente conversa sobre modelo de pagamento.
Se não funcionar, a gente desativa.

Interesse?

[Link calendly]

[Seu nome]
```

**Email 5 (Dia 14)**
```
Assunto: Pronto? Ou ainda não faz sentido?

Oi [Nome],

Vou parar de insistir (prometo).

Só deixo registrado: automação de atendimento é o diferencial que mais impacta 
restaurante que cresce.

Se um dia quiser conversar, estou aqui.

Sucesso!

[Seu nome]
```

---

### SEQUÊNCIA IMOBILIÁRIA (Cold Nurture)

**Email 1 (Dia 0)**
```
Assunto: Como 8 imobiliárias aumentaram conversão 25% em 3 meses

Oi [Nome],

Vi que você trabalha em [Imobiliária].

Aqui na gente a gente trabalha com qualificação automática de leads.

Tipo: lead chega por qualquer canal (Instagram, WhatsApp, site), IA qualifica 
em tempo real (localização, orçamento, urgência, tipo de imóvel).

Vendedor recebe pronto. Conversão sobe.

8 imobiliárias como a sua aumentaram 25% em 3 meses.

Se fizer sentido, bora conversar.

[Seu nome]
```

**Email 2 (Dia 3)**
```
Assunto: O lead que chega fora do horário

Oi [Nome],

Vou ser bem específico sobre o problema que a gente resolve:

Você recebe 600 leads/mês. 40% chegam fora do horário.

Desses 40%, quantos viram cliente se ninguém qualifica na hora?

A gente automatiza isso. IA fica 24/7 qualificando. Nenhum lead cai.

Resultado? Mesma equipe, 3x mais produtiva.

[Seu nome]
```

**Email 3 (Dia 7)**
```
Assunto: Quanto custa um lead perdido pra você?

Oi [Nome],

Fórmula rápida:

Leads/mês: 600
Taxa conversão: 8%
Ticket médio: 200K

Receita que deveria vir: 600 * 0.08 * 200K = 960K/mês

Se você perde 20% por falta de qualificação rápida: 192K/mês indo embora.

A gente reduz isso pra 5%.

Valor pra você/mês: 76K+ a mais.

Custo da solução: [valor menor].

Faz conta?

[Link calendly]

[Seu nome]
```

**Email 4 (Dia 11)**
```
Assunto: 7 dias testando (no seu fluxo real)

Oi [Nome],

Quer testar a IA qualificando seus leads reais por 7 dias?

Grátis. Sem contrato. Você vê o resultado na prática.

Sim? [Link calendly]
Não? Tudo bem.

[Seu nome]
```

**Email 5 (Dia 14)**
```
Assunto: Door está aberta

Oi [Nome],

Última mensagem.

Qualificação automática é a alavanca 80/20 em imobiliária. Se fosse prioridade, 
seus números já tinham mudado.

Se virar prioridade, estou aqui.

[Seu nome]
```

---

## 3. AUTOMAÇÃO 2: WHATSAPP FOLLOW-UP (Leads Mornos)

**Quando ativa:** Score 60-79
**Plataforma:** Zapier + seu WhatsApp Business
**Frequência:** 3 mensagens em 5 dias

---

### SEQUÊNCIA WHATSAPP (Restaurante)

**Mensagem 1 (Imediatamente após qualificação)**
```
Oi [Nome]!

Anotei suas respostas e vi que você tem um case que combina muito com o de 
[Restaurante similar].

Lá tínhamos o mesmo desafio: 25 pedidos/noite sendo perdidos.

Colocamos IA respondendo em segundos.

Resultado? 2.5K extra/mês.

Posso mandar um video de 2 minutos mostrando?

[Link YouTube (gravação sua mostrando como funciona)]
```

**Mensagem 2 (Dia 2 - Se não respondeu)**
```
Oi [Nome], beleza?

Vou ser honesto: a maioria das pessoas que vê o video muda de ideia.

Vale os 2 minutos? [Link video]
```

**Mensagem 3 (Dia 4 - Se visualizou mas não respondeu)**
```
[Nome], conseguiu ver o video?

Ficou alguma dúvida? Posso esclarecer por aqui mesmo.

Ou podemos agendar 20 min pra eu detalhar?

[Link calendly]
```

---

### SEQUÊNCIA WHATSAPP (Imobiliária)

**Mensagem 1**
```
[Nome], beleza?

Análise rápida do seu case:

- 600 leads/mês
- 40% fora do horário
- Perda estimada: 120 leads/mês

Se a gente qualificava esses 120, quanto seria de receita extra?

[Deixe ele pensar]
```

**Mensagem 2 (Dia 2)**
```
Deve ser algo como 150K+ por mês em receita perdida.

Custo de uma solução que evita isso? [Valor bem menor].

ROI de 3 meses.

Faz sentido conversar?

[Link calendly]
```

**Mensagem 3 (Dia 4)**
```
Se não conseguir aparecer agora, tá tranquilo.

Deixo meu número ativo. Qualquer dia que resolver investir em qualificação, 
é só chamar.

Estou aqui.
```

---

## 4. AUTOMAÇÃO 3: REMINDER DE FOLLOW-UP (Pra você não cair)

**Quando ativa:** Sempre
**Plataforma:** Seu CRM interno ou calendario
**Frequência:** Diária

---

### CHECKLIST AUTOMÁTICO (Dia a dia)

**Segunda-feira 09h: Leads que responderam LinkedIn (fim de semana)**
```
Quem respondeu no fim de semana?
→ Responder em <30min
→ Chamar pra WhatsApp

Ação: Email/WhatsApp automático marca "Respondido"
```

**Terça-feira 14h: Leads Quentes em Follow-up**
```
Quem está no Score 80-100?
→ Você ligou ontem?
→ Se sim: próximo contato é quando?
→ Se não: ligar hoje

Ação: Notificação no seu celular com lista
```

**Quarta-feira 10h: Propostas Enviadas (3 dias atrás)**
```
Quem recebeu proposta na segunda-feira?
→ Você fez follow-up?
→ Se não: fazer hoje

Ação: Email automático (seu nome) solicitando resposta
```

**Sexta-feira 15h: Leads Frios (sem resposta 5 dias)**
```
Quem não respondeu por 5 dias?
→ Mover pra nurture automática
→ Email de reabordagem

Ação: Trigger automático envia email 5
```

---

## 5. AUTOMAÇÃO 4: TRIGGER DE COMPORTAMENTO

**Quando ativa:** Em tempo real
**Plataforma:** Zapier + CRM

---

### TRIGGER 1: Lead Abriu Email (Engagement)
```
Ação: Lead abriu email da sequência
→ Se abriu 2x: aumenta score +5
→ Se abriu + clicou link: aumenta score +15
→ Automação: Notificação pra você (esse é quente)
```

---

### TRIGGER 2: Lead Respondeu Positivamente
```
Ação: Lead responde "Sim", "Quer saber mais", "Manda proposta"
→ Score sobe automaticamente
→ Notificação urgente no seu celular
→ WhatsApp automático marcando hora da call
```

---

### TRIGGER 3: Lead Visualizou Video (Interesse Alto)
```
Ação: Lead clicou no link do video
→ Score +10
→ Se ficou >5 minutos: Score +15
→ Automação: Próxima mensagem personalizada baseado no que viu
```

---

### TRIGGER 4: Lead Agendou Demo
```
Ação: Lead clicou no calendly e agendou
→ Score para em 95 (pronto pra converter)
→ Notificação urgente (confirme o agendamento)
→ Automação: Email confirmação + WhatsApp reminder 24h antes
→ Automação: Preparar materiais pra demo (você recebe lembrete)
```

---

### TRIGGER 5: Lead Ficou Inativo (14 dias)
```
Ação: Lead não respondeu por 14 dias
→ Score diminui -20
→ Automação: Email de reativação
→ Se continuar inativo 30 dias: move pra "Arquivado"
```

---

## 6. AUTOMAÇÃO 5: LEAD SCORING EM TEMPO REAL

**Quando ativa:** Sempre
**Plataforma:** Seu CRM

---

### PONTOS ACUMULAM AUTOMATICAMENTE

```
Lead responde LinkedIn      +10
Lead responde Email         +15
Lead responde telefone      +20
Lead abriu email            +5
Lead clicou link do email   +10
Lead assistiu video         +15
Lead agendou demo           +25
Lead mencionou orçamento    +10
Lead falou timing           +15
Lead em growth/urgência     +20
```

---

### SCORE RECALCULA A CADA AÇÃO
```
Dia 0: Lead chega (Score 0)
→ Responde LinkedIn (Score 10)
→ Abriu email (Score 15)
→ Assistiu video (Score 30)
→ Agendou demo (Score 55 → reclassifica de "Frio" pra "Qualificado")

Sistema automaticamente:
- Envia notificação pra você
- Marca próxima ação
- Agenda follow-up
```

---

## 7. AUTOMAÇÃO 6: PIPELINE VISIBILITY (Seu Dashboard)

**Quando ativa:** Sempre
**Plataforma:** Google Sheets OU seu CRM

---

### O QUE VOCÊ VÊ (Atualizado em tempo real)

**HOJE - Status do Funil**
```
QUENTES (80-100):           5 leads
→ Roberto (Restaurante)     Demo hoje 14h
→ Camila (Imobiliária)      Call agora
→ Fernando (Concessionária)  Aguardando resposta (proposta enviada)
→ Lucas (E-commerce)        Teste grátis iniciado
→ Ana (Restaurante)         Está em negociação

MORNOS (60-79):             12 leads
→ [Lista com status de cada um]

FRIOS (40-59):              25 leads
→ [Em sequência automática]

MUITO FRIOS (<40):          48 leads
→ [Arquivados, revisão em 6 meses]
```

---

### MÉTRICAS ATUALIZADAS A CADA HORA
```
Leads entrados hoje:    3
Novos quentes:          1
Demos agendadas:        2
Propostas enviadas:     1
Closings esperados:     1 (Roberto)
```

---

## 8. AUTOMAÇÃO 7: REATIVAÇÃO DE BASE (Leads "Mortos")

**Quando ativa:** Lead frio ficou 90 dias sem responder
**Plataforma:** Zapier
**Frequência:** 1x a cada 180 dias

---

### SEQUÊNCIA DE REATIVAÇÃO

**Email 1 (Dia 90)**
```
Assunto: Ainda faz sentido conversar?

Oi [Nome],

Faz tempo que não conversamos (uns 3 meses).

Imagino que não era a hora certa pra você.

Mas quis deixar claro: se em algum momento mudar de ideia, a gente tá aqui.

A solução continua a mesma, resultado também.

[Seu nome]
```

---

## 9. CHECKLIST DE CONFIGURAÇÃO (O que você precisa fazer)

### PASSO 1: Configurar Email Sequences
- [ ] Criar 5 templates de email (1 por segmento/situação)
- [ ] Integrar com Mailchimp/Zapier
- [ ] Agendar delays (dia 0, 3, 7, 11, 14)
- [ ] Testar

### PASSO 2: Configurar WhatsApp Follow-ups
- [ ] Integrar WhatsApp Business com Zapier
- [ ] Criar 3 sequências de WhatsApp (1 por score)
- [ ] Agendar delays
- [ ] Testar

### PASSO 3: Configurar Triggers
- [ ] Email aberto = notificação seu celular
- [ ] Link clicado = score +10
- [ ] Video assistido = score +15
- [ ] Calendly agendado = notificação urgente

### PASSO 4: Configurar Dashboard
- [ ] Google Sheets com "HOJE" section
- [ ] Leads por score
- [ ] Próximas ações
- [ ] Atualização automática

### PASSO 5: Configurar Reminders (pra você)
- [ ] Slack/Email com leads quentes cada manhã
- [ ] Reminder de follow-up em propostas
- [ ] Aviso de leads inativos (14 dias)

---

## 10. EXEMPLO: UM DIA COM AUTOMAÇÕES RODANDO

```
08h: Acordado
→ Notificação Slack: "3 leads responderam no fim de semana, 2 quentes"
→ Você responde Roberto (restaurante, score 95)
→ Você liga pra Camila (imobiliária, score 85)

09h: Começou trabalho
→ Sistema automaticamente enviou proposta pra Fernando
→ Notificação: "Video foi assistido por Lucas, score agora 72"
→ Você não fez nada, mas sistema está ativo

10h: Trabalho normal
→ Email automático foi enviado pra 8 leads em nurture
→ WhatsApp automático pra 3 leads mornos
→ Você não fez nada

11h: Rotina
→ Prospectando no LinkedIn (você quem faz, 1h/dia)
→ Respondendo quentes conforme vão chegando

14h: Você tem call com Roberto
→ Ele quer começar
→ Você envia proposta ao vivo

15h: Trabalho normal
→ Sistema marcou "Proposta enviada" automaticamente
→ Reminder automático: "Follow-up proposta Roberto em 24h"
→ Você não faz nada (automação lembrou você)

17h: Fim de dia
→ Revisar dashboard: 6 quentes, 3 agendadas pra semana
→ Sucesso! Funil está saudável
→ Fez contato com 15+ prospects
→ Sem você ter que gerenciar tudo manualmente
```

---

**Próximo documento:** Dashboard Central (Visualização Única)
