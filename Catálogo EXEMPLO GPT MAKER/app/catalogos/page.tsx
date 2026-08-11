import Link from "next/link";
import { companies, segments } from "@/lib/catalog-data";

export default function CatalogsHomePage() {
  return (
    <main className="page" id="main-content">
      <div className="container page-stack">
        <section className="dashboard-grid">
          <article className="section-card dashboard-lead">
            <div className="kicker">Dashboard interno</div>
            <h1 className="section-title">Abra uma vertical, valide a navegação e copie a rota que a IA lê.</h1>
            <p className="section-subtitle">
              A shell mantém os acessos principais em um só lugar, com cards curtos, touch targets amplos e
              leitura rápida em mobile.
            </p>

            <div className="metric-grid">
              <div className="metric-card">
                <strong>{segments.length}</strong>
                <span>segmentos ativos</span>
              </div>
              <div className="metric-card">
                <strong>{companies.length}</strong>
                <span>empresas demo</span>
              </div>
              <div className="metric-card">
                <strong>4</strong>
                <span>atalhos prioritários</span>
              </div>
              <div className="metric-card">
                <strong>/api</strong>
                <span>espelho operacional</span>
              </div>
            </div>
          </article>

          <aside className="section-card dashboard-aside">
            <div className="kicker">Rotas rápidas</div>
            <div className="stack-compact">
              {segments.map((segment) => (
                <Link className="quick-link" href={segment.publicPath} key={segment.key}>
                  <span>{segment.shortLabel}</span>
                  <code>{segment.apiPath}</code>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="segment-grid segment-grid-dashboard">
          {segments.map((segment) => (
            <Link className="segment-card" href={segment.publicPath} key={segment.key}>
              <div className="card-row">
                <span className="tag tag-accent">{segment.label}</span>
                <span className="tag">{segment.queryExamples.length} exemplos</span>
              </div>
              <h2>{segment.shortLabel}</h2>
              <p>{segment.description}</p>
              <div className="card-row">
                <span className="route-chip">{segment.publicPath}</span>
                <span className="route-chip route-chip-muted">{segment.apiPath}</span>
              </div>
            </Link>
          ))}
        </section>

        <section className="section-card">
          <div className="section-heading">
            <div>
              <div className="kicker">Gateways de empresa</div>
              <h2 className="section-title">Acesso contextual para as demos.</h2>
            </div>
            <p className="section-subtitle">Cards leves para abrir a vertical correspondente com contexto de marca.</p>
          </div>

          <div className="company-grid">
            {companies.map((company) => {
              const segment = segments.find((item) => item.key === company.segment);

              return (
                <Link className="company-card company-card-gateway" href={segment?.publicPath ?? "/catalogos"} key={company.slug}>
                  <div className="card-row">
                    <span className="tag tag-accent">{company.name}</span>
                    <span className="tag">{company.segment}</span>
                  </div>
                  <h3>{company.city}</h3>
                  <p>{company.tagline}</p>
                  <div className="card-row">
                    <span className="route-chip">{segment?.publicPath}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
