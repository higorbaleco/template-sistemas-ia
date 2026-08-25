import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Calculator, Sparkles, Moon, Sun } from "lucide-react";
import { appTabs } from "../config/navigation";
import { useTheme } from "../hooks/useTheme";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const activeTab = appTabs.find((tab) => location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`));

  return (
    <div className="app-shell">
      <div className="app-shell__glow app-shell__glow--one" aria-hidden="true" />
      <div className="app-shell__glow app-shell__glow--two" aria-hidden="true" />

      <header className="shell-chrome">
        <div className="shell-brand">
          <p className="shell-kicker">
            <Sparkles size={14} />
            Central de simulações
          </p>
          <h1>Simulador Financeiro</h1>
          <p className="shell-subtitle">
            Leitura mobile first para crédito, dívida, patrimônio e custo de oportunidade.
          </p>
        </div>

        <div className="shell-actions">
          <button
            onClick={toggleTheme}
            className="shell-icon-button"
            title={`Modo: ${theme === "dark" ? "Escuro" : theme === "light" ? "Claro" : "Sistema"}`}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="shell-route-chip">
            <Calculator size={14} />
            <span>{activeTab?.label ?? "Visão geral"}</span>
          </div>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <nav className="bottom-nav" aria-label="Navegação principal">
        {appTabs.map((tab) => {
          const isActive = location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`);
          const Icon = tab.icon;

          return (
            <NavLink key={tab.path} to={tab.path} className={`bottom-nav__item${isActive ? " is-active" : ""}`}>
              <Icon size={18} />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
