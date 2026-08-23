export type FinancingResult = {
  principal: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

export function calculatePriceFinancing(principal: number, monthlyRatePercent: number, months: number): FinancingResult {
  const monthlyRate = monthlyRatePercent / 100;
  if (months <= 0) {
    return { principal, monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }
  if (monthlyRate === 0) {
    const monthlyPayment = principal / months;
    return {
      principal,
      monthlyPayment,
      totalPayment: monthlyPayment * months,
      totalInterest: 0,
    };
  }
  const factor = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = principal * ((monthlyRate * factor) / (factor - 1));
  const totalPayment = monthlyPayment * months;
  return {
    principal,
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
  };
}

export function calculateSimpleAmortization(balance: number, monthlyPayment: number, extraPayment: number, monthlyRatePercent: number) {
  const monthlyRate = monthlyRatePercent / 100;
  let remaining = balance;
  let months = 0;
  let totalInterest = 0;

  if (monthlyPayment <= 0) {
    return { months: 0, totalInterest: 0, totalPaid: 0 };
  }

  while (remaining > 0 && months < 1200) {
    const interest = remaining * monthlyRate;
    const payment = monthlyPayment + extraPayment;
    const amortization = payment - interest;
    remaining -= amortization;
    totalInterest += Math.max(0, interest);
    months += 1;
    if (payment <= interest) {
      break;
    }
  }

  return {
    months,
    totalInterest,
    totalPaid: months * (monthlyPayment + extraPayment),
  };
}

export function calculateCompoundGrowth(initial: number, monthlyContribution: number, monthlyRatePercent: number, months: number) {
  const monthlyRate = monthlyRatePercent / 100;
  let total = initial;
  for (let month = 0; month < months; month += 1) {
    total = total * (1 + monthlyRate) + monthlyContribution;
  }
  return total;
}

