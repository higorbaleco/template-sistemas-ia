import Link from "next/link";
import { companies, segments } from "@/lib/catalog-data";

const quickStats = [
  { value: `${segments.length}`, label: "verticais ativas" },
  { value: `${companies.length}`, label: "empresas demo" },
  { value: "URL + JSON", label: "leitura alinhada" },
];

export default function HomePage() {
  return (
    <main className="page" id="main-content">
      <div className="container page-stack">
        <section className="shell-hero-grid">
          <article className="bento-card bento-card-hero">
            <div className="kicker">Catálogos internos para agentes</div>
            <h1 className="hero-title">Navegue por segmentos reais sem sair do primeiro toque.</h1>
            <p className="hero-copy">
              O Catálogo Lab reúne as vitrines de imóveis, veículos, e-commerce e food em uma shell única,
              pronta para uso humano e leitura por IA com a mesma estrutura de rotas.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-primary" href="/catalogos">
                Abrir dashboard
              </Link>
            </div>

            <div className="metric-strip">
              {quickStats.map((stat) => (
                <div className="metric-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="bento-card bento-card-side">
            <div className="kicker">Primeiro fold</div>
            <h2 className="section-title">Escolha a vertical e siga.</h2>
            <p className="section-subtitle">
              Cada card leva para um catálogo navegável com filtros, itens e endpoint espelhado.
            </p>

            <div className="stack-compact">
              <div className="mini-route">
                <span>dashboard</span>
                <code>/catalogos</code>
              </div>
              <div className="mini-route">
                <span>API exemplo</span>
                <code>/api/catalogos/imoveis?cidade=maringa</code>
              </div>
            </div>
          </aside>

          {segments.map((segment) => (
            <Link className="bento-card segment-bento" href={segment.publicPath} key={segment.key}>
              <div className="card-row">
                <span className="tag tag-accent">{segment.label}</span>
                <span className="tag">{segment.queryExamples.length} prompts</span>
              </div>
              <h2>{segment.shortLabel}</h2>
              <p>{segment.description}</p>
              <div className="card-row">
                <span className="route-chip">{segment.publicPath}</span>
              </div>
            </Link>
          ))}
        </section>

        <section className="section-card">
          <div className="section-heading">
            <div>
              <div className="kicker">Empresas gateway</div>
              <h2 className="section-title">Entradas rápidas por contexto de demonstração.</h2>
            </div>
            <p className="section-subtitle">
              Cada empresa abaixo abre a vertical correspondente com um ponto de entrada mais contextual.
            </p>
          </div>

          <div className="company-grid">
            {companies.map((company) => {
              const segment = segments.find((item) => item.key === company.segment);

              return (
                <Link
                  className="company-card company-card-gateway"
                  href={`/catalogos/empresa/${company.slug}/${company.segment}`}
                  key={company.slug}
                >
                  <div className="card-row">
                    <span className="tag tag-accent">{company.name}</span>
                    <span className="tag">{company.city}</span>
                  </div>
                  <h3>{company.tagline}</h3>
                  <p>{company.description}</p>
                  <div className="card-row">
                    <span className="route-chip">{`/catalogos/empresa/${company.slug}/${company.segment}`}</span>
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
