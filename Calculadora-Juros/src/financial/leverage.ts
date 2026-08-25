import type { LeverageComparisonInput, LeverageComparisonResult } from "../types/financial";
import { calculateFutureValue } from "./futureValue";
import { calculatePriceFinancing } from "./price";

export function compareLeverage(input: LeverageComparisonInput): LeverageComparisonResult {
  const financedCost = calculatePriceFinancing({
    principal: input.assetPrice - input.ownCapital,
    monthlyRatePercent: input.monthlyRatePercent,
    months: input.months,
  }).totalPayment;

  const financedAssetValue = calculateFutureValue(
    input.assetPrice,
    input.assetMonthlyReturnPercent,
    input.months,
  );

  const ownCapitalValue = calculateFutureValue(
    input.ownCapital,
    input.assetMonthlyReturnPercent,
    input.months,
  );

  return {
    financedCost,
    financedAssetValue,
    ownCapitalValue,
    difference: financedAssetValue - financedCost - ownCapitalValue,
  };
}

