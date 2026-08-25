import { useMemo } from "react";
import { saveComparison } from "../services/comparison";
import type { SimulationComparison } from "../types/simulation";

export function useComparison(leftValue: number, rightValue: number, label: string) {
  const comparison = useMemo<SimulationComparison>(
    () => ({
      leftId: "left",
      rightId: "right",
      label,
      difference: rightValue - leftValue,
    }),
    [label, leftValue, rightValue],
  );

  const persistComparison = () => saveComparison(comparison);

  return {
    comparison,
    persistComparison,
  };
}

