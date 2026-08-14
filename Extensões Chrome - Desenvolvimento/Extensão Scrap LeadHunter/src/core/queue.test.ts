import { describe, expect, it } from "vitest";
import type { QueueItem } from "./types";
import {
  markQueueError,
  markQueueProcessed,
  markQueueRunning,
  selectNextQueueItem,
  summarizeQueue,
} from "./queue";

function baseQueueItem(overrides: Partial<QueueItem> = {}): QueueItem {
  const now = new Date().toISOString();
  return {
    id: "q_1",
    url: "https://example.com",
    status: "pending",
    extractedLeads: 0,
    attempts: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("queue helpers", () => {
  it("selects the oldest retryable item", () => {
    const a = baseQueueItem({ id: "a", createdAt: "2024-01-01T00:00:00.000Z" });
    const b = baseQueueItem({
      id: "b",
      status: "error",
      attempts: 1,
      createdAt: "2024-01-02T00:00:00.000Z",
    });
    expect(selectNextQueueItem([b, a])?.id).toBe("a");
  });

  it("summarizes queue states", () => {
    const queue = [
      baseQueueItem(),
      baseQueueItem({ id: "b", status: "running", attempts: 1 }),
      baseQueueItem({ id: "c", status: "processed", attempts: 1 }),
      baseQueueItem({ id: "d", status: "error", attempts: 2 }),
    ];
    const summary = summarizeQueue(queue, { isRunning: true, updatedAt: new Date().toISOString() });
    expect(summary.total).toBe(4);
    expect(summary.pending).toBe(1);
    expect(summary.running).toBe(1);
    expect(summary.processed).toBe(1);
    expect(summary.error).toBe(1);
    expect(summary.isRunning).toBe(true);
  });

  it("marks queue item transitions", () => {
    const running = markQueueRunning(baseQueueItem());
    expect(running.status).toBe("running");
    expect(running.attempts).toBe(1);
    const processed = markQueueProcessed(running, 3);
    expect(processed.status).toBe("processed");
    expect(processed.extractedLeads).toBe(3);
    const errored = markQueueError(running, "timeout");
    expect(errored.status).toBe("error");
    expect(errored.lastError).toBe("timeout");
  });
});
