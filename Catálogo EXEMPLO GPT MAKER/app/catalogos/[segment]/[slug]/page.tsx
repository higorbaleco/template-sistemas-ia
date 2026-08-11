import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildCatalogDetailPayload,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  getItemBySlug,
  getScope,
} from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type PageProps = {
  params: { segment: SegmentKey; slug: string };
};

export default function SegmentItemPage({ params }: PageProps) {
  const scope = getScope(params.segment);
  const item = getItemBySlug(params.segment, params.slug);
  if (!item) {
    notFound();
  }
  const payload = buildCatalogDetailPayload(scope, item);

  return (
    <main className="page" id="main-content">
      <div className="container">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" />
            Catálogo Lab · {scope.segment.label}
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
              <span className="tag tag-accent">{item.companyName}</span>
              <span className="tag">{item.status}</span>
              {item.featured ? <span className="tag tag-warm">destaque</span> : null}
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
                <span>Segmento</span>
                <strong>{scope.segment.label}</strong>
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

            <div className="grid-actions" style={{ marginTop: 18 }}>
              <Link className="btn btn-primary" href={payload.links.apiPath}>
                Abrir JSON
              </Link>
              <Link className="btn btn-secondary" href={scope.publicPath}>
                Voltar à lista
              </Link>
            </div>
          </article>

          <aside className="detail-card">
            <div className="kicker">Detalhes estruturados</div>
            <div className="codebox" style={{ marginTop: 12 }}>
              {JSON.stringify(payload, null, 2)}
            </div>
          </aside>
        </section>

        <section className="section-card page-section">
          <div className="kicker">Resumo operacional</div>
          {item.segment === "imoveis" ? (
            <>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {item.details.type} em {item.details.city}
              </h2>
              <ul className="list">
                <li>{item.details.bedrooms} quartos, {item.details.suites} suíte(s), {item.details.bathrooms} banheiros</li>
                <li>{formatNumber(item.details.areaUseful)} m² úteis e {formatNumber(item.details.areaTotal)} m² totais</li>
                <li>{item.details.furnished ? "Mobiliado" : "Sem mobília"} · {item.details.financing ? "Financiável" : "Sem financiamento"} · {item.details.pets ? "Aceita pets" : "Não aceita pets"}</li>
                <li>{item.details.features.join(" · ")}</li>
              </ul>
            </>
          ) : item.segment === "veiculos" ? (
            <>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {item.details.brand} {item.details.model} {item.details.version}
              </h2>
              <ul className="list">
                <li>{item.details.year}/{item.details.modelYear} · {formatNumber(item.details.mileage)} km</li>
                <li>{item.details.gearbox} · {item.details.fuel} · {item.details.body}</li>
                <li>{item.details.exchange ? "Aceita troca" : "Não aceita troca"} · {item.details.financing ? "Financiamento" : "Sem financiamento"} · {item.details.warranty ? "Com garantia" : "Sem garantia"}</li>
                <li>{item.details.features.join(" · ")}</li>
              </ul>
            </>
          ) : item.segment === "ecommerce" ? (
            <>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {item.details.brand} · {item.details.category}
              </h2>
              <ul className="list">
                <li>SKU {item.details.sku} · estoque {item.details.stock}</li>
                <li>{item.details.color} · {item.details.size} · {item.details.material}</li>
                <li>Garantia {item.details.warrantyMonths} meses</li>
                <li>{item.details.features.join(" · ")}</li>
              </ul>
            </>
          ) : (
            <>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {item.details.category} · serve {item.details.serves} pessoas
              </h2>
              <ul className="list">
                <li>Tempo estimado: {item.details.prepTime} min</li>
                <li>Ingredientes: {item.details.ingredients.join(" · ")}</li>
                <li>Sem: {item.details.removals.join(" · ")}</li>
                <li>Adicionais: {item.details.addOns.map((addon) => `${addon.label} ${formatCompactCurrency(addon.price)}`).join(" · ")}</li>
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
