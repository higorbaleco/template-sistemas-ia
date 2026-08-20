import { MessageQueueService } from '../../src/services/queue';
import { createMockEvolutionClient, createMockPrisma } from '../helpers/mocks';

describe('MessageQueueService', () => {
  it('enqueues a message and writes a queued log', async () => {
    const prisma = createMockPrisma();
    prisma.messageQueue.create.mockResolvedValue({
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
    });
    prisma.messageLog.create.mockResolvedValue({});

    const service = new MessageQueueService({
      prisma,
      evolutionClient: createMockEvolutionClient(),
      now: () => new Date('2026-08-20T12:00:00Z'),
    });

    const message = await service.enqueue({
      organizationId: 'org-1',
      instanceId: 'inst-1',
      recipientPhone: '+5511999999999',
      messageText: 'Oi',
    });

    expect(message.id).toBe('msg-1');
    expect(prisma.messageQueue.create).toHaveBeenCalledTimes(1);
    expect(prisma.messageLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        messageQueueId: 'msg-1',
        event: 'queued',
      }),
    });
  });

  it('marks a pending message as sent', async () => {
    const prisma = createMockPrisma();
    const message = {
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
      instance: {
        id: 'inst-1',
        organizationId: 'org-1',
        instanceName: 'vendas',
        status: 'connected',
      },
    };

    prisma.messageQueue.findMany.mockResolvedValue([message]);
    prisma.messageQueue.update.mockResolvedValue({
      ...message,
      status: 'sent',
    });
    prisma.messageLog.create.mockResolvedValue({});

    const evolutionClient = createMockEvolutionClient();
    evolutionClient.sendMessage = jest.fn().mockResolvedValue({
      key: { id: 'remote-1' },
      message: { text: 'Oi' },
      status: 'sent',
    });

    const service = new MessageQueueService({
      prisma,
      evolutionClient,
      now: () => new Date('2026-08-20T12:00:00Z'),
    });

    const result = await service.processPending();

    expect(result.processed).toBe(1);
    expect(prisma.messageQueue.update).toHaveBeenCalledWith({
      where: { id: 'msg-1' },
      data: expect.objectContaining({
        status: 'sent',
      }),
    });
  });

  it('schedules a retry for transient failures', async () => {
    const prisma = createMockPrisma();
    const message = {
      id: 'msg-2',
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
      instance: {
        id: 'inst-1',
        organizationId: 'org-1',
        instanceName: 'vendas',
        status: 'connected',
      },
    };

    prisma.messageQueue.findMany.mockResolvedValue([message]);
    prisma.messageQueue.update.mockResolvedValue({
      ...message,
      retryCount: 1,
      retryUntil: new Date('2026-08-20T12:05:00Z'),
    });
    prisma.messageLog.create.mockResolvedValue({});

    const evolutionClient = createMockEvolutionClient();
    evolutionClient.sendMessage = jest.fn().mockRejectedValue({
      response: { status: 500, data: { message: 'temporary failure' } },
      message: 'Request failed with status code 500',
    });

    const service = new MessageQueueService({
      prisma,
      evolutionClient,
      now: () => new Date('2026-08-20T12:00:00Z'),
    });

    const result = await service.processPending();

    expect(result.results[0]).toMatchObject({
      status: 'retry_scheduled',
      messageId: 'msg-2',
    });
    expect(prisma.messageQueue.update).toHaveBeenCalledWith({
      where: { id: 'msg-2' },
      data: expect.objectContaining({
        retryCount: 1,
      }),
    });
  });
});
