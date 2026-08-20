import { createApp } from '../../src/api';
import { MessageQueueService } from '../../src/services/queue';
import { createMockEvolutionClient, createMockPrisma } from '../helpers/mocks';
import { startServer, requestJson } from '../helpers/server';

describe('auth middleware', () => {
  it('rejects missing bearer token', async () => {
    const prisma = createMockPrisma();
    const queueService = new MessageQueueService({
      prisma,
      evolutionClient: createMockEvolutionClient(),
      now: () => new Date('2026-08-20T12:00:00Z'),
    });

    const app = createApp({
      prisma,
      evolutionClient: createMockEvolutionClient(),
      queueService,
      webhookSecret: 'secret',
    });

    const server = await startServer(app);
    try {
      const response = await requestJson(server.baseUrl, '/api/v1/messages');
      expect(response.status).toBe(401);
      expect(response.data).toEqual({ error: 'Unauthorized' });
    } finally {
      await server.close();
    }
  });

  it('accepts a valid organization api key', async () => {
    const prisma = createMockPrisma();
    prisma.organization.findUnique.mockResolvedValue({
      id: 'org-1',
      isActive: true,
    });
    prisma.instance.findFirst.mockResolvedValue({
      id: 'inst-1',
      organizationId: 'org-1',
      name: 'Vendas',
      instanceName: 'vendas',
    });
    prisma.messageQueue.create.mockResolvedValue({
      id: 'msg-1',
      status: 'pending',
      scheduledAt: new Date('2026-08-20T12:00:00Z'),
    });
    prisma.messageLog.create.mockResolvedValue({});

    const queueService = new MessageQueueService({
      prisma,
      evolutionClient: createMockEvolutionClient(),
      now: () => new Date('2026-08-20T12:00:00Z'),
    });
    jest.spyOn(queueService, 'enqueue').mockResolvedValue({
      id: 'msg-1',
      organizationId: 'org-1',
      instanceId: 'inst-1',
      recipientPhone: '+5511999999999',
      messageText: 'Olá',
      status: 'pending',
      scheduledAt: new Date('2026-08-20T12:00:00Z'),
      sentAt: null,
      retryCount: 0,
      retryUntil: null,
      errorMessage: null,
      metadata: null,
      createdAt: new Date('2026-08-20T12:00:00Z'),
      updatedAt: new Date('2026-08-20T12:00:00Z'),
    } as any);

    const app = createApp({
      prisma,
      evolutionClient: createMockEvolutionClient(),
      queueService,
      webhookSecret: 'secret',
    });

    const server = await startServer(app);
    try {
      const response = await requestJson(
        server.baseUrl,
        '/api/v1/messages',
        {
          method: 'POST',
          headers: {
            authorization: 'Bearer org-key',
          },
          body: JSON.stringify({
            instanceName: 'vendas',
            recipientPhone: '+5511999999999',
            messageText: 'Olá',
          }),
        },
      );

      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        id: 'msg-1',
        status: 'pending',
      });
      expect(prisma.organization.findUnique).toHaveBeenCalledWith({
        where: { apiKey: 'org-key' },
      });
    } finally {
      await server.close();
    }
  });
});
