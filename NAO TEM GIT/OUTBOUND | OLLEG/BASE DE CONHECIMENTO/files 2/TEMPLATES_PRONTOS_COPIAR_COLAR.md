# TEMPLATES PRONTOS - COPIE E COLE
## Tudo pronto pra você colar nos seus documentos/ferramentas

---

## GOOGLE SHEETS - CABEÇALHOS

### ABA 1: HOJE

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

**Linha de resumo (linha 20 aproximadamente):**

```
RESUMO DO DIA
Entrada: [coloque número]
Quentes: [coloque número]
Mornos: [coloque número]
Frios: [coloque número]
Demos: [coloque número]
Propostas: [coloque número]
```

---

### ABA 2: PIPELINE

```
A: ID
B: Data Entrada
C: Nome
D: Segmento
E: Canal
F: Score
G: Status
H: Valor
I: Próxima Ação
J: Última Atualização
```

**Totalizadores (linha 60 aproximadamente):**

```
TOTAL PIPELINE:
Leads: [fórmula: COUNTA(C:C)-1]
Valor Total: [fórmula: SUM(H:H)]
Quentes (80+): [COUNTIF(F:F,">=80")]
Mornos (60-79): [COUNTIFS(F:F,">=60",F:F,"<80")]
Frios (<60): [COUNTIF(F:F,"<60")]
```

---

### ABA 3: AUTOMACOES

```
A: Automação
B: Status
C: Leads Envolvidos
D: Próxima Execução
E: Nota
```

**Dados pré-preenchidos:**

```
Email Seq REST | ✓ ATIVA | 12 | 30/07 | OK
Email Seq IMOB | ✓ ATIVA | 8 | 30/07 | OK
Email Seq ECOM | ✓ ATIVA | 6 | 30/07 | OK
WhatsApp Follow | ✓ ATIVA | 12 | 30/07 | OK
Triggers Score | ✓ ATIVA | Real-time | 24/7 | OK
Reminders Slack | ✓ ATIVA | Diário 08h | 30/07 | OK
Reativação Frios | ⏸ PAUSADA | 33 | Semana 4 | Ativa depois
```

---

### ABA 4: METRICAS_SEMANA

```
A: Métrica
B: Essa Semana
C: Meta
D: Variação
E: Trend
```

**Dados iniciais:**

```
Leads entrada | 0 | 40-60 | - | -
Taxa qualif | 0% | 70%+ | - | -
Quentes | 0 | 3-5 | - | -
Demos agend | 0 | 2-3 | - | -
Propostas | 0 | 2-3 | - | -
Closings | 0 | 0-1 | - | -
Receita esp | 0K | 40-50K | - | -
```

---

### ABA 5: SEGMENTOS

```
HEADER ROW:
A: (em branco)
B: REST
C: IMOB
D: CONC
E: ECOM
F: TOTAL

DADOS:
Qtd | 0 | 0 | 0 | 0 | 0
Quentes | 0 | 0 | 0 | 0 | 0
Mornos | 0 | 0 | 0 | 0 | 0
Frios | 0 | 0 | 0 | 0 | 0
Taxa conv | 0% | 0% | 0% | 0% | 0%
Ciclo(d) | 0 | 0 | 0 | 0 | 0
Ticket | 0K | 0K | 0K | 0K | 0K
Receita | 0K | 0K | 0K | 0K | 0K
```

---

## LINKEDIN - TEMPLATES

### Template 1: RESTAURANTE

```
Oi [Nome],

Passei pelo perfil e vi que você gerencia operações em [Nome Restaurante].

Achei interessante porque trabalho com restaurantes que têm o mesmo desafio: 
cliente manda pedido no WhatsApp fora do horário, ninguém responde, e ele compra na concorrência.

A gente criou uma IA que responde esses pedidos em segundos (mesmo quando você está fechado), 
e ainda qualifica se é delivery, retirada, local... sem o cliente perceber que é IA.

Resultado: clientes que iam ficar putos agora viram receita extra.

Faz sentido conversar sobre como isso funcionaria no [Nome Restaurante]?

[Seu nome]
```

---

### Template 2: IMOBILIÁRIA

```
Oi [Nome],

Vi que você trabalha em [Nome Imobiliária] como [Título].

Uma coisa que vejo muito com gerentes comerciais de imobiliária é: quanto mais o negócio cresce, 
mais leads chegam, mais difícil qualificar rápido.

Resultado: muitos leads caem porque ninguém responde em menos de 5 minutos.

Aqui, a gente conseguiu resolver assim: IA qualifica lead 24/7.
Cliente interessa? IA identifica. Pode comprar? IA sabe. Urgência? IA vê tudo.

Vendedor só conversa com quem realmente quer comprar agora.

Em uma imobiliária similar, conversão subiu 25% em 3 meses.

Faz sentido uma call de 15 minutos pra entender seu case específico?

[Seu nome]
```

---

### Template 3: E-COMMERCE

```
Oi [Nome],

Vi que vocês cresceram [número]% esse ano. Parabéns!

Aqui vem a pergunta: como tá o atendimento nesse crescimento?

Porque o padrão é: receita cresce 100%, atendimento customer também precisa de mais gente = custo cresce 100%.

Ou... coloca IA fazendo o trabalho repetitivo e custo cresce 20%.

A gente coloca IA respondendo as 80 dúvidas que você já respondeu. Seu time toca os 20% complexos.

Resultado? Cresce sem ter que contratar.

[E-commerce similar] cresceu 50%, conversão melhorou porque cliente é atendido em 3 segundos, não 3 horas.

Faz sentido conversar?

[Seu nome]
```

---

## EMAIL - TEMPLATES (Copie pro Mailchimp)

### Email 1 - HOOK INICIAL (REST)

```
ASSUNTO:
40% menos ligações pra [Nome Restaurante]?

CORPO:
Oi [Nome],

Tem um número que intriga bastante: 62% dos clientes desistem de pedir por WhatsApp 
se não responder em menos de 5 minutos.

Achei relevante porque vi que vocês têm [tipo de restaurante] e crescimento constante.

Quanto mais cresce, mais pedido por WhatsApp, e mais difícil responder rápido.

A gente coloca uma IA que responde esses pedidos em 3 segundos, mesmo fora do horário.

Resultado? Clientes que iam pra concorrência agora viraram receita extra.

Quer ver como funciona em 10 minutos?

[Link calendly seu]

[Seu nome]
```

---

### Email 2 - SOCIAL PROOF (REST)

```
ASSUNTO:
Re: 40% menos ligações pra [Nome Restaurante]?

CORPO:
Oi [Nome],

Seguindo...

Aqui tem uns resultados que rodamos com restaurantes similares ao de vocês:

Surubim (Recife): 35% menos ligações perdidas, 28% mais takeaway fora do horário
Pizza do Gordo: Reduziu caos de horário de pico porque IA qualifica pedido antes de chegar no balcão
Della Panificadora: Conseguiu abrir mais tarde porque IA cobre o atendimento inicial

A diferença é que não é chatbot genérico. A gente treina com seu cardápio, horários, política de entrega.

Resultado é tipo ter mais uma pessoa na recepção, sem custo de folha.

Vale conversar sobre seu case específico?

[Link calendly]

[Seu nome]
```

---

### Email 3 - OBJEÇÃO (REST)

```
ASSUNTO:
Preocupação comum: cliente não gosta de máquina

CORPO:
Oi [Nome],

Achei legal você não ter respondido. Às vezes a gente tem preocupação legítima.

A que mais ouço de restaurante é: "Meu cliente não gosta de falar com máquina".

Real? É por isso que a gente não manda chatbot genérico.

A IA aqui é treinada em cem conversas reais de [tipo de restaurante]. 
Ela soa como você, conhece seu cardápio de cor, entende contexto.

Tipo: cliente fala "sem cebola", IA não só anota, como confirma se é alergia ou preferência 
e já marca no sistema.

Cliente nem percebe que é IA. Só sente que recebeu resposta rápida.

Posso te mandar um vídeo de 2 minutos mostrando na prática?

[Link video seu]

[Seu nome]
```

---

### Email 4 - URGÊNCIA (REST)

```
ASSUNTO:
Última chance: teste por 7 dias (sem custo)

CORPO:
Oi [Nome],

Achei estranho não ter recebido retorno.

Ou meu email caiu em spam, ou realmente não faz sentido pra vocês.

Se é segunda opção, tudo bem. Mas antes de arquivar, queria deixar essa oferta em pé:

Posso colocar uma IA respondendo seu WhatsApp por 7 dias, grátis, sem contrato.

Você vê na prática se funciona. Se não funcionar, a gente desativa.

Sem compromisso. Só pra você ter certeza antes de decidir.

Se interessar: [link calendly]

Senão, sucesso aí.

[Seu nome]
```

---

### Email 5 - DESPEDIDA (REST)

```
ASSUNTO:
Finalizando (mas deixo porta aberta)

CORPO:
Oi [Nome],

Vou parar de mandar email (prometo).

Só queria deixar registrado: se em algum momento você achar que automação de atendimento faz sentido, 
a gente tá aqui.

Basta mandar reply.

Sucesso com [Nome Restaurante]!

[Seu nome]
```

---

## CHECKLIST - CÓPIA PURA

```
DIÁRIO:

MANHÃ - PROSPECTING (2h)
[ ] LinkedIn: 20 msgs enviadas
    - Segmento: _______
    - Quantas: _____ (meta: 20)
[ ] Respostas: _____ (meta: 2-3)
[ ] Pedi WhatsApp: _____ (meta: 1-2)
[ ] Anotei no Sheet: [ ]

MEIO DIA - CALLS (2h)
[ ] Ligações: _____ (meta: 2-3)
[ ] Demos agendadas: _____ (meta: 1-2)
[ ] Propostas: _____ (meta: 1)
[ ] Anotei resultados: [ ]

TARDE - FOLLOW-UP (1h)
[ ] WhatsApp respondido: [ ]
[ ] Propostas em follow-up: [ ]
[ ] Atualizar Sheet: [ ]

FINAL - DASHBOARD (30min)
[ ] Sheet atualizado: [ ]
[ ] Análise do dia: _____ (status)
[ ] Amanhã planejado: [ ]

RESUMO:
Entrada: _____ (meta: 6-10)
Demos: _____ (meta: 1-2)
Status: [ ] NO TRACK / [ ] ABAIXO

Próximo: _______________
```

---

## LINKEDIN - LISTA PREENCHER

**Copie e adapte pra sua lista:**

```
Nome | Título | Empresa | URL LinkedIn | Segmento | Status | Data | Resposta
---|---|---|---|---|---|---|---
[Nome] | Gerente Op | [Rest] | /in/[url] | REST | Não enviado | - | -
[Nome] | Gerente Com | [Imob] | /in/[url] | IMOB | Não enviado | - | -
[Nome] | Dono | [Ecom] | /in/[url] | ECOM | Não enviado | - | -
```

---

## CALENDLY - TEXTO PEDIR AGENDAMENTO

**Copie e cole no final do email/mensagem WhatsApp:**

```
Faz sentido conversar? 
Esses são meus horários disponíveis essa semana:

[Link calendly]

Marca aí o que funciona melhor pra você.
```

---

## WHATSAPP - PRIMEIRA MENSAGEM

**Copie e adapte conforme segmento:**

```
Oi [Nome]! Tudo certo?

Você respondeu meu [email/LinkedIn/call] sobre atendimento automático de pedidos.

Aqui funcionaria assim: a gente identifica quando cliente manda pedido no WhatsApp fora do horário. 
IA responde confirmando e qualificando (delivery, retirada, local).

Seu cliente não sente que é máquina. Você não perde receita.

Quer marcar uma call de 20 min pra eu entender melhor [Nome Restaurante]?

[Link calendly]

ou me manda seu horário que eu me encaixo.
```

---

## FÓRMULAS GOOGLE SHEETS

**Se quiser ser avançado:**

```
Contar leads quentes:
=COUNTIF(F:F,">=80")

Somar valor total:
=SUM(H:H)

Média do score:
=AVERAGE(E:E)

Contar status específico:
=COUNTIF(B:B,"QUENTE")

Taxa conversão:
=COUNTIF(G:G,"FECHADO")/COUNTA(A:A)-1
```

---

**Tudo pronto pra copiar e colar!**

**Próximo: Comece segunda 08h com PLANO_ACAO**

