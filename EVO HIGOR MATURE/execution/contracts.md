# Shared Contracts

This file is the source of truth for names that must stay stable across streams.

## Core Entities

- `agent`
- `whatsapp_instance`
- `conversation`
- `message`
- `group`
- `warming_profile`
- `warming_session`
- `warming_message_log`
- `instance_block_event`
- `webhook_subscription`
- `webhook_delivery`
- `metric_snapshot`

## Core Events

- `agent.created`
- `agent.updated`
- `agent.activated`
- `agent.deactivated`
- `conversation.opened`
- `conversation.closed`
- `group.joined`
- `group.left`
- `group.mentioned`
- `error.raised`
- `risk.flagged`
- `instance.connected`
- `instance.disconnected`
- `instance.blocked`
- `instance.warming_started`
- `instance.warming_completed`
- `message.received`
- `message.sent`
- `webhook.delivery_failed`

## State Names

- `connection_status`: `disconnected`, `connecting`, `qr_pending`, `connected`
- `lifecycle_status`: `CONNECTING`, `WARMING`, `READY`, `OPERATIONAL`, `BLOCKED`
- `response_mode`: `manual`, `semi_automatic`, `automatic`
