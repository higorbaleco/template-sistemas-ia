# LeadHunter + Catcher

Extensão Chrome MV3 para captura local de leads enquanto você navega.

## O que ela faz

- Captura dados visíveis de páginas abertas no navegador.
- Detecta plataformas como Google Search, Google Maps, LinkedIn e OLX.
- Faz captura genérica em qualquer site que expõe telefone, e-mail ou links sociais.
- Processa fila de URLs automaticamente dentro do próprio Chrome.
- Normaliza telefone/e-mail, calcula score e salva tudo localmente em `chrome.storage`.
- Exporta a base em CSV.
- Permite editar, filtrar e excluir leads no dashboard.

## Como usar

### 1. Instalar em modo desenvolvedor

1. Rode `npm install`.
2. Rode `npm run build`.
3. Abra `chrome://extensions`.
4. Ative `Modo do desenvolvedor`.
5. Clique em `Carregar sem compactação`.
6. Selecione a pasta `dist`.

### 2. Capturar leads

1. Abra uma página alvo.
2. Clique no ícone da extensão.
3. Use `Capturar desta página` para fazer uma captura manual.
4. Se quiser capturar enquanto navega, ative `Captura automática`.

### 3. Trabalhar com os dados

1. Clique em `Abrir painel`.
2. Use a aba `Leads` para pesquisar, filtrar por origem, editar ou excluir.
3. Use `Exportar CSV` para baixar a base.
4. Use a aba `Fila` para cadastrar URLs, iniciar a fila e acompanhar o processamento.

## O que a fila faz hoje

- A fila guarda URLs e mostra a lista no dashboard.
- Quando ativada, ela abre cada URL em uma aba temporária, aguarda carregar, captura os dados visíveis e salva localmente.
- Se o Chrome reiniciar ou a extensão recarregar, a fila pode ser retomada a partir do estado salvo.

## Limitações atuais

- A captura é baseada no DOM visível da página.
- O modo genérico ainda pode pegar dados incompletos ou repetidos em páginas muito dinâmicas.
- A extensão salva os dados localmente; não há sincronização com servidor.
- A automação depende do DOM visível e pode falhar em páginas que bloqueiam leitura ou carregam conteúdo tarde demais.

## Sugestão de uso realista

- Use como MVP de prospecção manual.
- Use muito bem em Google Search, Google Maps, LinkedIn e OLX.
- Valide os dados antes de importar para CRM ou pipeline comercial.
