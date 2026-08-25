export function calculatePresentValue(futureValue: number, monthlyRatePercent: number, months: number): number {
  const monthlyRate = monthlyRatePercent / 100;
  if (months <= 0) {
    return futureValue;
  }

  return futureValue / ((1 + monthlyRate) ** months);
}

