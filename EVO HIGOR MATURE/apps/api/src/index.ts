import type { Agent, Conversation, MetricSnapshot, WebhookDelivery, WhatsAppInstance, WarmingSession } from "../../../packages/contracts/src/index.js";
import { createInMemoryPlatformStore, createPersistentPlatformStore, type PersistentPlatformStore, type PlatformStore } from "../../../packages/contracts/src/store.js";
import { WarmingService } from "./warming-service.js";
import { WebhookService } from "./webhooks.js";
import { seedDemoState } from "./seed.js";

export interface ApiState {
  agents: Agent[];
  instances: WhatsAppInstance[];
  conversations: Conversation[];
  warmingSessions: WarmingSession[];
  webhooks: WebhookDelivery[];
  metrics: MetricSnapshot[];
}

export function createEmptyApiState(): ApiState {
  return {
    agents: [],
    instances: [],
    conversations: [],
    warmingSessions: [],
    webhooks: [],
    metrics: []
  };
}

export function createApiStore(): PlatformStore {
  return createInMemoryPlatformStore();
}

export function createApiServices() {
  const store = createApiStore();
  const warmingService = new WarmingService(store);
  const webhookService = new WebhookService(store);

  return {
    store,
    warmingService,
    webhookService
  };
}

export async function createPersistentApiServices(dataFilePath: string) {
  const store = await createPersistentPlatformStore(dataFilePath);
  const warmingService = new WarmingService(store);
  const webhookService = new WebhookService(store);

  await seedDemoState(store);

  return {
    store: store as PersistentPlatformStore,
    warmingService,
    webhookService
  };
}

export function listDashboardCounters(state: ApiState) {
  const activeAgents = state.agents.filter((agent) => agent.active).length;
  const activeInstances = state.instances.filter((instance) => instance.lifecycleStatus !== "BLOCKED").length;
  const runningWarmingSessions = state.warmingSessions.filter((session) => session.status === "running").length;

  return {
    activeAgents,
    activeInstances,
    runningWarmingSessions,
    conversations: state.conversations.length,
    metrics: state.metrics.length
  };
}
