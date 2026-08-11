import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { segments } from "@/lib/catalog-data";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catálogo Lab",
  description: "Dashboard interno para navegar catálogos demo e rotas espelhadas para agentes de IA.",
  applicationName: "Catálogo Lab",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#main-content">
          Pular para o conteúdo
        </a>

        <div className="app-shell">
          <div className="shell-bg" />

          <header className="shell-header">
            <div className="container shell-header-inner">
              <Link className="shell-brand" href="/">
                <span className="brand-mark" />
                <span>
                  <strong>Catálogo Lab</strong>
                  <small>Shell interno</small>
                </span>
              </Link>

              <nav className="shell-nav" aria-label="Global">
                <Link className="nav-chip" href="/">
                  Início
                </Link>
                <Link className="nav-chip" href="/catalogos">
                  Dashboard
                </Link>
                {segments.map((segment) => (
                  <Link className="nav-chip nav-chip-muted" key={segment.key} href={segment.publicPath}>
                    {segment.shortLabel}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          {children}

          <nav className="mobile-tabbar" aria-label="Atalhos">
            <Link className="mobile-tab" href="/">
              Início
            </Link>
            <Link className="mobile-tab" href="/catalogos">
              Dashboard
            </Link>
            <Link className="mobile-tab" href="/catalogos/imoveis">
              Imóveis
            </Link>
            <Link className="mobile-tab" href="/catalogos/veiculos">
              Veículos
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
