import { ArrowRight, Calculator, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard } from "../../components/metrics/MetricCard";
import { SectionCard } from "../../components/ui/SectionCard";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import { calculateCompoundGrowth, calculatePriceFinancing } from "../../utils/finance";

export function HomePage() {
  const financing = calculatePriceFinancing(30000, 1.6, 60);
  const futureValue = calculateCompoundGrowth(10000, 500, 0.8, 60);

  return (
    <div className="page-stack">
      <SectionCard title="Painel rápido" subtitle="Resumo imediato para decisões financeiras no mobile">
        <div className="hero-grid">
          <MetricCard
            label="Parcela estimada"
            value={formatCurrency(financing.monthlyPayment)}
            hint="Financiamento base de R$ 30.000,00"
            icon={<Wallet size={14} />}
          />
          <MetricCard
            label="Juros totais"
            value={formatCurrency(financing.totalInterest)}
            hint="Cenário de 60 meses"
            tone="alert"
            icon={<Calculator size={14} />}
          />
          <MetricCard
            label="Capital futuro"
            value={formatCurrency(futureValue)}
            hint={formatPercent(0.8)}
            tone="positive"
            icon={<TrendingUp size={14} />}
          />
        </div>
      </SectionCard>

      <SectionCard title="Atalhos" subtitle="Abra uma simulação em dois toques">
        <div className="quick-actions">
          <Link className="quick-action" to="/simulacoes/financiamento">
            <span>Financiamento</span>
            <ArrowRight size={16} />
          </Link>
          <Link className="quick-action" to="/simulacoes/amortizacao">
            <span>Amortização</span>
            <ArrowRight size={16} />
          </Link>
          <Link className="quick-action" to="/simulacoes/juros-compostos">
            <span>Juros compostos</span>
            <ArrowRight size={16} />
          </Link>
          <Link className="quick-action" to="/simulacoes/comprar-versus-juntar">
            <span>Comprar versus juntar</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}

