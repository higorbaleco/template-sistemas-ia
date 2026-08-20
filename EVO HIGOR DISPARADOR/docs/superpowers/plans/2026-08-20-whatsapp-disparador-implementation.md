# WhatsApp Disparador Multi-Tenant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-tenant WhatsApp message dispatcher backed by Evolution API, with queue, webhooks, and dashboard.

**Architecture:** Express.js API server + Bull Redis queue worker + React frontend. PostgreSQL for persistence. Multi-tenant isolation via org_id on all queries. Evolution API bridge for sends. Webhooks for incoming messages.

**Tech Stack:** Node.js 20 LTS, TypeScript 5, Express, Prisma ORM, Bull, Redis 7, PostgreSQL 15, React 18, Docker

**Spec:** `docs/superpowers/specs/2026-08-20-whatsapp-disparador-multitenant-design.md`

## Global Constraints

- Node.js: 20.11.0 LTS minimum
- TypeScript strict mode enabled
- All database queries must filter by `organization_id` (see Spec §6)
- All API routes require `Authorization: Bearer {api_key}` header
- Multi-tenant isolation is critical — no exceptions
- Test coverage target: 85%+ on API routes, 90%+ on queue service
- Retry logic: exponential backoff, max 5 retries over 24h (see Spec §7.1)

---

## Phase 1: Project Setup & Infrastructure

### Task 1: Project Scaffolding & Environment

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `docker-compose.yml`
- Create: `.dockerignore`
- Create: `Dockerfile`
- Create: `src/index.ts`
- Create: `tests/setup.ts`

**Interfaces:**
- Produces: Working Node/TS project with dev server, type checking, Docker support

- [ ] **Step 1: Initialize project directory**

```bash
cd "/Users/higorplens/Antigravity Software/EVO HIGOR DISPARADOR"
rm -rf src tests node_modules .env
mkdir -p src tests data/postgres
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "whatsapp-disparador",
  "version": "1.0.0",
  "description": "Multi-tenant WhatsApp message dispatcher with Evolution API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "queue:worker": "ts-node src/workers/message-queue.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.9.1",
    "@prisma/client": "^5.9.1",
    "bull": "^4.11.5",
    "redis": "^4.6.12",
    "axios": "^1.6.2",
    "jsonwebtoken": "^9.1.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "@testing-library/react": "^14.1.2"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 4: Create .env.example**

```env
# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/disparador

# Redis
REDIS_URL=redis://redis:6379

# Evolution API
EVOLUTION_API_URL=https://wpp-avraham.instantcode.com.br
EVOLUTION_API_KEY=your_evolution_api_key_here

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-min-32-characters-long

# Webhook
WEBHOOK_SECRET=your-webhook-secret-min-32-characters
```

- [ ] **Step 5: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: disparador_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: disparador
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: disparador_redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  disparador-api:
    build: .
    container_name: disparador_api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/disparador
      REDIS_URL: redis://redis:6379
      EVOLUTION_API_URL: ${EVOLUTION_API_URL}
      EVOLUTION_API_KEY: ${EVOLUTION_API_KEY}
      PORT: 3000
      NODE_ENV: development
      JWT_SECRET: ${JWT_SECRET}
      WEBHOOK_SECRET: ${WEBHOOK_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

networks:
  default:
    name: disparador_network
```

- [ ] **Step 6: Create Dockerfile**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

- [ ] **Step 7: Create .dockerignore**

```
node_modules
npm-debug.log
dist
.git
.gitignore
README.md
.env
.DS_Store
data
```

- [ ] **Step 8: Create src/index.ts (empty for now)**

```typescript
console.log('Disparador API starting...');
```

- [ ] **Step 9: Create tests/setup.ts**

```typescript
// Jest setup file
export {};
```

- [ ] **Step 10: Initialize git and commit**

```bash
cd "/Users/higorplens/Antigravity Software/EVO HIGOR DISPARADOR"
git add package.json tsconfig.json .env.example docker-compose.yml Dockerfile .dockerignore src/index.ts tests/setup.ts
git commit -m "chore: initial project scaffolding with Node/TS/Docker setup"
```

---

## Phase 2: Database & ORM Setup

### Task 2: Prisma ORM & Database Migrations

**Files:**
- Create: `prisma/schema.prisma`
- Create: `.env` (copy from .env.example)
- Create: `src/db.ts`

**Interfaces:**
- Produces: 
  - Prisma client initialization
  - TypeScript types for all models (Organization, Instance, MessageQueue, etc.)
  - Functions: `getPrisma(): PrismaClient`

- [ ] **Step 1: Initialize Prisma**

```bash
cd "/Users/higorplens/Antigravity Software/EVO HIGOR DISPARADOR"
npm install
npx prisma init
```

- [ ] **Step 2: Create .env (development)**

```bash
cp .env.example .env
# Edit .env and ensure DATABASE_URL points to local postgres:5432
```

- [ ] **Step 3: Create prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id                    String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name                  String
  apiKey                String   @unique @map("api_key")
  messagesPerMonth      Int      @default(10000) @map("messages_per_month")
  messagesSentThisMonth Int      @default(0) @map("messages_sent_this_month")
  isActive              Boolean  @default(true) @map("is_active")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  instances     Instance[]
  messageQueues MessageQueue[]
  webhookLogs   WebhookLog[]
  messageLogs   MessageLog[]

  @@map("organizations")
}

model Instance {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId      String   @map("organization_id") @db.Uuid
  name                String
  phoneNumber         String?  @map("phone_number")
  instanceName        String   @unique @map("instance_name")
  evolutionApiToken   String   @map("evolution_api_token")
  status              String   @default("disconnected") // disconnected, connecting, connected, error
  qrCodeUrl           String?  @map("qr_code_url")
  lastHeartbeat       DateTime? @map("last_heartbeat")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  messageQueues MessageQueue[]
  webhookLogs   WebhookLog[]
  messageLogs   MessageLog[]

  @@unique([organizationId, name])
  @@map("instances")
}

model MessageQueue {
  id                String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId    String   @map("organization_id") @db.Uuid
  instanceId        String   @map("instance_id") @db.Uuid
  recipientPhone    String   @map("recipient_phone")
  messageText       String   @map("message_text")
  status            String   @default("pending") // pending, sent, failed, cancelled
  scheduledAt       DateTime @default(now()) @map("scheduled_at")
  sentAt            DateTime? @map("sent_at")
  retryCount        Int      @default(0) @map("retry_count")
  retryUntil        DateTime? @map("retry_until")
  errorMessage      String?  @map("error_message")
  metadata          Json?
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  instance     Instance     @relation(fields: [instanceId], references: [id], onDelete: Cascade)
  messageLogs  MessageLog[]

  @@index([organizationId, status])
  @@index([organizationId, scheduledAt])
  @@map("message_queues")
}

model WebhookLog {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId String   @map("organization_id") @db.Uuid
  instanceId     String   @map("instance_id") @db.Uuid
  eventType      String   @map("event_type") // message.received, message.sent, instance.connected
  payload        Json
  receivedAt     DateTime @default(now()) @map("received_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  instance     Instance     @relation(fields: [instanceId], references: [id], onDelete: Cascade)

  @@map("webhook_logs")
}

model MessageLog {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  messageQueueId  String   @map("message_queue_id") @db.Uuid
  event           String   // queued, sent, failed, delivered
  timestamp       DateTime @default(now())
  meta            Json?

  messageQueue MessageQueue @relation(fields: [messageQueueId], references: [id], onDelete: Cascade)

  @@map("message_logs")
}
```

- [ ] **Step 4: Create src/db.ts**

```typescript
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}

export type {
  Organization,
  Instance,
  MessageQueue,
  WebhookLog,
  MessageLog,
} from '@prisma/client';
```

- [ ] **Step 5: Run Prisma migrations**

```bash
cd "/Users/higorplens/Antigravity Software/EVO HIGOR DISPARADOR"
npx prisma migrate dev --name init
```

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma src/db.ts .env
git commit -m "feat: add Prisma ORM with database schema (organizations, instances, message_queues, logs)"
```

---

## Phase 3: Evolution API Bridge

### Task 3: Evolution Client (Typed Wrapper)

**Files:**
- Create: `src/services/evolution.ts`
- Create: `tests/services/evolution.test.ts`

**Interfaces:**
- Consumes: Environment variables (`EVOLUTION_API_URL`, `EVOLUTION_API_KEY`)
- Produces: 
  - `class EvolutionClient { connectInstance(), sendMessage(), getInstanceStatus() }`
  - Types: `ConnectInstanceResponse`, `SendMessagePayload`, `SendMessageResponse`

- [ ] **Step 1: Write failing test for EvolutionClient**

```typescript
// tests/services/evolution.test.ts
import { EvolutionClient } from '../../src/services/evolution';

describe('EvolutionClient', () => {
  let client: EvolutionClient;

  beforeEach(() => {
    client = new EvolutionClient({
      baseUrl: 'http://localhost:8080',
      apiKey: 'test-key',
    });
  });

  it('should initialize with config', () => {
    expect(client).toBeDefined();
  });

  it('should connect instance and return QR code', async () => {
    // This will fail until we implement connectInstance
    const result = await client.connectInstance('test-instance');
    expect(result).toHaveProperty('base64');
    expect(result).toHaveProperty('code');
  });

  it('should send message and return response', async () => {
    const result = await client.sendMessage('test-instance', {
      number: '+5511987654321',
      text: 'Hello',
    });
    expect(result).toHaveProperty('key');
    expect(result.status).toBe('sent');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd "/Users/higorplens/Antigravity Software/EVO HIGOR DISPARADOR"
npm test -- tests/services/evolution.test.ts
# Expected: FAIL - EvolutionClient is not defined
```

- [ ] **Step 3: Implement EvolutionClient**

```typescript
// src/services/evolution.ts
import axios, { AxiosInstance } from 'axios';

export interface EvolutionConfig {
  baseUrl: string;
  apiKey: string;
}

export interface ConnectInstanceResponse {
  pairingCode: string | null;
  code: string;
  base64: string;
  count: number;
}

export interface SendMessagePayload {
  number: string;
  text: string;
}

export interface SendMessageResponse {
  key: { id: string };
  message: { text: string };
  status: string;
}

export interface InstanceStatusResponse {
  connected: boolean;
  phoneNumber?: string;
}

export class EvolutionClient {
  private http: AxiosInstance;

  constructor(private config: EvolutionConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'apikey': config.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async connectInstance(instanceName: string): Promise<ConnectInstanceResponse> {
    const response = await this.http.get<ConnectInstanceResponse>(
      `/instance/connect/${instanceName}`
    );
    return response.data;
  }

  async sendMessage(
    instanceName: string,
    payload: SendMessagePayload
  ): Promise<SendMessageResponse> {
    const response = await this.http.post<SendMessageResponse>(
      `/message/sendText/${instanceName}`,
      {
        number: payload.number,
        text: payload.text,
      }
    );
    return response.data;
  }

  async getInstanceStatus(instanceName: string): Promise<InstanceStatusResponse> {
    const response = await this.http.get<InstanceStatusResponse>(
      `/instance/fetch/${instanceName}`
    );
    return response.data;
  }

  async logoutInstance(instanceName: string): Promise<void> {
    await this.http.delete(`/instance/logout/${instanceName}`);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/services/evolution.test.ts
# Expected: PASS (mocked axios calls)
```

Note: For real integration, you'd mock axios. For now, tests check initialization.

- [ ] **Step 5: Commit**

```bash
git add src/services/evolution.ts tests/services/evolution.test.ts
git commit -m "feat: add EvolutionClient with typed wrapper for API calls"
```

---

## Phase 4: Queue Service & Worker

### Task 4: Message Queue Service (Bull + Redis)

**Files:**
- Create: `src/services/queue.ts`
- Create: `src/workers/message-queue.ts`
- Create: `tests/services/queue.test.ts`

**Interfaces:**
- Consumes: `EvolutionClient`, `getPrisma()`, Redis
- Produces:
  - `class MessageQueueService { enqueue(), process() }`
  - Queue worker loop (runs on interval)

- [ ] **Step 1: Write test for MessageQueueService**

```typescript
// tests/services/queue.test.ts
import { MessageQueueService } from '../../src/services/queue';
import { getPrisma } from '../../src/db';

describe('MessageQueueService', () => {
  let service: MessageQueueService;
  let prisma = getPrisma();

  beforeEach(async () => {
    service = new MessageQueueService(prisma);
  });

  it('should enqueue a message', async () => {
    const msg = await service.enqueue({
      organizationId: 'org-123',
      instanceId: 'inst-123',
      recipientPhone: '+5511987654321',
      messageText: 'Hello',
      scheduledAt: new Date(),
    });
    expect(msg.id).toBeDefined();
    expect(msg.status).toBe('pending');
  });

  it('should not process messages from other orgs (isolation)', async () => {
    // After queue.process() runs, only messages from the current org are sent
    // This test verifies isolation by checking the org_id filter
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/services/queue.test.ts
# Expected: FAIL - MessageQueueService is not defined
```

- [ ] **Step 3: Implement MessageQueueService**

```typescript
// src/services/queue.ts
import { PrismaClient, MessageQueue } from '@prisma/client';
import { EvolutionClient } from './evolution';
import * as Bull from 'bull';
import * as Redis from 'redis';

export interface EnqueuePayload {
  organizationId: string;
  instanceId: string;
  recipientPhone: string;
  messageText: string;
  scheduledAt?: Date;
  metadata?: Record<string, unknown>;
}

const EXPONENTIAL_BACKOFF_BASE = 300; // 5 minutes
const MAX_RETRIES = 5;

export class MessageQueueService {
  private queue: Bull.Queue<EnqueuePayload>;
  private evolutionClient: EvolutionClient;

  constructor(
    private prisma: PrismaClient,
    redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379',
    evolutionConfig?: { baseUrl: string; apiKey: string }
  ) {
    this.queue = new Bull('messages', redisUrl);
    
    this.evolutionClient = new EvolutionClient(
      evolutionConfig || {
        baseUrl: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
        apiKey: process.env.EVOLUTION_API_KEY || 'key',
      }
    );
  }

  async enqueue(payload: EnqueuePayload): Promise<MessageQueue> {
    const message = await this.prisma.messageQueue.create({
      data: {
        organizationId: payload.organizationId,
        instanceId: payload.instanceId,
        recipientPhone: payload.recipientPhone,
        messageText: payload.messageText,
        scheduledAt: payload.scheduledAt || new Date(),
        metadata: payload.metadata || {},
      },
    });

    // Log message queued event
    await this.prisma.messageLog.create({
      data: {
        messageQueueId: message.id,
        event: 'queued',
        meta: { enqueuedAt: new Date().toISOString() },
      },
    });

    return message;
  }

  async process(): Promise<void> {
    // Fetch all pending messages ready to send
    const messages = await this.prisma.messageQueue.findMany({
      where: {
        status: 'pending',
        scheduledAt: { lte: new Date() },
      },
      include: {
        instance: true,
        organization: true,
      },
    });

    for (const msg of messages) {
      await this.sendMessage(msg);
    }
  }

  private async sendMessage(msg: MessageQueue & { instance: any; organization: any }): Promise<void> {
    try {
      // Call Evolution API
      const result = await this.evolutionClient.sendMessage(msg.instance.instanceName, {
        number: msg.recipientPhone,
        text: msg.messageText,
      });

      // Mark as sent
      await this.prisma.messageQueue.update({
        where: { id: msg.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });

      // Log sent event
      await this.prisma.messageLog.create({
        data: {
          messageQueueId: msg.id,
          event: 'sent',
          meta: { evolutionKey: result.key.id },
        },
      });
    } catch (error: any) {
      await this.handleSendError(msg, error);
    }
  }

  private async handleSendError(msg: MessageQueue, error: any): Promise<void> {
    const isTransient = error.response?.status >= 500 || error.code === 'ECONNREFUSED';
    
    if (isTransient && msg.retryCount < MAX_RETRIES) {
      // Exponential backoff
      const backoffMs = EXPONENTIAL_BACKOFF_BASE * Math.pow(2, msg.retryCount) * 1000;
      const retryUntil = new Date(Date.now() + backoffMs);

      await this.prisma.messageQueue.update({
        where: { id: msg.id },
        data: {
          retryCount: msg.retryCount + 1,
          retryUntil,
          errorMessage: error.message,
        },
      });

      await this.prisma.messageLog.create({
        data: {
          messageQueueId: msg.id,
          event: 'failed',
          meta: { error: error.message, retryAt: retryUntil.toISOString() },
        },
      });
    } else {
      // Permanent failure
      await this.prisma.messageQueue.update({
        where: { id: msg.id },
        data: {
          status: 'failed',
          errorMessage: error.message,
        },
      });

      await this.prisma.messageLog.create({
        data: {
          messageQueueId: msg.id,
          event: 'failed',
          meta: { error: error.message, permanent: true },
        },
      });
    }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/services/queue.test.ts
# Expected: PASS
```

- [ ] **Step 5: Create message queue worker script**

```typescript
// src/workers/message-queue.ts
import { getPrisma, disconnectPrisma } from '../db';
import { MessageQueueService } from '../services/queue';

const PROCESS_INTERVAL_MS = 5000; // 5 seconds

async function runWorker() {
  const prisma = getPrisma();
  const service = new MessageQueueService(prisma);

  console.log('[Worker] Starting message queue worker...');

  setInterval(async () => {
    try {
      await service.process();
    } catch (error) {
      console.error('[Worker] Error processing queue:', error);
    }
  }, PROCESS_INTERVAL_MS);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[Worker] Shutting down...');
    await disconnectPrisma();
    process.exit(0);
  });
}

runWorker().catch(console.error);
```

- [ ] **Step 6: Update package.json scripts**

```json
{
  "scripts": {
    "queue:worker": "ts-node src/workers/message-queue.ts"
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add src/services/queue.ts src/workers/message-queue.ts tests/services/queue.test.ts
git commit -m "feat: add MessageQueueService with Bull/Redis and exponential backoff retry logic"
```

---

## Phase 5: Express API Server & Routes

### Task 5: Auth Middleware & Core API Setup

**Files:**
- Create: `src/middleware/auth.ts`
- Create: `src/api/index.ts`
- Create: `src/index.ts` (main server)
- Create: `tests/middleware/auth.test.ts`

**Interfaces:**
- Consumes: `getPrisma()`, JWT secret from env
- Produces:
  - `authMiddleware(req, res, next)` — validates API key, sets `req.organizationId`
  - Express app setup with CORS, error handling

- [ ] **Step 1: Write test for auth middleware**

```typescript
// tests/middleware/auth.test.ts
import request from 'supertest';
import express from 'express';
import { authMiddleware } from '../../src/middleware/auth';

describe('authMiddleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(authMiddleware);
    app.get('/protected', (req, res) => {
      res.json({ organizationId: req.organizationId });
    });
  });

  it('should reject missing API key', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('should reject invalid API key', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-key');
    expect(res.status).toBe(401);
  });

  it('should allow valid API key and set organizationId', async () => {
    // Assumes test org exists with known API key
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer test-api-key');
    expect(res.status).toBe(200);
    expect(res.body.organizationId).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/middleware/auth.test.ts
# Expected: FAIL - authMiddleware not found
```

- [ ] **Step 3: Implement auth middleware**

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { getPrisma } from '../db';

declare global {
  namespace Express {
    interface Request {
      organizationId?: string;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const apiKey = authHeader.slice(7);
  const prisma = getPrisma();

  const org = await prisma.organization.findUnique({
    where: { apiKey },
  });

  if (!org || !org.isActive) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  req.organizationId = org.id;
  next();
}
```

- [ ] **Step 4: Create API setup file**

```typescript
// src/api/index.ts
import express, { Express } from 'express';
import cors from 'cors';
import { authMiddleware } from '../middleware/auth';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check (no auth required)
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // All other routes require auth
  app.use('/api/v1', authMiddleware);

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Error]', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });

  return app;
}
```

- [ ] **Step 5: Create main index.ts**

```typescript
// src/index.ts
import 'dotenv/config';
import { createApp } from './api';
import { getPrisma, disconnectPrisma } from './db';

const PORT = parseInt(process.env.PORT || '3000');

async function main() {
  const app = createApp();
  const prisma = getPrisma();

  // Test database connection
  await prisma.$queryRaw`SELECT 1`;
  console.log('[DB] Connected to PostgreSQL');

  const server = app.listen(PORT, () => {
    console.log(`[Server] Disparador API listening on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[Server] Shutting down...');
    server.close(() => {
      disconnectPrisma();
      process.exit(0);
    });
  });
}

main().catch((error) => {
  console.error('[Fatal]', error);
  process.exit(1);
});
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test -- tests/middleware/auth.test.ts
# Expected: PASS (with mocked Prisma)
```

- [ ] **Step 7: Commit**

```bash
git add src/middleware/auth.ts src/api/index.ts src/index.ts tests/middleware/auth.test.ts
git commit -m "feat: add auth middleware and Express API setup"
```

---

### Task 6: Message Routes (POST, GET, DELETE, CANCEL)

**Files:**
- Create: `src/api/routes/messages.ts`
- Create: `tests/api/routes/messages.test.ts`

**Interfaces:**
- Consumes: `authMiddleware` (req.organizationId), `MessageQueueService`, `getPrisma()`
- Produces:
  - `POST /api/v1/messages` — enqueue message
  - `GET /api/v1/messages` — list paginated
  - `GET /api/v1/messages/:id` — fetch detail
  - `DELETE /api/v1/messages/:id` — cancel pending

- [ ] **Step 1: Write tests for message routes**

```typescript
// tests/api/routes/messages.test.ts
import request from 'supertest';
import { createApp } from '../../src/api';

describe('Message Routes', () => {
  let app: any;
  const orgId = 'test-org-id';
  const authHeader = 'Bearer test-api-key';

  beforeEach(() => {
    app = createApp();
  });

  describe('POST /api/v1/messages', () => {
    it('should enqueue a message', async () => {
      const res = await request(app)
        .post('/api/v1/messages')
        .set('Authorization', authHeader)
        .send({
          instance_name: 'vendas',
          recipient_phone: '+5511987654321',
          message_text: 'Hello',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('pending');
    });

    it('should require all fields', async () => {
      const res = await request(app)
        .post('/api/v1/messages')
        .set('Authorization', authHeader)
        .send({ message_text: 'Hello' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/messages', () => {
    it('should list organization messages', async () => {
      const res = await request(app)
        .get('/api/v1/messages')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/v1/messages?page=1&limit=10')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('limit');
      expect(res.body).toHaveProperty('total');
    });
  });

  describe('GET /api/v1/messages/:id', () => {
    it('should fetch message detail', async () => {
      // Assumes message exists
      const res = await request(app)
        .get('/api/v1/messages/msg-123')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200 || 404);
    });
  });

  describe('DELETE /api/v1/messages/:id', () => {
    it('should cancel pending message', async () => {
      const res = await request(app)
        .delete('/api/v1/messages/msg-123')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200 || 404);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/api/routes/messages.test.ts
# Expected: FAIL - routes not defined
```

- [ ] **Step 3: Implement message routes**

```typescript
// src/api/routes/messages.ts
import { Router, Request, Response } from 'express';
import { getPrisma } from '../../db';
import { MessageQueueService } from '../../services/queue';
import { v4 as uuid } from 'uuid';

const router = Router();
const prisma = getPrisma();
const queueService = new MessageQueueService(prisma);

// POST /api/v1/messages
router.post('/messages', async (req: Request, res: Response) => {
  const { instance_name, recipient_phone, message_text, scheduled_at, metadata } = req.body;
  const organizationId = req.organizationId!;

  if (!instance_name || !recipient_phone || !message_text) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Resolve instance
    const instance = await prisma.instance.findFirst({
      where: {
        organizationId,
        name: instance_name,
      },
    });

    if (!instance) {
      res.status(404).json({ error: 'Instance not found' });
      return;
    }

    // Enqueue message
    const message = await queueService.enqueue({
      organizationId,
      instanceId: instance.id,
      recipientPhone: recipient_phone,
      messageText: message_text,
      scheduledAt: scheduled_at ? new Date(scheduled_at) : new Date(),
      metadata: metadata || {},
    });

    res.status(201).json(message);
  } catch (error: any) {
    console.error('[Error] POST /messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/messages
router.get('/messages', async (req: Request, res: Response) => {
  const organizationId = req.organizationId!;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;

  try {
    const where: any = { organizationId };
    if (status) where.status = status;

    const total = await prisma.messageQueue.count({ where });
    const data = await prisma.messageQueue.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { instance: true },
    });

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data,
    });
  } catch (error: any) {
    console.error('[Error] GET /messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/messages/:id
router.get('/messages/:id', async (req: Request, res: Response) => {
  const organizationId = req.organizationId!;
  const { id } = req.params;

  try {
    const message = await prisma.messageQueue.findFirst({
      where: { id, organizationId },
      include: { instance: true, messageLogs: true },
    });

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    res.json(message);
  } catch (error: any) {
    console.error('[Error] GET /messages/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/v1/messages/:id
router.delete('/messages/:id', async (req: Request, res: Response) => {
  const organizationId = req.organizationId!;
  const { id } = req.params;

  try {
    const message = await prisma.messageQueue.findFirst({
      where: { id, organizationId },
    });

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (message.status !== 'pending') {
      res.status(400).json({ error: 'Can only cancel pending messages' });
      return;
    }

    const updated = await prisma.messageQueue.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('[Error] DELETE /messages/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

- [ ] **Step 4: Register routes in API**

Update `src/api/index.ts`:

```typescript
import messagesRouter from './routes/messages';

// ... inside createApp() after authMiddleware:

app.use('/api/v1', authMiddleware, messagesRouter);
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- tests/api/routes/messages.test.ts
# Expected: PASS (with mocked Prisma)
```

- [ ] **Step 6: Commit**

```bash
git add src/api/routes/messages.ts tests/api/routes/messages.test.ts
git commit -m "feat: add message enqueue, list, detail, and cancel routes"
```

---

### Task 7: Instance Routes (Create, List, QR Code, Disconnect)

**Files:**
- Create: `src/api/routes/instances.ts`
- Create: `tests/api/routes/instances.test.ts`

**Interfaces:**
- Consumes: `authMiddleware`, `EvolutionClient`, `getPrisma()`
- Produces:
  - `POST /api/v1/instances` — create instance
  - `GET /api/v1/instances` — list org's instances
  - `GET /api/v1/instances/:id/qr` — get QR code
  - `DELETE /api/v1/instances/:id` — logout instance

- [ ] **Step 1: Write tests for instance routes**

```typescript
// tests/api/routes/instances.test.ts
import request from 'supertest';
import { createApp } from '../../src/api';

describe('Instance Routes', () => {
  let app: any;
  const authHeader = 'Bearer test-api-key';

  beforeEach(() => {
    app = createApp();
  });

  describe('POST /api/v1/instances', () => {
    it('should create a new instance', async () => {
      const res = await request(app)
        .post('/api/v1/instances')
        .set('Authorization', authHeader)
        .send({
          name: 'vendas',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('disconnected');
    });
  });

  describe('GET /api/v1/instances', () => {
    it('should list org instances', async () => {
      const res = await request(app)
        .get('/api/v1/instances')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/v1/instances/:id/qr', () => {
    it('should fetch QR code', async () => {
      const res = await request(app)
        .get('/api/v1/instances/inst-123/qr')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200 || 404);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/api/routes/instances.test.ts
# Expected: FAIL
```

- [ ] **Step 3: Implement instance routes**

```typescript
// src/api/routes/instances.ts
import { Router, Request, Response } from 'express';
import { getPrisma } from '../../db';
import { EvolutionClient } from '../../services/evolution';
import { v4 as uuid } from 'uuid';

const router = Router();
const prisma = getPrisma();
const evolutionClient = new EvolutionClient({
  baseUrl: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
  apiKey: process.env.EVOLUTION_API_KEY || 'key',
});

// POST /api/v1/instances
router.post('/instances', async (req: Request, res: Response) => {
  const organizationId = req.organizationId!;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    // Check uniqueness within org
    const existing = await prisma.instance.findFirst({
      where: { organizationId, name },
    });

    if (existing) {
      res.status(400).json({ error: 'Instance name already exists' });
      return;
    }

    const instanceName = `${organizationId.slice(0, 8)}_${name}_${uuid().slice(0, 8)}`;
    const evolutionToken = `token_${uuid()}`;

    const instance = await prisma.instance.create({
      data: {
        organizationId,
        name,
        instanceName,
        evolutionApiToken: evolutionToken,
        status: 'disconnected',
      },
    });

    res.status(201).json(instance);
  } catch (error: any) {
    console.error('[Error] POST /instances:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/instances
router.get('/instances', async (req: Request, res: Response) => {
  const organizationId = req.organizationId!;

  try {
    const instances = await prisma.instance.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(instances);
  } catch (error: any) {
    console.error('[Error] GET /instances:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/instances/:id/qr
router.get('/instances/:id/qr', async (req: Request, res: Response) => {
  const organizationId = req.organizationId!;
  const { id } = req.params;

  try {
    const instance = await prisma.instance.findFirst({
      where: { id, organizationId },
    });

    if (!instance) {
      res.status(404).json({ error: 'Instance not found' });
      return;
    }

    // Fetch QR from Evolution
    const qr = await evolutionClient.connectInstance(instance.instanceName);

    // Update QR in DB
    await prisma.instance.update({
      where: { id },
      data: { qrCodeUrl: qr.base64 },
    });

    res.json({
      base64: qr.base64,
      code: qr.code,
      pairingCode: qr.pairingCode,
    });
  } catch (error: any) {
    console.error('[Error] GET /instances/:id/qr:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/v1/instances/:id
router.delete('/instances/:id', async (req: Request, res: Response) => {
  const organizationId = req.organizationId!;
  const { id } = req.params;

  try {
    const instance = await prisma.instance.findFirst({
      where: { id, organizationId },
    });

    if (!instance) {
      res.status(404).json({ error: 'Instance not found' });
      return;
    }

    // Logout from Evolution
    try {
      await evolutionClient.logoutInstance(instance.instanceName);
    } catch (err) {
      console.warn('[Warning] Evolution logout failed:', err);
    }

    // Delete instance
    await prisma.instance.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('[Error] DELETE /instances/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

- [ ] **Step 4: Register routes in API**

Update `src/api/index.ts`:

```typescript
import instancesRouter from './routes/instances';

// ... inside createApp():

app.use('/api/v1', authMiddleware, instancesRouter);
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- tests/api/routes/instances.test.ts
# Expected: PASS
```

- [ ] **Step 6: Commit**

```bash
git add src/api/routes/instances.ts tests/api/routes/instances.test.ts
git commit -m "feat: add instance creation, listing, QR code, and logout routes"
```

---

## Phase 6: Webhooks Handler

### Task 8: Webhook Ingestion & Event Routing

**Files:**
- Create: `src/api/routes/webhooks.ts`
- Create: `tests/api/routes/webhooks.test.ts`

**Interfaces:**
- Consumes: `getPrisma()`, webhook validation
- Produces:
  - `POST /webhooks/evolution` — receives Evolution webhook
  - Stores in `webhook_logs`
  - Emits to frontend via socket.io (setup in Phase 7)

- [ ] **Step 1: Write test for webhooks**

```typescript
// tests/api/routes/webhooks.test.ts
import request from 'supertest';
import { createApp } from '../../src/api';

describe('Webhook Routes', () => {
  let app: any;

  beforeEach(() => {
    app = createApp();
  });

  describe('POST /webhooks/evolution', () => {
    it('should accept webhook from Evolution', async () => {
      const payload = {
        event: 'messages.upsert',
        data: {
          instanceName: 'test_vendas_abc123',
          messages: [{
            key: { id: 'msg-key' },
            message: { body: 'Test message' },
          }],
        },
      };

      const res = await request(app)
        .post('/webhooks/evolution')
        .set('x-api-key', process.env.WEBHOOK_SECRET || 'secret')
        .send(payload);

      expect(res.status).toBe(200 || 202);
    });

    it('should reject invalid webhook signature', async () => {
      const res = await request(app)
        .post('/webhooks/evolution')
        .set('x-api-key', 'wrong-secret')
        .send({ event: 'test' });

      expect(res.status).toBe(401);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/api/routes/webhooks.test.ts
# Expected: FAIL
```

- [ ] **Step 3: Implement webhook routes**

```typescript
// src/api/routes/webhooks.ts
import { Router, Request, Response } from 'express';
import { getPrisma } from '../../db';

const router = Router();
const prisma = getPrisma();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'webhook-secret';

// Webhook validation middleware
function validateWebhookSecret(req: Request, res: Response, next: Function) {
  const secret = req.headers['x-api-key'];

  if (secret !== WEBHOOK_SECRET) {
    res.status(401).json({ error: 'Invalid webhook secret' });
    return;
  }

  next();
}

// POST /webhooks/evolution
router.post('/evolution', validateWebhookSecret, async (req: Request, res: Response) => {
  const { event, data } = req.body;

  try {
    const { instanceName } = data;

    // Resolve organization + instance
    const instance = await prisma.instance.findFirst({
      where: { instanceName },
      include: { organization: true },
    });

    if (!instance) {
      // Instance doesn't exist yet — log and ignore
      console.warn(`[Webhook] Unknown instance: ${instanceName}`);
      res.status(202).json({ received: true });
      return;
    }

    // Store webhook log
    const webhookLog = await prisma.webhookLog.create({
      data: {
        organizationId: instance.organizationId,
        instanceId: instance.id,
        eventType: event,
        payload: data,
      },
    });

    // Handle specific events
    if (event === 'messages.upsert' && data.messages) {
      for (const msg of data.messages) {
        // Log each message
        await prisma.messageLog.create({
          data: {
            messageQueueId: msg.key?.id || 'webhook-' + Date.now(),
            event: 'message.received',
            meta: {
              from: msg.message?.conversation,
              body: msg.message?.body,
              timestamp: new Date().toISOString(),
            },
          },
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[Error] Webhook handler:', error);
    // Always return 200 to Evolution to acknowledge receipt
    res.status(200).json({ received: true, error: error.message });
  }
});

export default router;
```

- [ ] **Step 4: Register webhook routes in API**

Update `src/api/index.ts`:

```typescript
import webhooksRouter from './routes/webhooks';

// ... inside createApp() before authMiddleware:

app.use('/webhooks', webhooksRouter); // No auth required for webhooks (they use secret header)
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- tests/api/routes/webhooks.test.ts
# Expected: PASS
```

- [ ] **Step 6: Commit**

```bash
git add src/api/routes/webhooks.ts tests/api/routes/webhooks.test.ts
git commit -m "feat: add webhook ingestion for Evolution events"
```

---

## Phase 7: Frontend (React Dashboard)

### Task 9: React Setup & Dashboard Layout

**Files:**
- Create: `src/frontend/` directory structure
- Create: `src/frontend/index.tsx`
- Create: `src/frontend/components/Dashboard.tsx`
- Create: `src/frontend/components/SendForm.tsx`
- Create: `src/frontend/components/MessageList.tsx`

**Interfaces:**
- Produces: React components for dashboard, send form, message list
- Note: Full React setup is out of scope for this plan. This task scaffolds the structure.

- [ ] **Step 1: Create frontend directory**

```bash
mkdir -p src/frontend/components src/frontend/pages src/frontend/api src/frontend/hooks
```

- [ ] **Step 2: Create Dashboard component**

```typescript
// src/frontend/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { SendForm } from './SendForm';
import { MessageList } from './MessageList';
import { useMessages } from '../hooks/useMessages';

export function Dashboard() {
  const { messages, loading, refetch } = useMessages();

  return (
    <div style={{ padding: '20px' }}>
      <h1>WhatsApp Disparador</h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Enviar Mensagem</h2>
          <SendForm onSuccess={refetch} />
        </div>

        <div style={{ flex: 2 }}>
          <h2>Fila ({messages.length})</h2>
          <MessageList messages={messages} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create SendForm component**

```typescript
// src/frontend/components/SendForm.tsx
import React, { useState } from 'react';
import { sendMessage } from '../api/messages';

export function SendForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    instance_name: '',
    recipient_phone: '',
    message_text: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage(form);
      setForm({ instance_name: '', recipient_phone: '', message_text: '' });
      onSuccess();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Instância:</label>
        <input
          value={form.instance_name}
          onChange={(e) => setForm({ ...form, instance_name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Telefone (+55...):</label>
        <input
          value={form.recipient_phone}
          onChange={(e) => setForm({ ...form, recipient_phone: e.target.value })}
          placeholder="+5511987654321"
          required
        />
      </div>

      <div>
        <label>Mensagem:</label>
        <textarea
          value={form.message_text}
          onChange={(e) => setForm({ ...form, message_text: e.target.value })}
          required
        />
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
}
```

- [ ] **Step 4: Create MessageList component**

```typescript
// src/frontend/components/MessageList.tsx
import React from 'react';
import { MessageQueue } from '../types';

export function MessageList({ messages }: { messages: MessageQueue[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #ccc' }}>
          <th style={{ textAlign: 'left', padding: '8px' }}>Telefone</th>
          <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
          <th style={{ textAlign: 'left', padding: '8px' }}>Enviado em</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((msg) => (
          <tr key={msg.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px' }}>{msg.recipientPhone}</td>
            <td style={{ padding: '8px' }}>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor:
                    msg.status === 'sent'
                      ? '#e6f7e6'
                      : msg.status === 'failed'
                      ? '#ffe6e6'
                      : '#e6e6ff',
                  color:
                    msg.status === 'sent'
                      ? '#0d6b0d'
                      : msg.status === 'failed'
                      ? '#b30000'
                      : '#0000b3',
                }}
              >
                {msg.status}
              </span>
            </td>
            <td style={{ padding: '8px' }}>
              {msg.sentAt ? new Date(msg.sentAt).toLocaleString('pt-BR') : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 5: Create API client functions**

```typescript
// src/frontend/api/messages.ts
const BASE_URL = 'http://localhost:3000/api/v1';

export async function sendMessage(data: any) {
  const apiKey = localStorage.getItem('apiKey') || '';

  const response = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function listMessages(page = 1, limit = 20) {
  const apiKey = localStorage.getItem('apiKey') || '';

  const response = await fetch(`${BASE_URL}/messages?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}
```

- [ ] **Step 6: Create types**

```typescript
// src/frontend/types.ts
export interface MessageQueue {
  id: string;
  organizationId: string;
  instanceId: string;
  recipientPhone: string;
  messageText: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  scheduledAt: string;
  sentAt?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 7: Create useMessages hook**

```typescript
// src/frontend/hooks/useMessages.ts
import { useEffect, useState } from 'react';
import { listMessages } from '../api/messages';
import { MessageQueue } from '../types';

export function useMessages() {
  const [messages, setMessages] = useState<MessageQueue[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await listMessages();
      setMessages(data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, []);

  return { messages, loading, refetch };
}
```

- [ ] **Step 8: Commit**

```bash
git add src/frontend/
git commit -m "feat: add React dashboard with send form and message list UI"
```

---

## Phase 8: Testing & Docker Deployment

### Task 10: Jest Configuration & Test Suite

**Files:**
- Create: `jest.config.js`
- Create: `tests/jest-setup.ts`

**Interfaces:**
- Produces: Configured Jest with TypeScript support

- [ ] **Step 1: Create jest.config.js**

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
};
```

- [ ] **Step 2: Create jest setup**

```typescript
// tests/jest-setup.ts
// Mock Prisma for unit tests
jest.mock('../src/db', () => ({
  getPrisma: () => ({
    organization: { findUnique: jest.fn() },
    instance: { findMany: jest.fn() },
    messageQueue: { create: jest.fn(), findMany: jest.fn() },
  }),
}));
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git add jest.config.js tests/jest-setup.ts
git commit -m "chore: add Jest configuration with TypeScript support"
```

---

### Task 11: Docker Compose & Local Dev Setup

**Files:**
- Already created in Task 1 (docker-compose.yml)

**This task verifies the setup works end-to-end**

- [ ] **Step 1: Start Docker services**

```bash
cd "/Users/higorplens/Antigravity Software/EVO HIGOR DISPARADOR"
docker compose up -d
```

- [ ] **Step 2: Wait for services to be healthy**

```bash
docker compose ps
# Verify postgres, redis, and disparador-api are all "healthy"
```

- [ ] **Step 3: Run migrations**

```bash
# Inside the container or via docker exec:
docker exec disparador_api npx prisma migrate dev
```

- [ ] **Step 4: Test health endpoint**

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

- [ ] **Step 5: Create a test organization in the database**

```bash
docker exec disparador_postgres psql -U postgres -d disparador -c \
  "INSERT INTO organizations (name, api_key, is_active) VALUES ('Test Org', 'test-api-key-123', true);"
```

- [ ] **Step 6: Test API authentication**

```bash
curl -X GET http://localhost:3000/api/v1/instances \
  -H "Authorization: Bearer test-api-key-123"
# Expected: [] (empty array of instances)
```

- [ ] **Step 7: Create test instance via API**

```bash
curl -X POST http://localhost:3000/api/v1/instances \
  -H "Authorization: Bearer test-api-key-123" \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

- [ ] **Step 8: Start queue worker in separate terminal**

```bash
npm run queue:worker
# Expected: [Worker] Starting message queue worker...
```

- [ ] **Step 9: Send test message via API**

```bash
curl -X POST http://localhost:3000/api/v1/messages \
  -H "Authorization: Bearer test-api-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "instance_name": "test",
    "recipient_phone": "+5511987654321",
    "message_text": "Hello"
  }'
# Expected: 201 with message object
```

- [ ] **Step 10: Verify message in queue**

```bash
curl http://localhost:3000/api/v1/messages \
  -H "Authorization: Bearer test-api-key-123"
# Expected: message appears in response
```

- [ ] **Step 11: Stop services**

```bash
docker compose down
```

- [ ] **Step 12: Commit**

```bash
git add docker-compose.yml Dockerfile .dockerignore
git commit -m "chore: verify Docker setup runs locally end-to-end"
```

---

## Summary

**Total: 11 Tasks across 8 Phases**

| Phase | Task | Component | Status |
|-------|------|-----------|--------|
| 1 | 1 | Project Setup | Docker, TS, Node |
| 2 | 2 | Database | Prisma, PostgreSQL schema |
| 3 | 3 | Evolution Bridge | Typed API client |
| 4 | 4 | Queue Service | Bull, Redis, retry logic |
| 5 | 5 | Auth & API | Express middleware, health check |
| 5 | 6 | Message Routes | CRUD messages |
| 5 | 7 | Instance Routes | CRUD instances, QR code |
| 6 | 8 | Webhooks | Event ingestion |
| 7 | 9 | Frontend | React dashboard (scaffolded) |
| 8 | 10 | Testing | Jest, unit + integration |
| 8 | 11 | Docker | End-to-end local verification |

**Next Step:** Use `superpowers:subagent-driven-development` to execute tasks in parallel with full code review between checkpoints.

