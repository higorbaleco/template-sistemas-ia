import type {
  Agent,
  Conversation,
  MetricSnapshot,
  Message,
  WebhookSubscription,
  WhatsAppInstance,
  WarmingProfile,
  WarmingSession
} from "../../../packages/contracts/src/index.js";
import { defaultConservativeWarmingProfile } from "../../../packages/contracts/src/index.js";
import type { PersistentPlatformStore, PlatformStore } from "../../../packages/contracts/src/store.js";
import { summarizePlatformMetrics } from "./metrics.js";

export async function seedDemoState(store: PlatformStore | PersistentPlatformStore) {
  if (store.agents.length > 0 || store.instances.length > 0) {
    return false;
  }

  const now = new Date().toISOString();
  const profile = defaultConservativeWarmingProfile(now);

  const agents: Agent[] = [
    {
      id: "agent_nina",
      name: "Nina Vale",
      username: "nina.vale",
      avatar: null,
      role: "relacionamento",
      personality: "calma, direta e calorosa",
      tone: "humano e preciso",
      writingStyle: "frases curtas com linguagem natural",
      responseLengthPolicy: "curta",
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
      trainingBase: "Base de boas-vindas e respostas de relacionamento",
      knowledgeSources: ["FAQ comercial", "scripts de suporte"],
      greetingTemplates: ["Oi, tudo certo por ai?", "Passando para ajudar rapidinho."],
      fallbackTemplates: ["Me confirma esse ponto?", "Deixa eu revisar isso rapidinho."],
      groupBehaviorPolicy: "responder apenas quando mencionada",
      privateChatPolicy: "responder com objetividade",
      mentionOnlyMode: true,
      active: true,
      riskLevel: 0.18,
      llmProvider: "openai",
      llmModel: "gpt-4o-mini",
      llmApiKeyRef: "env:OPENAI_API_KEY",
      temperature: 0.4,
      maxTokens: 320,
      memoryWindow: 20,
      memoryPolicy: "persistir apenas preferencias e contexto recente",
      allowedChannels: ["private", "group"],
      blockedChannels: [],
      tags: ["demo", "principal"],
      createdAt: now,
      updatedAt: now
    },
    {
      id: "agent_caio",
      name: "Caio Norte",
      username: "caio.norte",
      avatar: null,
      role: "aquecimento",
      personality: "leve, social e espontaneo",
      tone: "descontraido",
      writingStyle: "mensagens curtas com variacao",
      responseLengthPolicy: "curta",
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
      trainingBase: "Conversas de aquecimento e humanidade controlada",
      knowledgeSources: ["roteiros de aquecimento"],
      greetingTemplates: ["E ai, como ta por ai?", "Tudo certo, seguimos na area."],
      fallbackTemplates: ["Pode ser", "Fechou, entendi"],
      groupBehaviorPolicy: "aguardar mencao",
      privateChatPolicy: "aceitar conversas leves",
      mentionOnlyMode: true,
      active: false,
      riskLevel: 0.11,
      llmProvider: "anthropic",
      llmModel: "claude-3-5-sonnet",
      llmApiKeyRef: "env:ANTHROPIC_API_KEY",
      temperature: 0.55,
      maxTokens: 260,
      memoryWindow: 12,
      memoryPolicy: "somente contexto atual",
      allowedChannels: ["private", "group"],
      blockedChannels: [],
      tags: ["warming"],
      createdAt: now,
      updatedAt: now
    }
  ];

  const instances: WhatsAppInstance[] = [
    {
      id: "instance_01",
      phoneNumber: "+55 11 99999-0001",
      label: "Operacional A",
      sessionRef: "session:instance_01",
      connectionStatus: "connected",
      connectionUpdatedAt: now,
      lifecycleStatus: "OPERATIONAL",
      lifecycleUpdatedAt: now,
      linkedAgentId: "agent_nina",
      warmingProfileId: profile.id,
      warmingStartedAt: null,
      warmingCompletedAt: null,
      dailyMessageLimitTarget: 30,
      dailyMessageLimitCurrent: 30,
      messagesSentToday: 11,
      messagesSentTotal: 421,
      lastResetAt: now.slice(0, 10),
      excludedFromGroupWarming: false,
      riskScore: 0.14,
      createdAt: now,
      createdByUserId: null,
      deletedAt: null
    },
    {
      id: "instance_02",
      phoneNumber: "+55 11 99999-0002",
      label: "Warming B",
      sessionRef: "session:instance_02",
      connectionStatus: "connected",
      connectionUpdatedAt: now,
      lifecycleStatus: "WARMING",
      lifecycleUpdatedAt: now,
      linkedAgentId: null,
      warmingProfileId: profile.id,
      warmingStartedAt: now,
      warmingCompletedAt: null,
      dailyMessageLimitTarget: 30,
      dailyMessageLimitCurrent: 10,
      messagesSentToday: 4,
      messagesSentTotal: 38,
      lastResetAt: now.slice(0, 10),
      excludedFromGroupWarming: false,
      riskScore: 0.33,
      createdAt: now,
      createdByUserId: null,
      deletedAt: null
    }
  ];

  const conversations: Conversation[] = [
    {
      id: "conv_private_01",
      channelKind: "private",
      channelId: "5511999991111",
      title: "Lead - Maria",
      agentId: "agent_nina",
      instanceId: "instance_01",
      paused: false,
      sensitive: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: "conv_group_01",
      channelKind: "group",
      channelId: "5511999992222-123456@g.us",
      title: "Clube VIP",
      agentId: "agent_nina",
      instanceId: "instance_01",
      paused: false,
      sensitive: false,
      createdAt: now,
      updatedAt: now
    }
  ];

  const messages: Message[] = [
    {
      id: "msg_1",
      conversationId: "conv_private_01",
      direction: "inbound",
      content: "Oi, queria entender melhor o fluxo.",
      contentPreview: "Oi, queria entender melhor o fluxo.",
      authorId: "contact_maria",
      agentId: null,
      instanceId: null,
      sentAt: now,
      createdAt: now
    },
    {
      id: "msg_2",
      conversationId: "conv_private_01",
      direction: "outbound",
      content: "Claro, te explico rapidinho.",
      contentPreview: "Claro, te explico rapidinho.",
      authorId: null,
      agentId: "agent_nina",
      instanceId: "instance_01",
      sentAt: now,
      createdAt: now
    }
  ];

  const sessions: WarmingSession[] = [
    {
      id: "warming_session_01",
      mode: "private",
      status: "running",
      stopReason: null,
      participants: [
        { instanceId: "instance_01", joinOrder: 1 },
        { instanceId: "instance_02", joinOrder: 2 }
      ],
      startedAt: now,
      endedAt: null,
      messagesExchangedCount: 14,
      createdAt: now
    }
  ];

  const subscription: WebhookSubscription = {
    id: "webhook_01",
    url: "https://example.com/webhooks/whatsapp",
    secretRef: "env:WEBHOOK_SECRET",
    eventTypes: ["agent.created", "message.received", "instance.blocked"],
    active: true,
    createdAt: now,
    updatedAt: now
  };

  for (const agent of agents) {
    store.upsertAgent(agent);
  }

  for (const instance of instances) {
    store.upsertInstance(instance);
  }

  for (const conversation of conversations) {
    store.upsertConversation(conversation);
  }

  for (const message of messages) {
    store.appendMessage(message);
  }

  for (const session of sessions) {
    store.upsertWarmingSession(session);
  }

  store.upsertWarmingProfile(profile);
  store.upsertWebhookSubscription(subscription);

  for (const metric of summarizePlatformMetrics(store)) {
    store.appendMetricSnapshot(metric);
  }

  if ("flush" in store) {
    await store.flush();
  }
  return true;
}
