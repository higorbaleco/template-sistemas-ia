import { catalogItems } from "./catalog-data";
import { inferFiltersFromPhrase as inferBrowserFilters, normalizeText } from "./catalog-browser";
import {
  CatalogFilterValues,
  CatalogIndexEntry,
  CatalogItem,
  CatalogSegmentIndex,
  SegmentKey,
} from "./catalog-types";

const uniqueSorted = (values: string[]) =>
  Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ).sort((left, right) => left.localeCompare(right, "pt-BR"));

const toNumber = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toBoolean = (value?: string) => {
  if (!value) return undefined;
  const normalized = normalizeText(value);
  if (["1", "true", "sim", "yes"].includes(normalized)) return true;
  if (["0", "false", "nao", "não", "no"].includes(normalized)) return false;
  return undefined;
};

const stringify = (value: string | number | boolean) => String(value);

const scopedSlugKey = (companySlug: string, slug: string) => `${companySlug}:${slug}`;

const splitTokens = (value: string) => normalizeText(value).split(/[^a-z0-9]+/).filter(Boolean);

const matchesToken = (actual: string, expected?: string) => {
  if (!expected) return true;
  const normalizedExpected = normalizeText(expected);
  if (!normalizedExpected) return true;
  return splitTokens(actual).includes(normalizedExpected);
};

const commerceColorTerms: Record<string, string[]> = {
  preto: ["preto", "preta"],
  branco: ["branco", "branca"],
  cinza: ["cinza"],
  azul: ["azul"],
  grafite: ["grafite"],
  prata: ["prata"],
  rose: ["rose"],
  marrom: ["marrom"],
};

const matchesCommerceColor = (actual: string, expected?: string) => {
  if (!expected) return true;
  const normalizedExpected = normalizeText(expected);
  const terms = commerceColorTerms[normalizedExpected] ?? [normalizedExpected];
  const actualTokens = splitTokens(actual);
  return terms.some((term) => actualTokens.includes(term) || normalizeText(actual).includes(term));
};

const getProductVariantText = (variant: { label: string; value: string }) => `${variant.label} ${variant.value}`;

const getVariantFacetValues = (item: CatalogItem, kind: "cor" | "tamanho" | "variacao") => {
  if (item.segment !== "ecommerce") return [];
  if (kind === "variacao") {
    return item.details.variants.flatMap((variant) => [variant.label, variant.value]);
  }
  if (kind === "cor") {
    const colorValues = item.details.variants.flatMap((variant) => {
      const text = normalizeText(getProductVariantText(variant));
      return Object.entries(commerceColorTerms)
        .filter(([, terms]) => terms.some((term) => splitTokens(text).includes(term)))
        .map(([color]) => color);
    });
    return [item.details.color, ...colorValues];
  }

  const sizeTokens = ["pp", "p", "m", "g", "gg"];
  const variantSizes = item.details.variants.flatMap((variant) =>
    splitTokens(getProductVariantText(variant)).filter((token) => sizeTokens.includes(token) || /^\d{2}$/.test(token)),
  );
  return [item.details.size, ...variantSizes.map((value) => value.toUpperCase())];
};

const toSearchParts = (item: CatalogItem) => {
  if (item.segment === "imoveis") {
    return [
      item.name,
      item.description,
      item.companyName,
      item.highlights.join(" "),
      item.details.type,
      item.details.purpose,
      item.details.city,
      item.details.neighborhood,
      item.details.address,
      stringify(item.details.bedrooms),
      stringify(item.details.suites),
      stringify(item.details.bathrooms),
      stringify(item.details.parking),
      item.details.features.join(" "),
    ];
  }

  if (item.segment === "veiculos") {
    return [
      item.name,
      item.description,
      item.companyName,
      item.highlights.join(" "),
      item.details.brand,
      item.details.model,
      item.details.version,
      item.details.body,
      item.details.gearbox,
      item.details.fuel,
      item.details.color,
      stringify(item.details.year),
      stringify(item.details.modelYear),
      item.details.features.join(" "),
    ];
  }

  if (item.segment === "ecommerce") {
    return [
      item.name,
      item.description,
      item.companyName,
      item.highlights.join(" "),
      item.details.sku,
      item.details.brand,
      item.details.category,
      item.details.subcategory,
      item.details.color,
      item.details.size,
      item.details.material,
      item.details.features.join(" "),
      item.details.variants.map((variant) => `${variant.label} ${variant.value}`).join(" "),
    ];
  }

  return [
    item.name,
    item.description,
    item.companyName,
    item.highlights.join(" "),
    item.details.category,
    item.details.ingredients.join(" "),
    item.details.allergens.join(" "),
    item.details.removals.join(" "),
    item.details.addOns.map((addOn) => addOn.label).join(" "),
    item.details.sizes.map((size) => size.label).join(" "),
  ];
};

const toEntryFacets = (item: CatalogItem): Record<string, string[]> => {
  if (item.segment === "imoveis") {
    return {
      tipo: [item.details.type],
      finalidade: [item.details.purpose],
      cidade: [item.details.city],
      bairro: [item.details.neighborhood],
    };
  }

  if (item.segment === "veiculos") {
    return {
      marca: [item.details.brand],
      modelo: [item.details.model],
      carroceria: [item.details.body],
      cambio: [item.details.gearbox],
      combustivel: [item.details.fuel],
    };
  }

  if (item.segment === "ecommerce") {
    return {
      categoria: [item.details.category],
      subcategoria: [item.details.subcategory],
      marca: [item.details.brand],
      cor: getVariantFacetValues(item, "cor"),
      tamanho: getVariantFacetValues(item, "tamanho"),
      variacao: getVariantFacetValues(item, "variacao"),
    };
  }

  return {
    categoria: [item.details.category],
    adicional: item.details.addOns.map((addOn) => addOn.label),
    alergeno: item.details.allergens,
    sem: item.details.removals,
  };
};

const buildEntry = (item: CatalogItem): CatalogIndexEntry => ({
  item,
  companySlug: item.companySlug,
  searchText: normalizeText(toSearchParts(item).join(" ")),
  facets: toEntryFacets(item),
});

const segmentKeys: SegmentKey[] = ["imoveis", "veiculos", "ecommerce", "food"];

const buildSegmentIndex = (segment: SegmentKey): CatalogSegmentIndex => {
  const items = catalogItems.filter((item) => item.segment === segment);
  const entries = items.map(buildEntry);
  const itemBySlug = new Map<string, CatalogIndexEntry>();
  const itemByScopedSlug = new Map<string, CatalogIndexEntry>();

  for (const entry of entries) {
    const existingUnscoped = itemBySlug.get(entry.item.slug);
    if (existingUnscoped) {
      throw new Error(
        `Duplicate unscoped slug "${entry.item.slug}" in segment "${segment}" between "${existingUnscoped.companySlug}" and "${entry.companySlug}". Use company-scoped routes or unique segment slugs.`,
      );
    }

    const scopedKey = scopedSlugKey(entry.companySlug, entry.item.slug);
    if (itemByScopedSlug.has(scopedKey)) {
      throw new Error(`Duplicate scoped slug "${scopedKey}" in segment "${segment}".`);
    }

    itemBySlug.set(entry.item.slug, entry);
    itemByScopedSlug.set(scopedKey, entry);
  }

  const facets = uniqueSorted(
    entries.flatMap((entry) => Object.entries(entry.facets).flatMap(([key, values]) => values.map((value) => `${key}:${value}`))),
  ).reduce<Record<string, string[]>>((result, facetPair) => {
    const [key, ...rest] = facetPair.split(":");
    const value = rest.join(":");
    result[key] = [...(result[key] ?? []), value];
    return result;
  }, {});

  for (const key of Object.keys(facets)) {
    facets[key] = uniqueSorted(facets[key]);
  }

  return {
    segment,
    items,
    entries,
    itemBySlug,
    itemByScopedSlug,
    facets,
  };
};

const catalogIndexes = new Map<SegmentKey, CatalogSegmentIndex>(
  segmentKeys.map((segment) => [segment, buildSegmentIndex(segment)]),
);

const matchesText = (entry: CatalogIndexEntry, query?: string) => {
  if (!query) return true;
  return entry.searchText.includes(normalizeText(query));
};

const matchesString = (actual: string, expected?: string) => {
  if (!expected) return true;
  return normalizeText(actual).includes(normalizeText(expected));
};

const matchesBoolean = (actual: boolean, expected?: string) => {
  if (!expected) return true;
  const parsed = toBoolean(expected);
  if (parsed === undefined) return true;
  return actual === parsed;
};

const matchesMin = (actual: number, expected?: string) => {
  const parsed = toNumber(expected);
  if (parsed === undefined) return true;
  return actual >= parsed;
};

const matchesMax = (actual: number, expected?: string) => {
  const parsed = toNumber(expected);
  if (parsed === undefined) return true;
  return actual <= parsed;
};

const matchesProductVariants = (item: Extract<CatalogItem, { segment: "ecommerce" }>, filters: CatalogFilterValues) => {
  const variantFilters = [filters.cor, filters.tamanho, filters.variacao, filters.estoque_min, filters.preco_max].some(Boolean);
  if (!variantFilters) {
    return matchesMax(item.price, filters.preco_max) && matchesMin(item.details.stock, filters.estoque_min);
  }

  return item.details.variants.some((variant) => {
    const variantText = getProductVariantText(variant);
    return (
      matchesCommerceColor(variantText, filters.cor) &&
      matchesToken(variantText, filters.tamanho) &&
      matchesString(variantText, filters.variacao) &&
      matchesMax(variant.price, filters.preco_max) &&
      matchesMin(variant.stock, filters.estoque_min)
    );
  });
};

const matchesFilters = (entry: CatalogIndexEntry, filters: CatalogFilterValues) => {
  const { item } = entry;
  const query = filters.q ?? filters.search;

  if (!matchesText(entry, query)) {
    return false;
  }

  if (item.segment === "imoveis") {
    return (
      matchesString(item.details.type, filters.tipo) &&
      matchesString(item.details.purpose, filters.finalidade) &&
      matchesString(item.details.city, filters.cidade) &&
      matchesString(item.details.neighborhood, filters.bairro) &&
      matchesMin(item.details.bedrooms, filters.quartos_min) &&
      matchesMax(item.price, filters.preco_max) &&
      matchesBoolean(item.details.furnished, filters.mobiliado) &&
      matchesBoolean(item.details.financing, filters.financiamento) &&
      matchesBoolean(item.details.pets, filters.pets)
    );
  }

  if (item.segment === "veiculos") {
    return (
      matchesString(item.details.brand, filters.marca) &&
      matchesString(item.details.model, filters.modelo) &&
      matchesString(item.details.body, filters.carroceria) &&
      matchesString(item.details.gearbox, filters.cambio) &&
      matchesString(item.details.fuel, filters.combustivel) &&
      matchesMin(item.details.year, filters.ano_min) &&
      matchesMax(item.price, filters.preco_max) &&
      matchesMax(item.details.mileage, filters.km_max) &&
      matchesBoolean(item.details.exchange, filters.troca) &&
      matchesBoolean(item.details.financing, filters.financiamento)
    );
  }

  if (item.segment === "ecommerce") {
    return (
      matchesString(item.details.category, filters.categoria) &&
      matchesString(item.details.subcategory, filters.subcategoria) &&
      matchesString(item.details.brand, filters.marca) &&
      matchesString(item.details.sku, filters.sku) &&
      matchesProductVariants(item, filters)
    );
  }

  return (
    matchesString(item.details.category, filters.categoria) &&
    matchesMin(item.details.serves, filters.serve_min) &&
    matchesMax(item.price, filters.preco_max) &&
    matchesString(item.details.removals.join(" "), filters.sem) &&
    matchesString(item.details.addOns.map((addOn) => addOn.label).join(" "), filters.adicional) &&
    matchesString(item.details.allergens.join(" "), filters.alergeno)
  );
};

export const getCatalogIndex = (segment: SegmentKey) => {
  const index = catalogIndexes.get(segment);
  if (!index) {
    throw new Error(`Unknown segment: ${segment}`);
  }
  return index;
};

export const getIndexedItem = (segment: SegmentKey, slug: string, companySlug?: string) => {
  const index = getCatalogIndex(segment);
  const entry = companySlug ? index.itemByScopedSlug.get(scopedSlugKey(companySlug, slug)) : index.itemBySlug.get(slug);
  if (!entry) return undefined;
  return entry.item;
};

export const getIndexedItems = (segment: SegmentKey, companySlug?: string) =>
  getCatalogIndex(segment).entries
    .filter((entry) => !companySlug || entry.companySlug === companySlug)
    .map((entry) => entry.item);

export const getIndexedFacets = (segment: SegmentKey, companySlug?: string) => {
  if (!companySlug) {
    return getCatalogIndex(segment).facets;
  }

  const scopedEntries = getCatalogIndex(segment).entries.filter((entry) => entry.companySlug === companySlug);
  const scopedFacets: Record<string, string[]> = {};

  for (const entry of scopedEntries) {
    for (const [key, values] of Object.entries(entry.facets)) {
      scopedFacets[key] = uniqueSorted([...(scopedFacets[key] ?? []), ...values]);
    }
  }

  return scopedFacets;
};

export const filterIndexedItems = (segment: SegmentKey, filters: CatalogFilterValues, companySlug?: string) =>
  getCatalogIndex(segment).entries
    .filter((entry) => (!companySlug || entry.companySlug === companySlug) && matchesFilters(entry, filters))
    .map((entry) => entry.item);

export const inferFiltersFromPhrase = (segment: SegmentKey, phrase: string): CatalogFilterValues => {
  return inferBrowserFilters(segment, phrase, getIndexedFacets(segment));
};
