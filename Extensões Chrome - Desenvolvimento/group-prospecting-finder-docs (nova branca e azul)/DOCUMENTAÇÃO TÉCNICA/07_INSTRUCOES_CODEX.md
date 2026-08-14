# Instruções para CODEX

## 1. Objetivo

Desenvolver uma extensão Chrome Manifest V3 chamada `Group Prospecting Finder`.

A extensão deve buscar links públicos de grupos de WhatsApp por palavra-chave, região e fonte, usando buscas no Google com operadores `site:`.

## 2. Regras obrigatórias

- Não usar bibliotecas externas via CDN.
- Não criar backend no MVP.
- Não implementar login no MVP.
- Não enviar mensagens.
- Não entrar automaticamente em grupos.
- Não coletar telefones.
- Não coletar membros.
- Não burlar login de redes sociais.
- Não fazer scraping direto de redes sociais.
- Buscar apenas páginas públicas indexadas via Google.
- Usar `chrome.storage.local`.
- Usar Manifest V3.

## 3. Arquivos a criar

```txt
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
```

## 4. Implementação por etapas

### Etapa 1 | Estrutura base

Criar:

- `manifest.json`
- `popup.html`
- `popup.css`
- `popup.js`
- `background.js`

A extensão deve abrir um popup funcional.

### Etapa 2 | Formulário de busca

No popup, criar campos:

- Nome da campanha
- Palavra-chave principal
- Termos adicionais
- Região
- Fontes
- Páginas por fonte
- Profundidade
- Botão gerar queries
- Botão buscar

### Etapa 3 | Query builder

Criar `query-builder.js`.

Função principal:

```js
buildQueries({
  primaryKeyword,
  additionalTerms,
  region,
  sources,
  pagesPerSource,
  depth
})
```

Retorno esperado:

```js
[
  {
    source: 'facebook',
    query: 'site:facebook.com "corretores" "Maringá" "chat.whatsapp.com"',
    googleUrl: 'https://www.google.com/search?q=...&start=0',
    start: 0
  }
]
```

### Etapa 4 | Background

Criar função para abrir abas de busca e injetar `content-google.js`.

Fluxo:

1. Receber queries do popup.
2. Abrir aba do Google.
3. Esperar carregamento.
4. Injetar content script.
5. Receber links extraídos.
6. Salvar no storage.
7. Fechar ou manter aba conforme configuração.

### Etapa 5 | Content script Google

Criar `content-google.js`.

Função:

- Ler `document.body.innerText`
- Ler `document.body.innerHTML`
- Ler todos os `a.href`
- Extrair links `chat.whatsapp.com`
- Retornar links brutos

### Etapa 6 | Extractor e normalizer

Criar `extractor.js` com regex:

```js
const WHATSAPP_GROUP_REGEX = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{10,}/g;
```

Criar `normalizer.js` para remover parâmetros.

### Etapa 7 | Storage

Criar `storage.js`.

Funções:

```js
createCampaign(campaign)
getCampaigns()
saveGroupLinks(campaignId, links)
getGroupLinks(campaignId)
updateGroupLink(linkId, patch)
deleteGroupLink(linkId)
```

### Etapa 8 | Resultados

No popup:

- Renderizar links
- Exibir status
- Criar filtros
- Criar ações

### Etapa 9 | Exportação

Criar `export.js`.

Funções:

```js
exportToCsv(groupLinks)
exportToJson(groupLinks)
downloadFile(filename, content, mimeType)
```

### Etapa 10 | Validação assistida

Criar `content-whatsapp.js` e `validator.js`.

Fluxo:

1. Usuário clica em Validar.
2. Extensão abre `chat.whatsapp.com`.
3. Injeta `content-whatsapp.js`.
4. Lê texto da página.
5. Classifica status provável.
6. Atualiza link.
7. Usuário confirma manualmente.

## 5. Estados esperados

### Link ainda aceita usuários

Quando a página tem CTA de entrada, classificar como:

```txt
join_available
```

### Grupo cheio

Quando houver sinais de grupo cheio:

```txt
group_full
```

### Link revogado

Quando houver sinais de link inválido ou revogado:

```txt
invite_revoked
```

### Não identificado

Quando não for possível decidir:

```txt
manual_review_required
```

## 6. Interface visual

Estilo recomendado:

- Popup com largura de 420px a 520px
- Layout em cards
- Fundo claro
- Botões com cor principal azul/ciano
- Status com badges
- Lista compacta
- Ações rápidas por link

## 7. Critério final de aceite

O MVP estará pronto quando for possível:

1. Criar campanha.
2. Informar palavra-chave livre.
3. Informar região opcional.
4. Selecionar fontes.
5. Gerar queries.
6. Abrir buscas no Google.
7. Coletar links de grupos.
8. Remover duplicados.
9. Salvar resultados.
10. Validar links.
11. Marcar status manual.
12. Exportar CSV e JSON.
