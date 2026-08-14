import type { Lead } from "./types";

const HEADER = [
  "id",
  "nome",
  "empresa",
  "cargo",
  "localizacao",
  "telefone",
  "email",
  "whatsappUrl",
  "linkedinUrl",
  "siteUrl",
  "origemUrl",
  "origemTitulo",
  "origemPlataforma",
  "score",
  "confidence",
  "status",
  "tags",
  "lists",
  "dataCaptura",
  "updatedAt",
];

function escapeCsvCell(value: unknown): string {
  const s = String(value ?? "");
  const needsQuote = /[\";\n\r]/.test(s);
  const escaped = s.replaceAll('"', '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

export function leadsToCsv(leads: Lead[], delimiter = ";"): string {
  const lines: string[] = [];
  lines.push(HEADER.join(delimiter));
  for (const lead of leads) {
    const row = [
      lead.id,
      lead.nome ?? "",
      lead.empresa ?? "",
      lead.cargo ?? "",
      lead.localizacao ?? "",
      lead.telefone ?? "",
      lead.email ?? "",
      lead.whatsappUrl ?? "",
      lead.linkedinUrl ?? "",
      lead.siteUrl ?? "",
      lead.origemUrl ?? "",
      lead.origemTitulo ?? "",
      lead.origemPlataforma ?? "",
      String(lead.score ?? 0),
      String(lead.confidence ?? 0),
      lead.status ?? "new",
      (lead.tags || []).join(","),
      (lead.lists || []).join(","),
      lead.dataCaptura ?? "",
      lead.updatedAt ?? "",
    ].map(escapeCsvCell);
    lines.push(row.join(delimiter));
  }
  // UTF-8; Excel PT-BR usually opens better with BOM.
  return `\uFEFF${lines.join("\n")}\n`;
}
