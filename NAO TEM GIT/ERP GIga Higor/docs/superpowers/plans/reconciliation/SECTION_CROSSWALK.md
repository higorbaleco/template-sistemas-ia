# Crosswalk de Seções — ESPECIFICACAO.md v1 (62 seções) → v2 (170 seções)

**Data:** 2026-08-19
**Fonte v1:** `docs/archive/ESPECIFICACAO_v1_62secoes.md` (1998 linhas, arquivada)
**Fonte v2:** especificação de 170 seções fornecida pelo usuário diretamente no chat em 2026-08-19, incorporada em `ESPECIFICACAO.md` (raiz) na mesma sessão de reconciliação.

## Achado principal

As duas versões **não são conflitantes**. A v1 é um resumo condensado da mesma base conceitual da v2 — onde há sobreposição, os nomes de tabela, campos, enums e fórmulas batem exatamente (ex.: `sales`, `contracts`, `products` têm os mesmos campos nas duas versões). A v2 é estritamente mais completa: divide tópicos que a v1 tratava juntos em seções próprias, e adiciona **um bloco inteiro de conteúdo ausente da v1** (ver seção "Conteúdo 100% novo" abaixo). Nenhum `CONFLITO` real foi encontrado — só omissões na v1.

## Tabela de correspondência

| v1 § | Título v1 | v2 § | Título(s) v2 | Status |
|---|---|---|---|---|
| 1 | Visão do Produto | 1 | Visão do Produto | INALTERADA |
| 2 | Princípios do Sistema | 2 | Princípios do Sistema | INALTERADA |
| 3 | Estrutura Geral do Sistema | 3, 127 | Estrutura Geral / Menu Lateral | DIVIDIDA |
| 4 | Arquitetura de Arquivos Local | 4 | Arquitetura de Arquivos Local | INALTERADA |
| 5 | Banco Principal | 5 | Banco Principal | INALTERADA |
| 6 | Padrão de Todas as Tabelas | 6 | Padrão de Todas as Tabelas | INALTERADA |
| 7 | Qualidade dos Dados Históricos | 7 | Qualidade dos Dados Históricos | INALTERADA |
| 8 | Autenticação Local | 8 | Autenticação Local | INALTERADA |
| 9 | Senha Mestra | 9 | Senha Mestra | INALTERADA |
| 10 | Proteção dos Dados | 10 | Proteção dos Dados | INALTERADA |
| 11 | Usuários Locais | 11 | Usuários Locais | INALTERADA |
| 12 | Dashboard Principal | 12 | Dashboard Principal | INALTERADA |
| 13 | Dashboard Executivo | 13 | Dashboard Executivo | INALTERADA |
| 14 | Gráfico Histórico Principal | 14 | Gráfico Histórico Principal | INALTERADA |
| 15 | Cliente 360º | 15, 18 | Cliente 360º / Abas do Cliente | DIVIDIDA |
| 16 | Métricas do Cliente | 17 | Métricas do Cliente | INALTERADA |
| 17 | Tabela CLIENTS | 19 | Tabela CLIENTS | INALTERADA |
| 18 | Status do Cliente | 20 | Status do Cliente | INALTERADA |
| 19 | Contatos | 21 | Contatos | INALTERADA |
| 20 | Timeline do Cliente | 22 | Timeline do Cliente | INALTERADA |
| 21 | Prospecção | 23, 24 | Prospecção / Prospects | DIVIDIDA |
| 22 | Status do Prospect | 25 | Status do Prospect | INALTERADA |
| 23 | Pipeline Comercial | 28, 32, 33 | CRM/Pipeline / Pipeline / Etapas do Funil | DIVIDIDA |
| 24 | Oportunidades | 31 | Oportunidades | INALTERADA |
| 25 | Propostas | 36, 37 | Propostas / Itens da Proposta | DIVIDIDA |
| 26 | Vendas | 38, 39, 40 | Vendas / Status da Venda / Itens da Venda | DIVIDIDA |
| 27 | Cálculo Econômico da Venda | 41 | Cálculo Econômico da Venda | INALTERADA |
| 28 | Esforço | 42, 43 | Esforço / Esforço Histórico sem Horas | DIVIDIDA |
| 29 | Margem por Hora | 44 | Margem por Hora | INALTERADA |
| 30 | Contratos | 45, 46, 47 | Contratos / Status / Tipo de Encerramento | DIVIDIDA |
| 31 | Projetos | 48, 49, 50 | Projetos / Status do Projeto / Complexidade | DIVIDIDA |
| 32 | Cases | 51 | Cases | INALTERADA |
| 33 | Financeiro (menu) | 52 | Financeiro | INALTERADA |
| 34 | Contas Financeiras | 53 | Contas Financeiras | INALTERADA |
| 35 | Contas a Receber | 54, 55 | Contas a Receber / Status | DIVIDIDA |
| 36 | Contas a Pagar | 56 | Contas a Pagar | INALTERADA |
| 37 | Movimentações | 57 | Movimentações | INALTERADA |
| 38 | Categorias Financeiras | 58, 59 | Categorias Financeiras / Centros de Custo | EXPANDIDA (centros de custo é novo) |
| 39 | PF e PJ | 60 | PF e PJ | INALTERADA |
| 40 | Fluxo de Caixa | 61 | Fluxo de Caixa | INALTERADA |
| 41 | DRE Gerencial | 62 | DRE Gerencial | INALTERADA |
| 42 | Inadimplência | 63, 64 | Inadimplência / Aging de Recebíveis | EXPANDIDA (aging é novo) |
| 43 | Produtos | 66, 67, 68 | Produtos / Histórico de Custo / Histórico de Preço | DIVIDIDA |
| 44 | Fornecedores | 70 | Fornecedores | INALTERADA |
| 45 | Parceiros | 71 | Parceiros | INALTERADA |
| 46 | Comissões | 72 | Comissões | INALTERADA |
| 47 | Importações Históricas | 107, 108, 109, 110 | Importação / Staging / Tabela de Importação / Registros Temporários | DIVIDIDA |
| 48 | Detecção de Duplicidade | 111, 112 | Reconciliação / Detecção de Duplicidade | EXPANDIDA (exemplo de reconciliação é novo) |
| 49 | Risco do Cliente | 80, 81, 82, 83, 84, 85 | Risco / componentes financeiro/comercial/operacional/estratégico / Score de Risco | DIVIDIDA |
| 50 | Score Econômico do Cliente | 86, 87, 88 | Score Econômico / Pesos Iniciais / Classificação Econômica | DIVIDIDA |
| 51 | Classificação de Negócios | 89 | Classificação de Negócios | INALTERADA |
| 52 | Faturamento Enganoso | 90 | Faturamento Enganoso | INALTERADA |
| 53 | Matriz Margem x Esforço | 91 | Matriz Margem x Esforço | INALTERADA |
| 54 | Inteligência (menu) | 92 | Inteligência | INALTERADA |
| 55 | Rankings | 93, 94, 95 | Rankings de Clientes / Produtos / Parceiros | DIVIDIDA |
| 56 | Churn | 76 | Churn | INALTERADA |
| 57 | LTV | 77, 78 | LTV de Receita / LTV de Margem | DIVIDIDA |
| 58 | Retenção e Renovação | 75 | Retenção | INALTERADA |
| 59 | Visão de Implementação por Fase | 161–167 | Fases 1–7 | INALTERADA (roadmap idêntico, mesmos nomes/módulos por fase) |
| 60 | Critério de Sucesso do Sistema | 168 | Critério de Sucesso do Sistema | INALTERADA |
| 61 | Princípio Final da Central | 169 | Princípio Final da Central | INALTERADA |
| 62 | Objetivo Gerencial Final | 170 | Objetivo Gerencial Final | INALTERADA |

## Conteúdo 100% novo na v2 (sem correspondência na v1)

Nenhuma seção da v1 cobre estes tópicos — são adições líquidas, não expansões de algo já existente:

| v2 § | Título | Por que importa |
|---|---|---|
| 16 | Abas do Cliente (detalhe) | já coberto parcialmente via v1§15, mas com lista mais completa |
| 26–30 | Leads, Temperatura | tabela `leads` e enum `FRIO/MORNO/QUENTE` inexistentes na v1 — a v1 só tinha Oportunidades, sem estágio de Lead formal |
| 34 | Pipeline Ponderado (fórmula) | fórmula explícita de valor ponderado, ausente na v1 |
| 35 | Motivos de Perda (`loss_reasons`) | tabela dedicada; a v1 só tinha o campo `lost_reason_id` sem a tabela de motivos |
| 65 | **Impostos (`taxes`)** | **tabela inteira ausente na v1** — a v1 não tem nenhum modelo de dados para impostos, só menciona "Impostos" como categoria financeira |
| 69 | Rentabilidade do Produto (KPIs) | bloco de KPIs por produto, ausente na v1 |
| 73 | Dashboard de Parceiros | ausente na v1 |
| 74 | Reativação (tela + filtros) | ausente na v1 |
| 79 | Tempo de Relacionamento (fórmula) | ausente na v1 |
| 96 | Segmentos (`segments`) | **tabela ausente na v1** — v1 só cita `segment_id` como FK sem tabela própria |
| 97 | Origens de Cliente (`lead_sources`) | **tabela ausente na v1** — mesmo problema, só FK sem tabela |
| 98–99 | Dashboard de Aquisição / Conversão do Funil | ausente na v1 |
| 100 | Pesquisa Global | ausente na v1 |
| 101–104 | **Relatórios (menu completo)** | **seção inteira ausente na v1** — nenhuma menção a um módulo de relatórios |
| 105–106 | Documentos (`documents` table + organização física) | **tabela ausente na v1** — v1 só menciona pasta `documentos/` na arquitetura de arquivos, sem tabela de metadados |
| 113 | Base Histórica 2020+ (tela) | ausente na v1 |
| 114–118 | **Backup (menu, automático, retenção, estrutura, restauração)** | **seção inteira ausente na v1** — apesar de `CLAUDE.md` e os guias já mencionarem backup, a especificação funcional em si não tinha essa seção |
| 119 | Logs (`audit_logs`) | **tabela ausente na v1** |
| 120 | Exclusão (arquivar vs. excluir) | ausente na v1 |
| 121–125 | **Configurações (telas + parâmetros)** | **seção inteira ausente na v1** |
| 126–132 | **Interface (padrões de tela, menu lateral, header, botão novo, filtros, colunas, exportação)** | **bloco de UX inteiro ausente na v1** |
| 133–140 | KPIs (ticket médio, dias de recebimento, taxa de recompra/renovação, eficiência operacional, concentração de receita/margem) | fórmulas explícitas ausentes na v1 (conceitos citados soltos, sem fórmula) |
| 141–151 | **Dashboards de Inteligência (rentabilidade, esforço×resultado, receita×margem, risco, retenção, cohorts, motivos de perda/saída, painéis "o que funcionou/não funcionou/oportunidades escondidas")** | **o maior bloco novo — 11 seções de dashboards analíticos que a v1 não tinha nenhuma menção** |
| 152–153 | Alertas Internos + Parâmetros | ausente na v1 |
| 154 | Regras de Integridade | ausente na v1 |
| 155 | Campos Calculados (princípio) | ausente na v1 |
| 156 | Arquivamento (Ativos/Arquivados/Todos) | ausente na v1 |
| 157 | Performance (metas de volume) | ausente na v1 |
| 158–159 | Experiência de Cadastro + Campos Obrigatórios | ausente na v1 — princípio de cadastro progressivo |
| 160 | Atalhos (CMD+K etc.) | ausente na v1 |

## Impacto nos documentos dependentes

- **`docs/database/SCHEMA.md`**: precisa ganhar as tabelas novas — `taxes`, `segments`, `lead_sources`, `leads`, `loss_reasons`, `documents`, `audit_logs` — nenhuma delas existe no schema atual (que foi escrito contra a v1).
- **`docs/superpowers/plans/PHASES_OVERVIEW.md`**: o roadmap de 7 fases em si **não muda** (v1§59 = v2§161-167, idênticos). O que muda é a profundidade de cada fase — ex. Fase 6 (Inteligência) ganha 11 seções novas de dashboards que precisam entrar no plano.
- **`CLAUDE.md`**: duas referências a um arquivo inexistente `CENTRAL_EMPRESARIAL_SPEC.md` — corrigir para `ESPECIFICACAO.md`, e a frase "170 requirements across 7 phases" precisa virar "especificação de 170 seções, organizada em 7 fases" (não são a mesma unidade de contagem).
- **Plano da Fase 1** (`2026-08-19-central-empresarial-phase-1.md`): a linha `**Spec:**` cita seções pela numeração da v1 — precisa ser corrigida para a numeração v2 usando esta tabela.
