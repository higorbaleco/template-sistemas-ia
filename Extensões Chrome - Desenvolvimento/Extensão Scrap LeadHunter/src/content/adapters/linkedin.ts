import type { AdapterResult, ExtractedLead } from "./types";

function textOf(el: Element | null): string {
  if (!el) return "";
  return (el as HTMLElement).innerText || el.textContent || "";
}

export function linkedinAdapter(): AdapterResult {
  // Respect limitations: read visible DOM only; no automation, no hidden requests.
  const leads: ExtractedLead[] = [];
  const name =
    textOf(document.querySelector("h1")) ||
    textOf(document.querySelector(".text-heading-xlarge")) ||
    undefined;
  const headline =
    textOf(document.querySelector(".text-body-medium.break-words")) ||
    textOf(document.querySelector("[data-generated-suggestion-target]")) ||
    undefined;
  const locationText =
    textOf(document.querySelector(".text-body-small.inline.t-black--light.break-words")) || undefined;

  leads.push({
    nome: name,
    cargo: headline,
    localizacao: locationText,
    linkedinUrl: globalThis.location.href,
    confidence: 0.75,
  });

  return { platform: "linkedin", leads };
}
