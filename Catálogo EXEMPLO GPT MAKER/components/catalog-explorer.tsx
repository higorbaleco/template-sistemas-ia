"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildQueryString,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  getCompanyBySlug,
  getFilterDefinitions,
  getItemLabel,
  inferFiltersFromPhrase,
} from "@/lib/catalog-utils";
import { CatalogFilterValues, CatalogListPayload, CatalogScope } from "@/lib/catalog-types";

type Props = {
  scope: CatalogScope;
  payload: CatalogListPayload;
  initialFilters: CatalogFilterValues;
  pathPrefix: string;
};

export function CatalogExplorer({ scope, payload, initialFilters, pathPrefix }: Props) {
  const router = useRouter();
  const [filters, setFilters] = useState<CatalogFilterValues>(initialFilters);
  const [builderPhrase, setBuilderPhrase] = useState("");
  const [testPhrase, setTestPhrase] = useState(scope.segment.queryExamples[0] ?? "");
  const [testResult, setTestResult] = useState<CatalogFilterValues>({});

  const filterDefs = getFilterDefinitions(scope.segment.key);
  const apiUrl = `${scope.apiPath}${buildQueryString(filters)}`;
  const publicUrl = `${scope.publicPath}${buildQueryString(filters)}`;
  const copiedCompany = scope.company ? getCompanyBySlug(scope.company.slug) : undefined;

  const setFilter = (key: string, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const syncUrl = () => {
    const query = buildQueryString(filters);
    router.replace(`${pathPrefix}${query}`);
  };

  const reset = () => {
    setFilters({});
    router.replace(pathPrefix);
  };

  const applyPrompt = (prompt: string, targetSetter: (value: CatalogFilterValues) => void) => {
    const nextFilters = inferFiltersFromPhrase(scope.segment.key, prompt);
    targetSetter(nextFilters);
    setFilters(nextFilters);
    router.replace(`${pathPrefix}${buildQueryString(nextFilters)}`);
  };

  return (
    <div className="stack">
      <section className="builder-panel">
        <div className="breadcrumb">
          <Link href="/catalogos">Catálogo Lab</Link>
          <span>/</span>
          <span>{scope.segment.label}</span>
          {scope.company ? (
            <>
              <span>/</span>
              <span>{scope.company.name}</span>
            </>
          ) : null}
        </div>

        <div className="page-section">
          <div className="kicker">Base inteligente</div>
          <h2 className="section-title" style={{ marginTop: 10 }}>
            {payload.scope.title}
          </h2>
          <p className="section-subtitle">{payload.scope.subtitle}</p>
        </div>

        <div className="grid-actions" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href={apiUrl}>
            Abrir endpoint IA
          </Link>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigator.clipboard.writeText(apiUrl)}
          >
            Copiar URL da IA
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => navigator.clipboard.writeText(publicUrl)}>
            Copiar URL pública
          </button>
        </div>

        <div className="page-section builder-grid">
          <div className="glass-card" style={{ padding: 18 }}>
            <div className="kicker">Filtros</div>
            <div className="builder-form" style={{ marginTop: 14 }}>
              <div className="form-grid">
                {filterDefs.map((definition) => (
                  <label className="field" key={definition.key}>
                    <span className="field-label">{definition.label}</span>
                    {definition.type === "select" ? (
                      <select value={filters[definition.key] ?? ""} onChange={(event) => setFilter(definition.key, event.target.value)}>
                        {definition.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : definition.type === "boolean" ? (
                      <select value={filters[definition.key] ?? ""} onChange={(event) => setFilter(definition.key, event.target.value)}>
                        <option value="">Todos</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                      </select>
                    ) : definition.type === "number" ? (
                      <input
                        type="number"
                        inputMode="numeric"
                        step={definition.step ?? 1}
                        value={filters[definition.key] ?? ""}
                        placeholder={definition.placeholder}
                        onChange={(event) => setFilter(definition.key, event.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        value={filters[definition.key] ?? ""}
                        placeholder={definition.placeholder}
                        onChange={(event) => setFilter(definition.key, event.target.value)}
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="inline-actions">
                <button className="btn btn-primary" type="button" onClick={syncUrl}>
                  Aplicar filtros
                </button>
                <button className="btn btn-secondary" type="button" onClick={reset}>
                  Limpar
                </button>
              </div>
            </div>
          </div>

          <div className="sidebar">
            <div className="glass-card" style={{ padding: 18 }}>
              <div className="kicker">Endpoints</div>
              <div className="codebox" style={{ marginTop: 12 }}>
                {`VISUAL
${publicUrl}

IA
${apiUrl}`}
              </div>
              <p className="footer-note">
                {scope.company
                  ? `Empresa demo: ${scope.company.name}${copiedCompany ? ` · ${copiedCompany.city}` : ""}.`
                  : "A mesma base alimenta a interface humana e a rota JSON para o agente."}
              </p>
            </div>

            <div className="glass-card" style={{ padding: 18 }}>
              <label className="field" style={{ marginTop: 0 }}>
                <span className="field-label">Consulta simulada</span>
                <textarea
                  aria-label="Consulta simulada"
                  value={testPhrase}
                  onChange={(event) => setTestPhrase(event.target.value)}
                />
              </label>
              <div className="inline-actions" style={{ marginTop: 12 }}>
                <button className="btn btn-primary" type="button" onClick={() => applyPrompt(testPhrase, setTestResult)}>
                  Interpretar frase
                </button>
              </div>
              <div className="codebox" style={{ marginTop: 12 }}>
                {Object.keys(testResult).length ? JSON.stringify(testResult, null, 2) : "Digite uma consulta e clique em interpretar."}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <label className="field" style={{ marginTop: 0 }}>
          <span className="kicker">Teste de URL</span>
          <textarea
            aria-label="Teste de URL"
            value={builderPhrase}
            onChange={(event) => setBuilderPhrase(event.target.value)}
            placeholder="Ex: Quero um SUV automático até 130 mil."
          />
        </label>
        <div className="inline-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="button" onClick={() => applyPrompt(builderPhrase, setFilters)}>
            Gerar filtros a partir da frase
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              setBuilderPhrase("");
              setFilters({});
              setTestResult({});
              router.replace(pathPrefix);
              router.refresh();
            }}
          >
            Resetar builder
          </button>
        </div>
        <p className="footer-note">
          O builder cria a query URL e usa a mesma lógica dos endpoints. Se a frase trouxer um filtro conhecido, o sistema
          já converte para parâmetros.
        </p>
      </section>

      <section className="section-card">
        <div className="kicker">Resultados</div>
        <div className="page-section" style={{ display: "grid", gap: 14 }}>
          <div className="tag-row">
            <span className="tag tag-accent">{payload.count} itens encontrados</span>
            <span className="tag">{scope.segment.label}</span>
            {scope.company ? <span className="tag tag-warm">{scope.company.name}</span> : null}
            {Object.keys(payload.filters.applied).length ? <span className="tag tag-sky">URL ativa</span> : null}
          </div>

          {payload.items.length ? (
            <div className="item-grid">
              {payload.items.map((item) => (
                <article className="item-card" key={item.id}>
                  <div className="item-card-top">
                    <div>
                      <div className="tag-row" style={{ marginTop: 0 }}>
                        <span className="tag tag-accent">{item.companyName}</span>
                        <span className="tag">{item.status}</span>
                        {item.featured ? <span className="tag tag-warm">destaque</span> : null}
                      </div>
                      <h3 className="item-title">{item.name}</h3>
                      <div className="card-meta">{getItemLabel(item)}</div>
                    </div>
                    <div className="item-price">
                      {item.segment === "imoveis" || item.segment === "veiculos" ? formatCurrency(item.price) : formatCompactCurrency(item.price)}
                    </div>
                  </div>

                  <p className="item-copy">{item.description}</p>

                  <div className="tag-row">
                    {item.highlights.slice(0, 3).map((highlight) => (
                      <span className="tag" key={highlight}>
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="item-details">
                    {item.segment === "imoveis" ? (
                      <>
                        <div className="detail-pill"><strong>{item.details.city}</strong> · {item.details.neighborhood}</div>
                        <div className="detail-pill"><strong>{item.details.bedrooms}</strong> quartos</div>
                        <div className="detail-pill"><strong>{item.details.parking}</strong> vagas</div>
                        <div className="detail-pill"><strong>{formatNumber(item.details.areaUseful)} m²</strong> úteis</div>
                      </>
                    ) : item.segment === "veiculos" ? (
                      <>
                        <div className="detail-pill"><strong>{item.details.brand}</strong> {item.details.model}</div>
                        <div className="detail-pill"><strong>{item.details.year}</strong> / {item.details.modelYear}</div>
                        <div className="detail-pill"><strong>{formatNumber(item.details.mileage)} km</strong></div>
                        <div className="detail-pill"><strong>{item.details.gearbox}</strong> · {item.details.fuel}</div>
                      </>
                    ) : item.segment === "ecommerce" ? (
                      <>
                        <div className="detail-pill"><strong>{item.details.category}</strong> · {item.details.subcategory}</div>
                        <div className="detail-pill"><strong>{item.details.color}</strong> · {item.details.size}</div>
                        <div className="detail-pill"><strong>{item.details.stock}</strong> em estoque</div>
                        <div className="detail-pill"><strong>SKU</strong> {item.details.sku}</div>
                      </>
                    ) : (
                      <>
                        <div className="detail-pill"><strong>{item.details.category}</strong></div>
                        <div className="detail-pill"><strong>{item.details.serves}</strong> pessoas</div>
                        <div className="detail-pill"><strong>{item.details.prepTime}</strong> min</div>
                        <div className="detail-pill"><strong>{item.details.sizes.length}</strong> tamanhos</div>
                      </>
                    )}
                  </div>

                  <div className="grid-actions" style={{ marginTop: 16 }}>
                    <Link className="btn btn-secondary" href={`${pathPrefix}/${item.slug}`}>
                      Ver detalhes
                    </Link>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => navigator.clipboard.writeText(`${scope.apiPath}/${item.slug}`)}
                    >
                      Copiar item da IA
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nenhum item encontrado para esse conjunto de filtros.</div>
          )}
        </div>
      </section>
    </div>
  );
}
