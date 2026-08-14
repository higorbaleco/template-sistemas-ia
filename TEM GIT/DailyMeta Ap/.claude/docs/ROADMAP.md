# DailyMeta Roadmap

Atualizado em 2026-08-09.

## P0 - Fechamento Para Aprovação

Estes itens bloqueiam chamar a implementação de concluída.

1. Corrigir lint/format.
2. Corrigir warning de hook em `src/routes/calculadora.tsx`.
3. Integrar `PeriodSelector` em `src/routes/progresso.tsx`.
4. Reescrever progresso com histórico completo e seletor de período.
5. Implementar `BarChart` e `ReferenceLine` na visão de progresso.
6. Implementar gauge mensal no dashboard com `RadialBarChart`.
7. Implementar sparkline de metas com `AreaChart`.
8. Adicionar CTA de `/metas/$id` para `/calculadora`.
9. Aplicar migrations Supabase em ambiente remoto.
10. Validar sync real de badges e CRM.
11. Rodar QA visual desktop/mobile em navegador.
12. Rodar `npm run build` e `npm run lint` sem falhas.

## P1 - Qualidade e Manutenção

Itens importantes, mas não bloqueiam a experiência central se P0 estiver fechado.

1. Automatizar geração de `src/routeTree.gen.ts`.
2. Revisar split de chunks para reduzir bundle inicial.
3. Regenerar types do Supabase depois das migrations.
4. Avaliar `dnd-kit` para drag and drop mobile no CRM.
5. Criar checklist de QA manual por rota.
6. Documentar fluxos de sync local/cloud.
7. Adicionar smoke tests para cálculo, achievements e store.

## P2 - Evolução de Produto

Melhorias para versões seguintes.

1. Templates rápidos de leads no CRM.
2. Filtros de pipeline por fonte, valor e próxima ação.
3. Automação de lembretes de follow-up.
4. Export de progresso mensal.
5. Insights de tarefas com maior impacto por meta.
6. Recomendações de foco diário baseadas no ritmo da meta.

## Critério de Aprovação Final

A Fase 1 só deve ser marcada como aprovada quando todos os critérios abaixo forem verdadeiros:

- Build passa.
- Lint passa.
- Migrações aplicadas ou validadas em ambiente alvo.
- Todas as rotas principais renderizam sem erro em desktop e mobile.
- Calculadora usa seletores/inputs e responde corretamente aos modos.
- CRM permite criar, editar, remover e arrastar cards/etapas.
- Progresso usa selector e gráfico conforme plano.
- Dashboard tem contraste consistente.
- Documentação está atualizada.
