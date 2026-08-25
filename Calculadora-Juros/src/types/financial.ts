export type RateUnit = "monthly" | "annual";

export type FinancingInput = {
  principal: number;
  monthlyRatePercent: number;
  months: number;
};

export type AmortizationStrategy = "reduce-term" | "reduce-payment";

export type ExtraPaymentInput = {
  balance: number;
  regularPayment: number;
  extraPayment: number;
  monthlyRatePercent: number;
  strategy: AmortizationStrategy;
};

export type CompoundInterestInput = {
  initialAmount: number;
  monthlyContribution: number;
  monthlyRatePercent: number;
  months: number;
};

export type PaymentScheduleItem = {
  month: number;
  payment: number;
  interest: number;
  principalAmortized: number;
  balance: number;
};

export type FinancingResult = {
  principal: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: PaymentScheduleItem[];
};

export type AmortizationResult = {
  months: number;
  totalInterest: number;
  totalPaid: number;
  schedule: PaymentScheduleItem[];
};

export type RateConversionResult = {
  monthlyRatePercent: number;
  annualRatePercent: number;
};

export type FinancingCapacityInput = {
  monthlyPaymentCapacity: number;
  monthlyRatePercent: number;
  months: number;
};

export type FinancingCapacityResult = {
  maxPrincipal: number;
  monthlyPaymentCapacity: number;
  months: number;
  monthlyRatePercent: number;
};

export type CashFlowItem = {
  month: number;
  inflow: number;
  outflow: number;
  net: number;
  balance: number;
};

export type CashFlowInput = {
  startingBalance: number;
  inflow: number;
  outflow: number;
  months: number;
};

export type CashFlowResult = {
  items: CashFlowItem[];
  endingBalance: number;
};

export type WealthProjectionInput = {
  initialCapital: number;
  monthlyContribution: number;
  monthlyRatePercent: number;
  months: number;
};

export type WealthProjectionResult = {
  projectedValue: number;
  totalContributed: number;
  gain: number;
};

export type LeverageComparisonInput = {
  assetPrice: number;
  ownCapital: number;
  monthlyRatePercent: number;
  months: number;
  assetMonthlyReturnPercent: number;
};

export type LeverageComparisonResult = {
  financedCost: number;
  financedAssetValue: number;
  ownCapitalValue: number;
  difference: number;
};

