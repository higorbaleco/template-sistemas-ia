# 02. Arquitetura

Esta arquitetura descreve a organizacao do Gleaming Nest sem entrar em implementacao de tela.

## 1. Camadas

```txt
src/
  app/ ou routes/     roteamento, composicao de telas e layout
  components/        componentes de UI reutilizaveis
  hooks/             hooks de dados e integracao
  lib/               clientes, mapeadores, utilitarios
  types/             tipos do dominio
supabase/
  functions/         Edge Functions
```

## 2. Responsabilidade de cada camada

| Camada | Responsabilidade |
|---|---|
| `app` ou `routes` | montar as paginas e o layout geral |
| `components` | UI reutilizavel e controles visuais |
| `hooks` | buscar e salvar dados via Supabase |
| `lib` | clientes, constantes e mapeamento de dados |
| `types` | contratos do dominio |
| `supabase/functions` | integracoes com Notion, Anthropic e Apify |

## 3. Direcao de dependencia

Regra:

- o frontend conversa com as Edge Functions
- as Edge Functions conversam com Notion e APIs externas
- o frontend nao deve chamar Notion direto
- regras de integracao ficam fora dos componentes visuais

Fluxo principal:

```txt
UI -> hook -> Supabase Function -> API externa -> resposta -> UI
```

## 4. Rotas principais

| Rota | Proposito |
|---|---|
| `/` | home com atalhos e status geral |
| `/ganchos` | lista e cadastro de ganchos |
| `/inspiracoes` | catalogo de referencias e saves |
| `/roteiros` | kanban de roteiros |
| `/roteiros/:id` | editor de roteiro e analise Iada |

## 5. Modelo conceitual

| Entidade | Descricao | Relacoes |
|---|---|---|
| Gancho | abertura ou ideia pronta para uso | pode nascer de inspiracao |
| Inspiracao | save, post ou referencia externa | pode virar gancho |
| Roteiro | texto e status de producao | pode vincular gancho |
| Analise Iada | resultado da avaliacao do roteiro | pertence a um roteiro |
| Concorrente | fonte de coleta automatizada | alimenta inspiracoes |

## 6. Regras de arquitetura

- Toda persistencia de negocio passa pelo Notion
- Toda analise de roteiro passa pela Edge Function `iada-analyze`
- Toda ingestao automatica passa pela Edge Function `daily-ingest`
- A funcao `notion-proxy` centraliza a comunicacao com o Notion
- O layout nao deve depender de estado local como unica fonte de verdade

