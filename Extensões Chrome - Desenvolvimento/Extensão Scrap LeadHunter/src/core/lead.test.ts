import { describe, expect, it } from "vitest";
import type { Lead } from "./types";
import { mergeLead } from "./lead";

function baseLead(): Lead {
  const now = new Date().toISOString();
  return {
    id: "lead_1",
    nome: "",
    telefone: "+5511988224433",
    origemUrl: "https://example.com",
    score: 0,
    confidence: 0.6,
    status: "new",
    tags: [],
    lists: [],
    dataCaptura: now,
    updatedAt: now,
  };
}

describe("mergeLead", () => {
  it("fills empty fields only", () => {
    const a = baseLead();
    const b = mergeLead(a, { nome: "Ricardo Mendes", origemUrl: "https://changed.com" } as any);
    expect(b.nome).toBe("Ricardo Mendes");
    // origemUrl should not be overwritten when existing is non-empty.
    expect(b.origemUrl).toBe("https://example.com");
  });
});
