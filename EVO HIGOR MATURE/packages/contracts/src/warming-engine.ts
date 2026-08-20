import type {
  WarmingMode,
  WarmingProfile,
  WarmingSession,
  WarmingSessionParticipant,
  WhatsAppInstance
} from "./index.js";

export interface WarmingProgress {
  startedAt: string;
  now: string;
  messagesExchangedCount: number;
  blockEventsCount: number;
}

export interface WarmingSessionDraft {
  id: string;
  mode: WarmingMode;
  participants: WarmingSessionParticipant[];
  startedAt: string;
  createdAt: string;
  status: WarmingSession["status"];
  messagesExchangedCount: number;
}

export function getElapsedDays(startedAt: string, now: string): number {
  const start = new Date(startedAt).getTime();
  const current = new Date(now).getTime();
  const diff = Math.max(0, current - start);
  return Math.floor(diff / 86_400_000);
}

export function shouldPromoteToReady(profile: WarmingProfile, progress: WarmingProgress): boolean {
  const elapsedDays = getElapsedDays(progress.startedAt, progress.now);
  const meetsDays = elapsedDays >= profile.promoteToReadyDays;
  const meetsMessages = progress.messagesExchangedCount >= profile.promoteToReadyTotalMessages;

  if (profile.promoteToReadyCriteria === "days") {
    return meetsDays;
  }

  if (profile.promoteToReadyCriteria === "total_messages") {
    return meetsMessages;
  }

  return meetsDays || meetsMessages;
}

export function shouldStopSession(profile: WarmingProfile, session: Pick<WarmingSession, "messagesExchangedCount" | "status">, reason?: "block" | "manual"): boolean {
  if (reason === "block" || reason === "manual") {
    return true;
  }

  return session.messagesExchangedCount >= profile.stopAfterNMessages || session.status !== "running";
}

export function pickNextIntervalSeconds(profile: WarmingProfile, dayOffset: number): number {
  const step = [...profile.steps]
    .sort((a, b) => a.stepOrder - b.stepOrder)
    .filter((entry) => entry.dayOffset <= dayOffset)
    .at(-1);

  const min = step?.minIntervalSeconds ?? profile.minIntervalSeconds;
  const max = step?.maxIntervalSeconds ?? profile.maxIntervalSeconds;
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

export function pickWarmingParticipants(instances: WhatsAppInstance[], mode: WarmingMode): WarmingSessionParticipant[] {
  const eligible = instances.filter((instance) => {
    if (instance.lifecycleStatus === "BLOCKED") {
      return false;
    }

    if (instance.connectionStatus !== "connected") {
      return false;
    }

    if (mode === "group") {
      return !instance.excludedFromGroupWarming;
    }

    return true;
  });

  return eligible.slice(0, mode === "private" ? 2 : Math.max(2, eligible.length)).map((instance, index) => ({
    instanceId: instance.id,
    joinOrder: index + 1
  }));
}

export function createWarmingSessionDraft(input: {
  id: string;
  mode: WarmingMode;
  participants: WarmingSessionParticipant[];
  startedAt: string;
}): WarmingSessionDraft {
  return {
    id: input.id,
    mode: input.mode,
    participants: input.participants,
    startedAt: input.startedAt,
    createdAt: input.startedAt,
    status: "running",
    messagesExchangedCount: 0
  };
}

export function buildWarmupGreeting(profile: WarmingProfile, topic?: string): string {
  if (profile.useLlmContent) {
    return topic ? `Falando de ${topic}, seguimos por aqui.` : "Seguimos por aqui, tudo certo.";
  }

  return profile.templateMessages[0] ?? "Tudo certo por aqui.";
}

