import type { FinancingInput, FinancingResult, PaymentScheduleItem } from "../types/financial";

export function calculateSacFinancing(input: FinancingInput): FinancingResult {
  const { principal, monthlyRatePercent, months } = input;
  const monthlyRate = monthlyRatePercent / 100;

  if (months <= 0) {
    return { principal, monthlyPayment: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
  }

  const amortization = principal / months;
  const schedule: PaymentScheduleItem[] = [];
  let balance = principal;
  let totalPayment = 0;
  let totalInterest = 0;
  let firstPayment = 0;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    const payment = amortization + interest;
    balance = Math.max(0, balance - amortization);
    totalPayment += payment;
    totalInterest += interest;

    if (month === 1) {
      firstPayment = payment;
    }

    schedule.push({
      month,
      payment,
      interest,
      principalAmortized: amortization,
      balance,
    });
  }

  return {
    principal,
    monthlyPayment: firstPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

