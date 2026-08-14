# Fields and Views Checklist

Atualizado em 2026-08-09.

## Modelos de Dados

### Profile

Status: existente.

Campos:

- `name`
- `minDailyPercent`

### Goal

Status: existente.

Campos:

- `id`
- `name`
- `type`
- `target`
- `unit`
- `startDate`
- `endDate`
- `startingValue`
- `minDailyPercent`
- `color`
- `icon`
- `category`
- `cadence`
- `weekdays`
- `resultIndicators`
- `effortIndicators`
- `status`
- `createdAt`

### Task

Status: existente.

Campos:

- `id`
- `name`
- `category`
- `goalId`
- `indicator`
- `expectedQty`
- `unit`
- `estimatedMinutes`
- `actualMinutes`
- `contributionType`
- `impactLevel`
- `timeCategory`
- `strategicWeight`
- `planned`
- `strategic`
- `measurable`
- `canCombo`
- `pointsPerUnit`
- `pointsPerCompletion`
- `frequency`
- `weekdays`
- `weight`
- `points`
- `active`
- `createdAt`

### Execution

Status: existente.

Campos:

- `id`
- `taskId`
- `date`
- `quantity`

### Sale

Status: existente.

Campos:

- `id`
- `date`
- `value`
- `productId`
- `goalId`
- `customer`
- `status`
- `note`

### CrmLead

Status: criado.

Campos:

- `id`
- `name`
- `company`
- `stage`
- `value`
- `sortOrder`
- `source`
- `nextAction`
- `dueDate`
- `note`
- `createdAt`
- `updatedAt`

Avaliação:

- Bom para criação rápida.
- Bom para edição e remoção simples.
- Arrasta cards e etapas.
- Pode precisar melhoria touch/mobile se o uso principal for celular.

### TimeLog

Status: existente.

Campos:

- `id`
- `taskId`
- `goalId`
- `category`
- `date`
- `startAt`
- `endAt`
- `durationMinutes`
- `contributionType`
- `impactLevel`
- `note`

### Measurement

Status: existente.

Campos:

- `id`
- `goalId`
- `date`
- `value`
- `note`

### Product

Status: existente.

Campos:

- `id`
- `name`
- `defaultPrice`
- `color`
- `active`

### BadgeUnlock

Status: criado.

Campos:

- `id`
- `badgeId`
- `unlockedAt`

## Visões e Rotas

### `/`

Nome: Dashboard de hoje.

Status: parcial/aprovado funcionalmente.

Inclui:

- Foco do dia.
- Relatório de hoje.
- Progresso/pontos.
- Acesso a gamificação.

Pendente:

- Gauge mensal com `RadialBarChart`.
- QA visual final de contraste/responsividade.

### `/metas`

Nome: Lista de metas.

Status: existente.

Pendente:

- Sparkline por meta com `AreaChart`.

### `/metas/nova`

Nome: Criar meta.

Status: existente.

Pendente:

- Revisão visual final.

### `/metas/$id`

Nome: Detalhe da meta.

Status: existente.

Pendente:

- CTA direto para `/calculadora`.
- Revisão de cálculo/projeção na visão de detalhe.

### `/tarefas`

Nome: Tarefas.

Status: existente.

Pendente:

- Revisão de hierarquia visual e contraste em estado vazio/cheio.

### `/vendas`

Nome: Vendas.

Status: existente.

Pendente:

- Revisão de integração com metas financeiras e calculadora.

### `/produtos`

Nome: Produtos.

Status: existente.

Pendente:

- Revisão de uso em vendas e metas.

### `/tempo`

Nome: Tempo.

Status: existente.

Pendente:

- Revisão de conexão com indicadores de esforço.

### `/progresso`

Nome: Progresso.

Status: parcial.

Pendente:

- Integrar `PeriodSelector`.
- Usar histórico completo.
- Adicionar `BarChart`.
- Adicionar `ReferenceLine`.
- Melhorar leitura visual do progresso.

### `/calculadora`

Nome: Calculadora.

Status: aprovado funcionalmente com ressalvas.

Inclui:

- Select de meta.
- Select de modo de cálculo.
- Inputs para alvo, atual, dias e ritmo.
- Resultado principal.
- Breakdown prático.

Pendente:

- Corrigir warning de hook.
- Revisar microcopy final.
- Integrar CTA a partir da meta.

### `/crm`

Nome: Mini Kanban/CRM.

Status: aprovado funcionalmente com ressalvas.

Inclui:

- Criação rápida.
- Edição rápida.
- Remoção.
- Cards arrastáveis.
- Etapas arrastáveis.
- Campos simples.

Pendente:

- QA touch/mobile.
- Aplicar migrations no Supabase remoto.

### `/mais`

Nome: Mais.

Status: existente e atualizado.

Inclui:

- Link para calculadora.
- Link para CRM.

Pendente:

- Revisão visual final.

## Contraste

Status: parcialmente mitigado.

Entregue:

- Guardrails globais para `.bg-card`, `.bg-background`, `.bg-secondary` e `.bg-foreground`.
- Classe `.control` para inputs/selects.

Pendente:

- QA visual manual em todas as rotas.
- Corrigir casos específicos se algum componente usar combinação de classes conflitante.
