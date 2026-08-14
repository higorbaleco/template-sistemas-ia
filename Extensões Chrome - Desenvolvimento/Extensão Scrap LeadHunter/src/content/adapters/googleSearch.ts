import type { AdapterResult, ExtractedLead } from "./types";
import { EMAIL_REGEX, PHONE_REGEX, uniq } from "../regex";

function textOf(el: Element | null): string {
  if (!el) return "";
  return (el as HTMLElement).innerText || el.textContent || "";
}

export function googleSearchAdapter(): AdapterResult {
  const results = Array.from(document.querySelectorAll("div.g"));
  const leads: ExtractedLead[] = [];

  for (const r of results.slice(0, 20)) {
    const a = r.querySelector("a[href]") as HTMLAnchorElement | null;
    const href = a?.href || "";
    if (!href) continue;
    const title = textOf(r.querySelector("h3"));
    const snippet = textOf(r.querySelector("[data-sncf='1'], .VwiC3b, .aCOpRe")) || textOf(r);
    const phones = uniq((snippet.match(PHONE_REGEX) || []).map((s) => s.trim()));
    const emails = uniq((snippet.match(EMAIL_REGEX) || []).map((s) => s.trim()));

    const lead: ExtractedLead = {
      siteUrl: href,
      nome: title || undefined,
      confidence: 0.7,
    };
    if (phones[0]) lead.telefone = phones[0];
    if (emails[0]) lead.email = emails[0];
    leads.push(lead);
  }

  return { platform: "google_search", leads };
}

