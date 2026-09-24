import { EMAIL_REGEX, PHONE_REGEX, uniq } from "../regex";

export function textOf(el: Element | null): string {
  if (!el) return "";
  return (el as HTMLElement).innerText || el.textContent || "";
}

export function metaContent(selector: string): string | undefined {
  return document.querySelector(selector)?.getAttribute("content") || undefined;
}

export function extractPhones(text: string): string[] {
  return uniq((text.match(PHONE_REGEX) || []).map((s) => s.trim()));
}

export function extractEmails(text: string): string[] {
  return uniq((text.match(EMAIL_REGEX) || []).map((s) => s.trim()));
}

export function pickSocialLinks(links: string[]): {
  whatsappUrl?: string;
  linkedinUrl?: string;
  siteUrl?: string;
} {
  const out: { whatsappUrl?: string; linkedinUrl?: string; siteUrl?: string } = {};
  for (const href of links) {
    if (!out.whatsappUrl && /wa\.me\/|chat\.whatsapp\.com\/|api\.whatsapp\.com\//i.test(href)) {
      out.whatsappUrl = href;
      continue;
    }
    if (!out.linkedinUrl && /linkedin\.com\//i.test(href)) {
      out.linkedinUrl = href;
      continue;
    }
  }
  return out;
}

export function pickCanonicalUrl(): string | undefined {
  const canonical =
    document.querySelector("link[rel='canonical']")?.getAttribute("href") ||
    metaContent("meta[property='og:url']") ||
    undefined;
  if (!canonical) return undefined;
  try {
    const url = new URL(canonical, location.href);
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

export function normalizeUrlLike(input: string): string | undefined {
  try {
    const url = new URL(input, location.href);
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

export function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const s = value?.trim();
    if (s) return s;
  }
  return undefined;
}
