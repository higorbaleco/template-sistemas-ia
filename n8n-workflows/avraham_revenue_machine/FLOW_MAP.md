# Mapa Geral dos Fluxos

> Mapa inicial preservado como referência. O [desenho vigente dos 18 flows](16_FLOW_ARCHITECTURE/README.md) detalha gatilhos, contratos, seis ALAs e recuperação e prevalece em caso de divergência.

## Fluxo A — Aquisição

```text
Discovery
→ Account Database
→ Enrichment
→ ICP
→ Product Router
→ Campaign Ready
```

## Fluxo B — Omnichannel

```text
Campaign Engine
→ LinkedIn Worker
→ Instagram Worker
→ WhatsApp Worker
→ Event Bus/Logs
```

## Fluxo C — Resposta

```text
Incoming Message
→ Conversation Hub
→ Pause Campaign
→ Classification
→ Qualification
```

## Fluxo D — Comercial

```text
Qualified
→ Meeting Engine
→ Meeting Held
→ Opportunity
→ Proposal
→ Negotiation
→ Won/Lost
```

## Fluxo E — Analytics

```text
Events
+ Accounts
+ Opportunities
+ Revenue
→ Dashboard
```

## Fluxo F — Produtos

```text
Account
→ Product Router
→ Product Playbook
→ Campaign/Qualification específicos
```
