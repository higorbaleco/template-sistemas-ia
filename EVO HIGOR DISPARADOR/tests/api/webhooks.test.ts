import { createApp } from '../../src/api';
import { MessageQueueService } from '../../src/services/queue';
import { createMockEvolutionClient, createMockPrisma } from '../helpers/mocks';
import { requestJson, startServer } from '../helpers/server';

describe('webhook routes', () => {
  it('rejects invalid webhook secret', async () => {
    const prisma = createMockPrisma();
    const app = createApp({
      prisma,
      evolutionClient: createMockEvolutionClient(),
      queueService: new MessageQueueService({
        prisma,
        evolutionClient: createMockEvolutionClient(),
        now: () => new Date('2026-08-20T12:00:00Z'),
      }),
      webhookSecret: 'secret',
    });

    const server = await startServer(app);
    try {
      const response = await requestJson(server.baseUrl, '/webhooks/evolution', {
        method: 'POST',
        headers: {
          'x-api-key': 'wrong-secret',
        },
        body: JSON.stringify({ event: 'messages.upsert', data: { instanceName: 'vendas' } }),
      });

      expect(response.status).toBe(401);
    } finally {
      await server.close();
    }
  });

  it('stores webhook logs for a known instance', async () => {
    const prisma = createMockPrisma();
    prisma.instance.findUnique.mockResolvedValue({
      id: 'inst-1',
      organizationId: 'org-1',
      instanceName: 'vendas',
      status: 'connected',
    });
    prisma.webhookLog.create.mockResolvedValue({});

    const app = createApp({
      prisma,
      evolutionClient: createMockEvolutionClient(),
      queueService: new MessageQueueService({
        prisma,
        evolutionClient: createMockEvolutionClient(),
        now: () => new Date('2026-08-20T12:00:00Z'),
      }),
      webhookSecret: 'secret',
    });

    const server = await startServer(app);
    try {
      const response = await requestJson(server.baseUrl, '/webhooks/evolution', {
        method: 'POST',
        headers: {
          'x-api-key': 'secret',
        },
        body: JSON.stringify({ event: 'messages.upsert', data: { instanceName: 'vendas' } }),
      });

      expect(response.status).toBe(202);
      expect(prisma.webhookLog.create).toHaveBeenCalledTimes(1);
    } finally {
      await server.close();
    }
  });
});
