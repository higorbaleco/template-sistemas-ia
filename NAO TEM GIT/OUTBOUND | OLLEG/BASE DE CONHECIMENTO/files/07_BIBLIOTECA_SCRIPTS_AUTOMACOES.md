# BIBLIOTECA DE SCRIPTS E AUTOMACOES - AVRAHAM

**Objetivo:** concentrar os scripts reutilizaveis e dizer exatamente quando cada um entra em jogo.

---

## 1. SCRIPTS DE CONVERSA

### 1.1 Mensagem de conexao LinkedIn
**Uso:** primeira aproximacao.

**Regra:** nao vender, nao elogiar artificialmente, nao explicar demais.

**Estrutura**
- contexto da empresa;
- problema comum do segmento;
- motivo da conexao.

**Exemplo base**
```text
Oi [Nome], vi que sua operacao parece ter bastante contato com [tema]. Tenho estudado como empresas desse tipo estao reduzindo perda de oportunidade no primeiro atendimento. Achei que faria sentido conectar.
```

### 1.2 Pos-aceite
**Uso:** logo apos aceitar a conexao.

**Regra:** validar dor, nao fazer pitch.

**Estrutura**
- agradecimento;
- contexto da operacao;
- pergunta operacional binaria.

**Exemplo base**
```text
Obrigado por aceitar, [Nome]. Pelo tipo de operacao de voces, imaginei que WhatsApp, atendimento ou relacionamento com base tenha algum peso comercial. Hoje o maior gargalo esta mais em velocidade de resposta, qualificacao ou retomada de oportunidades antigas?
```

### 1.3 Pergunta diagnostica
**Uso:** depois de abrir a conversa.

**Regra:** pergunta simples, facil de responder, idealmente sim ou nao.

**Exemplo base**
```text
Hoje voces perdem oportunidades por demora ou por falta de padronizacao no atendimento pelo WhatsApp?
```

### 1.4 Transicao para WhatsApp
**Uso:** quando houver abertura real.

**Exemplo base**
```text
Se for mais pratico, posso te mandar um resumo curto por WhatsApp para nao poluir a inbox.
```

### 1.5 Cold call de abertura
**Uso:** ligar para lead com algum sinal de fit.

**Estrutura**
- motivo claro;
- problema observado;
- pergunta simples;
- convite para proximo passo.

**Exemplo base**
```text
Oi, [Nome]. Estou ligando porque vi um padrao na operacao de voces que costuma gerar perda de lead no primeiro contato. Queria confirmar se isso ainda esta acontecendo por ai antes de te tomar muito tempo.
```

### 1.6 WhatsApp curto para PME
**Uso:** contas locais ou mais pequenas com volume.

**Exemplo base**
```text
Oi, [Nome]. Vi que sua empresa atende bastante gente pelo WhatsApp. Temos ajudado negocios assim a reduzir demora e organizar melhor a entrada de contatos. Hoje isso ai pesa mais em atendimento ou em vendas?
```

---

## 2. SEQUENCIAS DE FOLLOW-UP

### 2.1 Sequencia LinkedIn
**Objetivo:** sair do primeiro contato e chegar a diagnostico.

**Passos**
1. conexao;
2. pos-aceite;
3. pergunta diagnostica;
4. reforco com contexto;
5. transicao para call ou WhatsApp;
6. follow-up leve se houver silencio.

### 2.2 Sequencia email fria
**Objetivo:** tocar volume sem perder contexto.

**Estrutura**
- email 1: contexto + hook;
- email 2: case ou prova;
- email 3: dor economica;
- email 4: tentativa de ultimo teste;
- email 5: encerramento limpo.

### 2.3 Sequencia WhatsApp morno
**Objetivo:** retomar quem ja demonstrou interesse.

**Estrutura**
- mensagem 1: resumo da dor;
- mensagem 2: valor potencial;
- mensagem 3: call to action curto.

### 2.4 Reativacao
**Objetivo:** voltar em leads antigos sem parecer insistente.

**Estrutura**
- lembrar o contexto anterior;
- mostrar novidade ou nova leitura;
- oferecer retomada curta.

---

## 3. TEMPLATES QUE PRECISAM EXISTIR

### Comerciais
- diagnostico;
- proposta expressa;
- proposta consultiva;
- proposta enterprise;
- case;
- one page;
- apresentacao comercial;
- escopo;
- aditivo.

### Operacionais
- kickoff;
- ata;
- treinamento;
- handoff;
- encerramento;
- renovacao;
- cobranca de pendencia.

### Inteligencia
- resumo de reuniao;
- atualizacao de CRM;
- score de oportunidade;
- prompt de objeções;
- prompt de prospeccao.

---

## 4. AUTOMACOES QUE JÁ FAZEM SENTIDO

### 4.1 Captura e enriquecimento
**Quando:** um lead entra por qualquer canal.

**Fluxo**
1. capturar;
2. prequalificar;
3. classificar ICP;
4. enriquecer;
5. scorear;
6. gerar mensagem;
7. gravar no Kanban.

**Codigo relacionado**
- `AI-cold-outreach/src/prequalify.py`
- `AI-cold-outreach/src/icp.py`
- `AI-cold-outreach/src/scoring.py`
- `AI-cold-outreach/src/kanban.py`

### 4.2 Busca LinkedIn
**Uso:** contas B2B com decisor claro.

**Codigo relacionado**
- `AI-cold-outreach/src/apify_client.py`
- `AI-cold-outreach/batch_run.py`
- `AI-cold-outreach/pages/1_🔎_Busca_LinkedIn.py`

### 4.3 Busca Google Maps
**Uso:** contas locais e regionais.

**Codigo relacionado**
- `AI-cold-outreach/src/gmaps.py`
- `AI-cold-outreach/pages/2_🗺️_Busca_GoogleMaps.py`

### 4.4 Trilha de custos
**Uso:** quando quiser saber se a operacao esta valendo a pena.

**Codigo relacionado**
- `AI-cold-outreach/src/cost_tracker.py`
- `AI-cold-outreach/pages/4_💰_Custos.py`

### 4.5 Sync de verdade
**Uso:** manter fonte local e espelho externo.

**Codigo relacionado**
- `AI-cold-outreach/src/notion_sync.py`
- `AI-cold-outreach/src/sheets_sync.py`
- `AI-cold-outreach/src/kanban.py`

---

## 5. QUANDO AUTOMATIZAR E QUANDO NAO AUTOMATIZAR

### Automatizar
- follow-up frio;
- lembranca de retorno;
- score inicial;
- registro em CRM;
- espelho em Sheets e Notion;
- notificacao de lead quente.

### Manter manual
- primeira leitura de conta estrategica;
- negociacao;
- proposta em conta grande;
- decisao de fit;
- mensagem em conta sensivel;
- fechamento de escopo.

---

## 6. ARQUIVO DE USO DIARIO

### Antes de prospectar
- escolher canal;
- escolher ICP;
- separar lista;
- revisar script;
- revisar o que e automacao e o que e humano.

### Durante a prospeccao
- registrar resposta;
- mover status;
- agendar proximo contato;
- checar se a dor e real.

### Depois da prospeccao
- revisar taxa de resposta;
- revisar taxa de agendamento;
- revisar custos;
- revisar o que precisa virar template novo.

---

## 7. BIBLIOTECA DE SINAIS

### Sinais de oportunidade
- WhatsApp visivel;
- site ativo;
- horario de atendimento claro;
- formulario de contato;
- volume de comentarios/reviews;
- time comercial aparente;
- vagas abertas para vendas, atendimento ou growth;
- varios canais de entrada.

### Sinais de risco
- empresa pequena demais;
- perfil sem cargo decisor;
- nenhum indício de volume;
- postura de "quero testar IA";
- sem responsavel;
- sem urgencia;
- sem capacidade de implantar.

---

## 8. USO COM IA

### Entrada ideal
- contexto da empresa;
- segmento;
- tamanho;
- canal;
- hipotese de dor;
- evidencia;
- oferta sugerida;
- prioridade.

### Saida ideal
- mensagem de conexao;
- pos-aceite;
- pergunta diagnostica;
- recomendacao de canal;
- proximo passo.

### Regra
Se a IA nao conseguir sustentar a hipotese, o lead deve ser rebaixado ou descartado.

