# Channel Workers

Cada canal deve ser um worker independente.

Todos recebem uma tarefa padronizada do Campaign Engine.

## Input padrão

```json
{
  "account_id": "...",
  "contact_id": "...",
  "campaign_id": "...",
  "channel": "...",
  "action": "...",
  "template_id": "...",
  "scheduled_at": "..."
}
```

## Output padrão

```json
{
  "status": "sent|failed|skipped",
  "external_message_id": "...",
  "sent_at": "...",
  "error": null
}
```

Isso permite substituir uma ferramenta sem alterar a máquina inteira.
