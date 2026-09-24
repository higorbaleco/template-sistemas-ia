# PRE | Plano de Requisitos e Execução

## 1. Estratégia de execução

O desenvolvimento deve seguir uma lógica incremental.

## Fase 1 | MVP funcional local

Objetivo: entregar uma extensão que busca, coleta, salva, deduplica e permite validação manual.

### Entregas

- Manifest V3
- Popup da extensão
- Criação de campanha
- Geração de query
- Abertura do Google
- Content script para leitura de resultados
- Extração de links de WhatsApp
- Deduplicação
- Armazenamento local
- Listagem de resultados
- Exportação CSV/JSON
- Validação manual

## Fase 2 | Validação assistida

Objetivo: melhorar a validação do link.

### Entregas

- Abrir link de grupo em aba controlada
- Detectar textos e botões da página de convite
- Classificar status provável
- Permitir confirmação humana
- Atualizar status do registro

## Fase 3 | Organização avançada

Objetivo: tornar a ferramenta eficiente para grande volume.

### Entregas

- Busca por campanha
- Filtro por status
- Filtro por fonte
- Filtro por palavra-chave
- Busca interna nos resultados
- Marcação em massa
- Lista negra de links inválidos

## Fase 4 | Backend opcional

Objetivo: transformar a extensão em produto mais robusto.

### Entregas

- Supabase
- Login
- Sincronização entre dispositivos
- Histórico centralizado
- Processamento em fila
- Dashboard de campanhas

## 2. Ordem sugerida de implementação

1. Criar estrutura da extensão
2. Criar popup visual
3. Criar storage local
4. Criar query builder
5. Criar abertura de abas
6. Criar content script do Google
7. Criar extração de links
8. Criar deduplicação
9. Criar listagem de resultados
10. Criar exportação
11. Criar validação manual
12. Criar validação assistida
13. Polir interface
14. Testar em diferentes buscas

## 3. Critérios de aceite por fase

### Fase 1

A extensão deve permitir:

- Criar uma busca
- Abrir Google
- Encontrar links `chat.whatsapp.com`
- Salvar resultados
- Remover duplicados
- Exibir os links
- Exportar CSV

### Fase 2

A extensão deve permitir:

- Abrir o link
- Ler a página de convite
- Sugerir status
- Não entrar automaticamente no grupo
- Permitir confirmação manual

## 4. Restrições

A ferramenta não deve:

- Enviar mensagens
- Entrar automaticamente em grupos
- Coletar membros
- Coletar telefones
- Burlar login de redes sociais
- Automatizar spam
- Fazer scraping agressivo
- Rodar em alta frequência sem controle

## 5. Padrão de desenvolvimento

- JavaScript puro
- HTML/CSS simples
- Manifest V3
- Código modular
- Funções pequenas
- Nomes claros
- Comentários somente onde necessário
- Sem dependências externas no MVP
