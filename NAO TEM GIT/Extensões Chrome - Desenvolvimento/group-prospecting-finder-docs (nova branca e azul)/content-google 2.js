(function () {
  const KEY = "gpf";
  const SENT_FINGERPRINTS = new Set();

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function getContextFromHash() {
    const hash = location.hash.replace(/^#/, "");

    if (!hash) {
      return null;
    }

    const [key, encoded] = hash.split("=");

    if (key !== KEY || !encoded) {
      return null;
    }

    try {
      return JSON.parse(safeDecode(encoded));
    } catch {
      return null;
    }
  }

  function trimCandidate(value) {
    return String(value || "").trim().replace(/[)\].,;'"'"'"]+$/g, "");
  }

  function normalizeUrlCandidate(value) {
    if (!value) {
      return null;
    }

    const raw = trimCandidate(value);
    const candidate = raw.startsWith("http") ? raw : `https://${raw}`;

    try {
      const url = new URL(candidate);

      if (url.hostname.includes("google.")) {
        const nested = url.searchParams.get("url") || url.searchParams.get("q") || url.searchParams.get("u");

        if (nested) {
          return normalizeUrlCandidate(safeDecode(nested));
        }
      }

      return candidate;
    } catch {
      const decoded = safeDecode(raw);

      if (decoded !== raw) {
        return normalizeUrlCandidate(decoded);
      }

      return raw;
    }
  }

  function scanUrlForNestedCandidates(value, results, depth = 0) {
    if (!value || depth > 2) {
      return;
    }

    const candidates = [value];

    try {
      const url = new URL(value, location.href);

      if (url.hostname.includes("google.")) {
        for (const key of ["url", "q", "u", "target", "redirect"]) {
          const nested = url.searchParams.get(key);

          if (nested) {
            candidates.push(nested);
            candidates.push(safeDecode(nested));
          }
        }
      }
    } catch {
      // Ignore parsing issues.
    }

    for (const candidate of candidates) {
      extractLinksFromString(candidate, results);
    }
  }

  function extractLinksFromString(value, results) {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?chat\.whatsapp\.com\/[A-Za-z0-9_-]{6,}(?:[^\s"'<>)]*)?/gi,
      /(?:https?:\/\/)?(?:www\.)?wa\.me\/[A-Za-z0-9_-]{6,}(?:[^\s"'<>)]*)?/gi,
    ];

    for (const pattern of patterns) {
      const matches = String(value || "").match(pattern) || [];

      for (const match of matches) {
        const normalized = normalizeUrlCandidate(match);

        if (normalized && normalized.includes("chat.whatsapp.com")) {
          results.add(normalized);
        }
      }
    }

    const decoded = safeDecode(String(value || ""));

    if (decoded !== value) {
      for (const pattern of patterns) {
        const matches = decoded.match(pattern) || [];

        for (const match of matches) {
          const normalized = normalizeUrlCandidate(match);

          if (normalized && normalized.includes("chat.whatsapp.com")) {
            results.add(normalized);
          }
        }
      }
    }
  }

  function scanDocument(forceEmpty = false) {
    const results = new Set();

    extractLinksFromString(document.body?.innerText || "", results);
    extractLinksFromString(document.body?.innerHTML || "", results);
    extractLinksFromString(document.title || "", results);

    for (const anchor of document.querySelectorAll("a[href]")) {
      scanUrlForNestedCandidates(anchor.href || "", results);
      extractLinksFromString(anchor.textContent || "", results);
    }

    const links = [...results];
    const fingerprint = links.slice().sort().join("|");

    if (!links.length && !forceEmpty) {
      return null;
    }

    if (SENT_FINGERPRINTS.has(fingerprint)) {
      return;
    }

    SENT_FINGERPRINTS.add(fingerprint);

    chrome.runtime.sendMessage(
      {
        type: "GPF_GOOGLE_EXTRACTION",
        payload: {
          context: getContextFromHash(),
          pageUrl: location.href,
          pageTitle: document.title || "",
          bodyText: document.body?.innerText || "",
          links,
        },
      },
      () => void chrome.runtime.lastError,
    );

    return links;
  }

  function run() {
    if (!location.pathname.includes("/search")) {
      return;
    }

    window.setTimeout(() => {
      const links = scanDocument();

      if (links && links.length) {
        return;
      }
    }, 900);

    const observer = new MutationObserver(() => {
      window.clearTimeout(window.__gpfGoogleTimer);
      window.__gpfGoogleTimer = window.setTimeout(() => {
        const links = scanDocument();

        if (links && links.length) {
          observer.disconnect();
        }
      }, 800);
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    window.setTimeout(() => {
      scanDocument(true);
      observer.disconnect();
    }, 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
