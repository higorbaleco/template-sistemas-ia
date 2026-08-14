# Group Prospecting Finder

Documentação base para criação de uma extensão Chrome que busca, organiza e valida links públicos de grupos de WhatsApp encontrados em páginas indexadas por mecanismos de busca.

## Objetivo

Criar uma ferramenta operacional para encontrar grupos públicos relacionados a uma palavra-chave, nicho, região ou intenção de busca, sem depender de presets fixos.

O usuário informa:

- Fonte da busca
- Palavra-chave principal
- Termos complementares
- Região opcional
- Quantidade de páginas
- Modo de profundidade

A extensão gera queries, abre buscas, coleta links públicos de `chat.whatsapp.com`, remove duplicados, salva os resultados e permite validar manualmente se o grupo ainda aceita entrada.

## Escopo do MVP

Incluído:

- Extensão Chrome Manifest V3
- Busca por palavra-chave livre
- Seleção de fontes
- Geração automática de queries
- Coleta de links de grupos
- Deduplicação
- Persistência local via `chrome.storage.local`
- Validação assistida de links
- Status manual e semi-automático
- Exportação CSV e JSON
- Histórico de campanhas

Fora do escopo:

- Envio automático de mensagens
- Entrada automática em grupos
- Coleta de membros
- Extração de telefones
- Scraping de dados pessoais
- Disparo em massa
- Backend obrigatório
- Login obrigatório
- Presets fixos de nicho
