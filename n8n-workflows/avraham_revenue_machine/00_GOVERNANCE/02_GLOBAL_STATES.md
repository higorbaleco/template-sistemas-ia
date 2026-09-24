# Estados Globais

> Modelo inicial, substituído conceitualmente por [Dados e estados](../16_FLOW_ARCHITECTURE/DATA_STATES.md). Não implementar a lista abaixo como um único estado de conta: mensagem, oportunidade e fornecedor têm ciclos separados na especificação vigente.

## Account Lifecycle

```text
DISCOVERED
ENRICHMENT_PENDING
ENRICHED
ICP_REVIEW
ICP_APPROVED
ICP_REJECTED
PRODUCT_ROUTED
CAMPAIGN_READY
ACTIVE_OUTREACH
RESPONDED
POSITIVE_REPLY
QUALIFYING
QUALIFIED
MEETING_OFFERED
MEETING_BOOKED
MEETING_HELD
OPPORTUNITY
PROPOSAL
NEGOTIATION
WON
LOST
NURTURE
DO_NOT_CONTACT
```

## Channel States

```text
NOT_AVAILABLE
AVAILABLE
READY
CONTACTED
DELIVERED
RESPONDED
FAILED
BLOCKED
OPTED_OUT
PAUSED
```

## Campaign States

```text
DRAFT
READY
ACTIVE
PAUSED
FINISHED
ARCHIVED
```

## Regras

- `DO_NOT_CONTACT` sempre possui prioridade.
- `WON` não significa remover a conta da base. Ela pode entrar em expansão/upsell.
- `LOST` precisa guardar motivo.
- `NURTURE` precisa guardar data da próxima tentativa.
