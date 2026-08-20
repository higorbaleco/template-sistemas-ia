import { createApp } from '../../src/api';
import { MessageQueueService } from '../../src/services/queue';
import { createMockEvolutionClient, createMockPrisma } from '../helpers/mocks';
import { requestJson, startServer } from '../helpers/server';

describe('instances routes', () => {
  it('creates an instance and returns qr payload', async () => {
    const prisma = createMockPrisma();
    prisma.organization.findUnique.mockResolvedValue({
      id: 'org-1',
      isActive: true,
    });
    prisma.instance.create.mockResolvedValue({
      id: 'inst-1',
      organizationId: 'org-1',
      name: 'Vendas',
      instanceName: 'vendas-123',
      evolutionApiToken: 'token',
      phoneNumber: null,
      status: 'connecting',
      qrCodeUrl: null,
      lastHeartbeat: null,
      createdAt: new Date('2026-08-20T12:00:00Z'),
      updatedAt: new Date('2026-08-20T12:00:00Z'),
    });
    prisma.instance.update.mockResolvedValue({
      id: 'inst-1',
      organizationId: 'org-1',
      name: 'Vendas',
      instanceName: 'vendas-123',
      evolutionApiToken: 'token',
      phoneNumber: null,
      status: 'connecting',
      qrCodeUrl: 'data:image/png;base64,AAAA',
      lastHeartbeat: null,
      createdAt: new Date('2026-08-20T12:00:00Z'),
      updatedAt: new Date('2026-08-20T12:00:00Z'),
    });

    const evolutionClient = createMockEvolutionClient();
    evolutionClient.connectInstance = jest.fn().mockResolvedValue({
      pairingCode: null,
      code: '2@exemple',
      base64: 'data:image/png;base64,AAAA',
      count: 1,
    });

    const queueService = new MessageQueueService({
      prisma,
      evolutionClient,
      now: () => new Date('2026-08-20T12:00:00Z'),
    });

    const app = createApp({
      prisma,
      evolutionClient,
      queueService,
      webhookSecret: 'secret',
    });

    const server = await startServer(app);
    try {
      const response = await requestJson(server.baseUrl, '/api/v1/instances', {
        method: 'POST',
        headers: {
          authorization: 'Bearer key-1',
        },
        body: JSON.stringify({
          name: 'Vendas',
          evolutionApiToken: 'token',
        }),
      });

      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        id: 'inst-1',
        instance_name: 'vendas-123',
        status: 'connecting',
      });
    } finally {
      await server.close();
    }
  });
});
