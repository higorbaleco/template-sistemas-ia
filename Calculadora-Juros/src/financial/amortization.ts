import type { AmortizationResult, PaymentScheduleItem } from "../types/financial";

export function calculateSimpleAmortization(
  balance: number,
  monthlyPayment: number,
  extraPayment: number,
  monthlyRatePercent: number,
): AmortizationResult {
  const monthlyRate = monthlyRatePercent / 100;
  let remaining = balance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const schedule: PaymentScheduleItem[] = [];

  if (monthlyPayment <= 0) {
    return { months: 0, totalInterest: 0, totalPaid: 0, schedule: [] };
  }

  while (remaining > 0 && months < 1200) {
    const interest = remaining * monthlyRate;
    const payment = monthlyPayment + extraPayment;
    const principalAmortized = payment - interest;

    if (principalAmortized <= 0) {
      break;
    }

    remaining = Math.max(0, remaining - principalAmortized);
    totalInterest += interest;
    totalPaid += payment;
    months += 1;

    schedule.push({
      month: months,
      payment,
      interest,
      principalAmortized,
      balance: remaining,
    });
  }

  return {
    months,
    totalInterest,
    totalPaid,
    schedule,
  };
}

