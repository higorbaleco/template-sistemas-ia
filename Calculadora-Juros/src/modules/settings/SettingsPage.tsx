import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { NumberField } from "../../components/forms/NumberField";
import { SectionCard } from "../../components/ui/SectionCard";

export function SettingsPage() {
  const [compactMode, setCompactMode] = useLocalStorageState("settings.compact", 1);
  const [defaultRate, setDefaultRate] = useLocalStorageState("settings.rate", 1.6);

  return (
    <div className="page-stack">
      <SectionCard title="Configurações" subtitle="Preferências da preview">
        <div className="form-grid">
          <NumberField label="Modo compacto" value={compactMode} onChange={setCompactMode} min={0} max={1} suffix="0 ou 1" />
          <NumberField label="Taxa padrão" value={defaultRate} onChange={setDefaultRate} step={0.01} />
        </div>
      </SectionCard>
    </div>
  );
}

