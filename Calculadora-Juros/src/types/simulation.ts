export type SimulationKind =
  | "financing"
  | "amortization"
  | "compound"
  | "buy-vs-save"
  | "scenarios"
  | "history"
  | "settings";

export type SimulationSnapshot = {
  id: string;
  kind: SimulationKind;
  title: string;
  inputs: Record<string, number | string | boolean>;
  summary: Record<string, number>;
  createdAt: string;
  updatedAt: string;
};

export type SimulationComparison = {
  leftId: string;
  rightId: string;
  label: string;
  difference: number;
};

