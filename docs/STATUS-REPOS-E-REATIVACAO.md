# Status de Repos e Reativacao

Data de corte: 24 de julho de 2026

Este documento separa os projetos em dois grupos:

1. projetos que **ja possuem `.git` proprio**
2. projetos que **ainda nao possuem repo proprio**, mas ja tem cara de app ou sistema

O foco aqui e pratico: remoto, doc, deploy e o caminho mais rapido para reviver.

## Estrutura atual da raiz

Os projetos foram movidos fisicamente para:

- [TEM GIT](</Users/higorplens/Antigravity Software/TEM GIT/README.md>)
- [NAO TEM GIT](</Users/higorplens/Antigravity Software/NAO TEM GIT/README.md>)

## 1. Projetos que ja possuem repo local (`.git`)

### Visao rapida

| Projeto | Repo local | Remote `origin` | Doc principal | Deploy mapeado | Estado para reativar |
| --- | --- | --- | --- | --- | --- |
| `Gerador de Propostas \| Avraham` | sim | sim | forte | sim, Vercel para `apps/studio` | bom, mas dirty |
| `SOCIAL-MEDIA-OLLEG` | sim | sim | basico | sim, Vercel generico | medio, dirty |
| `smart-finance-central` | sim | sim | basico | sim, via Lovable Publish | medio, dirty |
| `SITE AVRAHAM 2026` | sim | sim | parcial | nao explicito | medio, `ahead 1` |
| `Higir - Dash Campanha Disparo` | sim | sim | parcial | nao explicito | medio, 1 alteracao local |
| `Cardápio Online \| Pizza do Gordo` | sim | nao | forte | sim, Netlify e hosts estaticos | bom |
| `Berteli \| PDF's Consultoria Automotiva` | sim | nao | forte | sim, Netlify | bom |
| `Painel Feira` | sim | nao | bom | alvo Vercel documentado | bom |
| `Avraham New CRM` | sim | nao | forte | nao explicito | bom para retomada, sem commits |
| `CALCULO MARGEM DISPAROS TOPSEND` | sim | nao | fraco | nao explicito | precisa higiene primeiro |
| `my-project` | sim | nao | basico | docs genericas Nuxt | ok, sem commits |
| `Gerador de Cardápio Semanal` | sim | nao | fraco | nao mapeado | precisa documentar do zero |

### 1.1 `Gerador de Propostas | Avraham`

- Repo local: sim
- Remote: `https://github.com/higorbaleco/gerador-de-propostas-avraham.git`
- Branch: `main`
- Documentacao:
  - [README principal](</Users/higorplens/Antigravity Software/TEM GIT/Gerador de Propostas | Avraham/README.md>)
  - [apps/studio/README.md](</Users/higorplens/Antigravity Software/TEM GIT/Gerador de Propostas | Avraham/apps/studio/README.md>)
  - [avraham-panel/README.md](</Users/higorplens/Antigravity Software/TEM GIT/Gerador de Propostas | Avraham/avraham-panel/README.md>)
- Deploy:
  - o `apps/studio` tem deploy documentado na Vercel
  - o painel Python e a camada de geracao ainda dependem de setup proprio
- Como reviver:
  - `npm install`
  - `npm run dev`
  - opcional: `npm run studio`
- Proximos passos:
  - revisar o working tree dirty antes de novo push
  - validar variaveis do Studio
  - decidir se o `avraham-panel` entra na rodada de retomada agora ou depois

### 1.2 `SOCIAL-MEDIA-OLLEG`

- Repo local: sim
- Remote: `https://github.com/melnikoff-oleg/social-media.git`
- Branch: `main`
- Documentacao:
  - [app/README.md](</Users/higorplens/Antigravity Software/TEM GIT/SOCIAL-MEDIA-OLLEG/app/README.md>)
- Deploy:
  - README padrao do Next.js, apontando Vercel como caminho natural
- Como reviver:
  - `cd app`
  - `npm install`
  - `npm run dev`
- Proximos passos:
  - revisar alteracoes locais em `app/src` e `data/configs.csv`
  - documentar envs reais e integrações (`apify`, `claude`, `gemini`)

### 1.3 `smart-finance-central`

- Repo local: sim
- Remote: `https://github.com/scaleflowautomacoes/smart-finance-central.git`
- Branch: `main`
- Documentacao:
  - [README.md](</Users/higorplens/Antigravity Software/TEM GIT/smart-finance-central/README.md>)
  - [central-financeira-implementacao/README.md](</Users/higorplens/Antigravity Software/TEM GIT/smart-finance-central/central-financeira-implementacao/README.md>)
- Deploy:
  - o README aponta publicacao via Lovable
- Como reviver:
  - `pnpm install`
  - `pnpm dev`
- Proximos passos:
  - revisar alteracoes locais antes de publicar
  - verificar se o deploy continua sendo feito pelo Lovable ou se migra para fluxo Git

### 1.4 `SITE AVRAHAM 2026`

- Repo local: sim
- Remote: `https://github.com/higorbaleco/SITE-AVRAHAM-2026.git`
- Branch: `main`
- Documentacao:
  - [design-system/README.md](</Users/higorplens/Antigravity Software/TEM GIT/SITE AVRAHAM 2026/design-system/README.md>)
- Deploy:
  - nao ha README operacional do app, mas a estrutura indica build frontend padrao
- Como reviver:
  - `cd avraham-lp-verde`
  - `npm install`
  - `npm run dev`
- Proximos passos:
  - revisar o repo que esta `ahead 1`
  - escrever README de operacao do app, nao so do design system

### 1.5 `Higir - Dash Campanha Disparo`

- Repo local: sim
- Remote: `https://github.com/higorbaleco/avraham-site-2026.git`
- Branch: `main`
- Documentacao:
  - [Avraham Digital Design System/README.md](</Users/higorplens/Antigravity Software/TEM GIT/Higir - Dash Campanha Disparo/Avraham Digital Design System/README.md>)
- Deploy:
  - nao ha guia de deploy explicito do app
- Como reviver:
  - `cd avraham-site`
  - `npm install`
  - `npm run dev`
- Proximos passos:
  - revisar a alteracao local em `vite.config.ts`
  - adicionar README operacional do app

### 1.6 `Cardápio Online | Pizza do Gordo`

- Repo local: sim
- Remote: nao configurado
- Branch: `main`
- Documentacao:
  - [README.md](</Users/higorplens/Antigravity Software/TEM GIT/Cardápio Online | Pizza do Gordo/README.md>)
- Deploy:
  - bem documentado
  - `netlify.toml` presente
  - README cita Netlify, Vercel, Cloudflare Pages e GitHub Pages
- Como reviver:
  - `npm install`
  - `npm run dev`
- Proximos passos:
  - conectar um remote
  - fazer o primeiro commit limpo
  - publicar no host escolhido

### 1.7 `Berteli | PDF's Consultoria Automotiva`

- Repo local: sim
- Remote: nao configurado
- Branch: `main`
- Documentacao:
  - [README.md](</Users/higorplens/Antigravity Software/TEM GIT/Berteli | PDF's Consultoria Automotiva/README.md>)
  - `PRD.md`
  - `DETALHAMENTO-TECNICO.md`
- Deploy:
  - bem documentado
  - `netlify.toml` presente
  - site estatico puro, sem build step
- Como reviver:
  - `npx serve .`
  - ou `python3 -m http.server 8000`
- Proximos passos:
  - conectar um remote
  - fazer primeiro commit
  - publicar no Netlify

### 1.8 `Painel Feira`

- Repo local: sim
- Remote: nao configurado
- Branch: `main`
- Documentacao:
  - [README.md](</Users/higorplens/Antigravity Software/TEM GIT/Painel Feira/README.md>)
  - pasta `docs/`
- Deploy:
  - o README ja aponta Vercel como proximo passo
- Como reviver:
  - `npm install`
  - configurar `.env.local`
  - aplicar schema no Supabase
  - `npm run dev`
- Proximos passos:
  - fazer primeiro commit
  - conectar repo remoto
  - preparar deploy Vercel + variaveis Supabase

### 1.9 `Avraham New CRM`

- Repo local: sim
- Remote: nao configurado
- Branch: `main`
- Documentacao:
  - [avraham-hub/docs/README.md](</Users/higorplens/Antigravity Software/TEM GIT/Avraham New CRM/avraham-hub/docs/README.md>)
  - docs bem estruturadas em PRD, stack, dados, telas e roadmap
- Deploy:
  - nao esta explicitamente documentado
- Como reviver:
  - `cd avraham-hub`
  - `npm install`
  - `npm run dev`
- Proximos passos:
  - criar primeiro commit
  - definir ambiente de deploy
  - documentar `.env` e fluxo de publicacao

### 1.10 `CALCULO MARGEM DISPAROS TOPSEND`

- Repo local: sim
- Remote: nao configurado
- Branch: `main`
- Documentacao:
  - muito pouca
- Deploy:
  - nao documentado
- Como reviver:
  - `npm install`
  - `npm run dev`
- Proximos passos:
  - limpar `dist/` do versionamento
  - criar README operacional
  - so depois conectar remote e publicar

### 1.11 `my-project`

- Repo local: sim
- Remote: nao configurado
- Branch: `main`
- Documentacao:
  - [README.md](</Users/higorplens/Antigravity Software/TEM GIT/my-project/README.md>) generico do Nuxt
- Deploy:
  - apenas docs genericas do Nuxt
- Como reviver:
  - `npm install`
  - `npm run dev`
- Proximos passos:
  - dar nome e escopo reais ao projeto
  - fazer primeiro commit
  - escrever README proprio

### 1.12 `Gerador de Cardápio Semanal`

- Repo local: sim
- Remote: nao configurado
- Branch: `main`
- Documentacao:
  - praticamente ausente
- Deploy:
  - nao mapeado
- Como reviver:
  - precisa descobrir stack primeiro
- Proximos passos:
  - inventariar o conteudo
  - criar README
  - so depois configurar remote e deploy

## 2. Projetos sem repo proprio ainda

Estes merecem o mesmo processo: inventario, README, `.gitignore`, primeiro commit,
remote e estrategia de deploy.

### Prioridade alta

#### `CRM Avraham ANTIGO FLOW`

- Repo local: nao
- Stack: React + Vite
- Doc: [README.md](</Users/higorplens/Antigravity Software/CRM Avraham ANTIGO FLOW/README.md>) generico
 - Doc: [README.md](</Users/higorplens/Antigravity Software/NAO TEM GIT/CRM Avraham ANTIGO FLOW/README.md>) generico
- Reviver:
  - `npm install`
  - `npm run dev`
- Falta:
  - repo proprio
  - README real
  - deploy documentado

#### `Decide Aí Food`

- Repo local: nao
- Stack: Next.js
- Reviver:
  - `npm install`
  - `npm run dev`
- Falta:
  - README
  - repo proprio
  - deploy documentado
  - mapa de variaveis e seed

#### `Gerador de Briefing`

- Repo local: nao
- Stack: TanStack Start / Vite
- Doc:
  - `vercel.json` presente
  - arquitetura com arquivo `06-deploy-vercel.md`
- Reviver:
  - `cd avraham-briefing-hub`
  - `npm install`
  - `npm run dev`
- Falta:
  - repo proprio
  - consolidar README principal operacional

#### `OUTBOUND | OLLEG`

- Repo local: nao
- Stack: Python + dashboard Vite
- Doc:
  - [AI-cold-outreach/README.md](</Users/higorplens/Antigravity Software/NAO TEM GIT/OUTBOUND | OLLEG/AI-cold-outreach/README.md>)
  - [dashboard/README.md](</Users/higorplens/Antigravity Software/NAO TEM GIT/OUTBOUND | OLLEG/AI-cold-outreach/dashboard/README.md>)
  - `Dockerfile` presente
- Reviver:
  - backend: `pip install -r requirements.txt`
  - frontend: `cd dashboard && npm install && npm run dev`
- Falta:
  - repo proprio
  - decidir se backend e dashboard vivem juntos ou separados

#### `Painel SVP Disparos WhatsApp`

- Repo local: nao
- Stack: dois apps TanStack/Vite
- Doc:
  - [avraham-spark/README.md](</Users/higorplens/Antigravity Software/NAO TEM GIT/Painel SVP Disparos WhatsApp/avraham-spark/README.md>)
  - [sendpanel-avraham/README.md](</Users/higorplens/Antigravity Software/NAO TEM GIT/Painel SVP Disparos WhatsApp/sendpanel-avraham/README.md>)
  - docs de `DEPLOYMENT`, `DATABASE`, `ROADMAP`
- Reviver:
  - `bun install`
  - `bun run dev`
- Falta:
  - repo proprio
  - decidir qual dos dois apps e o principal

### Prioridade media

#### `Calculadora-custos-ia`

- Repo local: nao
- Stack: TanStack/Vite
- Reviver:
  - `cd calculadora-custos-ia`
  - `npm install`
  - `npm run dev`
- Falta:
  - repo proprio
  - README
  - deploy documentado

#### `Catalogo Car Systema`

- Repo local: nao
- Stack: TanStack/Vite
- Doc parcial:
  - `catalogo-car-system/docs/roadmap/README.md`
- Reviver:
  - `cd catalogo-car-system`
  - `npm install`
  - `npm run dev`
- Falta:
  - repo proprio
  - README principal
  - deploy documentado

#### `GitHub`

- Repo local: nao
- Stack: monorepo `avraham-reach`
- Doc:
  - [avraham-reach/README.md](</Users/higorplens/Antigravity Software/NAO TEM GIT/GitHub/avraham-reach/README.md>)
- Reviver:
  - `cd avraham-reach`
  - `npm install`
  - `npm run dev`
- Falta:
  - repo proprio no nivel da pasta `GitHub`
  - decidir se o repo real sera a pasta `GitHub` ou `avraham-reach`

#### `agro-system`

- Repo local: nao
- Stack: Next.js
- Reviver:
  - `cd apps/web`
  - `npm install`
  - `npm run dev`
- Falta:
  - README
  - repo proprio
  - deploy documentado

#### `avraham-ai-gpt`

- Repo local: nao
- Stack: TanStack/Vite
- Reviver:
  - `cd avraham-ai-gpt`
  - `npm install`
  - `npm run dev`
- Falta:
  - README
  - repo proprio
  - deploy documentado

#### `pakas-app`

- Repo local: nao
- Stack:
  - `pakas` em Vite
  - `antigravity-awesome-skills` em Node/Python
- Doc:
  - [pakas/README.md](</Users/higorplens/Antigravity Software/NAO TEM GIT/pakas-app/pakas/README.md>)
  - [antigravity-awesome-skills/README.md](</Users/higorplens/Antigravity Software/NAO TEM GIT/pakas-app/antigravity-awesome-skills/README.md>)
- Reviver:
  - `cd pakas && npm install && npm run dev`
  - pacote auxiliar tem scripts proprios de build/test
- Falta:
  - repo proprio
  - decidir se vira monorepo oficial

### Prioridade baixa ou exploratoria

#### `Criador de Agentes GPT Maker`

- Repo local: nao
- Estrutura grande e misturada, com `dashboard`, `opensquad` e templates
- Proximo passo:
  - decidir qual subapp e o principal antes de versionar

#### `Agente Conteúdi`

- Repo local: nao
- Estrutura tecnica mais voltada a toolkit (`Cargo.toml` + `openclaw/package.json`)
- Proximo passo:
  - primeiro definir se isso e produto, ferramenta interna ou dependencia

#### `design-scraper`

- Repo local: nao
- Tem `package.json`, mas sem doc operacional
- Proximo passo:
  - abrir e escrever README minimo antes de criar repo

#### `design-scraper 2`

- Repo local: nao
- Mesmo caso do anterior
- Proximo passo:
  - decidir se substitui ou duplica `design-scraper`

#### `prospeccao claude`

- Repo local: nao
- Tem `package.json`, mas sem doc e sem scripts claros
- Proximo passo:
  - inspecionar o objetivo real antes de versionar

## 3. Ordem recomendada de ataque

Se a ideia e reviver com seguranca e gerar momentum:

1. fechar os repos que ja estao quase prontos para deploy
2. depois transformar os sem repo em projetos versionados

Ordem sugerida:

1. `Cardápio Online | Pizza do Gordo`
2. `Berteli | PDF's Consultoria Automotiva`
3. `Painel Feira`
4. `Avraham New CRM`
5. `Gerador de Propostas | Avraham`
6. `Gerador de Briefing`
7. `OUTBOUND | OLLEG`
8. `Painel SVP Disparos WhatsApp`
9. `CRM Avraham ANTIGO FLOW`
10. `Decide Aí Food`

## 4. Regra simples para repetir o processo

Para cada projeto:

1. confirmar stack e comando de rodar
2. garantir `.gitignore`
3. criar ou revisar `README.md`
4. mapear deploy
5. criar primeiro commit limpo
6. conectar `origin`
7. testar revive local
