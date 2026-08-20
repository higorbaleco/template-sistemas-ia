import type { InstanceBlockEvent, WhatsAppInstance } from "../../../packages/contracts/src/index.js";
import { buildBlockEvent as createBlockEvent, isOperationalLifecycle } from "../../../packages/contracts/src/index.js";

export interface ConnectorHealth {
  connected: boolean;
  reconnecting: boolean;
  lastError?: string | null;
}

export interface ConnectorDecision {
  shouldReconnect: boolean;
  shouldMarkBlocked: boolean;
  reason: string;
}

export function evaluateConnectorState(instance: WhatsAppInstance, health: ConnectorHealth): ConnectorDecision {
  if (!health.connected && instance.connectionStatus === "connected") {
    return {
      shouldReconnect: true,
      shouldMarkBlocked: false,
      reason: "connection_lost"
    };
  }

  if (health.lastError?.includes("logged out") || health.lastError?.includes("403")) {
    return {
      shouldReconnect: false,
      shouldMarkBlocked: true,
      reason: "possible_block"
    };
  }

  return {
    shouldReconnect: health.reconnecting,
    shouldMarkBlocked: false,
    reason: "ok"
  };
}

export function shouldContinueWarmup(instance: WhatsAppInstance): boolean {
  return instance.connectionStatus === "connected" && !isOperationalLifecycle(instance.lifecycleStatus);
}

export function createConnectorBlockEvent(instanceId: string, source: InstanceBlockEvent["detectionSource"], rawSignal: Record<string, unknown>, notes?: string): InstanceBlockEvent {
  return createBlockEvent(instanceId, source, rawSignal, notes);
}
