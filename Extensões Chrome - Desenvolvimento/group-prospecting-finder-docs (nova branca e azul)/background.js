import { buildQueries, buildSearchExecutionUrl, buildSearchContext } from "./query-builder.js";
import {
  ensureState,
  createCampaign,
  saveSearchQueries,
  updateSearchQuery,
  saveDiscoveredLinks,
  saveCandidatePageScan,
  updateGroupLink,
  getLinkById,
  getSearchQueryById,
  getSettings,
  updateCampaign,
  getCampaignById,
  setActiveExecution,
  updateActiveExecution,
  clearActiveExecution,
} from "./storage.js";
import { scanCandidatePages, resolvePageScan } from "./page-crawler.js";
import { classifyWhatsAppInvitePage } from "./validator.js";
import { normalizeWhatsAppLink } from "./normalizer.js";
import { SOURCE_DEFINITIONS, VALIDATION_CONTEXT_KEY } from "./constants.js";

const pendingValidationRequests = new Map();
const activeSchedulers = new Map();
const tabToLane = new Map();
const MAX_LANES = 2;

function nowIso() {
  return new Date().toISOString();
}

function broadcastExecutionUpdate(execution) {
  chrome.runtime.sendMessage(
    {
      type: "GPF_EXECUTION_UPDATED",
      payload: execution,
    },
    () => void chrome.runtime.lastError,
  );
}

function buildValidationUrl(url, requestId) {
  const normalized = normalizeWhatsAppLink(url);

  if (!normalized) {
    return null;
  }

  const target = new URL(normalized);
  target.hash = `${VALIDATION_CONTEXT_KEY}=${encodeURIComponent(requestId)}`;
  return target.toString();
}

function clampLaneCount(value) {
  return Math.min(MAX_LANES, Math.max(1, Number(value) || MAX_LANES));
}

function sortQueries(queries) {
  return [...queries].sort((a, b) => {
    const sourceOrderA = Number(a.sourceIndex ?? a.source_index ?? a.source_order ?? 0);
    const sourceOrderB = Number(b.sourceIndex ?? b.source_index ?? b.source_order ?? 0);

    if (sourceOrderA !== sourceOrderB) {
      return sourceOrderA - sourceOrderB;
    }

    const scoreA = Number(b.priorityScore || 0) - Number(a.priorityScore || 0);
    if (scoreA !== 0) {
      return scoreA;
    }
    return Number(a.pageStart || 0) - Number(b.pageStart || 0);
  });
}

function getFamilyKey(query) {
  return String(query.familyKey || `${query.source}::${query.term || ""}::${query.pattern || ""}`).toLowerCase();
}

function getSourceKey(query) {
  return String(query.source || "").toLowerCase();
}

function getSourceLabel(source) {
  return SOURCE_DEFINITIONS[source]?.label || source || "";
}

function normalizeGoogleResults(results = []) {
  const seen = new Set();

  return results
    .map((item) => ({
      title: String(item?.title || "").trim(),
      url: String(item?.url || "").trim(),
      snippet: String(item?.snippet || "").trim(),
    }))
    .filter((item) => {
      if (!item.url || seen.has(item.url)) {
        return false;
      }

      try {
        const url = new URL(item.url);
        const hostname = String(url.hostname || "").toLowerCase();

        if (hostname.includes("google.") || hostname.includes("accounts.google.") || hostname.includes("support.google.")) {
          return false;
        }
      } catch {
        return false;
      }

      seen.add(item.url);
      return true;
    });
}

function hasPendingOrRunningForSource(run, source) {
  if (!source) {
    return false;
  }

  const targetSource = String(source || "").toLowerCase();

  return run.queue.some((query) => {
    if (getSourceKey(query) !== targetSource) {
      return false;
    }

    return ["pending", "assigned", "running"].includes(query.status);
  });
}

function syncCurrentSource(run) {
  if (run.currentSource && hasPendingOrRunningForSource(run, run.currentSource)) {
    return run.currentSource;
  }

  run.currentSource = null;

  for (const source of run.sourceOrder) {
    if (hasPendingOrRunningForSource(run, source)) {
      run.currentSource = source;
      break;
    }
  }

  return run.currentSource;
}

function createScheduler(runId, campaign, queries, settings) {
  const orderedQueries = sortQueries(queries).map((query, index) => ({
    ...query,
    orderIndex: index,
    status: "pending",
  }));

  return {
    runId,
    campaignId: campaign.id,
    campaignName: campaign.name,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    totalQueries: orderedQueries.length,
    completedQueries: 0,
    failedQueries: 0,
    linksFound: 0,
    active: true,
    currentSource: null,
    sourceOrder: [...new Set(orderedQueries.map((query) => query.source))],
    settings: {
      laneCount: clampLaneCount(settings.maxConcurrentTabs),
      batchSize: clampLaneCount(settings.batchSize || settings.maxConcurrentTabs),
      perQueryTimeoutMs: Math.max(15000, Number(settings.perQueryTimeoutMs) || 45000),
      noResultBackoffMs: Math.max(0, Number(settings.noResultBackoffMs) || 400),
      earlyYieldThreshold: Math.max(1, Number(settings.earlyYieldThreshold) || 1),
    },
    familyBoost: {},
    queue: orderedQueries,
    lanes: Array.from({ length: clampLaneCount(settings.maxConcurrentTabs) }, (_, laneIndex) => ({
      id: laneIndex,
      tabId: null,
      status: "idle",
      currentQueryId: null,
      currentSource: null,
      currentFamilyKey: null,
      currentQueryLabel: "",
      startedAt: null,
      finishedAt: null,
      lastResultCount: 0,
      timeoutId: null,
    })),
  };
}

function serializeScheduler(run) {
  return {
    runId: run.runId,
    campaignId: run.campaignId,
    campaignName: run.campaignName,
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    totalQueries: run.totalQueries,
    completedQueries: run.completedQueries,
    failedQueries: run.failedQueries,
    linksFound: run.linksFound,
    active: run.active,
    currentSource: run.currentSource || null,
    currentSourceLabel: getSourceLabel(run.currentSource),
    queueRemaining: run.queue.filter((query) => query.status === "pending").length,
    lanes: run.lanes.map((lane) => ({
      id: lane.id,
      tabId: lane.tabId,
      status: lane.status,
      currentQueryId: lane.currentQueryId,
      currentSource: lane.currentSource || null,
      currentQueryLabel: lane.currentQueryLabel,
      startedAt: lane.startedAt,
      finishedAt: lane.finishedAt,
      lastResultCount: lane.lastResultCount,
    })),
  };
}

async function persistScheduler(run) {
  run.updatedAt = nowIso();
  const serialized = serializeScheduler(run);
  await setActiveExecution(serialized);
  broadcastExecutionUpdate(serialized);
  return serialized;
}

function familyScore(run, query) {
  const familyKey = getFamilyKey(query);
  const boost = Number(run.familyBoost[familyKey] || 0);
  return boost;
}

function pickNextQuery(run) {
  const currentSource = syncCurrentSource(run);
  const pending = run.queue.filter((query) => query.status === "pending");

  if (!pending.length || !currentSource) {
    return null;
  }

  const scopedPending = pending.filter((query) => getSourceKey(query) === String(currentSource).toLowerCase());

  if (!scopedPending.length) {
    return null;
  }

  const scored = scopedPending.map((query) => {
    const base = Number(query.priorityScore || 0);
    const boost = familyScore(run, query) * 100;
    const pageBias = Math.max(0, 25 - Math.floor(Number(query.pageStart || 0) / 10));
    const earlyPhase = run.linksFound < run.settings.earlyYieldThreshold;
    const earlyBoost = earlyPhase
      ? (query.pageStart === 0 ? 40 : 10) + (query.source === "google" ? 25 : 0)
      : 0;
    return {
      query,
      score: base + boost + pageBias + earlyBoost,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return Number(a.query.pageStart || 0) - Number(b.query.pageStart || 0);
  });

  return scored[0]?.query || null;
}

async function openOrUpdateLaneTab(lane, url) {
  if (lane.tabId) {
    const previousTabId = lane.tabId;
    try {
      await chrome.tabs.update(lane.tabId, {
        url,
        active: false,
      });
      return lane.tabId;
    } catch {
      tabToLane.delete(previousTabId);
      lane.tabId = null;
    }
  }

  const created = await chrome.tabs.create({
    url,
    active: false,
  });

  lane.tabId = created.id || null;
  return lane.tabId;
}

function clearLaneTimer(lane) {
  if (lane.timeoutId) {
    clearTimeout(lane.timeoutId);
    lane.timeoutId = null;
  }
}

function mapTabToLane(runId, lane) {
  if (!lane.tabId) {
    return;
  }

  tabToLane.set(lane.tabId, {
    runId,
    laneId: lane.id,
  });
}

async function assignQueryToLane(run, lane, query) {
  if (!query) {
    lane.status = "idle";
    lane.currentQueryId = null;
    lane.currentSource = null;
    lane.currentFamilyKey = null;
    lane.currentQueryLabel = "";
    lane.startedAt = null;
    lane.finishedAt = nowIso();
    lane.lastResultCount = 0;
    clearLaneTimer(lane);
    return;
  }

  lane.status = "running";
  lane.currentQueryId = query.id;
  lane.currentSource = query.source;
  lane.currentFamilyKey = getFamilyKey(query);
  lane.currentQueryLabel = `${query.sourceLabel || query.source} · start=${query.pageStart}`;
  lane.startedAt = nowIso();
  lane.finishedAt = null;
  lane.lastResultCount = 0;
  clearLaneTimer(lane);

  await updateSearchQuery(query.id, {
    status: "running",
  });

  const context = buildSearchContext({
    campaignId: run.campaignId,
    searchQueryId: query.id,
    source: query.source,
    query: query.query,
    pageStart: query.pageStart,
    pageIndex: query.pageIndex,
    depth: query.depth,
  });
  const executionUrl = buildSearchExecutionUrl(query, context);
  const tabId = await openOrUpdateLaneTab(lane, executionUrl);
  mapTabToLane(run.runId, lane);

  lane.timeoutId = setTimeout(() => {
    handleQueryTimeout(run.runId, lane.id).catch(() => {});
  }, run.settings.perQueryTimeoutMs);

  await persistScheduler(run);
  return tabId;
}

async function fillIdleLanes(run) {
  syncCurrentSource(run);

  for (const lane of run.lanes) {
    if (lane.status !== "idle" || lane.currentQueryId) {
      continue;
    }

    const next = pickNextQuery(run);

    if (!next) {
      continue;
    }

    next.status = "assigned";
    await assignQueryToLane(run, lane, next);
  }
}

function getRun(runId) {
  return activeSchedulers.get(runId) || null;
}

async function finishRun(run) {
  if (!run.active) {
    return;
  }

  run.active = false;
  run.completedAt = nowIso();
  run.updatedAt = nowIso();

  for (const lane of run.lanes) {
    clearLaneTimer(lane);
  }

  const settings = await getSettings();

  if (settings.closeTabsAfterCollect) {
    const tabIds = run.lanes.map((lane) => lane.tabId).filter(Boolean);

    if (tabIds.length) {
      try {
        await chrome.tabs.remove(tabIds);
      } catch {
        // Ignore tab removal failures when tabs are already gone.
      }
    }
  }

  activeSchedulers.delete(run.runId);
  await updateCampaign(run.campaignId, {
    status: "completed",
  });
  await clearActiveExecution();
  broadcastExecutionUpdate(null);
}

async function maybeFinishRun(run) {
  const pending = run.queue.some((query) => query.status === "pending" || query.status === "assigned" || query.status === "running");
  const busy = run.lanes.some((lane) => lane.status === "running");

  if (!pending && !busy) {
    await persistScheduler(run);
    await finishRun(run);
  }
}

async function advanceLane(run, lane, outcome = {}) {
  clearLaneTimer(lane);

  const currentQueryId = lane.currentQueryId;
  const currentFamilyKey = lane.currentFamilyKey;

  if (currentQueryId) {
    await updateSearchQuery(currentQueryId, {
      status: outcome.status || "completed",
      results_count: outcome.resultsCount != null ? outcome.resultsCount : outcome.totalForQuery || 0,
    });
  }

  run.completedQueries += 1;
  run.failedQueries += outcome.status === "failed" ? 1 : 0;
  run.linksFound += outcome.insertedCount || 0;

  if (currentFamilyKey) {
    const currentBoost = Number(run.familyBoost[currentFamilyKey] || 0);
    if ((outcome.insertedCount || 0) > 0) {
      run.familyBoost[currentFamilyKey] = currentBoost + Math.max(1, Math.min(3, outcome.insertedCount || 1));
    } else {
      run.familyBoost[currentFamilyKey] = currentBoost - 1;
    }
  }

  lane.status = "idle";
  lane.currentQueryId = null;
  lane.currentSource = null;
  lane.currentFamilyKey = null;
  lane.currentQueryLabel = "";
  lane.startedAt = null;
  lane.finishedAt = nowIso();
  lane.lastResultCount = outcome.insertedCount || 0;

  syncCurrentSource(run);
  await persistScheduler(run);

  const next = pickNextQuery(run);

  if (!next) {
    await maybeFinishRun(run);
    return;
  }

  next.status = "assigned";
  await assignQueryToLane(run, lane, next);
}

async function handleQueryTimeout(runId, laneId) {
  const run = getRun(runId);
  if (!run || !run.active) {
    return;
  }

  const lane = run.lanes.find((item) => item.id === laneId);
  if (!lane || lane.status !== "running" || !lane.currentQueryId) {
    return;
  }

  await advanceLane(run, lane, {
    status: "failed",
    insertedCount: 0,
    totalForQuery: 0,
  });
}

async function startCampaignScheduler(campaign, queries, settings) {
  const runId = `${campaign.id}:${Date.now()}`;
  const run = createScheduler(runId, campaign, queries, settings);
  activeSchedulers.set(runId, run);

  await persistScheduler(run);
  if (!run.queue.length) {
    await finishRun(run);
    return run;
  }

  await fillIdleLanes(run);
  await persistScheduler(run);
  return run;
}

async function handleCreateAndRunCampaign(payload) {
  const settings = await getSettings();
  const campaign = await createCampaign({
    name: payload.name,
    primaryKeyword: payload.primaryKeyword,
    additionalTerms: payload.additionalTerms,
    region: payload.region,
    sources: payload.sources,
    pagesPerSource: payload.pagesPerSource,
    depth: payload.depth,
  });

  const queryBlueprints = buildQueries({
    primaryKeyword: payload.primaryKeyword,
    additionalTerms: payload.additionalTerms,
    region: payload.region,
    sources: payload.sources,
    pagesPerSource: payload.pagesPerSource,
    depth: payload.depth,
  });

  const createdQueries = await saveSearchQueries(campaign.id, queryBlueprints);

  await updateCampaign(campaign.id, {
    status: "active",
  });

  const run = await startCampaignScheduler(campaign, createdQueries, settings);

  return {
    campaign,
    totalQueries: run.totalQueries,
    laneCount: run.lanes.length,
    execution: serializeScheduler(run),
  };
}

async function handleGoogleResults(payload, sender) {
  const context = payload.context || {};
  let campaignId = context.campaignId || null;
  let searchQueryId = context.searchQueryId || null;
  let run = campaignId ? [...activeSchedulers.values()].find((item) => item.campaignId === campaignId) || null : null;
  const laneInfo = sender?.tab?.id ? tabToLane.get(sender.tab.id) : null;
  let lane = run && laneInfo ? run.lanes.find((item) => item.id === laneInfo.laneId) : null;

  if ((!campaignId || !searchQueryId) && lane && run) {
    campaignId = run.campaignId;
    searchQueryId = lane.currentQueryId || searchQueryId;
  }

  if (!campaignId || !searchQueryId) {
    return { ok: false, ignored: true };
  }

  const searchQuery = await getSearchQueryById(searchQueryId);
  if (!searchQuery) {
    return { ok: false, ignored: true };
  }

  if (!run) {
    run = [...activeSchedulers.values()].find((item) => item.campaignId === campaignId) || null;
  }

  if (!lane && run && laneInfo) {
    lane = run.lanes.find((item) => item.id === laneInfo.laneId) || null;
  }

  const campaign = await getCampaignById(campaignId);
  const candidatePages = normalizeGoogleResults(payload.results || []);
  const googleQuery = context.query || searchQuery.query || "";

  if (!candidatePages.length) {
    await updateSearchQuery(searchQueryId, {
      status: "completed",
      results_count: 0,
    });

    if (run && lane) {
      syncCurrentSource(run);
      await advanceLane(run, lane, {
        status: "completed",
        insertedCount: 0,
        totalForQuery: 0,
      });
    }

    return {
      ok: true,
      result: {
        candidatePages: 0,
        insertedCount: 0,
        duplicateCount: 0,
      },
    };
  }

  const scanContext = {
    campaignId,
    searchQueryId,
    source: context.source || searchQuery.source,
    googleQuery,
    primaryKeyword: context.primaryKeyword || campaign?.primary_keyword || "",
    region: context.region || campaign?.region || "",
  };

  const tabId = lane?.tabId || sender?.tab?.id;
  if (!tabId) {
    return { ok: false, error: "Nenhuma aba disponível para processar candidatos." };
  }

  const scanResults = await scanCandidatePages({
    tabId,
    candidatePages,
    context: scanContext,
    timeoutMs: 10000,
    delayBetweenPagesMs: 1500,
  });

  let insertedCount = 0;
  let duplicateCount = 0;

  for (const { candidate, payload: pagePayload } of scanResults) {
    const extractionStatus = pagePayload?.extraction_status || "unknown";
    const links = Array.isArray(pagePayload?.links) ? pagePayload.links : [];

    await saveCandidatePageScan({
      campaignId,
      searchQueryId,
      source: scanContext.source,
      googleQuery,
      candidatePageUrl: candidate.url,
      candidatePageTitle: candidate.title,
      extractionStatus,
      links,
    });

    if (links.length) {
      const result = await saveDiscoveredLinks({
        campaignId,
        searchQueryId,
        source: scanContext.source,
        googleQuery,
        primaryKeyword: scanContext.primaryKeyword,
        region: scanContext.region,
        candidatePageUrl: candidate.url,
        candidatePageTitle: candidate.title,
        extractionStatus,
        links,
      });

      insertedCount += result.insertedCount;
      duplicateCount += result.duplicateCount;
    }
  }

  await updateSearchQuery(searchQueryId, {
    status: "completed",
    results_count: insertedCount,
  });

  if (run && lane) {
    syncCurrentSource(run);
    await advanceLane(run, lane, {
      status: "completed",
      insertedCount,
      totalForQuery: insertedCount,
    });
  }

  return {
    ok: true,
    result: {
      candidatePages: candidatePages.length,
      insertedCount,
      duplicateCount,
    },
  };
}

async function handleValidationRequest(payload) {
  const link = await getLinkById(payload.linkId);

  if (!link) {
    return { ok: false, error: "Link não encontrado." };
  }

  const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const validationUrl = buildValidationUrl(payload.linkUrl || link.normalized_url, requestId);
  const settings = await getSettings();

  if (!validationUrl) {
    await updateGroupLink(link.id, {
      validation_status: "invalid_format",
      last_checked_at: nowIso(),
    });

    return {
      ok: false,
      error: "Link inválido.",
    };
  }

  const resultPromise = new Promise((resolve, reject) => {
    pendingValidationRequests.set(requestId, {
      resolve,
      reject,
      linkId: link.id,
    });
  });

  await chrome.tabs.create({
    url: validationUrl,
    active: Boolean(settings.openValidationInNewTab),
  });

  try {
    const result = await Promise.race([
      resultPromise,
      new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), 15000)),
    ]);

    if (result?.timedOut) {
      pendingValidationRequests.delete(requestId);
      await updateGroupLink(link.id, {
        validation_status: "manual_review_required",
        last_checked_at: nowIso(),
      });

      return {
        ok: true,
        suggestion: "manual_review_required",
        timedOut: true,
      };
    }

    return {
      ok: true,
      ...result,
    };
  } catch (error) {
    pendingValidationRequests.delete(requestId);
    await updateGroupLink(link.id, {
      validation_status: "unknown",
      last_checked_at: nowIso(),
    });

    return {
      ok: false,
      error: error?.message || "Falha na validação.",
    };
  }
}

async function handleWhatsappAnalysis(payload) {
  const suggestion = classifyWhatsAppInvitePage(payload);
  const requestId = payload.requestId;
  const pending = requestId ? pendingValidationRequests.get(requestId) : null;

  if (!pending) {
    return { ok: true, ignored: true, suggestion };
  }

  pendingValidationRequests.delete(requestId);

  await updateGroupLink(pending.linkId, {
    validation_status: suggestion,
    last_checked_at: nowIso(),
  });

  pending.resolve({
    ok: true,
    suggestion,
    payload,
  });

  return { ok: true, suggestion };
}

chrome.runtime.onInstalled.addListener(() => {
  ensureState().catch(() => {});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const type = message?.type;

  if (type === "GPF_CREATE_AND_RUN_CAMPAIGN") {
    handleCreateAndRunCampaign(message.payload)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: error?.message || "Erro inesperado." }));
    return true;
  }

  if (type === "GPF_GOOGLE_RESULTS" || type === "GPF_GOOGLE_EXTRACTION") {
    handleGoogleResults(message.payload, sender)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: error?.message || "Erro inesperado." }));
    return true;
  }

  if (type === "GPF_PAGE_SCAN") {
    const resolved = resolvePageScan(message.payload || {});
    sendResponse({ ok: true, resolved });
    return false;
  }

  if (type === "GPF_REQUEST_LINK_VALIDATION") {
    handleValidationRequest(message.payload)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: error?.message || "Erro inesperado." }));
    return true;
  }

  if (type === "GPF_WHATSAPP_ANALYSIS") {
    handleWhatsappAnalysis(message.payload, sender)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: error?.message || "Erro inesperado." }));
    return true;
  }

  if (type === "GPF_PING") {
    sendResponse({ ok: true });
    return false;
  }

  return false;
});
