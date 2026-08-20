export type AgentResponseMode = "manual" | "semi_automatic" | "automatic";

export type ConnectionStatus = "disconnected" | "connecting" | "qr_pending" | "connected";

export type LifecycleStatus = "CONNECTING" | "WARMING" | "READY" | "OPERATIONAL" | "BLOCKED";

export type ChannelKind = "private" | "group";

export type WarmingMode = "private" | "group";

export type WebhookEventType =
  | "agent.created"
  | "agent.updated"
  | "agent.activated"
  | "agent.deactivated"
  | "conversation.opened"
  | "conversation.closed"
  | "group.joined"
  | "group.left"
  | "group.mentioned"
  | "error.raised"
  | "risk.flagged"
  | "instance.connected"
  | "instance.disconnected"
  | "instance.blocked"
  | "instance.warming_started"
  | "instance.warming_completed"
  | "message.received"
  | "message.sent"
  | "webhook.delivery_failed";

export interface Agent {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
  role?: string | null;
  personality: string;
  tone: string;
  writingStyle: string;
  responseLengthPolicy: string;
  language: string;
  timezone: string;
  trainingBase: string;
  knowledgeSources: string[];
  greetingTemplates: string[];
  fallbackTemplates: string[];
  groupBehaviorPolicy: string;
  privateChatPolicy: string;
  mentionOnlyMode: boolean;
  active: boolean;
  riskLevel: number;
  llmProvider: string;
  llmModel: string;
  llmApiKeyRef: string;
  temperature: number;
  maxTokens: number;
  memoryWindow: number;
  memoryPolicy: string;
  allowedChannels: ChannelKind[];
  blockedChannels: ChannelKind[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppInstance {
  id: string;
  phoneNumber: string;
  label: string;
  sessionRef: string;
  connectionStatus: ConnectionStatus;
  connectionUpdatedAt: string;
  lifecycleStatus: LifecycleStatus;
  lifecycleUpdatedAt: string;
  linkedAgentId?: string | null;
  warmingProfileId?: string | null;
  warmingStartedAt?: string | null;
  warmingCompletedAt?: string | null;
  dailyMessageLimitTarget: number;
  dailyMessageLimitCurrent: number;
  messagesSentToday: number;
  messagesSentTotal: number;
  lastResetAt: string;
  excludedFromGroupWarming: boolean;
  riskScore: number;
  createdAt: string;
  createdByUserId?: string | null;
  deletedAt?: string | null;
}

export interface Conversation {
  id: string;
  channelKind: ChannelKind;
  channelId: string;
  title?: string | null;
  agentId?: string | null;
  instanceId?: string | null;
  paused: boolean;
  sensitive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  direction: "inbound" | "outbound";
  content: string;
  contentPreview: string;
  authorId?: string | null;
  agentId?: string | null;
  instanceId?: string | null;
  sentAt: string;
  createdAt: string;
}

export interface WarmingProfileStep {
  stepOrder: number;
  dayOffset: number;
  maxMessagesPerDay: number;
  minIntervalSeconds?: number | null;
  maxIntervalSeconds?: number | null;
}

export interface WarmingProfile {
  id: string;
  name: string;
  workspaceId: string;
  steps: WarmingProfileStep[];
  promoteToReadyCriteria: "days" | "total_messages" | "either";
  promoteToReadyDays: number;
  promoteToReadyTotalMessages: number;
  switchPartnerAfterNMessages: number;
  stopAfterNMessages: number;
  useLlmContent: boolean;
  templateMessages: string[];
  minIntervalSeconds: number;
  maxIntervalSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface WarmingSessionParticipant {
  instanceId: string;
  joinOrder: number;
}

export interface WarmingSession {
  id: string;
  mode: WarmingMode;
  status: "running" | "completed" | "stopped_by_limit" | "stopped_by_block" | "stopped_manually";
  stopReason?: string | null;
  participants: WarmingSessionParticipant[];
  startedAt: string;
  endedAt?: string | null;
  messagesExchangedCount: number;
  createdAt: string;
}

export interface WarmingMessageLog {
  id: string;
  warmingSessionId: string;
  fromInstanceId: string;
  toInstanceId?: string | null;
  toGroupId?: string | null;
  content: string;
  contentSource: "template" | "llm_generated";
  llmModelUsed?: string | null;
  sentAt: string;
  deliveryStatus: "pending" | "sent" | "failed" | "timeout";
  deliveryErrorCode?: string | null;
  intervalSinceLastMs: number;
  createdAt: string;
}

export interface InstanceBlockEvent {
  id: string;
  instanceId: string;
  detectedAt: string;
  detectionSource: "disconnect_code" | "send_error" | "manual" | "heuristic";
  rawSignal: Record<string, unknown>;
  actionTaken: "session_stopped" | "instance_marked_blocked" | "alert_raised";
  triggeredByUserId?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  secretRef: string;
  eventTypes: WebhookEventType[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventType: WebhookEventType;
  payload: Record<string, unknown>;
  status: "pending" | "delivered" | "failed";
  attempts: number;
  lastAttemptAt?: string | null;
  nextRetryAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MetricSnapshot {
  id: string;
  scopeType: "workspace" | "agent" | "instance" | "conversation";
  scopeId: string;
  metricKey: string;
  metricValue: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface WarmingEligibility {
  canRespond: boolean;
  reason: string;
}

export function canAgentRespond(agent: Pick<Agent, "active" | "allowedChannels" | "blockedChannels">, instance: Pick<WhatsAppInstance, "lifecycleStatus">, channel: ChannelKind): WarmingEligibility {
  if (!agent.active) {
    return { canRespond: false, reason: "agent_inactive" };
  }

  if (!agent.allowedChannels.includes(channel) || agent.blockedChannels.includes(channel)) {
    return { canRespond: false, reason: "channel_not_allowed" };
  }

  if (instance.lifecycleStatus !== "READY" && instance.lifecycleStatus !== "OPERATIONAL") {
    return { canRespond: false, reason: `instance_${instance.lifecycleStatus.toLowerCase()}` };
  }

  return { canRespond: true, reason: "ok" };
}

export function selectWarmingLimit(profile: WarmingProfile, dayOffset: number): number {
  const step = [...profile.steps]
    .sort((a, b) => a.stepOrder - b.stepOrder)
    .filter((entry) => entry.dayOffset <= dayOffset)
    .at(-1);
  return step?.maxMessagesPerDay ?? profile.promoteToReadyTotalMessages;
}

export function calculateAgentRiskLevel(input: {
  instanceRiskScore: number;
  recentErrorRate: number;
  blockEventsCount7d: number;
  daysSinceConnection: number;
}): number {
  const raw = (
    0.4 * input.instanceRiskScore +
    0.3 * input.recentErrorRate +
    0.2 * Math.min(1, input.blockEventsCount7d / 5) +
    0.1 * (1 - Math.min(1, input.daysSinceConnection / 30))
  );

  return Math.max(0, Math.min(1, Number(raw.toFixed(4))));
}

export function defaultConservativeWarmingProfile(now: string): WarmingProfile {
  return {
    id: "default-conservative",
    name: "Conservative 7 Day Ramp",
    workspaceId: "default",
    steps: [
      { stepOrder: 0, dayOffset: 0, maxMessagesPerDay: 5, minIntervalSeconds: 30, maxIntervalSeconds: 120 },
      { stepOrder: 1, dayOffset: 2, maxMessagesPerDay: 10, minIntervalSeconds: 30, maxIntervalSeconds: 120 },
      { stepOrder: 2, dayOffset: 4, maxMessagesPerDay: 20, minIntervalSeconds: 30, maxIntervalSeconds: 120 },
      { stepOrder: 3, dayOffset: 6, maxMessagesPerDay: 30, minIntervalSeconds: 30, maxIntervalSeconds: 120 }
    ],
    promoteToReadyCriteria: "days",
    promoteToReadyDays: 7,
    promoteToReadyTotalMessages: 80,
    switchPartnerAfterNMessages: 10,
    stopAfterNMessages: 50,
    useLlmContent: true,
    templateMessages: [
      "E ai, tudo certo por aqui?",
      "Passando so para manter o papo vivo.",
      "Hoje ta corrido, mas sigo na area."
    ],
    minIntervalSeconds: 30,
    maxIntervalSeconds: 120,
    createdAt: now,
    updatedAt: now
  };
}

export function isOperationalLifecycle(status: LifecycleStatus): boolean {
  return status === "READY" || status === "OPERATIONAL";
}

export function isTerminalLifecycle(status: LifecycleStatus): boolean {
  return status === "BLOCKED";
}

export function summarizeConversationMessage(content: string, maxLength = 120): string {
  const normalized = content.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export { buildBlockEvent } from "./blocking.js";
export {
  buildWarmupGreeting,
  createWarmingSessionDraft,
  getElapsedDays,
  pickNextIntervalSeconds,
  pickWarmingParticipants,
  shouldPromoteToReady,
  shouldStopSession
} from "./warming-engine.js";
