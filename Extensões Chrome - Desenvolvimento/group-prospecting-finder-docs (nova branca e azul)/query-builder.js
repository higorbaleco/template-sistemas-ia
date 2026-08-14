import {
  GOOGLE_PAGE_SIZE,
  GOOGLE_SEARCH_BASE,
  QUICK_WHATSAPP_PATTERNS,
  MEDIUM_WHATSAPP_PATTERNS,
  DEEP_WHATSAPP_PATTERNS,
  SEARCH_CONTEXT_KEY,
  SOURCE_DEFINITIONS,
} from "./constants.js";

function normalizeList(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .map((value) => String(value || "").trim())
    .filter(Boolean))];
}

function quotePhrase(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return "";
  }
  const escaped = trimmed.replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function buildSourcePrefix(source) {
  return SOURCE_DEFINITIONS[source]?.queryPrefix || "";
}

function buildSearchQuery(source, term, region, pattern) {
  const parts = [];
  const prefix = buildSourcePrefix(source);

  if (prefix) {
    parts.push(prefix);
  }

  const normalizedTerm = String(term || "").trim();
  const normalizedRegion = String(region || "").trim();
  const normalizedPattern = String(pattern || "").trim();

  if (normalizedTerm) {
    parts.push(quotePhrase(normalizedTerm));
  }

  if (normalizedRegion) {
    parts.push(quotePhrase(normalizedRegion));
  }

  if (normalizedPattern) {
    parts.push(normalizedPattern);
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function buildPatternVariants(depth) {
  if (depth === "deep") {
    return DEEP_WHATSAPP_PATTERNS;
  }
  if (depth === "medium") {
    return MEDIUM_WHATSAPP_PATTERNS;
  }
  return QUICK_WHATSAPP_PATTERNS;
}

function buildTermVariants(primaryKeyword, additionalTerms, region, depth) {
  const primary = String(primaryKeyword || "").trim();
  const extraTerms = normalizeList(additionalTerms);
  const variants = [];

  if (primary) {
    variants.push(primary);
  }

  variants.push(...extraTerms);

  if (depth === "deep") {
    for (const term of extraTerms) {
      variants.push(`${primary} ${term}`.trim());
    }

    if (region) {
      variants.push(`${primary} ${region}`.trim());
    }
  }

  return normalizeList(variants);
}

function buildGoogleSearchUrl(query, pageStart) {
  const url = new URL(GOOGLE_SEARCH_BASE);
  url.searchParams.set("q", query);
  url.searchParams.set("start", String(pageStart));
  return url.toString();
}

function scoreSource(source) {
  const weights = {
    google: 100,
    youtube: 85,
    facebook: 80,
    reddit: 70,
    instagram: 65,
    tiktok: 60,
    linkedin: 55,
    x: 50,
  };

  return weights[source] || 40;
}

function scorePattern(pattern, depth) {
  const normalized = String(pattern || "").toLowerCase();
  let score = 0;

  if (normalized.includes("chat.whatsapp.com")) {
    score += 120;
  }

  if (normalized.includes("grupo whatsapp") || normalized.includes("grupos whatsapp")) {
    score += 30;
  }

  if (normalized.includes("link de grupo")) {
    score += 20;
  }

  if (depth === "quick") {
    score += 20;
  } else if (depth === "medium") {
    score += 10;
  }

  return score;
}

function scoreTerm(term, primaryKeyword, depth) {
  const normalizedTerm = String(term || "").trim().toLowerCase();
  const normalizedPrimary = String(primaryKeyword || "").trim().toLowerCase();
  let score = 0;

  if (normalizedTerm && normalizedTerm === normalizedPrimary) {
    score += 120;
  }

  if (normalizedTerm.includes(normalizedPrimary) && normalizedPrimary) {
    score += 40;
  }

  if (depth === "quick") {
    score += 20;
  } else if (depth === "medium") {
    score += 10;
  }

  return score;
}

function scorePage(pageStart) {
  return Math.max(0, 40 - Math.floor(Number(pageStart || 0) / 10));
}

function buildFamilyKey(source, term, pattern) {
  return [source, term, pattern].map((value) => String(value || "").trim().toLowerCase()).join("::");
}

function encodeContext(context) {
  return encodeURIComponent(JSON.stringify(context));
}

function appendContextHash(url, context) {
  const cleanUrl = new URL(url);
  cleanUrl.hash = `${SEARCH_CONTEXT_KEY}=${encodeContext(context)}`;
  return cleanUrl.toString();
}

export function buildQueries({
  primaryKeyword,
  additionalTerms = [],
  region = "",
  sources = [],
  pagesPerSource = 1,
  depth = "quick",
}) {
  const selectedSources = normalizeList(sources);
  const termVariants = buildTermVariants(primaryKeyword, additionalTerms, region, depth);
  const patternVariants = buildPatternVariants(depth);
  const limit = Math.min(Math.max(Number(pagesPerSource) || 1, 1), 50);
  const result = [];
  const dedupe = new Set();

  for (const [sourceIndex, source] of selectedSources.entries()) {
    const prefix = buildSourcePrefix(source);

    for (const term of termVariants) {
      for (const pattern of patternVariants) {
        const query = buildSearchQuery(source, term, region, pattern);

        for (let pageIndex = 0; pageIndex < limit; pageIndex += 1) {
          const pageStart = pageIndex * GOOGLE_PAGE_SIZE;
          const dedupeKey = `${source}::${query}::${pageStart}`;

          if (dedupe.has(dedupeKey)) {
            continue;
          }

          dedupe.add(dedupeKey);

          const googleUrl = buildGoogleSearchUrl(query, pageStart);

          result.push({
            source,
            sourceLabel: SOURCE_DEFINITIONS[source]?.label || source,
            sourceIndex,
            sourceDomain: prefix || "",
            term,
            pattern,
            familyKey: buildFamilyKey(source, term, pattern),
            priorityScore:
              scoreSource(source) +
              scorePattern(pattern, depth) +
              scoreTerm(term, primaryKeyword, depth) +
              scorePage(pageStart),
            query,
            googleUrl,
            pageStart,
            pageIndex,
            depth,
          });
        }
      }
    }
  }

  return result;
}

export function buildSearchExecutionUrl(searchQuery, context = {}) {
  return appendContextHash(searchQuery.google_url || searchQuery.googleUrl || searchQuery, context);
}

export function buildCampaignSearchUrl(query, context = {}) {
  return appendContextHash(query, context);
}

export function buildSearchContext({
  campaignId,
  searchQueryId,
  source,
  query,
  pageStart,
  pageIndex,
  depth,
  primaryKeyword = "",
  region = "",
}) {
  return {
    campaignId,
    searchQueryId,
    source,
    query,
    pageStart,
    pageIndex,
    depth,
    primaryKeyword,
    region,
  };
}
