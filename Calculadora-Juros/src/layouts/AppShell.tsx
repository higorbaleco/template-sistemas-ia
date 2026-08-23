import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Calculator, Home, ListTodo, Settings, Sparkles, Warehouse } from "lucide-react";
import { appTabs } from "../config/navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="app-background" aria-hidden="true" />
      <header className="app-topbar">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} />
            Central de simulações
          </p>
          <h1>Simulador Financeiro</h1>
        </div>
        <div className="status-pill">
          <Calculator size={14} />
          <span>{location.pathname === "/" ? "Visão geral" : "Modo ativo"}</span>
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

