import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { useSimulationHistory } from "../../hooks/useSimulationHistory";

export function HistoryPage() {
  const { history, scenarios } = useSimulationHistory();

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Registro"
        title="Histórico"
        description="Veja as últimas simulações feitas neste dispositivo."
        chips={["Recentes", "Repetir", "Comparar"]}
      />

      <SectionCard eyebrow="Atividade" title="Últimas simulações realizadas neste dispositivo">
        <div className="empty-state">
          <strong>{history.length > 0 ? `${history.length} simulações salvas` : "Sem histórico ainda"}</strong>
          <p>
            {scenarios.length > 0
              ? `${scenarios.length} cenários estão prontos para comparação local.`
              : "As simulações executadas nesta preview podem ser persistidas localmente no próximo passo."}
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
