import type {
  Agent,
  Conversation,
  InstanceBlockEvent,
  MetricSnapshot,
  Message,
  WebhookDelivery,
  WebhookSubscription,
  WhatsAppInstance,
  WarmingProfile,
  WarmingSession,
  WarmingMessageLog
} from "./index.js";
import { createJsonPlatformRepository, createEmptyPlatformState, type JsonPlatformRepository } from "./json-persistence.js";

export interface PlatformStoreState {
  agents: Agent[];
  instances: WhatsAppInstance[];
  conversations: Conversation[];
  messages: Message[];
  warmingProfiles: WarmingProfile[];
  warmingSessions: WarmingSession[];
  warmingMessageLogs: WarmingMessageLog[];
  instanceBlockEvents: InstanceBlockEvent[];
  webhookSubscriptions: WebhookSubscription[];
  webhookDeliveries: WebhookDelivery[];
  metrics: MetricSnapshot[];
}

export interface PersistentPlatformStore extends PlatformStore {
  flush(): Promise<void>;
  snapshot(): PlatformStoreState;
}

export interface PlatformStore extends PlatformStoreState {
  upsertAgent(agent: Agent): Agent;
  upsertInstance(instance: WhatsAppInstance): WhatsAppInstance;
  upsertConversation(conversation: Conversation): Conversation;
  appendMessage(message: Message): Message;
  upsertWarmingProfile(profile: WarmingProfile): WarmingProfile;
  upsertWarmingSession(session: WarmingSession): WarmingSession;
  appendWarmingMessageLog(entry: WarmingMessageLog): WarmingMessageLog;
  appendInstanceBlockEvent(event: InstanceBlockEvent): InstanceBlockEvent;
  upsertWebhookSubscription(subscription: WebhookSubscription): WebhookSubscription;
  upsertWebhookDelivery(delivery: WebhookDelivery): WebhookDelivery;
  appendMetricSnapshot(snapshot: MetricSnapshot): MetricSnapshot;
}

export function createEmptyPlatformStore(): PlatformStoreState {
  return createEmptyPlatformState();
}

export function createInMemoryPlatformStore(seed?: Partial<PlatformStoreState>): PlatformStore {
  const state: PlatformStoreState = {
    ...createEmptyPlatformStore(),
    ...seed
  };

  const replaceById = <T extends { id: string }>(collection: T[], item: T): T[] => {
    const index = collection.findIndex((entry) => entry.id === item.id);
    if (index === -1) {
      return [...collection, item];
    }

    const next = collection.slice();
    next[index] = item;
    return next;
  };

  return {
    get agents() {
      return state.agents;
    },
    get instances() {
      return state.instances;
    },
    get conversations() {
      return state.conversations;
    },
    get messages() {
      return state.messages;
    },
    get warmingProfiles() {
      return state.warmingProfiles;
    },
    get warmingSessions() {
      return state.warmingSessions;
    },
    get warmingMessageLogs() {
      return state.warmingMessageLogs;
    },
    get instanceBlockEvents() {
      return state.instanceBlockEvents;
    },
    get webhookSubscriptions() {
      return state.webhookSubscriptions;
    },
    get webhookDeliveries() {
      return state.webhookDeliveries;
    },
    get metrics() {
      return state.metrics;
    },
    upsertAgent(agent) {
      state.agents = replaceById(state.agents, agent);
      return agent;
    },
    upsertInstance(instance) {
      state.instances = replaceById(state.instances, instance);
      return instance;
    },
    upsertConversation(conversation) {
      state.conversations = replaceById(state.conversations, conversation);
      return conversation;
    },
    appendMessage(message) {
      state.messages = [...state.messages, message];
      return message;
    },
    upsertWarmingProfile(profile) {
      state.warmingProfiles = replaceById(state.warmingProfiles, profile);
      return profile;
    },
    upsertWarmingSession(session) {
      state.warmingSessions = replaceById(state.warmingSessions, session);
      return session;
    },
    appendWarmingMessageLog(entry) {
      state.warmingMessageLogs = [...state.warmingMessageLogs, entry];
      return entry;
    },
    appendInstanceBlockEvent(event) {
      state.instanceBlockEvents = [...state.instanceBlockEvents, event];
      return event;
    },
    upsertWebhookSubscription(subscription) {
      state.webhookSubscriptions = replaceById(state.webhookSubscriptions, subscription);
      return subscription;
    },
    upsertWebhookDelivery(delivery) {
      state.webhookDeliveries = replaceById(state.webhookDeliveries, delivery);
      return delivery;
    },
    appendMetricSnapshot(snapshot) {
      state.metrics = [...state.metrics, snapshot];
      return snapshot;
    }
  };
}

export async function createPersistentPlatformStore(filePath: string, seed?: Partial<PlatformStoreState>): Promise<PersistentPlatformStore> {
  const repository: JsonPlatformRepository = createJsonPlatformRepository(filePath);
  const loaded = await repository.load();
  const state: PlatformStoreState = {
    ...loaded,
    ...seed
  };

  const store = createInMemoryPlatformStore(state) as PersistentPlatformStore;

  store.flush = async () => {
    await repository.save(store.snapshot());
  };

  store.snapshot = () => ({
    agents: store.agents,
    instances: store.instances,
    conversations: store.conversations,
    messages: store.messages,
    warmingProfiles: store.warmingProfiles,
    warmingSessions: store.warmingSessions,
    warmingMessageLogs: store.warmingMessageLogs,
    instanceBlockEvents: store.instanceBlockEvents,
    webhookSubscriptions: store.webhookSubscriptions,
    webhookDeliveries: store.webhookDeliveries,
    metrics: store.metrics
  });

  return store;
}
