import type { Agent, MetricSnapshot, WhatsAppInstance, WarmingSession } from "../../../packages/contracts/src/index.js";

export interface DashboardSummary {
  activeAgents: number;
  activeInstances: number;
  warmingSessionsRunning: number;
  blockedInstances: number;
  messagesToday: number;
  averageRiskLevel: number;
}

export interface DashboardViewModel {
  summary: DashboardSummary;
  topAgents: Agent[];
  blockedInstances: WhatsAppInstance[];
  runningWarmingSessions: WarmingSession[];
  recentMetrics: MetricSnapshot[];
}

export function buildDashboardSummary(input: {
  agents: Agent[];
  instances: WhatsAppInstance[];
  warmingSessions: WarmingSession[];
  metrics: MetricSnapshot[];
}): DashboardSummary {
  const activeAgents = input.agents.filter((agent) => agent.active).length;
  const activeInstances = input.instances.filter((instance) => instance.lifecycleStatus !== "BLOCKED").length;
  const warmingSessionsRunning = input.warmingSessions.filter((session) => session.status === "running").length;
  const blockedInstances = input.instances.filter((instance) => instance.lifecycleStatus === "BLOCKED").length;
  const messagesToday = input.instances.reduce((sum, instance) => sum + instance.messagesSentToday, 0);
  const averageRiskLevel = input.agents.length > 0
    ? input.agents.reduce((sum, agent) => sum + agent.riskLevel, 0) / input.agents.length
    : 0;

  return {
    activeAgents,
    activeInstances,
    warmingSessionsRunning,
    blockedInstances,
    messagesToday,
    averageRiskLevel: Number(averageRiskLevel.toFixed(3))
  };
}

export function buildDashboardViewModel(input: {
  agents: Agent[];
  instances: WhatsAppInstance[];
  warmingSessions: WarmingSession[];
  metrics: MetricSnapshot[];
}): DashboardViewModel {
  const summary = buildDashboardSummary(input);

  return {
    summary,
    topAgents: [...input.agents].sort((a, b) => b.riskLevel - a.riskLevel).slice(0, 5),
    blockedInstances: input.instances.filter((instance) => instance.lifecycleStatus === "BLOCKED"),
    runningWarmingSessions: input.warmingSessions.filter((session) => session.status === "running"),
    recentMetrics: [...input.metrics].sort((a, b) => b.periodEnd.localeCompare(a.periodEnd)).slice(0, 12)
  };
}
