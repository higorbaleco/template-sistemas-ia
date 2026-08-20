import type { InstanceBlockEvent, WhatsAppInstance, WarmingMessageLog, WarmingProfile, WarmingSession } from "../../../packages/contracts/src/index.js";
import { buildBlockEvent, createWarmingSessionDraft, defaultConservativeWarmingProfile, isOperationalLifecycle, pickNextIntervalSeconds, pickWarmingParticipants, shouldPromoteToReady, shouldStopSession } from "../../../packages/contracts/src/index.js";
import type { PlatformStore } from "../../../packages/contracts/src/store.js";

export interface WarmupRunResult {
  session: WarmingSession;
  messageLog?: WarmingMessageLog | null;
  blockEvent?: InstanceBlockEvent | null;
}

export class WarmingService {
  constructor(private readonly store: PlatformStore) {}

  ensureProfile(profile?: WarmingProfile | null): WarmingProfile {
    return profile ?? defaultConservativeWarmingProfile(new Date().toISOString());
  }

  canLinkAgent(instance: WhatsAppInstance): boolean {
    return isOperationalLifecycle(instance.lifecycleStatus);
  }

  startSession(mode: "private" | "group") {
    const participants = pickWarmingParticipants(this.store.instances, mode);
    const startedAt = new Date().toISOString();
    const session = createWarmingSessionDraft({
      id: `warming_${Date.now()}`,
      mode,
      participants,
      startedAt
    });

    this.store.upsertWarmingSession({
      ...session,
      stopReason: null,
      endedAt: null
    });

    for (const participant of participants) {
      const instance = this.store.instances.find((entry) => entry.id === participant.instanceId);

      if (!instance) {
        continue;
      }

      this.store.upsertInstance({
        ...instance,
        lifecycleStatus: "WARMING",
        lifecycleUpdatedAt: startedAt,
        warmingStartedAt: instance.warmingStartedAt ?? startedAt,
        warmingProfileId: instance.warmingProfileId ?? this.store.warmingProfiles[0]?.id ?? null
      });
    }

    return session;
  }

  registerSyntheticTurn(sessionId: string, content: string, fromInstanceId: string, toInstanceId?: string | null): WarmupRunResult {
    const now = new Date().toISOString();
    const session = this.store.warmingSessions.find((entry) => entry.id === sessionId);

    if (!session) {
      throw new Error(`warming_session_not_found:${sessionId}`);
    }

    const profile = this.ensureProfile(this.store.warmingProfiles[0]);
    const fromInstance = this.store.instances.find((entry) => entry.id === fromInstanceId);

    if (!fromInstance) {
      throw new Error(`instance_not_found:${fromInstanceId}`);
    }

    if (fromInstance.messagesSentToday >= fromInstance.dailyMessageLimitCurrent) {
      throw new Error(`daily_limit_reached:${fromInstanceId}`);
    }

    const dayOffset = 0;
    const intervalSeconds = pickNextIntervalSeconds(profile, dayOffset);
    const messageLog: WarmingMessageLog = {
      id: `warming_msg_${Date.now()}`,
      warmingSessionId: sessionId,
      fromInstanceId,
      toInstanceId: toInstanceId ?? null,
      toGroupId: null,
      content,
      contentSource: profile.useLlmContent ? "llm_generated" : "template",
      llmModelUsed: profile.useLlmContent ? "default" : null,
      sentAt: now,
      deliveryStatus: "sent",
      deliveryErrorCode: null,
      intervalSinceLastMs: intervalSeconds * 1000,
      createdAt: now
    };

    const updatedSession: WarmingSession = {
      ...session,
      messagesExchangedCount: session.messagesExchangedCount + 1
    };

    this.store.appendWarmingMessageLog(messageLog);
    this.store.upsertWarmingSession(updatedSession);

    this.store.upsertInstance({
      ...fromInstance,
      messagesSentToday: fromInstance.messagesSentToday + 1,
      messagesSentTotal: fromInstance.messagesSentTotal + 1,
      lifecycleUpdatedAt: now
    });

    const maybePromote = shouldPromoteToReady(profile, {
      startedAt: session.startedAt,
      now,
      messagesExchangedCount: updatedSession.messagesExchangedCount,
      blockEventsCount: 0
    });

    if (maybePromote) {
      this.store.upsertWarmingSession({
        ...updatedSession,
        status: "completed",
        endedAt: now,
        stopReason: "ready"
      });

      for (const participant of session.participants) {
        const instance = this.store.instances.find((entry) => entry.id === participant.instanceId);

        if (!instance) {
          continue;
        }

        this.store.upsertInstance({
          ...instance,
          lifecycleStatus: "READY",
          lifecycleUpdatedAt: now,
          warmingCompletedAt: now
        });
      }
    }

    if (shouldStopSession(profile, updatedSession)) {
      this.store.upsertWarmingSession({
        ...updatedSession,
        status: "completed",
        endedAt: now,
        stopReason: "limit_reached"
      });
    }

    return {
      session: this.store.warmingSessions.find((entry) => entry.id === sessionId) ?? updatedSession,
      messageLog
    };
  }

  registerBlock(instanceId: string, source: InstanceBlockEvent["detectionSource"], rawSignal: Record<string, unknown>, notes?: string) {
    const event = buildBlockEvent(instanceId, source, rawSignal, notes);
    this.store.appendInstanceBlockEvent(event);
    const instance = this.store.instances.find((entry) => entry.id === instanceId);

    if (!instance) {
      throw new Error(`instance_not_found:${instanceId}`);
    }

    this.store.upsertInstance({
      ...instance,
      lifecycleStatus: "BLOCKED",
      lifecycleUpdatedAt: event.detectedAt
    });
    return event;
  }
}
