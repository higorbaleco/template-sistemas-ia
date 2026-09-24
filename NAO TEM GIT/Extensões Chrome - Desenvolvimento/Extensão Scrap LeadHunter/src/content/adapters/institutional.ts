import type { AdapterResult, ExtractedLead } from "./types";
import {
  extractEmails,
  extractPhones,
  firstNonEmpty,
  metaContent,
  pickCanonicalUrl,
  pickSocialLinks,
  textOf,
} from "./shared";

function pickContactBlock(): Element | null {
  const selectors = [
    "main",
    "article",
    "[id*='contact' i]",
    "[class*='contact' i]",
    "[id*='sobre' i]",
    "[class*='sobre' i]",
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return document.body;
}

export function institutionalAdapter(): AdapterResult {
  const block = pickContactBlock();
  const bodyText = textOf(block);
  const phones = extractPhones(bodyText);
  const emails = extractEmails(bodyText);
  const links = Array.from(document.querySelectorAll("a[href]")).map((a) => (a as HTMLAnchorElement).href);
  const socials = pickSocialLinks(links);

  const nome = firstNonEmpty(
    textOf(document.querySelector("h1")),
    textOf(document.querySelector("h2")),
    metaContent("meta[property='og:site_name']"),
    metaContent("meta[property='og:title']"),
    document.title?.split("|")[0]?.trim(),
  );
  const empresa = firstNonEmpty(
    textOf(document.querySelector("[itemprop='legalName']")),
    textOf(document.querySelector("[itemprop='name']")),
    nome,
  );
  const localizacao = firstNonEmpty(
    textOf(document.querySelector("address")),
    textOf(document.querySelector("[itemprop='address']")),
    textOf(document.querySelector("[class*='address' i]")),
  );
  const siteUrl = firstNonEmpty(pickCanonicalUrl(), links.find((href) => /^https?:\/\//i.test(href)));

  const lead: ExtractedLead = {
    nome,
    empresa,
    localizacao,
    siteUrl,
    ...socials,
    confidence: 0.62,
  };
  if (phones[0]) lead.telefone = phones[0];
  if (emails[0]) lead.email = emails[0];

  const hasSignal = Boolean(lead.telefone || lead.email || lead.linkedinUrl || lead.siteUrl || lead.whatsappUrl);
  if (!hasSignal) {
    return { platform: "institutional", leads: [] };
  }

  return { platform: "institutional", leads: [lead] };
}
