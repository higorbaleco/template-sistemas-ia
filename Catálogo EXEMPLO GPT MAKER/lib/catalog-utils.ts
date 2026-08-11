import { notFound } from "next/navigation";
import { companies, segments } from "./catalog-data";
import {
  filterIndexedItems,
  getIndexedFacets,
  getIndexedItem,
  getIndexedItems,
  inferFiltersFromPhrase,
} from "./catalog-index";
import {
  CatalogCompany,
  CatalogDetailPayload,
  CatalogFilterValues,
  CatalogItem,
  CatalogListPayload,
  CatalogScope,
  CatalogScopeSummary,
  FilterDefinition,
  SegmentConfig,
  SegmentKey,
} from "./catalog-types";

const segmentMap = new Map(segments.map((segment) => [segment.key, segment]));
const companyMap = new Map(companies.map((company) => [company.slug, company]));

const toStringValue = (value?: string | string[]) => {
  if (!value) return "";
  return Array.isArray(value) ? value[0] : value;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

export const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(value);

export const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

export const getSegmentConfig = (segment: SegmentKey): SegmentConfig => {
  const config = segmentMap.get(segment);
  if (!config) {
    throw new Error(`Unknown segment: ${segment}`);
  }
  return config;
};

export const getCompanyBySlug = (slug?: string): CatalogCompany | undefined => {
  if (!slug) return undefined;
  return companyMap.get(slug);
};

export const resolveScope = (segment: SegmentKey, companySlug?: string): CatalogScope | null => {
  const config = segmentMap.get(segment);
  if (!config) {
    return null;
  }

  const company = companySlug ? getCompanyBySlug(companySlug) : undefined;
  if (companySlug && (!company || company.segment !== segment)) {
    return null;
  }

  const items = getIndexedItems(segment, companySlug);

  return {
    segment: config,
    company,
    items,
    title: company ? `${company.name} · ${config.label}` : config.label,
    subtitle: company
      ? `${company.description} Use filtros, veja o catálogo e consulte o endpoint espelhado pela IA.`
      : config.description,
    publicPath: company ? `/catalogos/empresa/${company.slug}/${config.key}` : config.publicPath,
    apiPath: company ? `/api/catalogos/empresa/${company.slug}/${config.key}` : config.apiPath,
  };
};

export const getScope = (segment: SegmentKey, companySlug?: string): CatalogScope => {
  const scope = resolveScope(segment, companySlug);
  if (!scope) {
    notFound();
  }
  return scope;
};

export const getItemBySlug = (segment: SegmentKey, slug: string, companySlug?: string) =>
  getIndexedItem(segment, slug, companySlug);

export const getAllCompaniesBySegment = (segment: SegmentKey) => companies.filter((company) => company.segment === segment);

export const getFilterDefinitions = (segment: SegmentKey): FilterDefinition[] => getSegmentConfig(segment).filterDefinitions;

export const cleanFilters = (filters: CatalogFilterValues) =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => typeof value === "string" && value.trim() !== ""),
  ) as CatalogFilterValues;

export const parseSearchParams = (searchParams: Record<string, string | string[] | undefined>): CatalogFilterValues => {
  const result: CatalogFilterValues = {};

  for (const [key, value] of Object.entries(searchParams)) {
    const normalized = toStringValue(value).trim();
    if (normalized) {
      result[key] = normalized;
    }
  }

  return result;
};

export const buildQueryString = (filters: CatalogFilterValues) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(cleanFilters(filters))) {
    params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const toFilterState = (segment: SegmentKey, searchParams: Record<string, string | string[] | undefined>) => {
  const filters = parseSearchParams(searchParams);
  const allowed = new Set(getFilterDefinitions(segment).map((definition) => definition.key).concat(["q", "search"]));

  return Object.fromEntries(Object.entries(filters).filter(([key]) => allowed.has(key))) as CatalogFilterValues;
};

const toScopeSummary = (scope: CatalogScope): CatalogScopeSummary => ({
  segment: scope.segment.key,
  company: scope.company ?? null,
  title: scope.title,
  subtitle: scope.subtitle,
  publicPath: scope.publicPath,
  apiPath: scope.apiPath,
});

export const getFilteredItems = (segment: SegmentKey, filters: CatalogFilterValues, companySlug?: string) =>
  filterIndexedItems(segment, cleanFilters(filters), companySlug);

export const buildCatalogListPayload = (scope: CatalogScope, filters: CatalogFilterValues): CatalogListPayload => {
  const applied = cleanFilters(filters);
  const items = getFilteredItems(scope.segment.key, applied, scope.company?.slug);

  return {
    scope: toScopeSummary(scope),
    count: items.length,
    filters: {
      applied,
      definitions: getFilterDefinitions(scope.segment.key),
      facets: getIndexedFacets(scope.segment.key, scope.company?.slug),
    },
    items,
  };
};

export const buildCatalogDetailPayload = (scope: CatalogScope, item: CatalogItem): CatalogDetailPayload => ({
  scope: toScopeSummary(scope),
  item,
  links: {
    publicPath: `${scope.publicPath}/${item.slug}`,
    apiPath: `${scope.apiPath}/${item.slug}`,
  },
});

export const routeTitle = (segment: SegmentKey, companySlug?: string) => {
  const company = getCompanyBySlug(companySlug);
  const config = getSegmentConfig(segment);
  return company ? `${company.name} · ${config.label}` : config.label;
};

export const routeSubtitle = (segment: SegmentKey, companySlug?: string) => {
  const company = getCompanyBySlug(companySlug);
  const config = getSegmentConfig(segment);
  return company ? company.tagline : config.description;
};

export const getAllSegments = () => segments;

export const getItemLabel = (item: CatalogItem) => {
  if (item.segment === "imoveis") {
    return `${item.details.type} · ${item.details.city} · ${formatCurrency(item.price)}`;
  }
  if (item.segment === "veiculos") {
    return `${item.details.brand} ${item.details.model} · ${item.details.year} · ${formatCurrency(item.price)}`;
  }
  if (item.segment === "ecommerce") {
    return `${item.details.category} · ${item.details.color} · ${formatCompactCurrency(item.price)}`;
  }
  return `${item.details.category} · serve ${item.details.serves} · ${formatCompactCurrency(item.price)}`;
};

export { inferFiltersFromPhrase };
