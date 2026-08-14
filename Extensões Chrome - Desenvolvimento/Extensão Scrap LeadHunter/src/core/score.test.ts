import { describe, expect, it } from "vitest";
import type { Lead } from "./types";
import { computeScore } from "./score";

function lead(overrides: Partial<Lead> = {}): Lead {
  const now = new Date().toISOString();
  return {
    id: "lead_1",
    origemUrl: "https://example.com",
    score: 0,
    confidence: 0.6,
    status: "new",
    tags: [],
    lists: [],
    dataCaptura: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("computeScore", () => {
  it("rewards contact richness and trusted sources", () => {
    const score = computeScore(
      lead({
        telefone: "+5511988224433",
        email: "test@example.com",
        nome: "Ana",
        empresa: "ACME",
        cargo: "CEO",
        origemPlataforma: "linkedin",
      }),
    );
    expect(score).toBeGreaterThan(60);
  });
});
