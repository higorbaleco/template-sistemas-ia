import { catalogItems } from "./catalog-data";
import {
  CatalogFilterValues,
  CatalogIndexEntry,
  CatalogItem,
  CatalogSegmentIndex,
  SegmentKey,
} from "./catalog-types";

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

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
      cor: [item.details.color],
      tamanho: [item.details.size],
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
  const itemBySlug = new Map(entries.map((entry) => [entry.item.slug, entry]));
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
      matchesString(item.details.color, filters.cor) &&
      matchesString(item.details.size, filters.tamanho) &&
      matchesString(item.details.sku, filters.sku) &&
      matchesMax(item.price, filters.preco_max) &&
      matchesMin(item.details.stock, filters.estoque_min)
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

const phrasePriceToValue = (phrase: string) => {
  const match = normalizeText(phrase).match(
    /(?:ate|até|max(?:imo|imum)?|por|custa|orcamento)[^\d]*(\d+(?:[.,]\d+)?)\s*(mil|milhao|milhoes|k)?/,
  );

  if (!match) return undefined;

  const numeric = Number(match[1].replace(",", "."));
  if (!Number.isFinite(numeric)) return undefined;

  if (match[2]) {
    return String(Math.round(numeric * 1000));
  }

  return String(Math.round(numeric));
};

export const getCatalogIndex = (segment: SegmentKey) => {
  const index = catalogIndexes.get(segment);
  if (!index) {
    throw new Error(`Unknown segment: ${segment}`);
  }
  return index;
};

export const getIndexedItem = (segment: SegmentKey, slug: string, companySlug?: string) => {
  const entry = getCatalogIndex(segment).itemBySlug.get(slug);
  if (!entry) return undefined;
  if (companySlug && entry.companySlug !== companySlug) return undefined;
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
  const text = normalizeText(phrase);
  const filters: CatalogFilterValues = {};
  const price = phrasePriceToValue(phrase);

  if (segment === "imoveis") {
    if (text.includes("apart")) filters.tipo = "apartamento";
    if (text.includes("casa")) filters.tipo = "casa";
    if (text.includes("terreno")) filters.tipo = "terreno";
    if (text.includes("studio")) filters.tipo = "studio";
    if (text.includes("cobertura")) filters.tipo = "cobertura";
    if (text.includes("aluguel") || text.includes("alugar")) filters.finalidade = "aluguel";
    if (text.includes("venda") || text.includes("compr")) filters.finalidade = "venda";

    const city = ["maringa", "londrina", "cianorte", "campo mourao", "paranavai", "apucarana", "sarandi"].find((value) =>
      text.includes(value),
    );
    if (city) filters.cidade = city;

    const bedrooms = text.match(/(\d+)\s*quartos?/);
    if (bedrooms) filters.quartos_min = bedrooms[1];
    if (price) filters.preco_max = price;
  }

  if (segment === "veiculos") {
    if (text.includes("suv")) filters.carroceria = "suv";
    if (text.includes("picape")) filters.carroceria = "picape";
    if (text.includes("sedan")) filters.carroceria = "sedan";
    if (text.includes("hatch")) filters.carroceria = "hatch";
    if (text.includes("utilitario")) filters.carroceria = "utilitario";
    if (text.includes("automatic")) filters.cambio = "automatico";
    if (text.includes("manual")) filters.cambio = "manual";
    if (text.includes("cvt")) filters.cambio = "cvt";
    if (text.includes("diesel")) filters.combustivel = "diesel";
    if (text.includes("flex")) filters.combustivel = "flex";
    if (text.includes("gasolina")) filters.combustivel = "gasolina";
    if (text.includes("eletric")) filters.combustivel = "eletrico";
    if (text.includes("hibrid")) filters.combustivel = "hibrido";

    const year = text.match(/20\d{2}/);
    if (year) filters.ano_min = year[0];
    if (price) filters.preco_max = price;
  }

  if (segment === "ecommerce") {
    if (text.includes("preto") || text.includes("preta")) filters.cor = "preto";
    if (text.includes("branco") || text.includes("branca")) filters.cor = "branco";
    if (text.includes("cinza")) filters.cor = "cinza";

    const size = ["pp", "p", "m", "g", "gg"].find(
      (value) => text.includes(`tamanho ${value}`) || text.includes(` ${value}`),
    );
    if (size) filters.tamanho = size.toUpperCase();
    if (text.includes("notebook") || text.includes("fone")) filters.categoria = "eletrônicos";
    if (text.includes("camiseta")) filters.categoria = "moda";
    if (price) filters.preco_max = price;
  }

  if (segment === "food") {
    if (text.includes("pizza")) filters.categoria = "pizzas";
    if (text.includes("burger") || text.includes("hamburg")) filters.categoria = "burgers";
    if (text.includes("salada")) filters.categoria = "saladas";
    if (text.includes("sobremesa") || text.includes("brownie")) filters.categoria = "sobremesas";

    const serves = text.match(/(?:serve|para)\s*(\d+)/);
    if (serves) filters.serve_min = serves[1];
    if (text.includes("sem cebola")) filters.sem = "cebola";
    if (text.includes("sem lactose")) filters.sem = "lactose";
    if (text.includes("catupiry")) filters.adicional = "catupiry";
    if (text.includes("bacon")) filters.adicional = "bacon";
    if (price) filters.preco_max = price;
  }

  return filters;
};
