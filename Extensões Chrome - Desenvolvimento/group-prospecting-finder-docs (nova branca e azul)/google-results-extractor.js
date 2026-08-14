(function () {
  const INTERNAL_HOST_PATTERNS = [
    /(^|\.)google\.[a-z.]+$/i,
    /(^|\.)gstatic\.com$/i,
    /(^|\.)googleusercontent\.com$/i,
  ];

  const INTERNAL_URL_HINTS = [
    "accounts.google.com",
    "support.google.com",
    "policies.google.com",
    "webcache.googleusercontent.com",
    "preferences",
  ];

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function trimCandidate(value) {
    return String(value || "").trim().replace(/[)\].,;'"'"'"]+$/g, "");
  }

  function isInternalGoogleHost(hostname) {
    const value = String(hostname || "").toLowerCase();
    if (!value) {
      return true;
    }

    return INTERNAL_HOST_PATTERNS.some((pattern) => pattern.test(value)) ||
      INTERNAL_URL_HINTS.some((hint) => value.includes(hint));
  }

  function decodeRedirectTarget(url) {
    const searchParams = ["url", "q", "u", "target", "redirect"];

    for (const key of searchParams) {
      const value = url.searchParams.get(key);

      if (value) {
        return safeDecode(value);
      }
    }

    return null;
  }

  function normalizeCandidateUrl(value) {
    if (!value) {
      return null;
    }

    const raw = trimCandidate(value);
    const candidate = raw.startsWith("http") ? raw : `https://${raw}`;

    try {
      const url = new URL(candidate);

      if (isInternalGoogleHost(url.hostname)) {
        const nested = decodeRedirectTarget(url);

        if (nested && nested !== candidate) {
          return normalizeCandidateUrl(nested);
        }

        return null;
      }

      if (url.pathname === "/url" || url.searchParams.has("q") || url.searchParams.has("url")) {
        const nested = decodeRedirectTarget(url);

        if (nested) {
          return normalizeCandidateUrl(nested);
        }
      }

      return url.toString();
    } catch {
      const decoded = safeDecode(raw);

      if (decoded !== raw) {
        return normalizeCandidateUrl(decoded);
      }

      return null;
    }
  }

  function getSnippet(anchor) {
    const container = anchor.closest("article, div.MjjYud, div.g, div[data-snc], li, main, section") || anchor.parentElement;
    const text = String(container?.innerText || "").replace(/\s+/g, " ").trim();
    const title = String(anchor.innerText || anchor.textContent || "").replace(/\s+/g, " ").trim();

    if (!text) {
      return "";
    }

    const snippet = title ? text.replace(title, "").trim() : text;
    return snippet.slice(0, 220);
  }

  function extractGoogleResults(doc = document) {
    const results = [];
    const seen = new Set();

    for (const anchor of doc.querySelectorAll("a[href]")) {
      const href = anchor.getAttribute("href") || anchor.href || "";
      const normalizedUrl = normalizeCandidateUrl(href);

      if (!normalizedUrl) {
        continue;
      }

      let url;
      try {
        url = new URL(normalizedUrl);
      } catch {
        continue;
      }

      if (isInternalGoogleHost(url.hostname)) {
        continue;
      }

      const resultContainer = anchor.closest("div.MjjYud, div.g, div[data-snc], article, main, section");
      const visibleTitle = String(anchor.innerText || anchor.textContent || anchor.getAttribute("aria-label") || "")
        .replace(/\s+/g, " ")
        .trim();

      if (!resultContainer && visibleTitle.length < 12) {
        continue;
      }

      if (seen.has(normalizedUrl)) {
        continue;
      }

      const title = visibleTitle.slice(0, 160);

      const snippet = getSnippet(anchor);
      results.push({
        title,
        url: normalizedUrl,
        snippet,
      });
      seen.add(normalizedUrl);
    }

    return results;
  }

  globalThis.GPFGoogleResultsExtractor = {
    extractGoogleResults,
    normalizeCandidateUrl,
    isInternalGoogleHost,
  };
})();
