import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
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
      <PageHeader
        kicker="Mapa da aplicação"
        title="Simulações"
        description="Acesso curto aos principais cenários com navegação pensada para mobile."
        chips={["Fluxo curto", "Categorias", "Acesso rápido"]}
      />

      <SectionCard eyebrow="Catálogo" title="Escolha o cenário que quer analisar">
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
