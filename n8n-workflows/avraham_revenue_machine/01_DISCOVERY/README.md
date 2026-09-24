# Discovery Engine

## Objetivo

Encontrar continuamente novas empresas e contatos que possam entrar na máquina comercial.

## Fontes prioritárias

1. Google Maps
2. Listas B2B
3. LinkedIn
4. Bases próprias
5. Importações manuais

## Input

```text
segmento
cidade/região
palavras-chave
fonte
campanha
quantidade desejada
```

## Processo

```text
Receber alvo
↓
Consultar fonte
↓
Extrair dados
↓
Normalizar
↓
Gerar chave de deduplicação
↓
Verificar base existente
↓
Criar/atualizar Account
↓
Enviar para Enrichment
```

## Output

Account com pelo menos:
- nome;
- segmento;
- cidade;
- origem;
- algum identificador de contato ou URL.

## Não fazer neste bloco

- decidir oferta;
- enviar mensagem;
- qualificar comercialmente;
- gerar proposta.

Discovery apenas encontra.
