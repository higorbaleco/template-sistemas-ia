export type SegmentKey = "imoveis" | "veiculos" | "ecommerce" | "food";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterDefinition = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "boolean";
  placeholder?: string;
  options?: FilterOption[];
  step?: number;
};

export type CatalogCompany = {
  slug: string;
  name: string;
  segment: SegmentKey;
  city: string;
  description: string;
  accent: string;
  tagline: string;
};

export type SegmentConfig = {
  key: SegmentKey;
  label: string;
  shortLabel: string;
  publicPath: string;
  apiPath: string;
  description: string;
  defaultCompanySlug: string;
  filterDefinitions: FilterDefinition[];
  queryExamples: string[];
};

export type BaseCatalogItem = {
  id: string;
  slug: string;
  name: string;
  companySlug: string;
  companyName: string;
  segment: SegmentKey;
  status: "ativo" | "esgotado" | "rascunho";
  description: string;
  price: number;
  originalPrice?: number;
  highlights: string[];
  galleryTone: string;
  featured?: boolean;
};

export type PropertyItem = BaseCatalogItem & {
  segment: "imoveis";
  details: {
    type: "apartamento" | "casa" | "terreno" | "comercial" | "chacara" | "studio" | "cobertura";
    purpose: "venda" | "aluguel";
    city: string;
    neighborhood: string;
    address: string;
    bedrooms: number;
    suites: number;
    bathrooms: number;
    parking: number;
    areaUseful: number;
    areaTotal: number;
    furnished: boolean;
    financing: boolean;
    pets: boolean;
    condominium: number;
    iptu: number;
    features: string[];
  };
};

export type VehicleItem = BaseCatalogItem & {
  segment: "veiculos";
  details: {
    brand: string;
    model: string;
    version: string;
    year: number;
    modelYear: number;
    mileage: number;
    gearbox: "manual" | "automatico" | "cvt";
    fuel: "flex" | "gasolina" | "diesel" | "eletrico" | "hibrido";
    body: "hatch" | "sedan" | "suv" | "picape" | "utilitario";
    color: string;
    doors: number;
    exchange: boolean;
    financing: boolean;
    warranty: boolean;
    oneOwner: boolean;
    blindado: boolean;
    features: string[];
  };
};

export type ProductItem = BaseCatalogItem & {
  segment: "ecommerce";
  details: {
    sku: string;
    brand: string;
    category: string;
    subcategory: string;
    color: string;
    size: string;
    material: string;
    stock: number;
    warrantyMonths: number;
    features: string[];
    variants: Array<{
      label: string;
      value: string;
      stock: number;
      price: number;
    }>;
  };
};

export type FoodItem = BaseCatalogItem & {
  segment: "food";
  details: {
    category: string;
    serves: number;
    prepTime: number;
    ingredients: string[];
    allergens: string[];
    removals: string[];
    addOns: Array<{
      label: string;
      price: number;
    }>;
    sizes: Array<{
      label: string;
      price: number;
    }>;
  };
};

export type CatalogItem = PropertyItem | VehicleItem | ProductItem | FoodItem;

export type CatalogFilterValues = Record<string, string>;

export type CatalogScope = {
  segment: SegmentConfig;
  company?: CatalogCompany;
  items: CatalogItem[];
  title: string;
  subtitle: string;
  publicPath: string;
  apiPath: string;
};

export type CatalogScopeSummary = {
  segment: SegmentKey;
  company: CatalogCompany | null;
  title: string;
  subtitle: string;
  publicPath: string;
  apiPath: string;
};

export type CatalogIndexEntry = {
  item: CatalogItem;
  companySlug: string;
  searchText: string;
  facets: Record<string, string[]>;
};

export type CatalogSegmentIndex = {
  segment: SegmentKey;
  items: CatalogItem[];
  entries: CatalogIndexEntry[];
  itemBySlug: Map<string, CatalogIndexEntry>;
  facets: Record<string, string[]>;
};

export type CatalogListPayload = {
  scope: CatalogScopeSummary;
  count: number;
  filters: {
    applied: CatalogFilterValues;
    definitions: FilterDefinition[];
    facets: Record<string, string[]>;
  };
  items: CatalogItem[];
};

export type CatalogDetailPayload = {
  scope: CatalogScopeSummary;
  item: CatalogItem;
  links: {
    publicPath: string;
    apiPath: string;
  };
};
