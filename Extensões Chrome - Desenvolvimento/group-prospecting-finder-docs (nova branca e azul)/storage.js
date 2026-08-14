import { DEFAULT_SETTINGS, DEFAULT_STATE, STORAGE_KEYS } from "./constants.js";
import { normalizeFreeText, normalizeWhatsAppLink } from "./normalizer.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `gpf_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeSettings(settings = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    maxConcurrentTabs: Math.min(
      2,
      Math.max(1, Number(settings.maxConcurrentTabs ?? DEFAULT_SETTINGS.maxConcurrentTabs)),
    ),
  };
}

function normalizeStateShape(state = {}) {
  return {
    campaigns: Array.isArray(state.campaigns) ? state.campaigns : [],
    searchQueries: Array.isArray(state.searchQueries) ? state.searchQueries : [],
    pageScans: Array.isArray(state.pageScans) ? state.pageScans : [],
    groupLinks: Array.isArray(state.groupLinks) ? state.groupLinks : [],
    activeExecution: state.activeExecution || null,
    settings: normalizeSettings(state.settings || {}),
  };
}

export async function loadState() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.APP_STATE);
  return normalizeStateShape(result[STORAGE_KEYS.APP_STATE] || DEFAULT_STATE);
}

export async function saveState(state) {
  const normalized = normalizeStateShape(state);
  await chrome.storage.local.set({
    [STORAGE_KEYS.APP_STATE]: normalized,
  });
  return normalized;
}

export async function ensureState() {
  const state = await loadState();
  await saveState(state);
  return state;
}

export async function getSettings() {
  const state = await loadState();
  return state.settings;
}

export async function updateSettings(patch) {
  const state = await loadState();
  state.settings = normalizeSettings({
    ...state.settings,
    ...patch,
  });
  await saveState(state);
  return state.settings;
}

export async function getActiveExecution() {
  const state = await loadState();
  return clone(state.activeExecution);
}

export async function setActiveExecution(execution) {
  const state = await loadState();
  state.activeExecution = execution ? clone(execution) : null;
  await saveState(state);
  return clone(state.activeExecution);
}

export async function updateActiveExecution(patch) {
  const state = await loadState();
  const current = state.activeExecution || null;

  if (!current) {
    return null;
  }

  state.activeExecution = {
    ...current,
    ...clone(patch),
    updated_at: nowIso(),
  };

  await saveState(state);
  return clone(state.activeExecution);
}

export async function clearActiveExecution() {
  const state = await loadState();
  state.activeExecution = null;
  await saveState(state);
  return true;
}

export async function createCampaign(input) {
  const state = await loadState();
  const timestamp = nowIso();
  const record = {
    id: createId(),
    name: normalizeFreeText(input.name || "Nova campanha"),
    primary_keyword: normalizeFreeText(input.primaryKeyword || ""),
    additional_terms: Array.isArray(input.additionalTerms)
      ? input.additionalTerms.map((term) => normalizeFreeText(term)).filter(Boolean)
      : [],
    region: normalizeFreeText(input.region || ""),
    sources: Array.isArray(input.sources) ? input.sources : [],
    pages_per_source: Math.min(Math.max(Number(input.pagesPerSource) || 1, 1), 50),
    depth: input.depth || "quick",
    status: input.status || "active",
    created_at: timestamp,
    updated_at: timestamp,
  };

  state.campaigns.unshift(record);
  await saveState(state);
  return record;
}

export async function listCampaigns() {
  const state = await loadState();
  return clone(state.campaigns).sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")));
}

export async function getCampaignById(id) {
  const state = await loadState();
  return clone(state.campaigns.find((campaign) => campaign.id === id) || null);
}

export async function updateCampaign(id, patch) {
  const state = await loadState();
  const target = state.campaigns.find((campaign) => campaign.id === id);

  if (!target) {
    return null;
  }

  Object.assign(target, patch, {
    updated_at: nowIso(),
  });

  await saveState(state);
  return clone(target);
}

export async function saveSearchQueries(campaignId, queries) {
  const state = await loadState();
  const timestamp = nowIso();
  const created = [];

  for (const query of queries) {
    const record = {
      id: createId(),
      campaign_id: campaignId,
      source: query.source,
      source_label: query.sourceLabel || query.source,
      source_index: Number.isFinite(Number(query.sourceIndex)) ? Number(query.sourceIndex) : 0,
      source_domain: query.sourceDomain || "",
      query: query.query,
      google_url: query.googleUrl,
      page_start: query.pageStart,
      page_index: query.pageIndex,
      term: query.term || "",
      pattern: query.pattern || "",
      depth: query.depth || "quick",
      status: "pending",
      results_count: 0,
      created_at: timestamp,
      updated_at: timestamp,
    };

    state.searchQueries.push(record);
    created.push(record);
  }

  await saveState(state);
  return created;
}

export async function listSearchQueries(campaignId = null) {
  const state = await loadState();
  const queries = campaignId
    ? state.searchQueries.filter((query) => query.campaign_id === campaignId)
    : state.searchQueries;
  return clone(queries).sort((a, b) => String(a.created_at || "").localeCompare(String(b.created_at || "")));
}

export async function getSearchQueryById(id) {
  const state = await loadState();
  return clone(state.searchQueries.find((query) => query.id === id) || null);
}

export async function updateSearchQuery(id, patch) {
  const state = await loadState();
  const target = state.searchQueries.find((query) => query.id === id);

  if (!target) {
    return null;
  }

  Object.assign(target, patch, {
    updated_at: nowIso(),
  });

  await saveState(state);
  return clone(target);
}

function uniqueList(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter(Boolean))];
}

function upsertLinkRecord(state, candidate) {
  const timestamp = nowIso();
  const rawUrl = candidate.group_url_raw || candidate.raw_url || candidate.rawUrl || "";
  const normalizedUrl = normalizeWhatsAppLink(rawUrl);

  if (!normalizedUrl) {
    return { record: null, inserted: false, duplicate: false };
  }

  const existing = state.groupLinks.find(
    (link) => link.campaign_id === candidate.campaign_id && link.normalized_url === normalizedUrl,
  );

  if (existing) {
    existing.search_query_ids = uniqueList([
      ...(existing.search_query_ids || []),
      candidate.search_query_id,
    ]);
    existing.sources = uniqueList([
      ...(existing.sources || []),
      candidate.source,
    ]);
    existing.page_urls = uniqueList([
      ...(existing.page_urls || []),
      candidate.candidate_page_url || candidate.page_url,
    ]);
    existing.raw_urls = uniqueList([
      ...(existing.raw_urls || []),
      rawUrl,
    ]);
    existing.group_url_raw = rawUrl || existing.group_url_raw || "";
    existing.group_url_normalized = normalizedUrl || existing.group_url_normalized || "";
    existing.raw_url = rawUrl || existing.raw_url || "";
    existing.normalized_url = normalizedUrl || existing.normalized_url || "";
    existing.candidate_page_titles = uniqueList([
      ...(existing.candidate_page_titles || []),
      candidate.candidate_page_title || candidate.page_title,
    ]);
    existing.candidate_page_urls = uniqueList([
      ...(existing.candidate_page_urls || []),
      candidate.candidate_page_url || candidate.page_url,
    ]);
    existing.candidate_page_url = candidate.candidate_page_url || candidate.page_url || existing.candidate_page_url || "";
    existing.candidate_page_title = candidate.candidate_page_title || candidate.page_title || existing.candidate_page_title || "";
    existing.page_url = existing.candidate_page_url || existing.page_url || "";
    existing.page_title = existing.candidate_page_title || existing.page_title || "";
    existing.google_queries = uniqueList([
      ...(existing.google_queries || []),
      candidate.google_query || "",
    ]);
    existing.extraction_status = candidate.extraction_status || existing.extraction_status || "unknown";
    existing.notes = normalizeFreeText(existing.notes || candidate.notes || "");
    existing.updated_at = timestamp;

    return { record: existing, inserted: false, duplicate: true };
  }

  const record = {
    id: createId(),
    campaign_id: candidate.campaign_id,
    search_query_id: candidate.search_query_id,
    search_query_ids: candidate.search_query_id ? [candidate.search_query_id] : [],
    source: candidate.source || "",
    sources: candidate.source ? [candidate.source] : [],
    primary_keyword: candidate.primary_keyword || "",
    region: candidate.region || "",
    google_query: candidate.google_query || "",
    raw_url: rawUrl,
    raw_urls: rawUrl ? [rawUrl] : [],
    normalized_url: normalizedUrl,
    group_url_raw: rawUrl,
    group_url_normalized: normalizedUrl,
    candidate_page_url: candidate.candidate_page_url || candidate.page_url || "",
    candidate_page_urls: candidate.candidate_page_url || candidate.page_url ? [candidate.candidate_page_url || candidate.page_url] : [],
    candidate_page_title: candidate.candidate_page_title || candidate.page_title || "",
    candidate_page_titles: candidate.candidate_page_title || candidate.page_title ? [candidate.candidate_page_title || candidate.page_title] : [],
    page_url: candidate.candidate_page_url || candidate.page_url || "",
    page_urls: candidate.candidate_page_url || candidate.page_url ? [candidate.candidate_page_url || candidate.page_url] : [],
    page_title: candidate.candidate_page_title || candidate.page_title || "",
    extraction_status: candidate.extraction_status || "unknown",
    status: "pending_validation",
    validation_status: "not_checked",
    manual_status: "not_tested",
    notes: candidate.notes || "",
    google_queries: candidate.google_query ? [candidate.google_query] : [],
    created_at: timestamp,
    last_checked_at: null,
    updated_at: timestamp,
  };

  state.groupLinks.push(record);
  return { record, inserted: true, duplicate: false };
}

export async function saveDiscoveredLinks({
  campaignId,
  searchQueryId,
  source,
  googleQuery = "",
  primaryKeyword = "",
  region = "",
  candidatePageUrl = "",
  candidatePageTitle = "",
  extractionStatus = "unknown",
  links = [],
}) {
  const state = await loadState();
  const insertedRecords = [];
  let insertedCount = 0;
  let duplicateCount = 0;

  for (const item of links) {
    const rawUrl = typeof item === "string" ? item : item?.rawUrl || item?.url || item?.raw_url || "";
    const { record, inserted, duplicate } = upsertLinkRecord(state, {
      campaign_id: campaignId,
      search_query_id: searchQueryId,
      source,
      google_query: googleQuery,
      primary_keyword: primaryKeyword,
      region,
      candidate_page_url: candidatePageUrl,
      candidate_page_title: candidatePageTitle,
      extraction_status: extractionStatus,
      raw_url: rawUrl,
      group_url_raw: rawUrl,
      notes: item?.notes || "",
    });

    if (record) {
      insertedRecords.push(record);
    }

    if (inserted) {
      insertedCount += 1;
    }

    if (duplicate) {
      duplicateCount += 1;
    }
  }

  await saveState(state);

  return {
    insertedCount,
    duplicateCount,
    records: insertedRecords.map(clone),
    totalForQuery: state.groupLinks.filter((link) => {
      if (link.campaign_id !== campaignId) {
        return false;
      }

      if (searchQueryId) {
        return uniqueList(link.search_query_ids || []).includes(searchQueryId);
      }

      return true;
    }).length,
  };
}

export async function saveCandidatePageScan({
  campaignId,
  searchQueryId,
  source,
  googleQuery = "",
  candidatePageUrl = "",
  candidatePageTitle = "",
  extractionStatus = "unknown",
  links = [],
}) {
  const state = await loadState();
  const timestamp = nowIso();
  const normalizedUrl = normalizeFreeText(candidatePageUrl || "");
  const existing = state.pageScans.find(
    (scan) =>
      scan.campaign_id === campaignId &&
      scan.search_query_id === searchQueryId &&
      normalizeFreeText(scan.candidate_page_url || "") === normalizedUrl,
  );

  const record = existing || {
    id: createId(),
    campaign_id: campaignId,
    search_query_id: searchQueryId,
    source: source || "",
    google_query: googleQuery || "",
    candidate_page_url: candidatePageUrl || "",
    candidate_page_title: candidatePageTitle || "",
    extraction_status: extractionStatus || "unknown",
    group_urls_found_count: 0,
    created_at: timestamp,
    updated_at: timestamp,
  };

  record.source = source || record.source || "";
  record.google_query = googleQuery || record.google_query || "";
  record.candidate_page_url = candidatePageUrl || record.candidate_page_url || "";
  record.candidate_page_title = candidatePageTitle || record.candidate_page_title || "";
  record.extraction_status = extractionStatus || record.extraction_status || "unknown";
  record.group_urls_found_count = Math.max(Number(record.group_urls_found_count || 0), links.length || 0);
  record.updated_at = timestamp;

  if (existing) {
    Object.assign(existing, record);
  } else {
    state.pageScans.push(record);
  }

  await saveState(state);
  return clone(record);
}

export async function listGroupLinks({ campaignId = null, status = null, source = null, text = "" } = {}) {
  const state = await loadState();
  let links = state.groupLinks;

  if (campaignId) {
    links = links.filter((link) => link.campaign_id === campaignId);
  }

  if (status) {
    links = links.filter((link) => link.status === status || link.manual_status === status);
  }

  if (source) {
    links = links.filter((link) => (link.source || "").toLowerCase() === String(source).toLowerCase());
  }

  const search = normalizeFreeText(text).toLowerCase();

  if (search) {
    links = links.filter((link) => {
      const haystack = [
        link.raw_url,
        link.normalized_url,
        link.group_url_raw,
        link.group_url_normalized,
        link.page_title,
        link.candidate_page_title,
        link.page_url,
        link.candidate_page_url,
        link.google_query,
        link.notes,
        link.source,
        link.primary_keyword,
        link.region,
        ...(link.raw_urls || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }

  return clone(links).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

export async function getLinkById(id) {
  const state = await loadState();
  return clone(state.groupLinks.find((link) => link.id === id) || null);
}

export async function updateGroupLink(id, patch) {
  const state = await loadState();
  const target = state.groupLinks.find((link) => link.id === id);

  if (!target) {
    return null;
  }

  Object.assign(target, patch, {
    updated_at: nowIso(),
  });

  await saveState(state);
  return clone(target);
}

export async function deleteGroupLink(id) {
  const state = await loadState();
  const before = state.groupLinks.length;
  state.groupLinks = state.groupLinks.filter((link) => link.id !== id);

  if (state.groupLinks.length === before) {
    return false;
  }

  await saveState(state);
  return true;
}

export async function bulkUpdateGroupLinks(ids, patch) {
  const state = await loadState();
  const idSet = new Set(ids);
  const timestamp = nowIso();
  let updatedCount = 0;

  for (const link of state.groupLinks) {
    if (!idSet.has(link.id)) {
      continue;
    }

    Object.assign(link, patch, {
      updated_at: timestamp,
    });
    updatedCount += 1;
  }

  await saveState(state);
  return updatedCount;
}

export async function getCampaignSummaries() {
  const state = await loadState();

  return state.campaigns.map((campaign) => {
    const queries = state.searchQueries.filter((query) => query.campaign_id === campaign.id);
    const pageScans = state.pageScans.filter((scan) => scan.campaign_id === campaign.id);
    const links = state.groupLinks.filter((link) => link.campaign_id === campaign.id);

    return {
      ...clone(campaign),
      query_count: queries.length,
      page_scan_count: pageScans.length,
      link_count: links.length,
      valid_count: links.filter((link) => link.manual_status === "valid" || link.status === "valid").length,
      pending_count: links.filter((link) => link.validation_status === "not_checked").length,
    };
  });
}
