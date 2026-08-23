import { useMemo, useState } from "react";
import { ArrowDownCircle, Clock3, Percent } from "lucide-react";
import { CurrencyField } from "../../components/forms/CurrencyField";
import { NumberField } from "../../components/forms/NumberField";
import { MetricCard } from "../../components/metrics/MetricCard";
import { SectionCard } from "../../components/ui/SectionCard";
import { formatCurrency, parseCurrencyInput } from "../../utils/formatters";
import { calculateSimpleAmortization } from "../../utils/finance";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";

export function AmortizationPage() {
  const [balanceInput, setBalanceInput] = useLocalStorageState("amortization.balance", "R$ 30.000,00");
  const [paymentInput, setPaymentInput] = useLocalStorageState("amortization.payment", "R$ 800,00");
  const [extraPaymentInput, setExtraPaymentInput] = useLocalStorageState("amortization.extra", "R$ 500,00");
  const [rate, setRate] = useLocalStorageState("amortization.rate", 1.6);

  const balance = parseCurrencyInput(balanceInput);
  const payment = parseCurrencyInput(paymentInput);
  const extra = parseCurrencyInput(extraPaymentInput);

  const result = useMemo(() => calculateSimpleAmortization(balance, payment, extra, rate), [balance, payment, extra, rate]);

  return (
    <div className="page-stack">
      <SectionCard title="Amortização" subtitle="Veja o efeito de pagar a mais todo mês">
        <div className="form-grid">
          <CurrencyField label="Saldo devedor" value={balanceInput} onChange={setBalanceInput} />
          <CurrencyField label="Parcela atual" value={paymentInput} onChange={setPaymentInput} />
          <CurrencyField label="Pagamento extra" value={extraPaymentInput} onChange={setExtraPaymentInput} />
          <NumberField label="Taxa mensal" value={rate} onChange={setRate} step={0.01} />
        </div>
      </SectionCard>

      <SectionCard title="Impacto">
        <div className="hero-grid">
          <MetricCard label="Meses até quitar" value={`${result.months} meses`} icon={<Clock3 size={14} />} />
          <MetricCard label="Juros totais" value={formatCurrency(result.totalInterest)} tone="alert" icon={<Percent size={14} />} />
          <MetricCard label="Total pago" value={formatCurrency(result.totalPaid)} icon={<ArrowDownCircle size={14} />} />
        </div>
      </SectionCard>
    </div>
  );
}
