# Modelo de dados

## Entidades principais

### Simulation

Representa uma simulação individual.

Campos esperados:

* id
* type
* title
* inputs
* outputs
* createdAt
* updatedAt

### Scenario

Agrupa uma ou mais simulações comparáveis.

Campos esperados:

* id
* name
* description
* simulations
* labels
* createdAt

### HistoryItem

Registra execução local.

Campos esperados:

* id
* simulationType
* summary
* snapshot
* createdAt

### AppSettings

Configurações globais do usuário.

Campos esperados:

* currency
* locale
* defaultRates
* theme
* compactMode

## Persistência inicial

* LocalStorage para uso offline
* estrutura serializável em JSON
* versionamento de schema para migração futura

## Evolução futura

* Supabase para sincronização
* PostgreSQL para histórico persistente
* Firebase como alternativa de autenticação e sync
* API própria para orquestração avançada

