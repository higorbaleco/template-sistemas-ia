import type { Agent, MetricSnapshot, WhatsAppInstance, WarmingProfile, WarmingSession } from "../../../packages/contracts/src/index.js";
import { buildDashboardViewModel, type DashboardViewModel } from "./dashboard.js";

export type PanelSection =
  | "dashboard"
  | "agents"
  | "conversations"
  | "groups"
  | "contacts"
  | "webhooks"
  | "metrics"
  | "logs"
  | "integrations"
  | "settings";

export interface PanelRegistry {
  sections: PanelSection[];
  selectedAgent?: Agent | null;
  selectedInstance?: WhatsAppInstance | null;
  selectedProfile?: WarmingProfile | null;
}

export interface WebAppState {
  agents: Agent[];
  instances: WhatsAppInstance[];
  warmingSessions: WarmingSession[];
  metrics: MetricSnapshot[];
}

export function createPanelRegistry(): PanelRegistry {
  return {
    sections: [
      "dashboard",
      "agents",
      "conversations",
      "groups",
      "contacts",
      "webhooks",
      "metrics",
      "logs",
      "integrations",
      "settings"
    ]
  };
}

export function createWebAppViewModel(state: WebAppState): DashboardViewModel {
  return buildDashboardViewModel(state);
}
