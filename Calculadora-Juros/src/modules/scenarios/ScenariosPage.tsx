import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { useSimulationHistory } from "../../hooks/useSimulationHistory";

export function ScenariosPage() {
  const { scenarios, history } = useSimulationHistory();

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Persistência"
        title="Cenários salvos"
        description="Guarde simulações para comparar cenários e retomar mais tarde."
        chips={["Local first", "Histórico", "Comparação"]}
      />

      <SectionCard eyebrow="Armazenamento" title="Base local para comparação e retomada">
        <div className="empty-state">
          <strong>{scenarios.length > 0 ? `${scenarios.length} cenários salvos` : "Nenhum cenário salvo ainda"}</strong>
          <p>
            {history.length > 0
              ? `${history.length} simulações recentes podem ser promovidas para cenário.`
              : "Esta preview já está pronta para gravar e comparar cenários no armazenamento local."}
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
