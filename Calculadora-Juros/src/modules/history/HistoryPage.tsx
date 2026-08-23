import { SectionCard } from "../../components/ui/SectionCard";

export function HistoryPage() {
  return (
    <div className="page-stack">
      <SectionCard title="Histórico" subtitle="Últimas simulações realizadas neste dispositivo">
        <div className="empty-state">
          <strong>Sem histórico ainda</strong>
          <p>As simulações executadas nesta preview podem ser persistidas localmente no próximo passo.</p>
        </div>
      </SectionCard>
    </div>
  );
}

