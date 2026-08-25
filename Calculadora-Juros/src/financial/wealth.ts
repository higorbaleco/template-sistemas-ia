import type { WealthProjectionInput, WealthProjectionResult } from "../types/financial";
import { calculateCompoundGrowth } from "./compoundInterest";

export function projectWealth(input: WealthProjectionInput): WealthProjectionResult {
  const projectedValue = calculateCompoundGrowth({
    initialAmount: input.initialCapital,
    monthlyContribution: input.monthlyContribution,
    monthlyRatePercent: input.monthlyRatePercent,
    months: input.months,
  });

  const totalContributed = input.initialCapital + input.monthlyContribution * input.months;

  return {
    projectedValue,
    totalContributed,
    gain: projectedValue - totalContributed,
  };
}

