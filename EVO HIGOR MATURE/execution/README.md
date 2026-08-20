# Execution Plan

This folder is the working map for the first implementation wave.

## Operating Rules

1. Work only with opt-in WhatsApp workflows and authorized communities.
2. Keep agent personas, connector sessions, and dashboard concerns separated.
3. Prefer small, reviewable changes per stream.
4. Treat all secrets as backend-only in production.
5. If a stream touches shared contracts, update `execution/contracts.md` first.

## Parallel Streams

### Stream A: Architecture and Data

Goal: define the first stable data model for agents, WhatsApp instances, messages, sessions, webhooks, and metrics.

Deliverables:

- canonical entity list
- relational schema draft
- event inventory
- migration order

### Stream B: Connector and Warming

Goal: define the service that owns WhatsApp sessions, connection lifecycle, delivery events, and warming state transitions.

Deliverables:

- connector service boundaries
- session lifecycle states
- warming job flow
- delivery and failure events

### Stream C: API and Dashboard

Goal: define the admin surface for creating agents, binding instances, viewing messages, and toggling automation.

Deliverables:

- API surface draft
- panel sections
- permissions model
- operational controls

### Stream D: Metrics and Webhooks

Goal: define observability, counters, exports, and webhook delivery semantics.

Deliverables:

- metrics catalog
- webhook events
- retry policy
- audit trail rules

## First Pass Acceptance

- Each stream can be worked on without blocking the others.
- Shared nouns have one definition only.
- No implementation file should guess at contract names.
- Each stream ends with a short review note and open questions.

