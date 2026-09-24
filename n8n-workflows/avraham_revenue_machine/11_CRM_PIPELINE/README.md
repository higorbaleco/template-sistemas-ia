# CRM & Pipeline

## Objetivo

Registrar o estado comercial real das oportunidades.

## Pipeline

```text
QUALIFIED
MEETING_BOOKED
MEETING_HELD
OPPORTUNITY
PROPOSAL
NEGOTIATION
WON
LOST
```

## Opportunity

Campos mínimos:

```text
opportunity_id
account_id
product
estimated_value
estimated_gross_profit
stage
probability
next_step
next_step_at
owner
created_at
closed_at
lost_reason
```

## Revenue

Separar quando aplicável:

```text
GMV
REVENUE
DIRECT_COST
GROSS_PROFIT
```

Especialmente importante para disparos e ativos.

## Regra

Não medir sucesso comercial apenas por faturamento bruto quando a margem varia fortemente entre produtos.
