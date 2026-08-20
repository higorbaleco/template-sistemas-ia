export interface AppConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  redisUrl: string;
  evolutionApiUrl: string;
  evolutionApiKey: string;
  webhookSecret: string;
  setupToken?: string;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    databaseUrl: requiredEnv('DATABASE_URL'),
    redisUrl: requiredEnv('REDIS_URL'),
    evolutionApiUrl: requiredEnv('EVOLUTION_API_URL'),
    evolutionApiKey: requiredEnv('EVOLUTION_API_KEY'),
    webhookSecret: requiredEnv('WEBHOOK_SECRET'),
    setupToken: process.env.SETUP_TOKEN?.trim() || undefined,
  };
}
