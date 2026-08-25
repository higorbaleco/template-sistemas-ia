import type { RateConversionResult } from "../types/financial";

export function monthlyToAnnualRate(monthlyRatePercent: number): number {
  const monthlyRate = monthlyRatePercent / 100;
  return ((1 + monthlyRate) ** 12 - 1) * 100;
}

export function annualToMonthlyRate(annualRatePercent: number): number {
  const annualRate = annualRatePercent / 100;
  return ((1 + annualRate) ** (1 / 12) - 1) * 100;
}

export function convertRate(ratePercent: number, from: "monthly" | "annual", to: "monthly" | "annual"): number {
  if (from === to) {
    return ratePercent;
  }

  return from === "monthly" ? monthlyToAnnualRate(ratePercent) : annualToMonthlyRate(ratePercent);
}

export function getRateConversion(monthlyRatePercent: number): RateConversionResult {
  return {
    monthlyRatePercent,
    annualRatePercent: monthlyToAnnualRate(monthlyRatePercent),
  };
}

