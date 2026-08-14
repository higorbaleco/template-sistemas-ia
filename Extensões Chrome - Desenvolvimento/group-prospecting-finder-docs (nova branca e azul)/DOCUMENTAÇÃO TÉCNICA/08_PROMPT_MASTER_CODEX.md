# Prompt Master para CODEX

Você é responsável por desenvolver uma extensão Chrome Manifest V3 chamada Group Prospecting Finder.

Leia todos os arquivos de documentação antes de implementar.

## Contexto

A extensão deve permitir que o usuário encontre links públicos de grupos de WhatsApp usando buscas no Google.

O usuário informa livremente:

- Palavra-chave principal
- Termos adicionais
- Região opcional
- Fontes
- Quantidade de páginas
- Profundidade

A extensão gera queries, abre buscas no Google, coleta links `chat.whatsapp.com`, remove duplicados, salva os resultados localmente e permite validação assistida.

## Restrições críticas

Não implemente:

- Envio automático de mensagens
- Entrada automática em grupos
- Coleta de membros
- Coleta de telefones
- Scraping direto de redes sociais
- Bypass de login
- Backend no MVP
- Dependências externas via CDN

## Implementar MVP com estes arquivos

- manifest.json
- popup.html
- popup.css
- popup.js
- background.js
- content-google.js
- content-whatsapp.js
- storage.js
- query-builder.js
- extractor.js
- normalizer.js
- validator.js
- export.js
- constants.js

## Comportamento esperado

1. Usuário cria campanha.
2. Sistema gera queries.
3. Usuário revisa queries.
4. Sistema abre páginas do Google.
5. Content script extrai links.
6. Sistema normaliza links.
7. Sistema remove duplicados.
8. Sistema salva resultados.
9. Usuário valida links.
10. Sistema sugere status do grupo.
11. Usuário confirma status.
12. Usuário exporta CSV/JSON.

## Validação de grupo

A validação deve abrir o link de convite e classificar a página como:

- join_available
- group_full
- invite_revoked
- manual_review_required
- unknown

A extensão não deve clicar automaticamente em nenhum botão de entrada.

## Entrega esperada

Código completo, modular, comentado quando necessário e pronto para rodar localmente como extensão unpacked no Chrome.
