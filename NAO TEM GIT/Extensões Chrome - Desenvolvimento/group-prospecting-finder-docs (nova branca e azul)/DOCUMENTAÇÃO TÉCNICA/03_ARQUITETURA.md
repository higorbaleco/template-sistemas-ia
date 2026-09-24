# Arquitetura Técnica

## 1. Visão geral

A extensão será composta por:

```txt
Popup UI
→ Query Builder
→ Background Service Worker
→ Google Search Tabs
→ Content Script
→ Link Extractor
→ Normalizer
→ Deduplicator
→ Local Storage
→ Results UI
→ Validator
→ Exporter
```

## 2. Estrutura de arquivos

```txt
group-prospecting-finder/
  manifest.json
  popup.html
  popup.css
  popup.js
  background.js
  content-google.js
  content-whatsapp.js
  storage.js
  query-builder.js
  extractor.js
  normalizer.js
  validator.js
  export.js
  constants.js
  icons/
    icon16.png
    icon48.png
    icon128.png
  docs/
    00_README.md
    01_PRD.md
    02_PRE_PLANO_EXECUCAO.md
    03_ARQUITETURA.md
    04_ESPECIFICACAO_FUNCIONAL.md
    05_VALIDACAO_GRUPOS.md
    06_SCHEMA_DADOS.md
    07_INSTRUCOES_CODEX.md
```

## 3. Responsabilidade de cada arquivo

### `manifest.json`

Define:

- Nome da extensão
- Versão
- Permissões
- Host permissions
- Popup
- Background service worker
- Content scripts opcionais

### `popup.html`

Estrutura visual:

- Formulário de busca
- Lista de campanhas
- Lista de resultados
- Botões de exportação
- Botões de validação

### `popup.css`

Estilo visual do popup.

### `popup.js`

Controla a interface:

- Captura inputs
- Cria campanha
- Chama query builder
- Envia mensagem para background
- Renderiza resultados
- Dispara exportação

### `background.js`

Responsável por:

- Abrir abas de busca
- Controlar fluxo assíncrono
- Injetar scripts
- Receber resultados do content script
- Salvar dados

### `content-google.js`

Executa dentro da página do Google.

Responsável por:

- Ler DOM da página
- Coletar links visíveis
- Coletar links dentro de snippets quando possível
- Retornar links encontrados

### `content-whatsapp.js`

Executa dentro da página `chat.whatsapp.com`.

Responsável por:

- Identificar se a página de convite está disponível
- Detectar sinais de grupo cheio
- Detectar sinais de link inválido/revogado
- Detectar botão de entrada
- Retornar status provável

### `query-builder.js`

Monta queries a partir dos dados do usuário.

### `extractor.js`

Extrai links de WhatsApp de textos, HTML e URLs.

### `normalizer.js`

Normaliza URLs e remove parâmetros.

### `validator.js`

Classifica status de validação.

### `storage.js`

Abstrai acesso ao `chrome.storage.local`.

### `export.js`

Gera CSV e JSON.

### `constants.js`

Centraliza:

- Fontes
- Status
- Regex
- Configurações
- Limites

## 4. Fluxo principal

```txt
1. Usuário preenche busca
2. Popup cria campanha
3. Query builder gera queries
4. Background abre Google
5. Content script extrai links
6. Background normaliza e deduplica
7. Storage salva resultados
8. Popup renderiza lista
9. Usuário valida links
10. Resultados podem ser exportados
```

## 5. Permissões sugeridas

```json
{
  "permissions": [
    "storage",
    "tabs",
    "scripting"
  ],
  "host_permissions": [
    "https://www.google.com/*",
    "https://www.google.com.br/*",
    "https://chat.whatsapp.com/*"
  ]
}
```

## 6. Observação sobre fontes

A extensão não precisa acessar diretamente Facebook, Instagram, TikTok ou outras redes.

A busca será feita via Google usando operadores `site:`.

Exemplos:

```txt
site:facebook.com "afiliados nutra" "chat.whatsapp.com"
site:youtube.com "corretores de imóveis" "Maringá" "chat.whatsapp.com"
site:tiktok.com "grupo de afiliados" "chat.whatsapp.com"
```

## 7. Motivo dessa arquitetura

Essa abordagem reduz complexidade, porque:

- Evita scraping direto de redes sociais
- Usa páginas públicas indexadas
- Simplifica permissões
- Permite MVP mais rápido
- Reduz risco técnico
