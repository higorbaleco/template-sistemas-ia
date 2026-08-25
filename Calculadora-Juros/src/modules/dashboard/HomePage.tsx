import { ArrowRight, Calculator, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard } from "../../components/metrics/MetricCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import { calculateCompoundGrowth, calculatePriceFinancing } from "../../utils/finance";

export function HomePage() {
  const financing = calculatePriceFinancing(30000, 1.6, 60);
  const futureValue = calculateCompoundGrowth(10000, 500, 0.8, 60);

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Visão geral"
        title="Simulações que parecem um produto premium, não uma planilha"
        description="A tela inicial prioriza leitura rápida, decisão de bolso e mobile first."
        chips={["PWA pronta", "Formato pt-BR", "Cálculo preciso"]}
      />

      <section className="hero-banner">
        <div className="hero-banner__main">
          <span className="hero-banner__eyebrow">Cenário principal</span>
          <h3>Veja o impacto real do dinheiro antes de assumir o compromisso.</h3>
          <p>
            O painel central mostra parcela, juros e formação de capital com foco em clareza visual e
            hierarquia numérica.
          </p>
        </div>

        <div className="hero-banner__side">
          <MetricCard
            label="Parcela estimada"
            value={formatCurrency(financing.monthlyPayment)}
            hint="Baseado em R$ 30.000,00"
            icon={<Wallet size={14} />}
          />
          <MetricCard
            label="Juros totais"
            value={formatCurrency(financing.totalInterest)}
            hint="Prazo de 60 meses"
            tone="alert"
            icon={<Calculator size={14} />}
          />
        </div>
      </section>

      <SectionCard
        eyebrow="Resumo inteligente"
        title="Capital futuro"
        subtitle="Crescimento simulado com aporte inicial e mensalidade recorrente"
      >
        <div className="hero-grid">
          <MetricCard value={formatCurrency(futureValue)} label="Valor projetado" tone="positive" icon={<TrendingUp size={14} />} />
          <MetricCard value={formatPercent(0.8)} label="Taxa mensal" hint="Crescimento assumido no cenário" />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Ações rápidas" title="Atalhos" subtitle="Abra uma simulação em dois toques">
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
