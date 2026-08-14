importScripts("sources.js", "shared.js");

const { SOURCE_CATALOG } = globalThis.FerramentaConsultaSources;
const FC = globalThis.FerramentaConsulta;

const STORAGE_KEYS = FC.STORAGE_KEYS;
const SCAN_TIMEOUT_MS = 11_000;
const MAX_PAGES_PER_SOURCE = 6;

function buildDefaultSettings() {
  return FC.defaultSettingsFromSources(SOURCE_CATALOG);
}

async function readSettings() {
  const stored = await chrome.storage.sync.get({ [STORAGE_KEYS.settings]: null });
  return FC.normalizeSettings(stored[STORAGE_KEYS.settings], SOURCE_CATALOG);
}

async function writeSettings(settings) {
  await chrome.storage.sync.set({ [STORAGE_KEYS.settings]: settings });
}

async function readLastScan() {
  const stored = await chrome.storage.session.get({ [STORAGE_KEYS.lastScan]: null });
  return stored[STORAGE_KEYS.lastScan] || null;
}

async function writeLastScan(payload) {
  await chrome.storage.session.set({ [STORAGE_KEYS.lastScan]: payload });
}

async function fetchText(url, timeoutMs = SCAN_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function filterEntriesByChannels(entries, settings) {
  const channels = settings?.channels || {};
  return (entries || []).filter((entry) => {
    if (entry.type === "whatsapp") {
      return channels.whatsapp !== false;
    }
    if (entry.type === "telegram") {
      return channels.telegram !== false;
    }
    return true;
  });
}

function filterEntriesBySearch(entries, settings) {
  return FC.filterEntriesBySearch(entries, settings);
}

function toSearchSlug(term) {
  return String(term || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDiscoveryTerms(settings) {
  return FC.buildSearchTerms(settings?.keyword, settings?.category).slice(0, 3);
}

function buildDiscoverySeedUrls(source, terms, budget = 4) {
  const urls = [];
  const seen = new Set();
  let parsed;

  try {
    parsed = new URL(source.seedUrl);
  } catch (_) {
    return [source.seedUrl];
  }

  const domain = parsed.hostname.toLowerCase();
  const origin = `${parsed.protocol}//${domain}`;
  const activeTerms = (terms || []).map((term) => String(term || "").trim()).filter(Boolean).slice(0, 3);
  const maxUrls = Math.max(1, Number(budget || 1));

  const add = (url) => {
    if (!url || seen.has(url) || urls.length >= maxUrls) {
      return;
    }
    seen.add(url);
    urls.push(url);
  };

  add(source.seedUrl);
  if (urls.length >= maxUrls) {
    return urls;
  }

  for (const term of activeTerms) {
    const encoded = encodeURIComponent(term);
    const slug = toSearchSlug(term);

    add(`${origin}/?s=${encoded}`);
    add(`${origin}/?q=${encoded}`);
    add(`${origin}/?search=${encoded}`);
    add(`${origin}/search?q=${encoded}`);
    add(`${origin}/search/${slug}`);
    add(`${origin}/busca/${slug}`);
  }

  return urls;
}

async function collectFromActiveTab(settings, progress) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || typeof tab.id !== "number") {
    throw new Error("Nenhuma aba ativa encontrada.");
  }

  const response = await chrome.tabs.sendMessage(tab.id, {
    type: "FC_COLLECT_PAGE_LINKS",
    channels: settings.channels,
  });

  if (!response || !response.ok) {
    throw new Error(response?.error || "Não foi possível ler a aba atual.");
  }

  const entries = filterEntriesByChannels(response.entries || [], settings);
  progress.push(`Aba atual: ${entries.length} link(s) encontrados.`);
  return entries;
}

async function crawlSource(source, settings, progress) {
  const depthLimit = Math.max(1, Math.min(4, Number(settings.crawlDepth || 2)));
  const maxPages = Math.min(MAX_PAGES_PER_SOURCE, Math.max(1, depthLimit * 2));
  const visited = new Set();
  const searchTerms = getDiscoveryTerms(settings);
  const queue = [];
  const entries = [];

  const seedUrls = buildDiscoverySeedUrls(source, searchTerms, maxPages);
  for (const url of seedUrls) {
    queue.push({ url, depth: 0 });
  }
  progress.push(`${source.label}: ${seedUrls.length} seed(s) de descoberta, página principal garantida.`);

  while (queue.length && visited.size < maxPages) {
    const next = queue.shift();
    const normalized = FC.normalizeUrl(next.url);
    if (!normalized || visited.has(normalized)) {
      continue;
    }

    visited.add(normalized);

    let html = "";
    try {
      html = await fetchText(normalized);
    } catch (error) {
      progress.push(`${source.label}: falha em ${normalized} (${error.message})`);
      continue;
    }

    const pageTitle = FC.extractPageTitleFromHtml(html);
    const pageEntries = filterEntriesByChannels(
      FC.extractInviteEntriesFromText(html, {
        source: source.label,
        title: pageTitle,
        pageUrl: normalized,
        isAdult: Boolean(source.adultOnly),
      }),
      settings,
    );
    entries.push(...pageEntries);

    if (next.depth >= depthLimit - 1) {
      continue;
    }

    const candidates = FC.extractCandidateUrlsFromHtml(html, normalized);
    for (const candidate of candidates.slice(0, 10)) {
      if (!visited.has(candidate)) {
        queue.push({ url: candidate, depth: next.depth + 1 });
      }
    }
  }

  progress.push(`${source.label}: ${entries.length} link(s) em ${visited.size} página(s).`);
  return entries;
}

async function runScan(request = {}) {
  const storedSettings = await readSettings();
  const mergedSettings = FC.normalizeSettings(
    {
      ...storedSettings,
      ...request.settings,
      channels: {
        ...storedSettings.channels,
        ...request.settings?.channels,
      },
      sources: {
        ...storedSettings.sources,
        ...request.settings?.sources,
      },
    },
    SOURCE_CATALOG,
  );

  const selectedSourceIds = FC.selectedSourceIds(mergedSettings, SOURCE_CATALOG);
  const selectedSources = SOURCE_CATALOG.filter((source) => selectedSourceIds.includes(source.id));
  const progress = [];
  const collectedEntries = [];

  if (mergedSettings.includeCurrentTab) {
    try {
      const currentTabEntries = await collectFromActiveTab(mergedSettings, progress);
      collectedEntries.push(...currentTabEntries);
    } catch (error) {
      progress.push(`Aba atual: ${error.message}`);
    }
  } else {
    progress.push("Aba atual desativada nas opções.");
  }

  for (const source of selectedSources) {
    progress.push(`Varredura em ${source.label}...`);
    const sourceEntries = await crawlSource(source, mergedSettings, progress);
    collectedEntries.push(...sourceEntries);
  }

  const results = FC.mergeInviteEntries(collectedEntries);
  const channelFilteredResults = filterEntriesByChannels(results, mergedSettings);
  const rankedResults = filterEntriesBySearch(channelFilteredResults, mergedSettings);
  const quality = FC.filterEntriesByQuality(rankedResults, mergedSettings, "clean");
  const searchMatchedTotal = rankedResults.filter((entry) => entry.searchMatched !== false).length;
  const summary = {
    ...FC.summarizeEntries(rankedResults),
    sourcesScanned: selectedSources.length,
    currentTabScanned: Boolean(mergedSettings.includeCurrentTab),
    rawTotal: rankedResults.length,
    searchMatchedTotal,
    cleanTotal: quality.clean.length,
    suspectTotal: quality.suspect.length,
    rejectedTotal: quality.rejected.length,
  };

  const payload = {
    scannedAt: new Date().toISOString(),
    settings: mergedSettings,
    summary,
    rawResults: rankedResults,
    results: quality.visible,
    progress,
  };

  if (!rankedResults.length && collectedEntries.length) {
    progress.push("Resultados brutos encontrados, mas todos foram limpos pelos filtros atuais.");
  } else if (searchMatchedTotal === 0 && rankedResults.length) {
    progress.push("Busca suave: nenhum resultado bateu literalmente com keyword/categoria, mas a lista continua disponível e ordenada por relevância.");
  }

  await writeLastScan(payload);
  return payload;
}

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.sync.get({ [STORAGE_KEYS.settings]: null });
  if (!stored[STORAGE_KEYS.settings]) {
    await writeSettings(buildDefaultSettings());
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== "object") {
    return false;
  }

  if (message.type === "FC_START_SCAN") {
    runScan(message)
      .then((payload) => sendResponse({ ok: true, payload }))
      .catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));
    return true;
  }

  if (message.type === "FC_GET_LAST_SCAN") {
    readLastScan()
      .then((payload) => sendResponse({ ok: true, payload }))
      .catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));
    return true;
  }

  if (message.type === "FC_SAVE_SETTINGS") {
    const nextSettings = FC.normalizeSettings(message.settings, SOURCE_CATALOG);
    writeSettings(nextSettings)
      .then(() => sendResponse({ ok: true, settings: nextSettings }))
      .catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));
    return true;
  }

  if (message.type === "FC_LOAD_SETTINGS") {
    readSettings()
      .then((settings) => sendResponse({ ok: true, settings }))
      .catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));
    return true;
  }

  return false;
});
