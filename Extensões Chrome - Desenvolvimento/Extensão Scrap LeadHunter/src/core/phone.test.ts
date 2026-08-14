import { describe, expect, it } from "vitest";
import { normalizePhoneBR, waMeUrlFromE164 } from "./phone";

describe("normalizePhoneBR", () => {
  it("normalizes common BR formats", () => {
    expect(normalizePhoneBR("(11) 98822-4433")).toBe("+5511988224433");
    expect(normalizePhoneBR("11 98822 4433")).toBe("+5511988224433");
    expect(normalizePhoneBR("+55 (11) 98822-4433")).toBe("+5511988224433");
    expect(normalizePhoneBR("21 97722-1100")).toBe("+5521977221100");
  });

  it("rejects invalid lengths", () => {
    expect(normalizePhoneBR("123")).toBeNull();
    expect(normalizePhoneBR("5511")).toBeNull();
    expect(normalizePhoneBR("559999999999999")).toBeNull();
  });
});

describe("waMeUrlFromE164", () => {
  it("builds wa.me URL", () => {
    expect(waMeUrlFromE164("+5511988224433")).toBe("https://wa.me/5511988224433");
  });
});

