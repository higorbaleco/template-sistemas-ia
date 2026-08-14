import type { Lead } from "./types";

export function computeScore(lead: Lead): number {
  let score = 0;
  if (lead.telefone) score += 42;
  if (lead.whatsappUrl) score += 16;
  if (lead.email) score += 24;
  if (lead.linkedinUrl) score += 12;
  if (lead.siteUrl) score += 10;
  if (lead.nome) score += 8;
  if (lead.empresa) score += 8;
  if (lead.cargo) score += 4;
  if (lead.localizacao) score += 3;
  score += Math.round(Math.max(0, Math.min(1, lead.confidence || 0)) * 12);
  if (["google_maps", "linkedin", "institutional", "directory"].includes(lead.origemPlataforma || "")) {
    score += 5;
  }
  return Math.max(0, Math.min(100, score));
}

export function clampConfidence(v: unknown, fallback = 0.6): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}
