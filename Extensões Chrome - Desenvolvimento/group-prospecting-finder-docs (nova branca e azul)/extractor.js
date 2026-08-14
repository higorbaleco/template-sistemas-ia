import { normalizeWhatsAppLink } from "./normalizer.js";

const WHATSAPP_LINK_REGEX = /(?:https?:\/\/)?(?:www\.)?chat\.whatsapp\.com\/[A-Za-z0-9_-]{6,}(?:[^\s"'<>)]*)?/gi;
const REDIRECT_PARAM_KEYS = ["url", "q", "u", "target", "redirect", "r"];

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function addMatch(results, candidate) {
  const normalized = normalizeWhatsAppLink(candidate);

  if (normalized) {
    results.add(normalized);
  }
}

function scanStringForLinks(value, results, depth = 0) {
  if (!value || depth > 2) {
    return;
  }

  const text = String(value);
  const matches = text.match(WHATSAPP_LINK_REGEX) || [];

  for (const match of matches) {
    addMatch(results, match);
  }

  const decoded = safeDecode(text);

  if (decoded !== text) {
    scanStringForLinks(decoded, results, depth + 1);
  }
}

function scanRedirectUrl(value, results, depth = 0) {
  if (!value || depth > 2) {
    return;
  }

  try {
    const url = new URL(value, location.href);

    if (url.hostname.includes("google.")) {
      for (const key of REDIRECT_PARAM_KEYS) {
        const paramValue = url.searchParams.get(key);

        if (paramValue) {
          scanStringForLinks(paramValue, results, depth + 1);
          scanRedirectUrl(paramValue, results, depth + 1);
        }
      }
    }

    scanStringForLinks(url.toString(), results, depth + 1);
  } catch {
    scanStringForLinks(value, results, depth + 1);
  }
}

export function extractWhatsAppLinksFromText(text) {
  const results = new Set();
  scanStringForLinks(text, results);
  return [...results];
}

export function extractWhatsAppLinksFromCandidates(candidates) {
  const results = new Set();

  for (const candidate of candidates) {
    scanStringForLinks(candidate, results);
    scanRedirectUrl(candidate, results);
  }

  return [...results];
}

export function extractWhatsAppLinksFromDocument(doc = document) {
  const candidates = new Set();

  candidates.add(doc.body?.innerText || "");
  candidates.add(doc.body?.innerHTML || "");
  candidates.add(doc.title || "");

  for (const anchor of doc.querySelectorAll("a[href]")) {
    candidates.add(anchor.href || "");
    candidates.add(anchor.textContent || "");
  }

  for (const button of doc.querySelectorAll("button, a, span, div")) {
    const text = button.textContent || "";

    if (text && text.length < 500) {
      candidates.add(text);
    }
  }

  return extractWhatsAppLinksFromCandidates(candidates);
}
