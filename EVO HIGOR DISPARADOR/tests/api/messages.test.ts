import { createApp } from '../../src/api';
import { MessageQueueService } from '../../src/services/queue';
import { createMockEvolutionClient, createMockPrisma } from '../helpers/mocks';
import { requestJson, startServer } from '../helpers/server';

describe('messages routes', () => {
  it('lists messages for the authenticated organization', async () => {
    const prisma = createMockPrisma();
    prisma.organization.findUnique.mockResolvedValue({
      id: 'org-1',
      isActive: true,
    });
    prisma.messageQueue.findMany.mockResolvedValue([
      {
        id: 'msg-1',
        organizationId: 'org-1',
        instanceId: 'inst-1',
        recipientPhone: '+5511999999999',
        messageText: 'Oi',
        status: 'pending',
        scheduledAt: new Date('2026-08-20T12:00:00Z'),
        sentAt: null,
        retryCount: 0,
        retryUntil: null,
        errorMessage: null,
        metadata: null,
        createdAt: new Date('2026-08-20T12:00:00Z'),
        updatedAt: new Date('2026-08-20T12:00:00Z'),
        instance: { id: 'inst-1', instanceName: 'vendas', organizationId: 'org-1', status: 'connected' },
      },
    ]);
    prisma.messageQueue.count.mockResolvedValue(1);
    prisma.$transaction.mockImplementation(async (operations: unknown[]) => Promise.all(operations as Promise<unknown>[]));

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
      const response = await requestJson(server.baseUrl, '/api/v1/messages', {
        headers: {
          authorization: 'Bearer key-1',
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.total).toBe(1);
      expect(response.data.items).toHaveLength(1);
    } finally {
      await server.close();
    }
  });
});
