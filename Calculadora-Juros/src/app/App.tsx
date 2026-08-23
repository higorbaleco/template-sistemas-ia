import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../modules/dashboard/HomePage";
import { SimulationHubPage } from "../modules/dashboard/SimulationHubPage";
import { FinancingPage } from "../modules/financing/FinancingPage";
import { AmortizationPage } from "../modules/amortization/AmortizationPage";
import { CompoundPage } from "../modules/investment/CompoundPage";
import { BuyVsSavePage } from "../modules/buy-vs-save/BuyVsSavePage";
import { ScenariosPage } from "../modules/scenarios/ScenariosPage";
import { HistoryPage } from "../modules/history/HistoryPage";
import { SettingsPage } from "../modules/settings/SettingsPage";
import { AppShell } from "../layouts/AppShell";

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulacoes" element={<SimulationHubPage />} />
        <Route path="/simulacoes/financiamento" element={<FinancingPage />} />
        <Route path="/simulacoes/amortizacao" element={<AmortizationPage />} />
        <Route path="/simulacoes/juros-compostos" element={<CompoundPage />} />
        <Route path="/simulacoes/comprar-versus-juntar" element={<BuyVsSavePage />} />
        <Route path="/cenarios" element={<ScenariosPage />} />
        <Route path="/historico" element={<HistoryPage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

