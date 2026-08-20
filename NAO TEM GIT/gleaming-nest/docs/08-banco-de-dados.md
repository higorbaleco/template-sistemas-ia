# 08. Banco de dados

Neste projeto, o sistema de registro e o "banco" de negocio e o Notion.

## 1. Topologia

| Componente | Papel |
|---|---|
| Notion | armazenamento principal do dominio |
| Supabase | camada de orquestracao e proxy |
| Edge Functions | leitura, escrita e integracoes externas |

## 2. Databases do Notion

| Database | Uso |
|---|---|
| Ganchos | biblioteca de aberturas |
| Roteiros | cadastro e producao de roteiros |
| Inspiracoes | referencias e saves |
| Concorrentes | lista de fontes a monitorar |

## 3. Entidades e propriedades

### Gancho

- titulo
- intencao
- tema
- origem
- data adicionada
- performance media

### Roteiro

- titulo
- status
- resultado
- metricas
- data publicacao
- texto roteiro
- marcacoes
- checklist
- ultima analise Iada
- relacao com gancho, quando existir

### Inspiracao

- autor
- url
- post url
- origem
- tema inferido
- gancho extraido
- transcricao
- data de captura

### Concorrente

- nome ou handle
- ativo
- ultima varredura

## 4. Regras de integracao

- os nomes das propriedades no Notion precisam permanecer estaveis
- o mapeamento de ida e volta fica concentrado nas Edge Functions
- relacoes devem ser respeitadas no nivel do frontend, mas persistidas pelo Notion
- nao duplicar logica de negocio em componentes visuais

## 5. O que nao existe aqui

- migrations SQL
- indices relacionais
- schema relacional proprio

O dominio e propositalmente registrado no Notion para manter a arquitetura leve.

