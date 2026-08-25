import type { CompoundInterestInput } from "../types/financial";

export function calculateCompoundGrowth(input: CompoundInterestInput): number {
  const { initialAmount, monthlyContribution, monthlyRatePercent, months } = input;
  const monthlyRate = monthlyRatePercent / 100;
  let total = initialAmount;

  for (let month = 0; month < months; month += 1) {
    total = total * (1 + monthlyRate) + monthlyContribution;
  }

  return total;
}

