import { getStorageItem, setStorageItem } from "./storage/localStorage";
import { storageKeys } from "./storage/keys";
import type { Scenario } from "../types/scenario";
import type { SimulationSnapshot } from "../types/simulation";

export function readSimulationHistory(): SimulationSnapshot[] {
  return getStorageItem<SimulationSnapshot[]>(storageKeys.history, []);
}

export function saveSimulationSnapshot(snapshot: SimulationSnapshot): SimulationSnapshot[] {
  const history = readSimulationHistory();
  const next = [snapshot, ...history.filter((item) => item.id !== snapshot.id)].slice(0, 50);
  setStorageItem(storageKeys.history, next);
  return next;
}

export function readScenarios(): Scenario[] {
  return getStorageItem<Scenario[]>(storageKeys.scenarios, []);
}

export function saveScenario(scenario: Scenario): Scenario[] {
  const scenarios = readScenarios();
  const next = [scenario, ...scenarios.filter((item) => item.id !== scenario.id)];
  setStorageItem(storageKeys.scenarios, next);
  return next;
}

