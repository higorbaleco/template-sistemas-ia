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

function guessNomeFromTitle(title: string): string | undefined {
  const t = (title || "").trim();
  if (!t) return undefined;
  const cut = t.split("|")[0]?.split("-")[0] ?? t;
  const s = cut.trim().slice(0, 100);
  return s || undefined;
}

function pickPrimaryVisibleHeading(): string | undefined {
  const candidates = [
    textOf(document.querySelector("h1")),
    textOf(document.querySelector("h2")),
    textOf(document.querySelector("h3")),
    textOf(document.querySelector("[itemprop='name']")),
    metaContent("meta[property='og:site_name']"),
  ];
  return firstNonEmpty(...candidates);
}

function pickLeadUrl(): string | undefined {
  return (
    pickCanonicalUrl() ||
    (() => {
      const links = Array.from(document.querySelectorAll("a[href]"))
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((href) => href && !/^(mailto:|tel:|javascript:)/i.test(href));
      return links[0];
    })()
  );
}

export function genericAdapter(): AdapterResult {
  const bodyText = document.body ? document.body.innerText || document.body.textContent || "" : "";
  const title = document.title || "";
  const phones = extractPhones(bodyText);
  const emails = extractEmails(bodyText);
  const links = Array.from(document.querySelectorAll("a[href]"))
    .map((a) => (a as HTMLAnchorElement).href)
    .filter(Boolean);
  const socials = pickSocialLinks(links);

  const heading = pickPrimaryVisibleHeading();
  const nome = guessNomeFromTitle(title) || heading;
  const empresa = firstNonEmpty(
    textOf(document.querySelector("[itemprop='legalName']")),
    textOf(document.querySelector("[itemprop='organizationName']")),
    metaContent("meta[property='og:site_name']"),
    heading,
  );
  const localizacao = firstNonEmpty(
    textOf(document.querySelector("address")),
    textOf(document.querySelector("[itemprop='address']")),
    textOf(document.querySelector("[aria-label*='address' i]")),
  );
  const siteUrl = firstNonEmpty(pickLeadUrl(), socials.siteUrl);

  const leads: ExtractedLead[] = [];
  const baseConfidence = 0.56;

  if (phones.length) {
    for (const p of phones.slice(0, 20)) {
      leads.push({
        nome,
        empresa,
        localizacao,
        telefone: p,
        ...socials,
        siteUrl,
        confidence: baseConfidence,
      });
    }
  }

  if (emails.length) {
    for (const e of emails.slice(0, 20)) {
      leads.push({
        nome,
        empresa,
        localizacao,
        email: e,
        ...socials,
        siteUrl,
        confidence: baseConfidence,
      });
    }
  }

  if (!leads.length && (socials.linkedinUrl || socials.whatsappUrl || siteUrl)) {
    leads.push({
      nome,
      empresa,
      localizacao,
      ...socials,
      siteUrl,
      confidence: 0.5,
    });
  }

  if (!leads.length && (nome || empresa || localizacao)) {
    leads.push({
      nome,
      empresa,
      localizacao,
      siteUrl,
      confidence: 0.45,
    });
  }

  return { platform: "generic", leads: leads.slice(0, 50) };
}
