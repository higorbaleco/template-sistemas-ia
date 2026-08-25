import type { FinancingCapacityInput, FinancingCapacityResult } from "../types/financial";

export function calculateFinancingCapacity(input: FinancingCapacityInput): FinancingCapacityResult {
  const { monthlyPaymentCapacity, monthlyRatePercent, months } = input;
  const monthlyRate = monthlyRatePercent / 100;

  if (months <= 0) {
    return {
      maxPrincipal: 0,
      monthlyPaymentCapacity,
      months,
      monthlyRatePercent,
    };
  }

  if (monthlyRate === 0) {
    return {
      maxPrincipal: monthlyPaymentCapacity * months,
      monthlyPaymentCapacity,
      months,
      monthlyRatePercent,
    };
  }

  const factor = (1 + monthlyRate) ** months;
  const maxPrincipal = monthlyPaymentCapacity * ((factor - 1) / (monthlyRate * factor));

  return {
    maxPrincipal,
    monthlyPaymentCapacity,
    months,
    monthlyRatePercent,
  };
}

