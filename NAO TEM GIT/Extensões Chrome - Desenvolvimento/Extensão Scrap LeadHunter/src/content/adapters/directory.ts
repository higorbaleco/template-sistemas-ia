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

function pickCards(): Element[] {
  const selectors = [
    "main article",
    "main li",
    "main [role='article']",
    ".card",
    ".listing",
    ".result",
    "tr",
  ];
  const cards = new Map<Element, true>();
  for (const selector of selectors) {
    for (const el of Array.from(document.querySelectorAll(selector))) {
      cards.set(el, true);
    }
  }
  return Array.from(cards.keys());
}

function pickNameFromCard(card: Element): string | undefined {
  return firstNonEmpty(
    textOf(card.querySelector("h1")),
    textOf(card.querySelector("h2")),
    textOf(card.querySelector("h3")),
    textOf(card.querySelector("h4")),
    textOf(card.querySelector("[itemprop='name']")),
    textOf(card.querySelector("a[aria-label]")),
    textOf(card.querySelector("strong")),
  );
}

function pickSiteFromCard(card: Element): string | undefined {
  const anchors = Array.from(card.querySelectorAll("a[href]"))
    .map((a) => (a as HTMLAnchorElement).href)
    .filter((href) => href && !/^(mailto:|tel:|javascript:)/i.test(href));
  return anchors[0];
}

export function directoryAdapter(): AdapterResult {
  const cards = pickCards();
  const leads: ExtractedLead[] = [];

  for (const card of cards.slice(0, 30)) {
    const text = textOf(card);
    const phones = extractPhones(text);
    const emails = extractEmails(text);
    const socials = pickSocialLinks(
      Array.from(card.querySelectorAll("a[href]")).map((a) => (a as HTMLAnchorElement).href),
    );
    const siteUrl = firstNonEmpty(pickSiteFromCard(card), pickCanonicalUrl());
    const nome = pickNameFromCard(card);
    const localizacao = firstNonEmpty(
      textOf(card.querySelector("[itemprop='address']")),
      textOf(card.querySelector(".location")),
      textOf(card.querySelector("[class*='location' i]")),
    );

    if (!nome && !phones.length && !emails.length && !siteUrl) continue;

    const lead: ExtractedLead = {
      nome,
      localizacao,
      siteUrl,
      ...socials,
      confidence: 0.58,
    };
    if (phones[0]) lead.telefone = phones[0];
    if (emails[0]) lead.email = emails[0];
    leads.push(lead);
  }

  if (!leads.length) {
    const fallbackText = document.body ? document.body.innerText || "" : "";
    const phones = extractPhones(fallbackText);
    const emails = extractEmails(fallbackText);
    const title = firstNonEmpty(
      textOf(document.querySelector("h1")),
      textOf(document.querySelector("h2")),
      metaContent("meta[property='og:title']"),
    );
    if (phones.length || emails.length || title) {
      leads.push({
        nome: title,
        localizacao: firstNonEmpty(
          textOf(document.querySelector("address")),
          textOf(document.querySelector("[itemprop='address']")),
        ),
        siteUrl: pickCanonicalUrl(),
        confidence: 0.5,
        telefone: phones[0],
        email: emails[0],
      });
    }
  }

  return { platform: "directory", leads: leads.slice(0, 50) };
}
