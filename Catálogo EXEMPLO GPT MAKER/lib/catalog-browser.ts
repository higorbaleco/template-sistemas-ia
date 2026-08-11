import { CatalogFilterValues, CatalogItem, SegmentKey } from "./catalog-types";

export const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const cleanFilters = (filters: CatalogFilterValues) =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => typeof value === "string" && value.trim() !== ""),
  ) as CatalogFilterValues;

export const buildQueryString = (filters: CatalogFilterValues) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(cleanFilters(filters))) {
    params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

export const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(value);

export const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

const phrasePriceToValue = (phrase: string) => {
  const match = normalizeText(phrase).match(
    /(?:ate|até|max(?:imo|imum)?|por|custa|orcamento|orcamento de|orçamento de)[^\d]*(\d+(?:[.,]\d+)?)\s*(milhoes|milhao|mil|k)?/,
  );

  if (!match) return undefined;

  const numeric = Number(match[1].replace(",", "."));
  if (!Number.isFinite(numeric)) return undefined;

  const multiplier = match[2]?.startsWith("milhao") || match[2]?.startsWith("milhoes") ? 1_000_000 : match[2] ? 1_000 : 1;
  return String(Math.round(numeric * multiplier));
};

const hasToken = (text: string, token: string) =>
  new RegExp(`(^|[^a-z0-9])${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i").test(text);

const findKnownValue = (text: string, values: string[]) => values.find((value) => text.includes(normalizeText(value)));

const commerceColors = [
  { canonical: "preto", terms: ["preto", "preta"] },
  { canonical: "branco", terms: ["branco", "branca"] },
  { canonical: "cinza", terms: ["cinza"] },
  { canonical: "azul", terms: ["azul"] },
  { canonical: "grafite", terms: ["grafite"] },
  { canonical: "prata", terms: ["prata"] },
  { canonical: "rose", terms: ["rose"] },
  { canonical: "marrom", terms: ["marrom"] },
];

const vehicleModelBrands: Record<string, string> = {
  corolla: "Toyota",
  civic: "Honda",
  compass: "Jeep",
  renegade: "Jeep",
  onix: "Chevrolet",
  hilux: "Toyota",
  ranger: "Ford",
  toro: "Fiat",
};

export const inferFiltersFromPhrase = (segment: SegmentKey, phrase: string, facets: Record<string, string[]> = {}): CatalogFilterValues => {
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
    if (text.includes("financiavel") || text.includes("financiamento") || text.includes("financiar")) {
      filters.financiamento = "true";
    }

    const city = findKnownValue(text, facets.cidade ?? ["Maringá", "Londrina", "Cianorte", "Campo Mourão", "Paranavaí", "Apucarana", "Sarandi"]);
    if (city) filters.cidade = city;

    const neighborhood = findKnownValue(text, facets.bairro ?? []);
    if (neighborhood) filters.bairro = neighborhood;

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
    if (text.includes("baixa quilometragem") || text.includes("baixo km") || text.includes("pouco rodado")) {
      filters.km_max = "30000";
    }
    if (text.includes("troca")) filters.troca = "true";
    if (text.includes("financiavel") || text.includes("financiamento") || text.includes("financiar")) {
      filters.financiamento = "true";
    }

    const brand = findKnownValue(text, facets.marca ?? []);
    if (brand) filters.marca = brand;
    const model = findKnownValue(text, facets.modelo ?? []);
    if (model) filters.modelo = model;
    const inferredBrand = model ? vehicleModelBrands[normalizeText(model)] : undefined;
    if (!filters.marca && inferredBrand) filters.marca = inferredBrand;

    const year = text.match(/20\d{2}/);
    if (year) filters.ano_min = year[0];
    if (price) filters.preco_max = price;
  }

  if (segment === "ecommerce") {
    const color = commerceColors.find((entry) => entry.terms.some((term) => hasToken(text, term)));
    if (color) filters.cor = color.canonical;

    const size = text.match(/(?:tamanho|tam|numero|n(?:u|ú)mero)\s*(pp|p|m|g|gg|\d{2}|unico|único)\b/)?.[1] ??
      ["pp", "p", "m", "g", "gg"].find((value) => hasToken(text, value));
    if (size) filters.tamanho = normalizeText(size).toUpperCase();

    if (text.includes("notebook") || text.includes("fone")) filters.categoria = "eletrônicos";
    if (text.includes("camiseta")) filters.categoria = "moda";
    if (text.includes("com estoque") || text.includes("disponivel") || text.includes("disponível")) {
      filters.estoque_min = "1";
    }
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
