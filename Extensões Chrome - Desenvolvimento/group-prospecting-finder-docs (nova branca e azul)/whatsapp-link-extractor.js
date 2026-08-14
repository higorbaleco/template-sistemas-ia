(function () {
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

  function normalizeWhatsAppLink(value) {
    if (!value) {
      return null;
    }

    const raw = trimCandidate(value);
    const candidate = raw.startsWith("http") ? raw : `https://${raw}`;

    try {
      const url = new URL(candidate);
      const hostname = String(url.hostname || "").toLowerCase();

      if (hostname !== "chat.whatsapp.com" && hostname !== "www.chat.whatsapp.com") {
        const decoded = safeDecode(raw);

        if (decoded !== raw) {
          return normalizeWhatsAppLink(decoded);
        }

        return null;
      }

      const [inviteCode] = url.pathname.split("/").filter(Boolean);

      if (!inviteCode) {
        return null;
      }

      return `https://chat.whatsapp.com/${inviteCode}`;
    } catch {
      const decoded = safeDecode(raw);

      if (decoded !== raw) {
        return normalizeWhatsAppLink(decoded);
      }

      const encodedMatch = raw.match(/chat\.whatsapp\.com%2F([A-Za-z0-9_-]{6,})/i);
      if (encodedMatch?.[1]) {
        return `https://chat.whatsapp.com/${encodedMatch[1]}`;
      }

      return null;
    }
  }

  function extractLinksFromString(value, results) {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?chat\.whatsapp\.com\/[A-Za-z0-9_-]{6,}(?:[^\s"'<>)]*)?/gi,
      /chat\.whatsapp\.com%2F[A-Za-z0-9_-]{6,}/gi,
      /https%3A%2F%2Fchat\.whatsapp\.com%2F[A-Za-z0-9_-]{6,}/gi,
    ];

    for (const pattern of patterns) {
      const matches = String(value || "").match(pattern) || [];

      for (const match of matches) {
        const normalized = normalizeWhatsAppLink(match);
        if (normalized) {
          results.add(normalized);
        }
      }
    }

    const decoded = safeDecode(String(value || ""));

    if (decoded !== value) {
      for (const pattern of patterns) {
        const matches = decoded.match(pattern) || [];

        for (const match of matches) {
          const normalized = normalizeWhatsAppLink(match);
          if (normalized) {
            results.add(normalized);
          }
        }
      }
    }
  }

  function extractWhatsAppLinksFromDocument(doc = document) {
    const results = new Set();

    extractLinksFromString(doc.body?.innerText || "", results);
    extractLinksFromString(doc.body?.innerHTML || "", results);
    extractLinksFromString(doc.title || "", results);

    for (const anchor of doc.querySelectorAll("a[href]")) {
      extractLinksFromString(anchor.href || "", results);
      extractLinksFromString(anchor.textContent || "", results);
    }

    return [...results];
  }

  globalThis.GPFWhatsAppLinkExtractor = {
    normalizeWhatsAppLink,
    extractLinksFromString,
    extractWhatsAppLinksFromDocument,
  };
})();
