importScripts("sources.js", "shared.js");

const { SOURCE_CATALOG } = globalThis.FerramentaConsultaSources;
const FC = globalThis.FerramentaConsulta;

const STORAGE_KEYS = FC.STORAGE_KEYS;
const SCAN_TIMEOUT_MS = 11_000;
const COMMON_DISCOVERY_TERMS = [
  "grupo",
  "grupos",
  "whatsapp",
  "telegram",
  "canal",
  "canais",
  "comunidade",
  "link",
];

const MAX_PAGES_PER_SOURCE = 24;

const SOURCE_PROFILE_RULES = [
  {
    pattern: /(grupodewhatsapp|gruposwhats|gruposdewhatsapp|grupos\.whats\.link|grupax|gruposbrasil|allgrupos|gruposdewhatss|gruposdezap|wgrupos|prodivulgas)/i,
    seedBudget: 16,
    pageBudget: 24,
    candidateLimit: 48,
    depthLimit: 6,
  },
  {
    pattern: /(grupostelegram|telegrupos|telegruposbr|telegruposvip)/i,
    seedBudget: 12,
    pageBudget: 18,
    candidateLimit: 32,
    depthLimit: 5,
  },
  {
    pattern: /(grupoporno|gruposputariatelegram)/i,
    seedBudget: 8,
    pageBudget: 14,
    candidateLimit: 20,
    depthLimit: 4,
  },
];

const DEFAULT_SOURCE_PROFILE = {
  seedBudget: 12,
  pageBudget: 16,
  candidateLimit: 28,
  depthLimit: 4,
};

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

function getSourceProfile(source) {
  const raw = [
    source?.id,
    source?.label,
    source?.seedUrl,
    source?.description,
  ].join(" ");

  for (const rule of SOURCE_PROFILE_RULES) {
    if (rule.pattern.test(raw)) {
      return { ...DEFAULT_SOURCE_PROFILE, ...rule };
    }
  }

  return { ...DEFAULT_SOURCE_PROFILE };
}

function normalizeCrawlUrl(rawUrl) {
  const input = FC.trimText(String(rawUrl || "")).replace(/\\\//g, "/");
  if (!input) {
    return "";
  }

  if (/\$\{|%24%7B|%7B|%7D|c\.slug|slug\}|undefined|null/i.test(input)) {
    return "";
  }

  let candidate = input;
  if (candidate.startsWith("//")) {
    candidate = `https:${candidate}`;
  } else if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    candidate = `https://${candidate.replace(/^\/+/, "")}`;
  }

  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/+$/, "");
    if (!url.pathname) {
      url.pathname = "/";
    }
    return url.toString().replace(/\/+$/, "");
  } catch (_) {
    return "";
  }
}

function getDiscoveryTerms(settings) {
  const terms = [];
  const keywordTerms = FC.buildSearchTerms(settings?.keyword, settings?.category);
  const labelTerms = String(settings?.sourceLabel || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3);

  for (const term of [...keywordTerms, ...COMMON_DISCOVERY_TERMS, ...labelTerms]) {
    const normalized = String(term || "").trim();
    if (normalized) {
      terms.push(normalized);
    }
  }

  return [...new Set(terms)].slice(0, 10);
}

function buildDiscoverySeedUrls(source, terms, budget = 4) {
  const urls = [];
  const seen = new Set();
  let parsed;

  try {
    parsed = new URL(source.seedUrl);
  } catch (_) {
    return [];
  }

  const origin = `${parsed.protocol}//${parsed.hostname.toLowerCase()}`;
  const activeTerms = (terms || []).map((term) => String(term || "").trim()).filter(Boolean).slice(0, 6);
  const maxUrls = Math.max(1, Number(budget || 1));
  const genericRoutes = [
    () => `${origin}/page/2`,
    () => `${origin}/page/3`,
    () => `${origin}/archive`,
    () => `${origin}/arquivos`,
    () => `${origin}/grupos`,
    () => `${origin}/grupo`,
  ];
  const termRoutes = [
    (encoded, slug) => `${origin}/?s=${encoded}`,
    (encoded, slug) => `${origin}/?q=${encoded}`,
    (encoded, slug) => `${origin}/?search=${encoded}`,
    (encoded, slug) => `${origin}/search?q=${encoded}`,
    (encoded, slug) => `${origin}/search/${slug}`,
    (encoded, slug) => `${origin}/busca/${slug}`,
    (encoded, slug) => `${origin}/grupo/${slug}`,
    (encoded, slug) => `${origin}/grupos/${slug}`,
    (encoded, slug) => `${origin}/categoria/${slug}`,
    (encoded, slug) => `${origin}/category/${slug}`,
    (encoded, slug) => `${origin}/tag/${slug}`,
    (encoded, slug) => `${origin}/tags/${slug}`,
    (encoded, slug) => `${origin}/page/2?s=${encoded}`,
    (encoded, slug) => `${origin}/page/3?s=${encoded}`,
    (encoded, slug) => `${origin}/page/2?q=${encoded}`,
    (encoded, slug) => `${origin}/page/3?q=${encoded}`,
  ];

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

  for (const buildUrl of genericRoutes) {
    add(buildUrl());
  }

  if (urls.length >= maxUrls) {
    return urls;
  }

  for (const term of activeTerms) {
    const encoded = encodeURIComponent(term);
    const slug = toSearchSlug(term);
    for (const buildUrl of termRoutes) {
      add(buildUrl(encoded, slug));
    }
  }

  return urls;
}

function collectEntriesFromSnapshot(snapshot, settings) {
  const pageUrl = String(snapshot?.pageUrl || "");
  const title = FC.trimText(snapshot?.title || "");
  const entries = [];
  const seen = new Set();
  const channels = settings?.channels || {};

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

  for (const link of snapshot?.links || []) {
    try {
      const rawHref = String(link?.href || "");
      if (!rawHref) {
        continue;
      }
      const absolute = FC.normalizeUrl(new URL(rawHref, pageUrl).toString());
      const type = FC.classifyInviteUrl(absolute);
      if (!type) {
        continue;
      }
      pushEntry(FC.buildInviteEntry(absolute, {
        source: "Aba atual",
        title,
        pageUrl,
        context: FC.trimText(link?.text || link?.label || absolute),
      }));
    } catch (_) {
      // Ignora links inválidos.
    }
  }

  for (const entry of FC.extractInviteEntriesFromText(snapshot?.bodyText || "", {
    source: "Aba atual",
    title,
    pageUrl,
    context: "Texto visível da página",
  })) {
    pushEntry(entry);
  }

  for (const entry of FC.extractInviteEntriesFromText(snapshot?.html || "", {
    source: "Aba atual",
    title,
    pageUrl,
    context: "HTML da página",
  })) {
    pushEntry(entry);
  }

  return FC.mergeInviteEntries(entries);
}

async function collectFromActiveTab(settings, progress) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || typeof tab.id !== "number") {
    throw new Error("Nenhuma aba ativa encontrada.");
  }

  try {
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
  } catch (error) {
    const fallbackMessage = String(error?.message || error || "");
    if (!/Receiving end does not exist|Could not establish connection/i.test(fallbackMessage)) {
      throw error;
    }

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        pageUrl: location.href,
        title: document.title || "",
        bodyText: document.body?.innerText || "",
        html: document.documentElement?.outerHTML || "",
        links: Array.from(document.querySelectorAll("a[href], area[href]")).slice(0, 5000).map((element) => ({
          href: element.getAttribute("href") || "",
          text: element.textContent || "",
          label: element.getAttribute("aria-label") || "",
        })),
      }),
    });

    const snapshot = result?.result || null;
    const entries = filterEntriesByChannels(collectEntriesFromSnapshot(snapshot, settings), settings);
    progress.push(`Aba atual (fallback): ${entries.length} link(s) encontrados.`);
    return entries;
  }
}

async function crawlSource(source, settings, progress) {
  const profile = getSourceProfile(source);
  const requestedDepth = Math.max(1, Math.min(5, Number(settings.crawlDepth || 2)));
  const depthLimit = Math.max(2, Math.min(profile.depthLimit || DEFAULT_SOURCE_PROFILE.depthLimit, requestedDepth + 1));
  const maxPages = Math.max(4, Math.min(profile.pageBudget || MAX_PAGES_PER_SOURCE, MAX_PAGES_PER_SOURCE));
  const visited = new Set();
  const queued = new Set();
  const searchTerms = getDiscoveryTerms({
    ...settings,
    sourceLabel: source.label,
  });
  const queue = [];
  const entries = [];
  const stats = {
    source: source.label,
    seedCount: 0,
    pagesVisited: 0,
    candidateCount: 0,
    extractedCount: 0,
    uniqueCount: 0,
    failures: 0,
  };
  let enqueueOrder = 0;

  const enqueue = (url, depth, score = 0) => {
    const normalized = normalizeCrawlUrl(url);
    if (!normalized || visited.has(normalized) || queued.has(normalized)) {
      return false;
    }
    queued.add(normalized);
    queue.push({
      url: normalized,
      depth,
      score: Number.isFinite(score) ? score : 0,
      order: enqueueOrder += 1,
    });
    return true;
  };

  const seedUrls = buildDiscoverySeedUrls(source, searchTerms, profile.seedBudget || 8);
  stats.seedCount = seedUrls.length;
  seedUrls.forEach((url, index) => {
    enqueue(url, 0, index === 0 ? 1000 : Math.max(100, 800 - (index * 20)));
  });
  progress.push(`${source.label}: ${stats.seedCount} seed(s) criadas, página principal garantida.`);

  while (queue.length && visited.size < maxPages) {
    queue.sort((a, b) => (b.score - a.score) || (a.depth - b.depth) || (a.order - b.order));
    const next = queue.shift();
    queued.delete(next.url);

    const normalized = next.url;
    if (!normalized || visited.has(normalized)) {
      continue;
    }

    visited.add(normalized);
    stats.pagesVisited = visited.size;

    let html = "";
    try {
      html = await fetchText(normalized);
    } catch (error) {
      stats.failures += 1;
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
    stats.extractedCount += pageEntries.length;
    entries.push(...pageEntries);

    if (next.depth >= depthLimit - 1) {
      continue;
    }

    const candidates = FC.extractCandidateUrlsFromHtml(html, normalized);
    stats.candidateCount += candidates.length;
    candidates.slice(0, profile.candidateLimit || DEFAULT_SOURCE_PROFILE.candidateLimit).forEach((candidate, index) => {
      enqueue(
        candidate,
        next.depth + 1,
        FC.scoreCandidateUrl(candidate, normalized) - (index * 0.5),
      );
    });
  }

  const mergedEntries = FC.mergeInviteEntries(entries);
  stats.uniqueCount = mergedEntries.length;
  progress.push(`${source.label}: ${stats.pagesVisited} página(s), ${stats.candidateCount} candidato(s), ${stats.uniqueCount} grupo(s) únicos após merge.`);
  return { entries: mergedEntries, stats };
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
  const sourceStats = [];

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
    const sourceScan = await crawlSource(source, mergedSettings, progress);
    collectedEntries.push(...sourceScan.entries);
    sourceStats.push(sourceScan.stats);
  }

  const results = FC.mergeInviteEntries(collectedEntries);
  const channelFilteredResults = filterEntriesByChannels(results, mergedSettings);
  const rankedResults = filterEntriesBySearch(channelFilteredResults, mergedSettings);
  const quality = FC.filterEntriesByQuality(rankedResults, mergedSettings, "clean");
  const searchMatchedTotal = rankedResults.filter((entry) => entry.searchMatched !== false).length;
  const sourceStatsTotals = sourceStats.reduce((acc, item) => {
    acc.seeds += item.seedCount || 0;
    acc.pages += item.pagesVisited || 0;
    acc.candidates += item.candidateCount || 0;
    acc.extracted += item.extractedCount || 0;
    acc.unique += item.uniqueCount || 0;
    acc.failures += item.failures || 0;
    return acc;
  }, {
    seeds: 0,
    pages: 0,
    candidates: 0,
    extracted: 0,
    unique: 0,
    failures: 0,
  });
  const summary = {
    ...FC.summarizeEntries(rankedResults),
    sourcesScanned: selectedSources.length,
    currentTabScanned: Boolean(mergedSettings.includeCurrentTab),
    rawTotal: rankedResults.length,
    searchMatchedTotal,
    cleanTotal: quality.clean.length,
    suspectTotal: quality.suspect.length,
    rejectedTotal: quality.rejected.length,
    sourceStats: sourceStatsTotals,
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

  if (sourceStats.length) {
    progress.push(`Resumo do crawl: ${sourceStatsTotals.seeds} seed(s), ${sourceStatsTotals.pages} página(s), ${sourceStatsTotals.candidates} candidato(s), ${sourceStatsTotals.unique} grupo(s) únicos, ${sourceStatsTotals.failures} falha(s).`);
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
