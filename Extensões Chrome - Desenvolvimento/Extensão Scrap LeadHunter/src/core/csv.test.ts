import { describe, expect, it } from "vitest";
import type { Lead } from "./types";
import { leadsToCsv } from "./csv";

describe("leadsToCsv", () => {
  it("exports header and rows with BOM and ; delimiter", () => {
    const now = new Date().toISOString();
    const leads: Lead[] = [
      {
        id: "1",
        nome: "Ana;Costa",
        empresa: "ACME \"Inc\"",
        telefone: "+5511999999999",
        origemUrl: "https://example.com",
        score: 0,
        confidence: 0,
        status: "new",
        tags: [],
        lists: [],
        dataCaptura: now,
        updatedAt: now,
      },
    ];
    const csv = leadsToCsv(leads, ";");
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("id;nome;empresa;cargo;localizacao;telefone;email;whatsappUrl;linkedinUrl;siteUrl;origemUrl");
    expect(csv).toContain("\"Ana;Costa\"");
    expect(csv).toContain("\"ACME \"\"Inc\"\"\"");
  });
});
