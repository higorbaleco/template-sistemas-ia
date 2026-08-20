import http from 'http';
import { loadConfig } from './config';
import { getPrisma, disconnectPrisma } from './db';
import { EvolutionClient } from './services/evolution';
import { MessageQueueService } from './services/queue';
import { createApp } from './api';

async function main() {
  const config = loadConfig();
  const prisma = getPrisma();

  const evolutionClient = new EvolutionClient({
    baseUrl: config.evolutionApiUrl,
    apiKey: config.evolutionApiKey,
  });

  const queueService = new MessageQueueService({
    prisma,
    evolutionClient,
  });

  const app = createApp({
    prisma,
    evolutionClient,
    queueService,
    webhookSecret: config.webhookSecret,
    setupToken: config.setupToken,
  });

  const server = http.createServer(app);

  server.listen(config.port, () => {
    console.log(`Disparador API listening on port ${config.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectPrisma();
    });
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

void main().catch(async (error) => {
  console.error('Fatal API error:', error);
  await disconnectPrisma();
  process.exit(1);
});
