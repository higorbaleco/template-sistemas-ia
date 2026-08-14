import type { AdapterResult, ExtractedLead } from "./types";
import { EMAIL_REGEX, PHONE_REGEX, uniq } from "../regex";

function textOf(el: Element | null): string {
  if (!el) return "";
  return (el as HTMLElement).innerText || el.textContent || "";
}

export function googleMapsAdapter(): AdapterResult {
  // Maps DOM is highly dynamic; keep this best-effort and lightweight.
  const cards = Array.from(document.querySelectorAll("[role='article']"));
  const leads: ExtractedLead[] = [];

  for (const c of cards.slice(0, 20)) {
    const name = textOf(c.querySelector("a[aria-label]")) || textOf(c.querySelector("div[aria-label]"));
    const allText = textOf(c);
    const phones = uniq((allText.match(PHONE_REGEX) || []).map((s) => s.trim()));
    const emails = uniq((allText.match(EMAIL_REGEX) || []).map((s) => s.trim()));

    const lead: ExtractedLead = { nome: name || undefined, confidence: 0.65 };
    if (phones[0]) lead.telefone = phones[0];
    if (emails[0]) lead.email = emails[0];
    leads.push(lead);
  }

  return { platform: "google_maps", leads };
}

