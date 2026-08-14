(function () {
  const SENT_FINGERPRINTS = new Set();

  function getContext() {
    return globalThis.__GPF_PAGE_SCAN_CONTEXT || null;
  }

  function classifyExtraction(links, bodyText, pageUrl) {
    const text = String(bodyText || "").toLowerCase();
    const url = String(pageUrl || "").toLowerCase();

    if (links.length) {
      return "links_found";
    }

    if (
      text.includes("log in") ||
      text.includes("login") ||
      text.includes("entrar") ||
      text.includes("sign in") ||
      text.includes("continue to") ||
      url.includes("accounts.google.com") ||
      text.includes("auth required")
    ) {
      return "login_required";
    }

    if (
      text.includes("access denied") ||
      text.includes("blocked") ||
      text.includes("forbidden") ||
      text.includes("page not found") ||
      text.includes("content unavailable") ||
      text.includes("this content isn't available") ||
      text.includes("something went wrong") ||
      text.includes("unavailable")
    ) {
      return "blocked";
    }

    return "no_links_found";
  }

  function scanPage(forceEmpty = false) {
    const extractor = globalThis.GPFWhatsAppLinkExtractor;
    const context = getContext();

    if (!extractor || !context?.requestId) {
      return null;
    }

    const links = extractor.extractWhatsAppLinksFromDocument(document);
    const bodyText = document.body?.innerText || "";
    const pageUrl = location.href;
    const pageTitle = document.title || "";
    const extraction_status = classifyExtraction(links, bodyText, pageUrl);
    const fingerprint = `${context.requestId}::${pageUrl}::${pageTitle}::${links.slice().sort().join("|")}::${extraction_status}`;

    if (!links.length && !forceEmpty) {
      return null;
    }

    if (SENT_FINGERPRINTS.has(fingerprint)) {
      return null;
    }

    SENT_FINGERPRINTS.add(fingerprint);

    chrome.runtime.sendMessage(
      {
        type: "GPF_PAGE_SCAN",
        payload: {
          requestId: context.requestId,
          campaignId: context.campaignId || null,
          searchQueryId: context.searchQueryId || null,
          source: context.source || "",
          googleQuery: context.googleQuery || "",
          candidatePageUrl: context.candidatePageUrl || pageUrl,
          candidatePageTitle: context.candidatePageTitle || pageTitle,
          pageUrl,
          pageTitle,
          bodyText,
          extraction_status,
          links,
          scannedAt: new Date().toISOString(),
        },
      },
      () => void chrome.runtime.lastError,
    );

    return links;
  }

  function run() {
    const context = getContext();

    if (!context?.requestId) {
      return;
    }

    const delay = document.readyState === "complete" ? 500 : 1000;
    window.setTimeout(() => {
      scanPage();
    }, delay);

    const observer = new MutationObserver(() => {
      window.clearTimeout(window.__gpfPageTimer);
      window.__gpfPageTimer = window.setTimeout(() => {
        const links = scanPage();

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
      scanPage(true);
      observer.disconnect();
    }, 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
