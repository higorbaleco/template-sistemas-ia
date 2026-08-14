(function () {
  const KEY = "gpfv";
  const SENT = new Set();

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function getRequestId() {
    const hash = location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash.replace(/^/, ""));
    return params.get(KEY) || null;
  }

  function extractButtonLabels() {
    return [...document.querySelectorAll("button, a, [role='button']")]
      .map((node) => (node.innerText || node.textContent || "").trim())
      .filter(Boolean)
      .slice(0, 40);
  }

  function extractHeadingText() {
    return [...document.querySelectorAll("h1, h2, h3, strong")]
      .map((node) => (node.innerText || node.textContent || "").trim())
      .filter(Boolean)
      .join(" ");
  }

  function extractLinkLabels() {
    return [...document.querySelectorAll("a[href]")]
      .map((node) => (node.innerText || node.textContent || "").trim())
      .filter(Boolean)
      .slice(0, 40);
  }

  function buildPayload() {
    return {
      requestId: getRequestId(),
      url: location.href,
      pageUrl: location.href,
      pageTitle: document.title || "",
      bodyText: document.body?.innerText || "",
      headingText: extractHeadingText(),
      buttonLabels: extractButtonLabels(),
      linkLabels: extractLinkLabels(),
      capturedAt: new Date().toISOString(),
    };
  }

  function sendAnalysis() {
    const payload = buildPayload();
    const signature = `${payload.requestId || "no-request"}::${payload.url}::${payload.bodyText.length}`;

    if (SENT.has(signature)) {
      return;
    }

    SENT.add(signature);

    chrome.runtime.sendMessage(
      {
        type: "GPF_WHATSAPP_ANALYSIS",
        payload,
      },
      () => void chrome.runtime.lastError,
    );
  }

  function run() {
    if (!location.hostname.includes("chat.whatsapp.com")) {
      return;
    }

    const delay = document.readyState === "complete" ? 500 : 1200;
    window.setTimeout(sendAnalysis, delay);

    const observer = new MutationObserver(() => {
      window.clearTimeout(window.__gpfWhatsappTimer);
      window.__gpfWhatsappTimer = window.setTimeout(sendAnalysis, 1000);
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    window.setTimeout(() => observer.disconnect(), 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
