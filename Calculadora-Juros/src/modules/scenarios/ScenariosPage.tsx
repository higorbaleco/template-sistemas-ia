import { SectionCard } from "../../components/ui/SectionCard";

export function ScenariosPage() {
  return (
    <div className="page-stack">
      <SectionCard title="Cenários salvos" subtitle="Base local para comparação e retomada">
        <div className="empty-state">
          <strong>Nenhum cenário salvo ainda</strong>
          <p>Esta preview já está pronta para gravar e comparar cenários no armazenamento local.</p>
        </div>
      </SectionCard>
    </div>
  );
}

