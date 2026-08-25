export function calculateFutureValue(presentValue: number, monthlyRatePercent: number, months: number): number {
  const monthlyRate = monthlyRatePercent / 100;
  return presentValue * ((1 + monthlyRate) ** months);
}

