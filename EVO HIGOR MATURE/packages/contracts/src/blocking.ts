import type { InstanceBlockEvent } from "./index.js";

export function buildBlockEvent(instanceId: string, source: InstanceBlockEvent["detectionSource"], rawSignal: Record<string, unknown>, notes?: string): InstanceBlockEvent {
  const now = new Date().toISOString();

  return {
    id: `block_${instanceId}_${Date.now()}`,
    instanceId,
    detectedAt: now,
    detectionSource: source,
    rawSignal,
    actionTaken: "session_stopped",
    notes: notes ?? null,
    createdAt: now
  };
}

