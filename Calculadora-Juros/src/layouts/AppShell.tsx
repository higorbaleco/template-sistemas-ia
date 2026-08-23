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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-3 z-10 mx-4 mb-3 px-4 py-3 border border-border rounded-2xl bg-card/95 backdrop-blur-2xl shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <Sparkles size={14} />
              Central de simulações
            </p>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold mt-1">Simulador Financeiro</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors inline-flex items-center gap-2"
              title={`Modo: ${theme === 'dark' ? 'Escuro' : theme === 'light' ? 'Claro' : 'Sistema'}`}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {theme === 'dark' ? 'Claro' : 'Escuro'}
              </span>
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-border text-muted-foreground text-sm font-medium whitespace-nowrap">
              <Calculator size={14} />
              <span className="hidden sm:inline">{location.pathname === "/" ? "Visão geral" : "Modo ativo"}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pb-24">{children}</main>

      <nav className="fixed bottom-4 left-4 right-4 sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-40 flex gap-2 p-2 border border-border rounded-3xl bg-card/95 backdrop-blur-2xl shadow-lg" aria-label="Navegação principal">
        {appTabs.map((tab) => {
          const isActive = location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`);
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-white/20 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

