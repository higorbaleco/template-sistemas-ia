const pendingPageScans = new Map();

function nowIso() {
  return new Date().toISOString();
}

function createRequestId() {
  if (globalThis.crypto?.randomUUID) {
    return `pagescan_${globalThis.crypto.randomUUID()}`;
  }

  return `pagescan_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeCandidatePage(candidate) {
  if (!candidate) {
    return null;
  }

  if (typeof candidate === "string") {
    return {
      url: candidate,
      title: "",
      snippet: "",
    };
  }

  return {
    url: candidate.url || candidate.pageUrl || candidate.link || "",
    title: candidate.title || candidate.pageTitle || "",
    snippet: candidate.snippet || "",
  };
}

function withScanContext(candidate, baseContext, requestId) {
  return {
    requestId,
    campaignId: baseContext.campaignId || null,
    searchQueryId: baseContext.searchQueryId || null,
    source: baseContext.source || "",
    googleQuery: baseContext.googleQuery || "",
    candidatePageUrl: candidate.url || "",
    candidatePageTitle: candidate.title || "",
    createdAt: nowIso(),
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function registerPendingScan(requestId, timeoutMs, context, candidate) {
  let resolvePromise;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  const timeoutId = setTimeout(() => {
    const pending = pendingPageScans.get(requestId);
    if (!pending) {
      return;
    }

    pendingPageScans.delete(requestId);
    pending.resolve({
      requestId,
      campaignId: context.campaignId,
      searchQueryId: context.searchQueryId,
      source: context.source,
      googleQuery: context.googleQuery,
      candidatePageUrl: candidate.url,
      candidatePageTitle: candidate.title,
      pageUrl: candidate.url,
      pageTitle: candidate.title,
      bodyText: "",
      extraction_status: "timeout",
      links: [],
      timedOut: true,
      scannedAt: nowIso(),
    });
  }, timeoutMs);

  pendingPageScans.set(requestId, {
    resolve: resolvePromise,
    timeoutId,
  });

  return promise;
}

export function resolvePageScan(payload) {
  const requestId = payload?.requestId;
  if (!requestId) {
    return false;
  }

  const pending = pendingPageScans.get(requestId);
  if (!pending) {
    return false;
  }

  pendingPageScans.delete(requestId);
  if (pending.timeoutId) {
    clearTimeout(pending.timeoutId);
  }

  pending.resolve(payload);
  return true;
}

export async function scanCandidatePages({
  tabId,
  candidatePages = [],
  context = {},
  timeoutMs = 10000,
  delayBetweenPagesMs = 1500,
}) {
  const results = [];
  const normalizedCandidates = candidatePages
    .map(normalizeCandidatePage)
    .filter((candidate) => candidate && candidate.url);

  for (const candidate of normalizedCandidates) {
    const requestId = createRequestId();
    const scanContext = withScanContext(candidate, context, requestId);
    let targetUrl;

    try {
      targetUrl = new URL(candidate.url);
    } catch {
      continue;
    }

    targetUrl.hash = "";

    const pending = registerPendingScan(requestId, timeoutMs, scanContext, candidate);

    await chrome.tabs.update(tabId, {
      url: targetUrl.toString(),
      active: false,
    });

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["whatsapp-link-extractor.js"],
    });

    await chrome.scripting.executeScript({
      target: { tabId },
      func: (payload) => {
        globalThis.__GPF_PAGE_SCAN_CONTEXT = payload;
      },
      args: [scanContext],
    });

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content-page.js"],
    });

    const payload = await pending;
    results.push({
      candidate,
      payload,
    });

    if (delayBetweenPagesMs > 0) {
      await delay(delayBetweenPagesMs);
    }
  }

  return results;
}
