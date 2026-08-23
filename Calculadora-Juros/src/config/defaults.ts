export type CurrencyDefaults = {
  locale: string;
  currency: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
};

export type SimulationDefaults = {
  monthlyRatePrecision: number;
  annualRatePrecision: number;
  defaultLoanTermMonths: number;
};

export const currencyDefaults: CurrencyDefaults = {
  locale: "pt-BR",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const simulationDefaults: SimulationDefaults = {
  monthlyRatePrecision: 4,
  annualRatePrecision: 4,
  defaultLoanTermMonths: 60,
};

