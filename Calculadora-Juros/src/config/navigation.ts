import { Home, ListTodo, Settings, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tab = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export const appTabs: Tab[] = [
  { path: "/", label: "Início", icon: Home },
  { path: "/simulacoes", label: "Simulações", icon: ListTodo },
  { path: "/cenarios", label: "Cenários", icon: Warehouse },
  { path: "/configuracoes", label: "Configurações", icon: Settings },
];

