import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET as getSegmentCatalog } from "../app/api/catalogos/[segment]/route";
import { inferFiltersFromPhrase } from "../lib/catalog-browser";
import {
  buildCatalogListPayload,
  getFilteredItems,
  getItemBySlug,
  getScope,
} from "../lib/catalog-utils";
import { CatalogItem } from "../lib/catalog-types";

const slugs = (items: CatalogItem[]) => items.map((item) => item.slug).sort();

test("e-commerce filters match product variants by color, size and variation", () => {
  assert.deepEqual(slugs(getFilteredItems("ecommerce", { cor: "azul" })), ["fone-pulse-pro"]);
  assert.ok(slugs(getFilteredItems("ecommerce", { tamanho: "G" })).includes("camiseta-essential"));
  assert.deepEqual(slugs(getFilteredItems("ecommerce", { variacao: "azul", estoque_min: "1" })), ["fone-pulse-pro"]);
});

test("natural language examples produce stable filters", () => {
  const vehicle = inferFiltersFromPhrase("veiculos", "Tem Corolla 2024 com baixa quilometragem?", {
    marca: ["Toyota"],
    modelo: ["Corolla"],
  });
  assert.equal(vehicle.marca, "Toyota");
  assert.equal(vehicle.modelo, "Corolla");
  assert.equal(vehicle.ano_min, "2024");
  assert.equal(vehicle.km_max, "30000");

  const property = inferFiltersFromPhrase("imoveis", "Algo financiável na Zona 07?", {
    bairro: ["Zona 07"],
    cidade: ["Maringá"],
  });
  assert.equal(property.financiamento, "true");
  assert.equal(property.bairro, "Zona 07");

  const product = inferFiltersFromPhrase("ecommerce", "Tem preta tamanho G?");
  assert.equal(product.cor, "preto");
  assert.equal(product.tamanho, "G");
  assert.notEqual(product.tamanho, "P");

  const budget = inferFiltersFromPhrase("imoveis", "Apartamento até 1 milhão");
  assert.equal(budget.preco_max, "1000000");
});

test("scoped slug lookup resolves by company without falling back to another scope", () => {
  const scopedItem = getItemBySlug("food", "pizza-calabresa", "pizza-bella");
  assert.equal(scopedItem?.companySlug, "pizza-bella");

  const wrongCompany = getItemBySlug("food", "pizza-calabresa", "urban-store");
  assert.equal(wrongCompany, undefined);
});

test("API route list payload matches the shared human listing payload item IDs", async () => {
  const request = new NextRequest("http://localhost/api/catalogos/ecommerce?cor=azul&estoque_min=1");
  const response = await getSegmentCatalog(request, { params: Promise.resolve({ segment: "ecommerce" }) });
  assert.equal(response.status, 200);

  const apiPayload = await response.json();
  const humanPayload = buildCatalogListPayload(getScope("ecommerce"), { cor: "azul", estoque_min: "1" });

  assert.deepEqual(slugs(apiPayload.items), slugs(humanPayload.items));
  assert.deepEqual(apiPayload.filters.applied, humanPayload.filters.applied);
});
