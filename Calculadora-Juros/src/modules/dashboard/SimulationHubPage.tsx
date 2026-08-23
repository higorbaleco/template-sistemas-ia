import { Link } from "react-router-dom";
import { SectionCard } from "../../components/ui/SectionCard";

const simulations = [
  { to: "/simulacoes/financiamento", title: "Financiamento", description: "Parcela, juros e total pago" },
  { to: "/simulacoes/amortizacao", title: "Amortização", description: "Impacto de pagamentos extras" },
  { to: "/simulacoes/juros-compostos", title: "Juros compostos", description: "Crescimento com aportes" },
  { to: "/simulacoes/comprar-versus-juntar", title: "Comprar versus juntar", description: "Decisão com custo de oportunidade" },
];

export function SimulationHubPage() {
  return (
    <div className="page-stack">
      <SectionCard title="Simulações" subtitle="Escolha o cenário que quer analisar">
        <div className="sim-list">
          {simulations.map((item) => (
            <Link key={item.to} to={item.to} className="sim-list__item">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

