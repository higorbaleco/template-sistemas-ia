import { getStorageItem, setStorageItem } from "./storage/localStorage";
import { storageKeys } from "./storage/keys";
import type { SimulationComparison } from "../types/simulation";

export function readComparisons(): SimulationComparison[] {
  return getStorageItem<SimulationComparison[]>(storageKeys.comparisons, []);
}

export function saveComparison(comparison: SimulationComparison): SimulationComparison[] {
  const comparisons = readComparisons();
  const next = [comparison, ...comparisons.filter((item) => item.label !== comparison.label)];
  setStorageItem(storageKeys.comparisons, next);
  return next;
}

