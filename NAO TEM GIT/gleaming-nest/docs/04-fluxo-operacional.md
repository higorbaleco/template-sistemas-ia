# 04. Fluxo operacional

Este documento mostra o caminho da informacao dentro do Gleaming Nest.

## 1. Captura

Fontes de entrada:

- saves do Instagram
- posts de concorrentes
- tendencias do Google Trends
- roteiros digitados manualmente
- ideias capturadas pelo operador

## 2. Normalizacao

As Edge Functions transformam entradas externas em registros consistentes:

- `daily-ingest` cria itens novos no Notion
- `notion-proxy` faz query, create, update e get
- o frontend exibe tudo em formato operacional

## 3. Producoes centrais

### Ganchos

Entrada:

- manual
- automatico via tendencias
- derivado de inspiracao

Saida:

- lista limpa de aberturas reutilizaveis

### Inspiracoes

Entrada:

- saves
- concorrentes

Saida:

- referencia pronta para virar gancho

### Roteiros

Entrada:

- gancho selecionado
- texto do roteiro
- checklist de qualidade

Saida:

- roteiro pronto para revisao e analise

### Iada

Entrada:

- texto do roteiro
- marcações
- checklist

Saida:

- score
- pontos fortes
- sugestoes
- reescrita opcional

## 4. Ingestao diaria

Fluxo diario esperado:

1. o cron dispara `daily-ingest`
2. a funcao consulta fontes externas
3. novos registros sao criados no Notion
4. o frontend passa a enxergar os novos itens na proxima leitura

## 5. Analise sob demanda

Fluxo do editor:

1. usuario abre `/roteiros/:id`
2. altera texto, marcações ou checklist
3. clica em `Rodar Iada`
4. a Edge Function analisa o conteudo
5. a resposta volta para a tela e e persistida no Notion

