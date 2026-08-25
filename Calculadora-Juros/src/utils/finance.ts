import {
  calculateCompoundGrowth as calculateCompoundGrowthCore,
  calculatePriceFinancing as calculatePriceFinancingCore,
  calculateSimpleAmortization as calculateSimpleAmortizationCore,
} from "../financial";
import type {
  AmortizationResult,
  CompoundInterestInput,
  FinancingInput,
  FinancingResult,
} from "../types/financial";

export type { AmortizationResult, FinancingResult } from "../types/financial";

export function calculatePriceFinancing(
  principal: number,
  monthlyRatePercent: number,
  months: number,
): FinancingResult {
  return calculatePriceFinancingCore({
    principal,
    monthlyRatePercent,
    months,
  } satisfies FinancingInput);
}

export function calculateSimpleAmortization(
  balance: number,
  monthlyPayment: number,
  extraPayment: number,
  monthlyRatePercent: number,
): AmortizationResult {
  return calculateSimpleAmortizationCore(balance, monthlyPayment, extraPayment, monthlyRatePercent);
}

export function calculateCompoundGrowth(
  initial: number,
  monthlyContribution: number,
  monthlyRatePercent: number,
  months: number,
): number {
  return calculateCompoundGrowthCore({
    initialAmount: initial,
    monthlyContribution,
    monthlyRatePercent,
    months,
  } satisfies CompoundInterestInput);
}

