# 00. Visao e escopo

Este documento define o problema que o Gleaming Nest resolve e o que esta arquitetura cobre.

## 1. Problema

O projeto organiza o ciclo de criacao de conteudo do Higor em um unico sistema:

- captar referencias e saves
- transformar referencias em ganchos
- estruturar roteiros
- revisar roteiro com checklist
- rodar analise automatizada com IA
- registrar tudo no Notion
- manter ingestao diaria de novos sinais

O problema real nao e apenas "guardar conteudo". E reduzir friccao entre capturar uma ideia, transforma-la em roteiro e acompanhar a qualidade da saida.

## 2. Metricas de sucesso

| Metica | Alvo inicial | Como medir |
|---|---|---|
| Ingestao diaria concluida | 100% das execucoes agendadas | log da Edge Function `daily-ingest` |
| Analise de roteiro concluida | em menos de 60s na maior parte dos casos | resposta da Edge Function `iada-analyze` |
| Consistencia do catalogo | nenhuma pagina fica fora do fluxo esperado | conferência do banco no Notion |
| Tempo para converter inspiracao em gancho | baixo e previsivel | fluxo manual do operador |

## 3. Atores

| Ator | Papel | O que faz |
|---|---|---|
| Higor | Operador principal | cria, revisa e consome o conteudo |
| Frontend | Camada de operacao | exibe shell, listas, editor e painel de analise |
| Supabase Edge Functions | Orquestracao | expoe proxy, ingestao e analise |
| Notion | Sistema de registro | persiste ganchos, roteiros, inspiracoes e concorrentes |
| Anthropic | Motor de analise | avalia roteiro e sugere melhorias |
| Apify | Coleta externa | extrai saves e posts de Instagram |

## 4. Volume esperado

- Operacao inicial: baixa a media
- Usuarios ativos: 1 operador principal
- Execucoes automatizadas: 1 vez por dia, com uso eventual sob demanda
- Pico esperado: leitura e escrita pontual no Notion, nao processamento em massa

## 5. Fora de escopo

- Autenticacao e permissao por usuario
- Multi-tenant
- Publicacao automatica em redes sociais
- Chat ou CRM generico
- Banco relacional proprio para o dominio

## 6. Ambiente critico

Sim. O projeto usa tokens e integra com servicos externos.

Motivos:

- depende de credenciais sensiveis
- escreve em databases do Notion
- consome APIs pagas ou limitadas
- automatiza captura de dados externos

