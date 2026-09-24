# Event Schema

> Esquema inicial preservado para referência. Novas implementações devem seguir os [contratos vigentes](../16_FLOW_ARCHITECTURE/CONTRACTS.md), incluindo origem, ALA, versões, correlação e idempotência.

Toda ação relevante deve gerar um evento.

## Estrutura mínima

```json
{
  "event_id": "uuid",
  "timestamp": "ISO-8601",
  "account_id": "uuid",
  "contact_id": "uuid|null",
  "campaign_id": "uuid|null",
  "channel": "whatsapp|linkedin|instagram|system",
  "event_type": "message_sent",
  "status": "success|failed|pending",
  "metadata": {}
}
```

## Eventos principais

```text
account_discovered
account_enriched
icp_approved
icp_rejected
product_routed
campaign_entered
message_scheduled
message_sent
message_delivered
message_failed
message_replied
positive_reply
negative_reply
opt_out
qualification_started
qualification_completed
meeting_offered
meeting_booked
meeting_held
meeting_no_show
opportunity_created
proposal_created
sale_won
sale_lost
revenue_recorded
gross_profit_recorded
```
