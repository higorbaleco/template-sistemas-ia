# PRD | Product Requirements Document

## 1. Produto

**Nome:** Group Prospecting Finder  
**Formato:** Extensão Chrome  
**Usuário principal:** Profissional que precisa mapear grupos públicos de WhatsApp por segmento, região e objetivo comercial ou comunitário.

## 2. Problema

O usuário precisa encontrar grupos públicos de WhatsApp relacionados a temas específicos, como:

- Negócios imobiliários em uma região
- Afiliados de nutracêuticos
- Afiliados de infoprodutos
- Comunidades locais
- Segmentos B2B
- Nichos de interesse

Hoje o processo é manual:

1. O usuário monta uma query no Google.
2. Abre vários resultados.
3. Copia links de grupos.
4. Valida um por um.
5. Perde histórico.
6. Não sabe quais links já testou.
7. Encontra muitos duplicados.
8. Não tem organização por campanha.

## 3. Solução

Uma extensão Chrome onde o usuário cria uma campanha de busca e informa:

- Palavra-chave principal
- Termos adicionais opcionais
- Região opcional
- Fonte desejada
- Quantidade de páginas
- Profundidade

A extensão monta buscas no Google, coleta links públicos de WhatsApp, deduplica, salva e permite validação.

## 4. Objetivos do produto

### Objetivo primário

Reduzir o tempo necessário para encontrar e validar grupos públicos de WhatsApp relacionados a um nicho específico.

### Objetivos secundários

- Organizar buscas por campanha
- Criar histórico de links encontrados
- Permitir exportação
- Evitar retrabalho com links duplicados
- Identificar links inválidos, revogados ou cheios
- Melhorar a priorização dos links relevantes

## 5. Personas

### Usuário operador

Precisa fazer buscas rápidas, validar links e exportar listas.

### Usuário estrategista

Precisa mapear comunidades por nicho, região e intenção.

### Usuário gestor

Precisa consultar campanhas, status e produtividade.

## 6. Casos de uso

### Caso 1: Grupos imobiliários regionais

Entrada:

- Palavra-chave: `corretores de imóveis`
- Região: `Maringá`
- Fonte: `Facebook, Google, YouTube`
- Páginas: `10`

Saída:

- Lista de links encontrados
- Fonte original
- Query usada
- Status de validação
- Exportação CSV

### Caso 2: Afiliados nutra

Entrada:

- Palavra-chave: `afiliados nutra`
- Termos adicionais: `encapsulados, emagrecimento, suplementos`
- Região: `Brasil`
- Fonte: `Google, Facebook, TikTok, YouTube`

Saída:

- Links únicos
- Duplicados removidos
- Pendentes de validação
- Links válidos

### Caso 3: Afiliados infoprodutos

Entrada:

- Palavra-chave: `afiliados hotmart`
- Termos adicionais: `kiwify, plr, lançamentos digitais`
- Região: vazia
- Fonte: `Google, YouTube, Facebook, Reddit`

Saída:

- Links públicos encontrados
- Validação assistida
- Lista exportável

## 7. Requisitos funcionais

### RF01 | Criar campanha

O usuário deve conseguir criar uma campanha com:

- Nome
- Palavra-chave principal
- Termos adicionais
- Região
- Fontes
- Páginas por fonte
- Profundidade
- Status

### RF02 | Gerar queries

O sistema deve montar queries baseadas nos campos preenchidos.

Exemplo:

```txt
site:facebook.com "corretores de imóveis" "Maringá" "chat.whatsapp.com"
```

### RF03 | Abrir páginas de busca

A extensão deve abrir páginas do Google com paginação:

```txt
start=0
start=10
start=20
start=30
```

### RF04 | Coletar links

A extensão deve procurar links com padrão:

```regex
https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{10,}
```

### RF05 | Normalizar links

Remover query strings e parâmetros.

Exemplo:

```txt
https://chat.whatsapp.com/ABC123?utm_source=x
```

vira:

```txt
https://chat.whatsapp.com/ABC123
```

### RF06 | Deduplicar

A extensão deve impedir links repetidos dentro da mesma campanha.

### RF07 | Salvar resultados

Salvar localmente:

- Campanha
- Query
- Fonte
- Link bruto
- Link normalizado
- Status
- Data da coleta
- Data da última validação
- Observações

### RF08 | Validar grupo

A extensão deve permitir validar se o link:

- Abre página de convite
- Parece aceitar entrada
- Está cheio
- Foi revogado
- Está indisponível
- Precisa de validação manual

A extensão não deve entrar automaticamente no grupo.

### RF09 | Validação manual

O usuário deve poder classificar:

- Válido
- Inválido
- Grupo cheio
- Link revogado
- Fora do nicho
- Duplicado
- Prioritário
- Não testado

### RF10 | Exportar

Exportar em:

- CSV
- JSON

### RF11 | Histórico

O usuário deve conseguir consultar campanhas anteriores e seus resultados.

## 8. Requisitos não funcionais

- Interface simples e rápida
- Execução local no navegador
- Sem coleta de dados pessoais
- Sem envio automático de mensagens
- Sem entrada automática em grupos
- Código modular
- Sem bibliotecas externas por CDN
- Compatível com Manifest V3
- Armazenamento local no MVP
- Preparado para Supabase na fase 2

## 9. Métricas de sucesso

- Tempo médio para encontrar links
- Quantidade de links únicos por campanha
- Percentual de duplicados removidos
- Percentual de links válidos
- Percentual de links revogados
- Tempo médio de validação manual
- Taxa de exportação
