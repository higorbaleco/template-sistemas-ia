import type { EvolutionClient } from '../../src/services/evolution';

export function createMockPrisma(overrides: Record<string, unknown> = {}) {
  return {
    organization: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    instance: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    messageQueue: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    messageLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
    webhookLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(async (operations: unknown[]) => Promise.all(operations as Promise<unknown>[])),
    ...overrides,
  } as any;
}

export function createMockEvolutionClient(overrides: Partial<EvolutionClient> = {}) {
  return {
    connectInstance: jest.fn(),
    sendMessage: jest.fn(),
    getInstanceStatus: jest.fn(),
    logoutInstance: jest.fn(),
    ...overrides,
  } as unknown as EvolutionClient;
}
