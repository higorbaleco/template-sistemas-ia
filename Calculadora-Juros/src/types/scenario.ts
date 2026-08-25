import type { SimulationSnapshot } from "./simulation";

export type Scenario = {
  id: string;
  name: string;
  description: string;
  simulations: SimulationSnapshot[];
  createdAt: string;
  updatedAt: string;
};

