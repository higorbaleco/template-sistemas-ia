import type { FinancingInput, FinancingResult, PaymentScheduleItem } from "../types/financial";

function buildPriceSchedule(principal: number, monthlyRatePercent: number, months: number, monthlyPayment: number): PaymentScheduleItem[] {
  const schedule: PaymentScheduleItem[] = [];
  const monthlyRate = monthlyRatePercent / 100;
  let balance = principal;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    const principalAmortized = monthlyPayment - interest;
    balance = Math.max(0, balance - principalAmortized);

    schedule.push({
      month,
      payment: monthlyPayment,
      interest,
      principalAmortized,
      balance,
    });
  }

  return schedule;
}

export function calculatePriceFinancing(input: FinancingInput): FinancingResult {
  const { principal, monthlyRatePercent, months } = input;
  const monthlyRate = monthlyRatePercent / 100;

  if (months <= 0) {
    return { principal, monthlyPayment: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
  }

  if (monthlyRate === 0) {
    const monthlyPayment = principal / months;
    const schedule = Array.from({ length: months }, (_, index) => {
      const balance = Math.max(0, principal - monthlyPayment * (index + 1));
      return {
        month: index + 1,
        payment: monthlyPayment,
        interest: 0,
        principalAmortized: monthlyPayment,
        balance,
      };
    });

    return {
      principal,
      monthlyPayment,
      totalPayment: monthlyPayment * months,
      totalInterest: 0,
      schedule,
    };
  }

  const factor = (1 + monthlyRate) ** months;
  const monthlyPayment = principal * ((monthlyRate * factor) / (factor - 1));
  const schedule = buildPriceSchedule(principal, monthlyRatePercent, months, monthlyPayment);
  const totalPayment = monthlyPayment * months;

  return {
    principal,
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    schedule,
  };
}

