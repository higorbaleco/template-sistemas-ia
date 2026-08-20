import { createApp } from '../../src/api';
import { MessageQueueService } from '../../src/services/queue';
import { createMockEvolutionClient, createMockPrisma } from '../helpers/mocks';
import { startServer } from '../helpers/server';

describe('setup and dashboard', () => {
  it('serves the dashboard html at the root path', async () => {
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
      setupToken: 'setup-token',
    });

    const server = await startServer(app);
    try {
      const response = await fetch(`${server.baseUrl}/`);
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(html).toContain('WhatsApp Disparador');
      expect(html).toContain('Bootstrap Organization');
      expect(html).toContain('API Settings');
      expect(html).toContain('API Routes');
      expect(html).toContain('Maturador API key');
    } finally {
      await server.close();
    }
  });

  it('creates an organization when the setup token is valid', async () => {
    const prisma = createMockPrisma();
    prisma.organization.create.mockResolvedValue({
      id: 'org-1',
      name: 'Acme',
      apiKey: 'org-key-123',
    });

    const app = createApp({
      prisma,
      evolutionClient: createMockEvolutionClient(),
      queueService: new MessageQueueService({
        prisma,
        evolutionClient: createMockEvolutionClient(),
        now: () => new Date('2026-08-20T12:00:00Z'),
      }),
      webhookSecret: 'secret',
      setupToken: 'setup-token',
    });

    const server = await startServer(app);
    try {
      const response = await fetch(`${server.baseUrl}/setup/organizations`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-setup-token': 'setup-token',
        },
        body: JSON.stringify({ name: 'Acme' }),
      });
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json).toMatchObject({
        id: 'org-1',
        name: 'Acme',
        api_key: 'org-key-123',
      });
      expect(prisma.organization.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Acme',
          apiKey: expect.any(String),
          isActive: true,
        }),
      });
    } finally {
      await server.close();
    }
  });
});
