import { useState } from "react";
import { Banknote, Clock3, Percent } from "lucide-react";
import { CurrencyField } from "../../components/forms/CurrencyField";
import { NumberField } from "../../components/forms/NumberField";
import { MetricCard } from "../../components/metrics/MetricCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { formatCurrency, formatPercent, parseCurrencyInput } from "../../utils/formatters";
import { useFinancingSimulation } from "../../hooks/useFinancingSimulation";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";

export function FinancingPage() {
  const [amountInput, setAmountInput] = useLocalStorageState("financing.amount", "R$ 30.000,00");
  const [downPaymentInput, setDownPaymentInput] = useLocalStorageState("financing.downPayment", "R$ 5.000,00");
  const [rate, setRate] = useLocalStorageState("financing.rate", 1.6);
  const [months, setMonths] = useLocalStorageState("financing.months", 60);

  const principal = Math.max(0, parseCurrencyInput(amountInput) - parseCurrencyInput(downPaymentInput));

  const result = useFinancingSimulation(principal, rate, months);

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Simulação principal"
        title="Financiamento"
        description="Valores com leitura rápida, moeda correta e foco em decisão no celular."
        chips={["Parcela", "Total pago", "Juros"]}
      />
      <SectionCard eyebrow="Entradas" title="Parâmetros" subtitle="Ajuste os números para comparar cenários">
        <div className="form-grid">
          <CurrencyField label="Valor do bem" value={amountInput} onChange={setAmountInput} />
          <CurrencyField label="Entrada" value={downPaymentInput} onChange={setDownPaymentInput} />
          <NumberField label="Taxa mensal" value={rate} onChange={setRate} step={0.01} suffix={formatPercent(rate)} />
          <NumberField label="Prazo" value={months} onChange={setMonths} min={1} suffix="meses" />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Saída" title="Resultados" subtitle="Comparação imediata da simulação">
        <div className="hero-grid">
          <MetricCard label="Parcela" value={formatCurrency(result.monthlyPayment)} icon={<Banknote size={14} />} />
          <MetricCard label="Total pago" value={formatCurrency(result.totalPayment)} icon={<Clock3 size={14} />} />
          <MetricCard label="Juros totais" value={formatCurrency(result.totalInterest)} tone="alert" icon={<Percent size={14} />} />
        </div>
      </SectionCard>
    </div>
  );
}
