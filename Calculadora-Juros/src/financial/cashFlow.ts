import type { CashFlowInput, CashFlowResult } from "../types/financial";

export function simulateCashFlow(input: CashFlowInput): CashFlowResult {
  const items = [];
  let balance = input.startingBalance;

  for (let month = 1; month <= input.months; month += 1) {
    const net = input.inflow - input.outflow;
    balance += net;
    items.push({
      month,
      inflow: input.inflow,
      outflow: input.outflow,
      net,
      balance,
    });
  }

  return {
    items,
    endingBalance: balance,
  };
}

