export type AppRoute = {
  path: string;
  title: string;
  mobileLabel: string;
};

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    title: "Início",
    mobileLabel: "Início",
  },
  {
    path: "/simulacoes",
    title: "Simulações",
    mobileLabel: "Simulações",
  },
  {
    path: "/cenarios",
    title: "Cenários",
    mobileLabel: "Cenários",
  },
  {
    path: "/historico",
    title: "Histórico",
    mobileLabel: "Histórico",
  },
  {
    path: "/configuracoes",
    title: "Configurações",
    mobileLabel: "Configurações",
  },
];

export const simulationRoutes: AppRoute[] = [
  {
    path: "/simulacoes/financiamento",
    title: "Financiamento",
    mobileLabel: "Financiamento",
  },
  {
    path: "/simulacoes/amortizacao",
    title: "Amortização",
    mobileLabel: "Amortização",
  },
  {
    path: "/simulacoes/juros-compostos",
    title: "Juros compostos",
    mobileLabel: "Juros",
  },
  {
    path: "/simulacoes/comprar-versus-juntar",
    title: "Comprar versus juntar",
    mobileLabel: "Comparar",
  },
  {
    path: "/simulacoes/patrimonio",
    title: "Patrimônio",
    mobileLabel: "Patrimônio",
  },
  {
    path: "/simulacoes/capacidade-financiamento",
    title: "Capacidade de financiamento",
    mobileLabel: "Capacidade",
  },
];

