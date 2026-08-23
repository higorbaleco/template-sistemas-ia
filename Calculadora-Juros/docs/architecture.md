# Arquitetura

## Princípios

* separar UI, regras de negócio e persistência
* manter o core financeiro puro e testável
* evitar constantes financeiras espalhadas pela interface
* preferir composição por módulos de domínio
* tratar persistência local como fonte temporária, não como verdade definitiva

## Camadas

### 1. App

Responsável por bootstrap, providers, roteamento e composição global.

### 2. Modules

Cada domínio tem seu conjunto de páginas, formulários, listas, gráficos e regras de orquestração.

### 3. Financial core

Funções matemáticas puras, sem dependência de React, DOM, armazenamento ou serviços externos.

### 4. Hooks

Fazem a ponte entre formulário, cálculo, persistência e estado de tela.

### 5. Services

Persistência local, exportação de relatórios e futuras integrações.

### 6. Components

Biblioteca visual compartilhada com foco em acessibilidade e consistência.

## Padrões

* `financial` recebe parâmetros e retorna resultados
* `hooks` coordenam o fluxo da tela
* `modules` definem a experiência de cada domínio
* `components` não contêm regra de negócio

## Tecnologias alvo

* React
* TypeScript strict
* Vite
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts
* React Hook Form
* Zod
* Vitest
* LocalStorage

## Preparação para backend futuro

* tipos prontos para API própria
* contratos compatíveis com Supabase, Firebase e PostgreSQL
* serialização de cenários e histórico
* camada de service isolada para troca posterior de implementação

