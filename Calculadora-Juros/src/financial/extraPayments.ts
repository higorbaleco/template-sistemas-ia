import type { AmortizationResult, ExtraPaymentInput } from "../types/financial";
import { calculateSimpleAmortization } from "./amortization";

export function simulateExtraPayments(input: ExtraPaymentInput): AmortizationResult {
  const base = calculateSimpleAmortization(
    input.balance,
    input.regularPayment,
    input.extraPayment,
    input.monthlyRatePercent,
  );

  if (input.strategy === "reduce-term") {
    return base;
  }

  if (base.months === 0) {
    return base;
  }

  const totalPaid = input.regularPayment * base.months;

  return {
    ...base,
    totalPaid,
  };
}

