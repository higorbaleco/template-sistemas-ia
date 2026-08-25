import { useMemo, useState } from "react";
import { ArrowRightLeft, Clock3 } from "lucide-react";
import { CurrencyField } from "../../components/forms/CurrencyField";
import { NumberField } from "../../components/forms/NumberField";
import { MetricCard } from "../../components/metrics/MetricCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { formatCurrency, parseCurrencyInput } from "../../utils/formatters";
import { calculateCompoundGrowth } from "../../utils/finance";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";

export function BuyVsSavePage() {
  const [priceInput, setPriceInput] = useLocalStorageState("bvs.price", "R$ 30.000,00");
  const [saveMonths, setSaveMonths] = useLocalStorageState("bvs.months", 24);
  const [investmentRate, setInvestmentRate] = useLocalStorageState("bvs.rate", 0.8);
  const [monthlySaveInput, setMonthlySaveInput] = useLocalStorageState("bvs.monthly", "R$ 1.200,00");

  const target = parseCurrencyInput(priceInput);
  const monthlySave = parseCurrencyInput(monthlySaveInput);

  const futureSavings = useMemo(
    () => calculateCompoundGrowth(0, monthlySave, investmentRate, saveMonths),
    [monthlySave, investmentRate, saveMonths],
  );

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Custo de oportunidade"
        title="Comprar versus juntar"
        description="Compare a compra imediata com a disciplina de poupar até atingir o alvo."
        chips={["Meta", "Reserva", "Custo de espera"]}
      />

      <SectionCard eyebrow="Entradas" title="Parâmetros" subtitle="Compare custo financeiro e disciplina de caixa">
        <div className="form-grid">
          <CurrencyField label="Preço alvo" value={priceInput} onChange={setPriceInput} />
          <CurrencyField label="Reserva mensal" value={monthlySaveInput} onChange={setMonthlySaveInput} />
          <NumberField label="Prazo de espera" value={saveMonths} onChange={setSaveMonths} min={1} suffix="meses" />
          <NumberField label="Taxa do investimento" value={investmentRate} onChange={setInvestmentRate} step={0.01} />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Saída" title="Comparação">
        <div className="hero-grid">
          <MetricCard label="Dinheiro acumulado" value={formatCurrency(futureSavings)} tone="positive" icon={<ArrowRightLeft size={14} />} />
          <MetricCard label="Preço alvo" value={formatCurrency(target)} icon={<Clock3 size={14} />} />
        </div>
      </SectionCard>
    </div>
  );
}
