import type { AdapterResult, ExtractedLead } from "./types";
import { EMAIL_REGEX, PHONE_REGEX, uniq } from "../regex";

function textOf(el: Element | null): string {
  if (!el) return "";
  return (el as HTMLElement).innerText || el.textContent || "";
}

export function olxAdapter(): AdapterResult {
  const leads: ExtractedLead[] = [];
  const title = textOf(document.querySelector("h1")) || undefined;
  const location = textOf(document.querySelector("[data-testid='ad-location']")) || undefined;
  const bodyText = document.body ? (document.body.innerText || "") : "";
  const phones = uniq((bodyText.match(PHONE_REGEX) || []).map((s) => s.trim()));
  const emails = uniq((bodyText.match(EMAIL_REGEX) || []).map((s) => s.trim()));

  if (phones.length || emails.length) {
    leads.push({
      nome: title,
      localizacao: location,
      telefone: phones[0],
      email: emails[0],
      confidence: 0.65,
    });
  }
  return { platform: "olx", leads };
}

