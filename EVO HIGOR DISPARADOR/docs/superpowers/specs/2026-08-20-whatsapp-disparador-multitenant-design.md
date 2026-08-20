# WhatsApp Disparador Multi-Tenant com Evolution API — Design Spec

> **Date:** 2026-08-20  
> **Status:** Ready for Implementation  
> **Scope:** MVP multi-tenant WhatsApp message dispatcher backed by Evolution API

---

## 1. Objetivo

Construir um **disparador de mensagens WhatsApp** (fila + painel) que:
- Gerencia **múltiplas instâncias** Evolution API
- Cada cliente (org) tem seu próprio set de números WhatsApp
- Fila de disparo com agendamento, throttling, retry
- Webhooks para receber mensagens entrantes
- Logs + analytics de entrega
- UI simples para enviar, agendar, monitorar

**Stack:** Node.js + TypeScript, PostgreSQL, Redis, React/Vue, Docker

---

## 2. Arquitetura Alto-Nível

```
┌─────────────────────────────────────────────────────┐
│          Disparador (Node.js + React)               │
├─────────────────────────────────────────────────────┤
│  API Server         │  Queue Worker    │  Webhooks  │
│  (Express)          │  (Bull/Redis)    │  Handler   │
└──────────┬──────────┴────────┬─────────┴────────┬───┘
           │                   │                  │
           └───────────────────┼──────────────────┘
                               │
                    Evolution API (wpp-avraham.*)
                    - /instance/connect/{name}
                    - /message/send
                    - webhooks (incoming msg, status)
```

**Componentes:**

| Componente | Responsabilidade | Tech |
|-----------|------------------|------|
| **API Server** | CRUD orgs, instâncias, filas; auth; webhooks in | Express, JWT |
| **Queue Worker** | Processa fila, envia msg via Evolution, retry | Bull, Redis |
| **Frontend** | Dashboard, envio, agendamento, logs | React ou Vue |
| **Database** | Orgs, instâncias, filas, logs, webhooks | PostgreSQL |
| **Evolution Bridge** | Wrapper tipado para Evolution API | Axios, tipos TS |

---

## 3. Data Model

### 3.1 Organization (Multi-Tenant Root)

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  api_key VARCHAR UNIQUE NOT NULL, -- gerado no signup
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- quotas
  messages_per_month INT DEFAULT 10000,
  messages_sent_this_month INT DEFAULT 0,
  
  -- status
  is_active BOOLEAN DEFAULT TRUE
);
```

### 3.2 Instance (Evolution Instance por Org)

```sql
CREATE TABLE instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  name VARCHAR NOT NULL, -- "vendas", "suporte", etc
  phone_number VARCHAR, -- +55 11 9 XXXX-XXXX ou NULL se não conectado
  instance_name VARCHAR UNIQUE NOT NULL, -- para Evolution API
  evolution_api_token VARCHAR NOT NULL, -- JWT token da Evolution
  
  status VARCHAR DEFAULT 'disconnected', -- disconnected, connecting, connected, error
  qr_code_url VARCHAR, -- URL do QR code atual
  last_heartbeat TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (organization_id, name)
);
```

### 3.3 Message Queue

```sql
CREATE TABLE message_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  instance_id UUID NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
  
  recipient_phone VARCHAR NOT NULL, -- +55 11 9 XXXX-XXXX
  message_text TEXT NOT NULL,
  
  status VARCHAR DEFAULT 'pending', -- pending, sent, failed, cancelled
  scheduled_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  
  retry_count INT DEFAULT 0,
  retry_until TIMESTAMP,
  error_message VARCHAR,
  
  metadata JSONB, -- tags, custom fields, etc
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mq_status ON message_queues(organization_id, status);
CREATE INDEX idx_mq_scheduled ON message_queues(organization_id, scheduled_at);
```

### 3.4 Logs & Webhooks

```sql
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  instance_id UUID NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
  
  event_type VARCHAR, -- message.received, message.sent, instance.connected
  payload JSONB,
  received_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_queue_id UUID NOT NULL REFERENCES message_queues(id) ON DELETE CASCADE,
  
  event VARCHAR, -- queued, sent, failed, delivered
  timestamp TIMESTAMP DEFAULT NOW(),
  meta JSONB
);
```

---

## 4. Fluxo de Disparo (Core Logic)

### 4.1 API: Enviar Mensagem

```
POST /api/v1/messages
Authorization: Bearer {api_key}

{
  "instance_name": "vendas",
  "recipient_phone": "+55 11 98765-4321",
  "message_text": "Olá! Como posso ajudar?",
  "scheduled_at": "2026-08-20T14:30:00Z" // opcional
}

Response:
{
  "id": "msg-123",
  "status": "queued",
  "scheduled_at": "2026-08-20T14:30:00Z"
}
```

### 4.2 Queue Worker Loop

```
every 5 seconds:
  1. SELECT * FROM message_queues 
     WHERE status = 'pending' 
     AND scheduled_at <= NOW()
     AND organization_id = $org_id
  
  2. For each message:
     a. Load instance
     b. Call Evolution: POST /message/send
     c. If success:
        - UPDATE status = 'sent'
        - Log event
     d. If 429 / timeout:
        - retry_count++
        - retry_until = NOW() + exponential_backoff
     e. If fail (invalid phone, etc):
        - UPDATE status = 'failed'
        - Notify client
```

### 4.3 Webhook: Mensagem Recebida

```
Evolution chama: POST {disparador_url}/webhooks/evolution
headers: x-api-key: {disparador_api_key}

{
  "event": "messages.upsert",
  "data": {
    "instanceName": "vendas",
    "messages": [{
      "key": {...},
      "message": {
        "conversation": "+55 11 98765-4321",
        "body": "Preciso de ajuda com..."
      }
    }]
  }
}

Disparador:
  1. Validate API key
  2. Resolve organization_id + instance_id from instanceName
  3. Store in webhook_logs + message_logs
  4. Emit event (socket.io ou similar) para dashboard
```

---

## 5. Componentes & Interfaces

### 5.1 Evolution Bridge (Wrapper Tipado)

**Arquivo:** `src/services/evolution.ts`

```typescript
interface EvolutionConfig {
  baseUrl: string;        // e.g., "https://wpp-avraham.instantcode.com.br"
  apiKey: string;         // API key da Evolution
}

interface ConnectInstanceResponse {
  pairingCode: string | null;
  code: string;           // e.g., "2@exemple"
  base64: string;         // QR code em data:image/png;base64
  count: number;
}

interface SendMessagePayload {
  number: string;         // recipient phone
  text: string;
}

interface SendMessageResponse {
  key: { id: string };
  message: { text: string };
  status: string;
}

class EvolutionClient {
  constructor(config: EvolutionConfig) { ... }
  
  async connectInstance(instanceName: string): Promise<ConnectInstanceResponse>
  async sendMessage(instanceName: string, payload: SendMessagePayload): Promise<SendMessageResponse>
  async getInstanceStatus(instanceName: string): Promise<{ connected: boolean }>
}
```

### 5.2 Queue Service (Bull)

**Arquivo:** `src/services/queue.ts`

```typescript
class MessageQueueService {
  constructor(redis: Redis, db: Database) { ... }
  
  async enqueue(
    organizationId: string,
    instanceId: string,
    recipientPhone: string,
    messageText: string,
    scheduledAt?: Date
  ): Promise<MessageQueue>
  
  async process(): Promise<void> // runs on interval, processes pending
  
  private async sendViaEvolution(msg: MessageQueue): Promise<void>
  private async handleRetry(msg: MessageQueue): Promise<void>
}
```

### 5.3 API Routes

**Arquivo:** `src/api/routes/messages.ts`

```typescript
POST   /api/v1/messages              // enqueue
GET    /api/v1/messages              // list (paginated, filtered)
GET    /api/v1/messages/:id          // detail
DELETE /api/v1/messages/:id          // cancel pending

GET    /api/v1/instances             // list org's instances
POST   /api/v1/instances             // create new instance
GET    /api/v1/instances/:id/qr      // get QR code
DELETE /api/v1/instances/:id         // disconnect

GET    /api/v1/logs                  // message + webhook logs
```

### 5.4 Webhooks

**Arquivo:** `src/api/routes/webhooks.ts`

```typescript
POST /webhooks/evolution              // Evolution sends messages/events
// Validates x-api-key
// Stores in webhook_logs
// Emits via socket.io to dashboard
```

---

## 6. Multi-Tenant Isolation

**Regra de Ouro:** Toda query e mutação filtra por `organization_id`.

```typescript
// BAD
const messages = await db.query('SELECT * FROM message_queues WHERE ...');

// GOOD
const messages = await db.query(
  'SELECT * FROM message_queues WHERE organization_id = $1 AND ...',
  [organizationId]
);
```

**Auth Middleware:**

```typescript
async function authMiddleware(req, res, next) {
  const apiKey = req.headers.authorization?.split(' ')[1];
  const org = await db.query(
    'SELECT * FROM organizations WHERE api_key = $1',
    [apiKey]
  );
  
  if (!org) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.organizationId = org.id;
  next();
}
```

---

## 7. Error Handling & Retry

### 7.1 Retry Logic

- **Transient errors** (429, 5xx, timeout): exponential backoff, max 5 retries over 24h
- **Permanent errors** (invalid phone, blocked number): mark as failed, don't retry
- **Instance disconnected**: wait for reconnection, retry after

### 7.2 Monitoring

- Logs all sends/failures to `message_logs` with timestamps
- Webhook logs stored for audit + debugging
- Dashboard shows real-time queue status + failure breakdown

---

## 8. Testing Strategy

### 8.1 Unit Tests

- Evolution client mocks
- Queue logic (enqueue, retry, backoff)
- Multi-tenant isolation (asserting org_id filters)

### 8.2 Integration Tests

- E2E message flow (enqueue → send → log)
- Webhook ingestion (validate, store, emit)
- Instance connection (QR code flow)

### 8.3 Test Coverage Targets

- Message queue service: 90%+
- API routes: 85%+
- Multi-tenant isolation: 100% (critical)

---

## 9. Deployment & Config

### 9.1 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/disparador

# Redis
REDIS_URL=redis://localhost:6379

# Evolution API
EVOLUTION_API_URL=https://wpp-avraham.instantcode.com.br
EVOLUTION_API_KEY=<from-evolution-manager>

# Disparador Server
PORT=3000
NODE_ENV=production

# JWT (for frontend auth)
JWT_SECRET=<random-32-chars>

# Webhook validation
WEBHOOK_SECRET=<random-32-chars>
```

### 9.2 Docker Compose (Local Dev)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: disparador
      POSTGRES_PASSWORD: dev
    volumes:
      - ./data/postgres:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  disparador-api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgres://postgres:dev@postgres:5432/disparador
      REDIS_URL: redis://redis:6379
```

---

## 10. MVP Scope

**In:**
- Multi-tenant orgs + instances
- Enqueue + send via Evolution
- Retry with backoff
- Basic webhook ingestion
- API + logs
- Docker setup

**Out (v2+):**
- Advanced scheduling (templates, variables)
- AI-powered responses
- Contact management
- Advanced analytics
- Multi-user org roles
- Integrations (Zapier, n8n)

---

## 11. Success Criteria

- [ ] Organization can create 1+ instances
- [ ] Each instance can send 100 messages/min without errors
- [ ] Failed sends retry automatically within 24h
- [ ] Webhook logs all incoming messages
- [ ] API key isolates org data completely
- [ ] Tests: 85%+ coverage, all multi-tenant checks pass
- [ ] Docker setup runs locally on Mac without manual steps

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Evolution API rate limits | Implement exponential backoff + queue throttling |
| Multi-tenant data leak | Code review + automated org_id filter tests |
| Redis/DB connection loss | Graceful degradation, health checks, reconnect logic |
| Webhook replay attacks | HMAC signature validation + timestamp checks |

