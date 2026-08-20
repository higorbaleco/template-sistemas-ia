import type { MetricSnapshot } from "../../../packages/contracts/src/index.js";
import type { PlatformStore } from "../../../packages/contracts/src/store.js";
import { buildMetricSnapshot } from "./webhooks.js";

export function summarizePlatformMetrics(store: PlatformStore): MetricSnapshot[] {
  return [
    buildMetricSnapshot("workspace", "default", "agents.active", store.agents.filter((agent) => agent.active).length),
    buildMetricSnapshot("workspace", "default", "instances.active", store.instances.filter((instance) => instance.lifecycleStatus !== "BLOCKED").length),
    buildMetricSnapshot("workspace", "default", "instances.blocked", store.instances.filter((instance) => instance.lifecycleStatus === "BLOCKED").length),
    buildMetricSnapshot("workspace", "default", "warming.sessions.running", store.warmingSessions.filter((session) => session.status === "running").length),
    buildMetricSnapshot("workspace", "default", "messages.sent_today", store.instances.reduce((sum, instance) => sum + instance.messagesSentToday, 0))
  ];
}
