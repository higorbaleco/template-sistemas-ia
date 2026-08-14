import type { Lead } from "./types";
import { nowIso } from "./time";
import { uid } from "./id";
import { cleanText, normalizeEmail } from "./normalize";
import { waMeUrlFromE164 } from "./phone";

export function createLead(params: {
  origemUrl: string;
  origemTitulo?: string;
  origemPlataforma?: string;
  nome?: string;
  empresa?: string;
  cargo?: string;
  localizacao?: string;
  telefone?: string;
  email?: string;
  whatsappUrl?: string;
  linkedinUrl?: string;
  siteUrl?: string;
  baseConfidence?: number;
}): Lead {
  const now = nowIso();
  const telefone = params.telefone?.trim() || undefined;
  const email = normalizeEmail(params.email);
  const whatsappUrl = params.whatsappUrl?.trim() || (telefone ? waMeUrlFromE164(telefone) : undefined);
  return {
    id: uid("lead"),
    nome: cleanText(params.nome, 80),
    empresa: cleanText(params.empresa, 120),
    cargo: cleanText(params.cargo, 120),
    localizacao: cleanText(params.localizacao, 120),
    telefone,
    email,
    whatsappUrl: cleanText(whatsappUrl, 260),
    linkedinUrl: cleanText(params.linkedinUrl, 260),
    siteUrl: cleanText(params.siteUrl, 260),
    origemUrl: params.origemUrl,
    origemTitulo: cleanText(params.origemTitulo, 160),
    origemPlataforma: cleanText(params.origemPlataforma, 60),
    score: 0,
    confidence: Math.max(0, Math.min(1, Number(params.baseConfidence ?? 0.6))),
    status: "new",
    tags: [],
    lists: [],
    dataCaptura: now,
    updatedAt: now,
  };
}

export function mergeLead(existing: Lead, incoming: Partial<Lead>): Lead {
  // Merge policy:
  // - Never overwrite non-empty scalar fields; fill blanks only.
  // - Union tags/lists.
  // - Keep max(score/confidence).
  const merged: Lead = { ...existing };
  const scalarKeys: Array<keyof Lead> = [
    "nome",
    "empresa",
    "cargo",
    "localizacao",
    "telefone",
    "email",
    "whatsappUrl",
    "linkedinUrl",
    "siteUrl",
    "origemTitulo",
    "origemPlataforma",
  ];
  for (const key of scalarKeys) {
    const cur = (merged as any)[key];
    const next = (incoming as any)[key];
    if ((cur === undefined || cur === null || String(cur).trim() === "") && next) {
      (merged as any)[key] = next;
    }
  }

  if (incoming.status && merged.status === "new") merged.status = incoming.status;
  if (Array.isArray(incoming.tags) && incoming.tags.length) {
    merged.tags = Array.from(new Set([...(merged.tags || []), ...incoming.tags]));
  }
  if (Array.isArray(incoming.lists) && incoming.lists.length) {
    merged.lists = Array.from(new Set([...(merged.lists || []), ...incoming.lists]));
  }
  if (typeof incoming.score === "number") merged.score = Math.max(merged.score || 0, incoming.score);
  if (typeof incoming.confidence === "number")
    merged.confidence = Math.max(merged.confidence || 0, Math.min(1, incoming.confidence));

  merged.updatedAt = nowIso();
  return merged;
}
