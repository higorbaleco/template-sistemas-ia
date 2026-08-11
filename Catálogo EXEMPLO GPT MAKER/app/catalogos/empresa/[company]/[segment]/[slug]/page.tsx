import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildCatalogDetailPayload,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  getCompanyBySlug,
  getItemBySlug,
  getScope,
} from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type PageProps = {
  params: { company: string; segment: SegmentKey; slug: string };
};

export default function CompanySegmentItemPage({ params }: PageProps) {
  const company = getCompanyBySlug(params.company);
  const item = getItemBySlug(params.segment, params.slug, params.company);
  if (!item || !company) {
    notFound();
  }

  const scope = getScope(params.segment, params.company);
  const payload = buildCatalogDetailPayload(scope, item);

  return (
    <main className="page" id="main-content">
      <div className="container">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" />
            Catálogo Lab · {company.name}
          </div>
          <nav className="nav-links">
            <Link className="nav-chip" href="/catalogos">
              Dashboard
            </Link>
            <Link className="nav-chip" href={scope.publicPath}>
              Voltar ao catálogo
            </Link>
            <Link className="nav-chip" href={payload.links.apiPath}>
              Ver JSON
            </Link>
          </nav>
        </header>

        <section className="detail-hero">
          <article className="detail-card">
            <div className="breadcrumb">
              <Link href="/catalogos">Catálogo Lab</Link>
              <span>/</span>
              <Link href={scope.publicPath}>{scope.segment.label}</Link>
              <span>/</span>
              <span>{item.name}</span>
            </div>

            <div className="tag-row" style={{ marginTop: 14 }}>
              <span className="tag tag-accent">{company.name}</span>
              <span className="tag">{company.city}</span>
              <span className="tag tag-warm">{item.status}</span>
            </div>

            <h1 className="detail-title" style={{ marginTop: 16 }}>
              {item.name}
            </h1>
            <p className="detail-summary">{item.description}</p>

            <div className="detail-kpis">
              <div className="kpi">
                <span>Preço</span>
                <strong>{item.segment === "ecommerce" || item.segment === "food" ? formatCompactCurrency(item.price) : formatCurrency(item.price)}</strong>
              </div>
              <div className="kpi">
                <span>Empresa</span>
                <strong>{company.name}</strong>
              </div>
              <div className="kpi">
                <span>Endpoint público</span>
                <strong>{payload.links.publicPath}</strong>
              </div>
              <div className="kpi">
                <span>Endpoint IA</span>
                <strong>{payload.links.apiPath}</strong>
              </div>
            </div>
          </article>

          <aside className="detail-card">
            <div className="kicker">JSON estruturado</div>
            <div className="codebox" style={{ marginTop: 12 }}>
              {JSON.stringify(payload, null, 2)}
            </div>
          </aside>
        </section>

        <section className="section-card page-section">
          <div className="kicker">Resumo operacional</div>
          {item.segment === "imoveis" ? (
            <ul className="list">
              <li>{item.details.type} · {item.details.purpose} · {item.details.city} / {item.details.neighborhood}</li>
              <li>{item.details.bedrooms} quartos · {item.details.suites} suíte(s) · {item.details.parking} vagas</li>
              <li>{formatNumber(item.details.areaUseful)} m² úteis · {formatNumber(item.details.areaTotal)} m² totais</li>
            </ul>
          ) : item.segment === "veiculos" ? (
            <ul className="list">
              <li>{item.details.brand} {item.details.model} {item.details.version}</li>
              <li>{item.details.year}/{item.details.modelYear} · {formatNumber(item.details.mileage)} km</li>
              <li>{item.details.gearbox} · {item.details.fuel} · {item.details.body}</li>
            </ul>
          ) : item.segment === "ecommerce" ? (
            <ul className="list">
              <li>SKU {item.details.sku} · estoque {item.details.stock}</li>
              <li>{item.details.category} · {item.details.subcategory}</li>
              <li>{item.details.color} · {item.details.size} · garantia {item.details.warrantyMonths} meses</li>
            </ul>
          ) : (
            <ul className="list">
              <li>{item.details.category} · serve {item.details.serves} pessoas</li>
              <li>{item.details.ingredients.join(" · ")}</li>
              <li>Adicionais: {item.details.addOns.map((addon) => `${addon.label} ${formatCompactCurrency(addon.price)}`).join(" · ")}</li>
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
