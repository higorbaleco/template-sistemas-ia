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

  function scanDocument(forceEmpty = false) {
    const extractor = globalThis.GPFGoogleResultsExtractor;

    if (!extractor) {
      return null;
    }

    const results = extractor.extractGoogleResults(document);
    const fingerprint = results.map((item) => item.url).sort().join("|");

    if (!results.length && !forceEmpty) {
      return null;
    }

    if (SENT_FINGERPRINTS.has(fingerprint)) {
      return null;
    }

    SENT_FINGERPRINTS.add(fingerprint);

    chrome.runtime.sendMessage(
      {
        type: "GPF_GOOGLE_RESULTS",
        payload: {
          context: getContextFromHash(),
          pageUrl: location.href,
          pageTitle: document.title || "",
          results,
        },
      },
      () => void chrome.runtime.lastError,
    );

    return results;
  }

  function run() {
    if (!location.pathname.includes("/search")) {
      return;
    }

    window.setTimeout(() => {
      scanDocument();
    }, 900);

    const observer = new MutationObserver(() => {
      window.clearTimeout(window.__gpfGoogleTimer);
      window.__gpfGoogleTimer = window.setTimeout(() => {
        const results = scanDocument();

        if (results && results.length) {
          observer.disconnect();
        }
      }, 700);
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
