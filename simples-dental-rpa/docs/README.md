# Simples Dental RPA

Camada de automação para conectar uma IA ao Simples Dental, que **não possui
API pública nem webhooks** (confirmado no help center oficial deles:
`O Simples Dental tem integração via API com outros softwares?` → resposta:
"O Simples Dental não possui API de integração com outros softwares ou
sistemas.").

Como não existe API, a integração acontece por automação de navegador (RPA):
um robô Playwright loga com as credenciais reais do cliente e opera a
interface web como um usuário faria.

## ⚠️ Antes de usar

- As credenciais ficam só no seu `.env` local (nunca commitado — já está no
  `.gitignore`). Copie `.env.example` para `.env` e preencha.
- Isso **não é suportado oficialmente pela Simples Dental** e pode quebrar
  sem aviso se eles mudarem o front-end. Vale checar os Termos de Uso deles
  quanto a automação/scraping antes de colocar isso em produção com o
  cliente — e, em paralelo, vale tentar o contato comercial pedindo API de
  parceiro (empresas desse porte às vezes liberam acesso privado para contas
  grandes).
- Dados de prontuário são dados sensíveis de saúde. Tudo que for salvo em
  `data/simples-dental.db` deve ser tratado com o mesmo cuidado que o
  prontuário original (LGPD).

## Passo 1 — Instalar

```bash
cd "~/Antigravity Software/simples-dental-rpa"
npm install
npx playwright install chromium
cp .env.example .env   # preencha SIMPLESDENTAL_EMAIL e SIMPLESDENTAL_PASSWORD
```

## Passo 2 — Login

```bash
npm run login
```

Isso abre (ou não, se `HEADLESS=true`) o Chromium, loga, e salva a sessão em
`data/session.json` para não precisar logar de novo a cada execução.

Os seletores de login (`src/auth/login.js`) foram escritos sem acesso à tela
real — se o login falhar, rode com `HEADLESS=false` no `.env`, veja onde
trava e ajusta os `TODO`s do arquivo.

## Passo 3 — Capturar a API interna (o passo mais importante agora)

```bash
# no .env: HEADLESS=false
npm run capture
```

Isso abre o navegador logado e **grava toda chamada de rede (XHR/fetch)**
que o próprio site do Simples Dental faz enquanto você navega nele
normalmente — agenda, prontuário, confirmação de consulta, etc.

1. Rode `npm run capture`.
2. Navegue manualmente: abra a Agenda, clique num paciente, abra um
   prontuário, confirme uma consulta — faça exatamente as ações que a IA
   precisa fazer depois.
3. Feche o navegador.
4. Os dados ficam em `data/network-capture/*.json` e na tabela
   `raw_captures` do `data/simples-dental.db`.

Com isso eu consigo ver se o front deles chama uma API JSON interna (o mais
provável — praticamente todo app moderno funciona assim por trás). Se sim,
dá pra implementar `src/actions/*.js` chamando essa API diretamente com
`fetch` (usando os cookies da sessão), que é **muito mais rápido e estável**
do que clicar na tela toda vez. Se não — só HTML renderizado no servidor —
aí sim o robô precisa mesmo clicar/ler a tela via Playwright.

## Passo 4 — Ações (ainda não implementadas)

`src/cli.js` já tem os comandos `list-appointments`, `get-patient` e
`create-appointment` como stubs. Eles ficam reais assim que eu tiver o
resultado do Passo 3 — me manda o conteúdo de `data/network-capture/` (ou
cola os JSONs relevantes aqui) que eu termino a implementação.

## Estrutura

```
src/
  browser.js        # abre o Chromium, reaproveita sessão salva
  auth/login.js      # login + persistência de sessão
  pages/             # Page Objects (a preencher com seletores reais)
  actions/           # funções de alto nível que a IA vai chamar
  storage/db.js       # SQLite local (appointments, patients, raw_captures)
scripts/
  capture-network.js  # grava as chamadas de API internas durante uso manual
data/
  session.json        # sessão logada (git-ignored)
  simples-dental.db    # banco local
  network-capture/      # dump bruto das requisições capturadas
```
