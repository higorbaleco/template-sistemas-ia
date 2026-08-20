import { loadConfig } from '../config';
import { getPrisma, disconnectPrisma } from '../db';
import { EvolutionClient } from '../services/evolution';
import { MessageQueueService } from '../services/queue';

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

  const tick = async () => {
    try {
      await queueService.processPending({ limit: 50 });
    } catch (error) {
      console.error('Queue worker error:', error);
    }
  };

  await tick();
  const interval = setInterval(tick, 5000);

  const shutdown = async () => {
    clearInterval(interval);
    await disconnectPrisma();
    process.exit(0);
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

void main().catch(async (error) => {
  console.error('Fatal worker error:', error);
  await disconnectPrisma();
  process.exit(1);
});
