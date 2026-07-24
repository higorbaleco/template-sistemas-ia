# Inventario do Workspace

Data de corte: 24 de julho de 2026

## Resumo executivo

O workspace mistura quatro tipos de conteudo:

1. projetos com Git proprio
2. projetos de codigo ainda sem historico consolidado
3. pastas operacionais e materiais soltos
4. backups binarios na raiz

O principal problema de peso nao esta no codigo-fonte. Quase todo o volume vem
de dependencias e builds locais, o que e bom: isso pode ser ignorado no Git e
reinstalado depois sem perda funcional.

## Top itens por peso

| Ordem | Item | Peso aprox. | Estado Git | Stack | Peso dominante | Comando de reativacao |
| --- | --- | ---: | --- | --- | --- | --- |
| 1 | `Gerador de Propostas \| Avraham` | 1.18 GB | repo existente, dirty | Node workspace + Python | `node_modules` 617 MB, `.venv` 175 MB, `.next` 124 MB | `npm install` e `npm run dev` |
| 2 | `SOCIAL-MEDIA-OLLEG` | 858 MB | repo existente, dirty | Next.js | `node_modules` 590 MB, `.next` 264 MB | `cd app && npm install && npm run dev` |
| 3 | `Painel SVP Disparos WhatsApp` | 748 MB | sem `.git` na raiz | dois apps Vite | `node_modules` 378 MB + 358 MB | rodar no app desejado |
| 4 | `OUTBOUND \| OLLEG` | 675 MB | sem `.git` na raiz | Python + dashboard Vite | `.venv` 493 MB, `node_modules` 180 MB | reativar backend e dashboard separadamente |
| 5 | `SITE AVRAHAM 2026` | 642 MB | repo existente, dirty | app Vite/TanStack | `node_modules` 596 MB | `cd avraham-lp-verde && npm install && npm run dev` |
| 6 | `Calculadora-custos-ia` | 510 MB | sem `.git` na raiz | app Vite/TanStack | `node_modules` 505 MB | `cd calculadora-custos-ia && npm install && npm run dev` |
| 7 | `pakas-app` | 435 MB | sem `.git` na raiz | Vite + pacote auxiliar | `node_modules` 235 MB | reativar `pakas` primeiro |
| 8 | `Avraham New CRM` | 425 MB | repo existente, sem commits | app Vite/TanStack | `node_modules` 415 MB | `cd avraham-hub && npm install && npm run dev` |
| 9 | `GitHub` | 414 MB | sem `.git` na raiz | workspace Node | `node_modules` 396 MB | `cd avraham-reach && npm install && npm run dev` |
| 10 | `Catalogo Car Systema` | 413 MB | sem `.git` na raiz | app Vite/TanStack | `node_modules` 401 MB | `cd catalogo-car-system && npm install && npm run dev` |
| 11 | `Gerador de Briefing` | 365 MB | sem `.git` na raiz | app Vite/TanStack | `node_modules` 356 MB | `cd avraham-briefing-hub && npm install && npm run dev` |
| 12 | `Decide Aí Food` | 371 MB | sem `.git` detectado na raiz do projeto | Next.js | `node_modules` 305 MB, `.next` 66 MB | `npm install` e `npm run dev` |

## Subrepositorios detectados

Os seguintes diretorios ja possuem `.git` proprio:

- `Avraham New CRM`
- `Berteli | PDF's Consultoria Automotiva`
- `CALCULO MARGEM DISPAROS TOPSEND`
- `Cardápio Online | Pizza do Gordo`
- `Gerador de Cardápio Semanal`
- `Gerador de Propostas | Avraham`
- `Higir - Dash Campanha Disparo`
- `Painel Feira`
- `SITE AVRAHAM 2026`
- `SOCIAL-MEDIA-OLLEG`
- `my-project`
- `smart-finance-central`

## Situacao dos projetos prioritarios

### 1. `Gerador de Propostas | Avraham`

- Branch atual: `main`
- Estado: repo existente com alteracoes locais e arquivos novos
- Stack detectada: Node com workspaces e painel Python
- Scripts principais:
  - `npm run dev`
  - `npm run build`
  - `npm run studio`
  - `npm run validate`
- Acao antes do push:
  - nao subir `node_modules`, `.next` nem `.venv`
  - revisar alteracoes locais antes de qualquer commit em massa
  - decidir se este repo continua independente ou so entra como pasta do workspace umbrella

### 2. `SOCIAL-MEDIA-OLLEG`

- Branch atual: `main`
- Estado: repo existente com alteracoes locais importantes
- Stack detectada: Next.js
- Scripts principais:
  - `cd app && npm run dev`
  - `cd app && npm run build`
  - `cd app && npm run start`
- Acao antes do push:
  - revisar as mudancas locais antes de encaixar no workspace umbrella
  - manter `.next` e `node_modules` fora do Git

### 3. `OUTBOUND | OLLEG`

- Stack detectada: Python + dashboard React/Vite
- Componentes:
  - backend em `AI-cold-outreach`
  - dashboard em `AI-cold-outreach/dashboard`
- Scripts principais:
  - backend: instalar por `requirements.txt`
  - dashboard: `npm install` e `npm run dev`
- Acao antes do push:
  - nao subir `.venv`
  - documentar dependencias externas e variaveis de ambiente

### 4. `SITE AVRAHAM 2026`

- Branch atual: `main`
- Estado: repo existente, `ahead 1`, com alteracoes locais
- Stack detectada: app Vite/TanStack
- Scripts principais:
  - `cd avraham-lp-verde && npm run dev`
  - `cd avraham-lp-verde && npm run build`
- Acao antes do push:
  - revisar o commit local ainda nao publicado
  - manter `dist/` fora do versionamento umbrella

### 5. `Painel SVP Disparos WhatsApp`

- Stack detectada: dois apps Vite
- Componentes:
  - `avraham-spark`
  - `sendpanel-avraham`
- Scripts principais:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
- Acao antes do push:
  - decidir qual dos dois apps e o principal
  - evitar duplicacao de dependencias no Git da raiz

### 6. `smart-finance-central`

- Branch atual: `main`
- Estado: repo existente com alteracoes locais e pasta `scripts/` nova
- Stack detectada: React + Vite + TypeScript
- Gerenciador: `pnpm@10.33.3`
- Scripts principais:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm lint`
- Acao antes do push:
  - revisar mudancas em `src/`
  - manter `dist/` fora do versionamento umbrella

### 7. `Decide Aí Food`

- Stack detectada: Next.js
- Scripts principais:
  - `npm run dev`
  - `npm run build`
  - `npm run start`
  - `npm run seed`
- Acao antes do push:
  - limpar cache de build
  - garantir `.env` e chaves fora do Git

### 8. `my-project`

- Branch atual: `main`
- Estado: repo existente, sem commits
- Stack detectada: Nuxt Content
- Scripts principais:
  - `npm run dev`
  - `npm run build`
  - `npm run generate`
  - `npm run preview`
- Acao antes do push:
  - fazer o primeiro commit do projeto quando o escopo estiver claro

### 9. `CRM Avraham ANTIGO FLOW`

- Stack detectada: React + Vite
- Scripts principais:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
- Acao antes do push:
  - criar historico proprio se o projeto ainda for relevante
  - ou marcar como legado dentro do workspace umbrella

### 10. `CALCULO MARGEM DISPAROS TOPSEND`

- Branch atual: `main`
- Estado: repo existente, sem commits, com `dist/` rastreado localmente
- Stack detectada: React + Vite
- Scripts principais:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Acao antes do push:
  - parar de subir `dist/`
  - revisar arquivos staged e manter apenas fonte e documentacao

### 11. `Cardápio Online | Pizza do Gordo`

- Branch atual: `main`
- Estado: repo existente, sem commits
- Stack detectada: Vite + PWA
- Scripts principais:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Acao antes do push:
  - preservar `docs/` e fontes
  - manter `dist/` fora do Git normal

## Pastas que parecem operacionais ou misc

Essas pastas existem na raiz, mas hoje nao entram na fila critica de peso:

- `_Organized`
- `Agente Conteúdi`
- `CRIADOR DO GPT MAKER`
- `Calculadora-custos-ia`
- `Catalogo Car Systema`
- `Comercial Avraham`
- `Criação-materiais-aprendizado`
- `Gerador de Briefing`
- `Painel Avraham Daily`
- `Painel SVP Disparos WhatsApp`
- `Painel de Execução Comercial Avraham v2`
- `catalogo-whatsapp-google-sheets`
- `design-scraper`
- `design-scraper 2`
- `prospeccao claude`
- `workspace-audit`

## Recomendacao estrutural

Recomendacao para a pasta principal:

1. manter os projetos pesados onde estao por enquanto
2. usar esta raiz como repositorio umbrella e indice operacional
3. ignorar artefatos regeneraveis no Git da raiz
4. tratar os `.zip` da raiz como backup local, ou migrar depois para uma pasta de arquivo fora do fluxo principal
