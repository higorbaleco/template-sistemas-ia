import { useMemo, useState } from "react";
import { TrendingUp, Wallet } from "lucide-react";
import { CurrencyField } from "../../components/forms/CurrencyField";
import { NumberField } from "../../components/forms/NumberField";
import { MetricCard } from "../../components/metrics/MetricCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { formatCurrency, parseCurrencyInput } from "../../utils/formatters";
import { calculateCompoundGrowth } from "../../utils/finance";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";

export function CompoundPage() {
  const [initialInput, setInitialInput] = useLocalStorageState("compound.initial", "R$ 10.000,00");
  const [contributionInput, setContributionInput] = useLocalStorageState("compound.contribution", "R$ 500,00");
  const [rate, setRate] = useLocalStorageState("compound.rate", 0.8);
  const [months, setMonths] = useLocalStorageState("compound.months", 60);

  const initial = parseCurrencyInput(initialInput);
  const contribution = parseCurrencyInput(contributionInput);

  const futureValue = useMemo(() => calculateCompoundGrowth(initial, contribution, rate, months), [initial, contribution, rate, months]);

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Patrimônio"
        title="Juros compostos"
        description="Uma tela para enxergar crescimento com aporte, prazo e taxa."
        chips={["Aporte", "Rendimento", "Valor futuro"]}
      />

      <SectionCard eyebrow="Entradas" title="Parâmetros" subtitle="Crescimento com aportes e reinvestimento">
        <div className="form-grid">
          <CurrencyField label="Capital inicial" value={initialInput} onChange={setInitialInput} />
          <CurrencyField label="Aporte mensal" value={contributionInput} onChange={setContributionInput} />
          <NumberField label="Taxa mensal" value={rate} onChange={setRate} step={0.01} />
          <NumberField label="Prazo" value={months} onChange={setMonths} min={1} suffix="meses" />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Saída" title="Resultado">
        <div className="hero-grid">
          <MetricCard label="Valor futuro" value={formatCurrency(futureValue)} tone="positive" icon={<TrendingUp size={14} />} />
          <MetricCard label="Capital inicial" value={formatCurrency(initial)} icon={<Wallet size={14} />} />
        </div>
      </SectionCard>
    </div>
  );
}
