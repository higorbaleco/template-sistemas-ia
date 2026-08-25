import { useMemo } from "react";
import { calculatePriceFinancing } from "../utils/finance";

export function useFinancingSimulation(principal: number, monthlyRatePercent: number, months: number) {
  return useMemo(
    () =>
      calculatePriceFinancing(principal, monthlyRatePercent, months),
    [principal, monthlyRatePercent, months],
  );
}

