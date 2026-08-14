# DailyMeta Execution Order

Atualizado em 2026-08-09.

Este arquivo reconstrói a ordem de execução operacional do projeto a partir do prompt de Fase 1 anexado no Codex, porque a pasta `.claude` e o arquivo original `execution-order.md` não existiam no repositório clonado.

## Status Geral

Status: parcialmente implementado, ainda não aprovado para sign-off final.

Motivos principais:

- O build de produção passa.
- A camada de cálculo, conquistas, badges, calculadora e CRM foram criados.
- O lint ainda falha com erros de Prettier e um alerta de dependências em hook.
- Algumas visões pedidas no plano original ainda estão parciais, principalmente gráficos de progresso, uso do `PeriodSelector`, sparkline de metas e gauge mensal no dashboard.
- As migrações Supabase foram criadas, mas ainda não foram aplicadas/validadas no banco remoto nesta sessão.

## Gate 0 - Preparação

Objetivo: validar ambiente, inventariar arquivos existentes e identificar documentos de referência.

Resultado:

- `package.json` encontrado.
- `src/routes`, `src/components`, `src/lib` e `supabase/migrations` encontrados.
- `.claude/EXECUTION-ORDER.md` não existia no início da auditoria.
- `.claude/docs/*` não existia no início da auditoria.
- O prompt anexado passou a ser a fonte primária de comparação.

## Gate 1 - Data Layer e Cálculos

Objetivo: criar helpers de cálculo, remover `computeStreak`, persistir badges e preparar sync/migration.

Status: aprovado com ressalvas.

Entregue:

- `src/lib/calc.ts` criado com helpers de mês, ritmo, projeção, séries diárias e consistência.
- Uso de `computeStreak` removido.
- `src/lib/achievements.ts` criado com estatísticas vitalícias, níveis e conquistas.
- `BadgeUnlock` adicionado ao store.
- Sync de badges adicionado ao snapshot cloud.
- Migration `20260809000000_add_dm_badges.sql` criada.

Ressalvas:

- Migração não foi aplicada no Supabase remoto durante esta auditoria.
- Lint ainda aponta formatação em arquivos dessa camada.

## Gate 2 - Gamificação e Estado de UI

Objetivo: criar strip/sheet de gamificação, controlar abertura global e melhorar visual de progresso.

Status: parcial.

Entregue:

- `gamificationOpen` adicionado em `src/lib/ui-store.ts`.
- `GamificationStrip` criado.
- `GamificationSheet` criado.
- Componentes conectados ao `AppShell`.
- `PeriodSelector` criado.

Pendente:

- Integrar `PeriodSelector` em `src/routes/progresso.tsx`.
- Reescrever visão de progresso com histórico completo, selector e gráfico conforme plano.
- Garantir que a visão de progresso não fique presa a janelas curtas quando o usuário quer histórico.

## Gate 3 - Dashboard, Gráficos e Calculadora

Objetivo: melhorar dashboard de hoje, metas, gráficos e calculadora.

Status: parcial.

Entregue:

- Dashboard de hoje reorganizado com relatório mais claro.
- `resolveCurrentMonthGoal` usado para foco mensal.
- Chip de nível/XP revisado.
- Rota `/calculadora` criada.
- Calculadora refeita com seletores e inputs, em vez de cards estáticos.
- Guardrails de contraste adicionados em CSS para reduzir texto branco sobre card branco.

Pendente:

- Adicionar gauge/radial mensal no dashboard com `RadialBarChart`.
- Adicionar `BarChart` e `ReferenceLine` em progresso.
- Adicionar sparkline em metas com `AreaChart`.
- Adicionar CTA de metas para `/calculadora`.
- Revisar responsive QA visual em navegador real.

## Gate 4 - Mini Kanban/CRM

Objetivo: criar um CRM simples, rápido e arrastável no estilo Trello.

Status: aprovado funcionalmente com ressalvas.

Entregue:

- Rota `/crm` criada.
- Leads adicionados ao store com `CrmLead`.
- Kanban com cards arrastáveis entre etapas.
- Etapas arrastáveis para reordenar colunas.
- Criação rápida de lead.
- Edição e remoção de informações.
- Campos simplificados para velocidade de uso.
- Sync cloud e migrations criados.

Ressalvas:

- Drag and drop nativo tende a funcionar melhor em desktop do que em mobile touch.
- Se mobile for prioridade alta, considerar `dnd-kit` ou biblioteca equivalente.
- Migrações não aplicadas no remoto durante esta auditoria.

## Gate 5 - QA, Documentação e Git

Objetivo: validar, documentar e publicar.

Status: em andamento.

Checks executados:

- `npm run build`: passou.
- `npm run lint`: falhou com erros de Prettier e um alerta de hook.
- `rg computeStreak`: nenhum uso encontrado.
- Busca por componentes Recharts pedidos: não encontrou `RadialBarChart`, `BarChart`, `AreaChart` ou `ReferenceLine` nas rotas/componentes atuais.

Decisão:

- Não aprovar como 100% concluído ainda.
- Documentar auditoria e roadmap.
- Subir documentação para o Git.

## Próxima Ordem de Execução

1. Corrigir lint/format em arquivos tocados pela implementação.
2. Corrigir alerta de hook em `src/routes/calculadora.tsx`.
3. Integrar `PeriodSelector` em progresso.
4. Implementar gráficos pendentes com Recharts.
5. Adicionar CTA de meta para calculadora.
6. Aplicar e validar migrations Supabase.
7. Rodar QA visual desktop/mobile.
8. Só então marcar Fase 1 como aprovada.
