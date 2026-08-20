# Notas de Reconciliação — ESPECIFICACAO.md v1 → v2

**Data:** 2026-08-19

## Resumo da decisão

Confirmado via `SECTION_CROSSWALK.md`: a v2 (170 seções) não contradiz a v1 (62 seções) em nenhum ponto — onde há sobreposição, tabelas/campos/enums/fórmulas são idênticos. A v2 é a v1 mais um bloco grande de conteúdo novo (interface/UX, relatórios, backup, configurações, alertas, 11 dashboards de inteligência, e 6 tabelas novas: `taxes`, `segments`, `lead_sources`, `leads`, `loss_reasons`, `documents`, `audit_logs`).

**Decisão:** `ESPECIFICACAO.md` será reescrito com o conteúdo completo da v2, numeração de seção v2 (1–170), normalizado ao padrão de formatação já usado no repo (heading `## N. TÍTULO`, blocos SQL para tabelas, listas para enums). A v1 fica arquivada em `docs/archive/ESPECIFICACAO_v1_62secoes.md`.

## Perguntas Abertas

Nenhuma delas é uma contradição real entre v1/v2 — são decisões de **em qual fase do roadmap cada peça nova entra**, já que o roadmap de 7 fases (`PHASES_OVERVIEW.md`) foi escrito contra a v1 e não menciona explicitamente alguns módulos novos da v2. Registrei uma recomendação padrão para cada uma, mas nenhuma foi executada como definitiva — todas seguem abertas para sua confirmação antes de virarem planos de fase.

### P1 — Tabelas de referência `segments` e `lead_sources`: Fase 1 ou Fase 2?
Essas duas tabelas são referenciadas por FK em `clients`, `prospects`, `opportunities` desde o início. Se ficarem só na Fase 2 (Comercial), a Fase 1 (Clientes) teria uma FK apontando para uma tabela que ainda não existe.
**Recomendação:** criar em Fase 1, junto com o schema base de clientes — são tabelas de referência simples (id, name, parent_id/description), não módulos com lógica de negócio.

### P2 — Módulo "Documentos" (`documents` table + tela): qual fase?
Não aparece nomeado em nenhuma das 7 fases do roadmap (só no menu lateral, grupo "Sistema"). A tabela é referenciada por vendas, contratos, projetos, propostas, cases desde cedo.
**Recomendação:** Fase 1 (junto com Backup, já que ambos são "infraestrutura de Sistema" e a tabela é simples — metadados + caminho de arquivo, sem lógica pesada).

### P3 — Bloco "Interface" (v2 §126–132: padrões de tela, menu lateral, header, filtros, colunas, exportação): documento transversal ou embutido em cada fase?
Esse bloco descreve convenções de UI que valem para toda tela do sistema, não um módulo de uma fase específica.
**Recomendação:** extrair para um documento próprio `docs/architecture/PADROES_INTERFACE.md`, referenciado por todos os planos de fase 1–7, em vez de duplicar essas convenções em cada plano.

### P4 — "Reativação" (v2 §74): Comercial (Fase 2) ou Inteligência/Retenção (Fase 6)?
A tela de reativação de leads/clientes frios toca tanto CRM (ação comercial) quanto análise de retenção (identificar quem reativar).
**Recomendação:** Fase 6 (Inteligência), já que depende de métricas de retenção/tempo sem contato que só existem depois que o histórico de vendas/timeline estiver maduro — mas a ação de "reativar" em si (criar novo lead a partir de cliente antigo) é um botão simples que pode reusar a Fase 2.

### P5 — "Configurações" (v2 §121–125): tudo na Fase 1 ou incremental por fase?
Parâmetros como "pesos do score econômico" só fazem sentido depois que o motor de score existir (Fase 6). Uma tela de Configurações completa na Fase 1 teria campos órfãos.
**Recomendação:** Configurações básicas (empresa, segurança, backup, interface) na Fase 1; cada fase seguinte adiciona sua própria seção de parâmetros à mesma tela (comercial na Fase 2, financeiro na Fase 3, scores na Fase 6) — a tela cresce incrementalmente, não é construída de uma vez.

## Confirmações (sem ambiguidade, não precisam de decisão)

- Roadmap de 7 fases (nomes, ordem, módulos por fase) é **idêntico** entre v1§59 e v2§161-167 — nenhuma mudança estrutural no roadmap, só profundidade de conteúdo por fase.
- "Impostos" já está explicitamente na Fase 3 (Financeiro) no roadmap — a tabela nova `taxes` (v2§65) só passa a ter uma casa que já existia, sem ambiguidade.
- "Leads" já está explicitamente na Fase 2 (Comercial) — a tabela nova `leads` (v2§26) só passa a ter uma casa que já existia.
- "Relatórios", "Alertas", "Exportações" já estão explicitamente na Fase 7 (Refinamento) — os blocos novos v2§101-104 e v2§152-153 só passam a ter conteúdo detalhado onde já havia um placeholder.

## Próximo passo

Após você revisar P1–P5 (pode aprovar as recomendações em bloco ou ajustar), sigo para:
1. Reescrever `ESPECIFICACAO.md` (v2 completa, numeração 1–170).
2. Atualizar `docs/database/SCHEMA.md` (+ as 7 tabelas novas, changelog v1.0→v2.0).
3. Atualizar `PHASES_OVERVIEW.md` com a profundidade nova por fase, aplicando as decisões P1-P5.
4. Corrigir as 2 referências obsoletas em `CLAUDE.md` e a linha `Spec:` do plano da Fase 1.
