import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import type { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { createAuthMiddleware } from '../middleware/auth';
import { EvolutionClient } from '../services/evolution';
import { MessageQueueService } from '../services/queue';
import { HttpError, isHttpError } from '../utils/http-error';
import { createMessagesRouter } from './routes/messages';
import { createInstancesRouter } from './routes/instances';
import { createWebhooksRouter } from './routes/webhooks';
import { createLogsRouter } from './routes/logs';
import { renderDashboardHtml } from '../frontend/dashboard';

export interface CreateAppDependencies {
  prisma: PrismaClient;
  evolutionClient: EvolutionClient;
  queueService: MessageQueueService;
  webhookSecret: string;
  setupToken?: string;
}

export function createApp(deps: CreateAppDependencies) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });

  app.get(['/', '/dashboard'], (_req, res) => {
    res.type('html').send(renderDashboardHtml());
  });

  app.post('/setup/organizations', async (req, res, next) => {
    try {
      if (!deps.setupToken) {
        throw new HttpError(503, 'Setup is disabled');
      }

      const token = String(req.header('x-setup-token') ?? '');
      if (token !== deps.setupToken) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const name = String(req.body?.name ?? 'Default Organization').trim();
      if (!name) {
        throw new HttpError(400, 'Organization name is required');
      }

      const created = await deps.prisma.organization.create({
        data: {
          name,
          apiKey: randomUUID(),
          isActive: true,
        },
      });

      res.status(201).json({
        id: created.id,
        name: created.name,
        api_key: created.apiKey,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use('/webhooks', createWebhooksRouter({
    prisma: deps.prisma,
    webhookSecret: deps.webhookSecret,
  }));

  const authMiddleware = createAuthMiddleware({ prisma: deps.prisma });
  app.use('/api/v1', authMiddleware);
  app.use('/api/v1/messages', createMessagesRouter({
    prisma: deps.prisma,
    queueService: deps.queueService,
  }));
  app.use('/api/v1/instances', createInstancesRouter({
    prisma: deps.prisma,
    evolutionClient: deps.evolutionClient,
  }));
  app.use('/api/v1/logs', createLogsRouter({
    prisma: deps.prisma,
  }));

  app.use(((error, _req, res, _next) => {
    if (isHttpError(error)) {
      res.status(error.statusCode).json({
        error: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      });
      return;
    }

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }) as ErrorRequestHandler);

  return app;
}
