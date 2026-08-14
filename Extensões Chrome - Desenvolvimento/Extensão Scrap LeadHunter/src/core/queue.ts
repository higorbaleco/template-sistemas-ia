import type { QueueItem, QueueRunState } from "./types";
import { nowIso } from "./time";

export const MAX_QUEUE_ATTEMPTS = 3;

export type QueueSummary = {
  total: number;
  pending: number;
  running: number;
  processed: number;
  error: number;
  active: number;
  isRunning: boolean;
  currentQueueId?: string;
};

export function normalizeQueueItem(anyItem: any): QueueItem | null {
  if (!anyItem || typeof anyItem.url !== "string") return null;
  const status = ["pending", "running", "processed", "error"].includes(anyItem.status)
    ? anyItem.status
    : "pending";
  const now = nowIso();
  return {
    id: String(anyItem.id || `q_${Date.now().toString(16)}`),
    url: anyItem.url,
    platform: typeof anyItem.platform === "string" ? anyItem.platform : undefined,
    status,
    lastError: typeof anyItem.lastError === "string" ? anyItem.lastError : undefined,
    extractedLeads: Number.isFinite(Number(anyItem.extractedLeads)) ? Number(anyItem.extractedLeads) : 0,
    attempts: Number.isFinite(Number(anyItem.attempts)) ? Number(anyItem.attempts) : 0,
    startedAt: typeof anyItem.startedAt === "string" ? anyItem.startedAt : undefined,
    processedAt: typeof anyItem.processedAt === "string" ? anyItem.processedAt : undefined,
    createdAt: typeof anyItem.createdAt === "string" ? anyItem.createdAt : now,
    updatedAt: typeof anyItem.updatedAt === "string" ? anyItem.updatedAt : now,
  };
}

export function normalizeQueueState(anyState: any): QueueRunState {
  return {
    isRunning: Boolean(anyState?.isRunning),
    currentQueueId: typeof anyState?.currentQueueId === "string" ? anyState.currentQueueId : undefined,
    currentTabId: Number.isFinite(Number(anyState?.currentTabId)) ? Number(anyState.currentTabId) : undefined,
    startedAt: typeof anyState?.startedAt === "string" ? anyState.startedAt : undefined,
    updatedAt: typeof anyState?.updatedAt === "string" ? anyState.updatedAt : nowIso(),
  };
}

export function summarizeQueue(queue: QueueItem[], state?: QueueRunState): QueueSummary {
  const summary: QueueSummary = {
    total: 0,
    pending: 0,
    running: 0,
    processed: 0,
    error: 0,
    active: 0,
    isRunning: Boolean(state?.isRunning),
    currentQueueId: state?.currentQueueId,
  };
  for (const item of queue) {
    summary.total += 1;
    if (item.status === "pending") summary.pending += 1;
    else if (item.status === "running") summary.running += 1;
    else if (item.status === "processed") summary.processed += 1;
    else if (item.status === "error") summary.error += 1;
    if (item.status === "pending" || item.status === "running" || item.status === "error") {
      summary.active += 1;
    }
  }
  return summary;
}

export function selectNextQueueItem(queue: QueueItem[]): QueueItem | null {
  const candidates = queue.filter(
    (item) =>
      (item.status === "pending" || item.status === "error") && (item.attempts || 0) < MAX_QUEUE_ATTEMPTS,
  );
  candidates.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.updatedAt.localeCompare(b.updatedAt));
  return candidates[0] ?? null;
}

export function markQueueRunning(item: QueueItem): QueueItem {
  const now = nowIso();
  return {
    ...item,
    status: "running",
    attempts: (item.attempts || 0) + 1,
    startedAt: now,
    updatedAt: now,
    lastError: undefined,
  };
}

export function markQueueProcessed(item: QueueItem, extractedLeads: number): QueueItem {
  const now = nowIso();
  return {
    ...item,
    status: "processed",
    extractedLeads: Math.max(item.extractedLeads || 0, extractedLeads || 0),
    processedAt: now,
    updatedAt: now,
    lastError: undefined,
  };
}

export function markQueueError(item: QueueItem, lastError: string): QueueItem {
  const now = nowIso();
  return {
    ...item,
    status: "error",
    lastError,
    updatedAt: now,
  };
}

export function resetRunningQueueItem(item: QueueItem): QueueItem {
  if (item.status !== "running") return item;
  const now = nowIso();
  return {
    ...item,
    status: "pending",
    lastError: "Interrupted before completion.",
    updatedAt: now,
  };
}

export function resetErrorQueueItem(item: QueueItem): QueueItem {
  if (item.status !== "error") return item;
  const now = nowIso();
  return {
    ...item,
    status: "pending",
    attempts: 0,
    extractedLeads: 0,
    startedAt: undefined,
    processedAt: undefined,
    lastError: undefined,
    updatedAt: now,
  };
}
