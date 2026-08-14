(() => {
  const FC = globalThis.FerramentaConsulta;

  function getPageTitle() {
    return String(document.title || "").trim();
  }

  function getVisibleText(limit = 150_000) {
    const bodyText = String(document.body?.innerText || "");
    return bodyText.slice(0, limit);
  }

  function getDocumentHtml(limit = 200_000) {
    const html = String(document.documentElement?.outerHTML || "");
    return html.slice(0, limit);
  }

  function collectEntries(channels = {}) {
    const pageUrl = String(location.href || "");
    const title = getPageTitle();
    const entries = [];
    const seen = new Set();

    const pushEntry = (entry) => {
      if (!entry) {
        return;
      }
      if (entry.type === "whatsapp" && channels.whatsapp === false) {
        return;
      }
      if (entry.type === "telegram" && channels.telegram === false) {
        return;
      }
      const key = `${entry.type}|${entry.url}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      entries.push(entry);
    };

    const anchors = document.querySelectorAll("a[href], area[href]");
    anchors.forEach((anchor) => {
      try {
        const href = anchor.getAttribute("href") || "";
        const absolute = FC.normalizeUrl(new URL(href, pageUrl).toString());
        const type = FC.classifyInviteUrl(absolute);
        if (!type) {
          return;
        }

        pushEntry(FC.buildInviteEntry(absolute, {
          source: "Aba atual",
          title,
          pageUrl,
          context: FC.trimText(anchor.textContent || anchor.getAttribute("aria-label") || absolute),
        }));
      } catch (_) {
        // Links malformados são ignorados.
      }
    });

    const bodyText = getVisibleText();
    for (const entry of FC.extractInviteEntriesFromText(bodyText, {
      source: "Aba atual",
      title,
      pageUrl,
      context: "Texto visível da página",
    })) {
      pushEntry(entry);
    }

    const htmlText = getDocumentHtml();
    for (const entry of FC.extractInviteEntriesFromText(htmlText, {
      source: "Aba atual",
      title,
      pageUrl,
      context: "HTML da página",
    })) {
      pushEntry(entry);
    }

    return FC.mergeInviteEntries(entries);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message.type !== "FC_COLLECT_PAGE_LINKS") {
      return false;
    }

    try {
      const entries = collectEntries(message.channels || {});
      sendResponse({ ok: true, entries });
    } catch (error) {
      sendResponse({ ok: false, error: error.message || String(error) });
    }

    return true;
  });
})();
