import { useMemo } from "react";
import { calculateSimpleAmortization } from "../utils/finance";

export function useAmortizationSimulation(
  balance: number,
  monthlyPayment: number,
  extraPayment: number,
  monthlyRatePercent: number,
) {
  return useMemo(
    () => calculateSimpleAmortization(balance, monthlyPayment, extraPayment, monthlyRatePercent),
    [balance, monthlyPayment, extraPayment, monthlyRatePercent],
  );
}

