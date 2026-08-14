(() => {
  const CATEGORIES = {
    all: {
      label: "Todos",
      terms: [],
    },
    amizade: {
      label: "Amizade",
      terms: ["amizade", "amigos", "bate-papo", "conversa"],
    },
    figurinhas: {
      label: "Figurinhas",
      terms: ["figurinhas", "stickers", "figurinha whatsapp"],
    },
    vendas: {
      label: "Vendas",
      terms: ["vendas", "compra", "venda", "negocio", "loja"],
    },
    jogos: {
      label: "Jogos",
      terms: ["jogos", "games", "gamer", "free fire", "minecraft"],
    },
    musica: {
      label: "Música",
      terms: ["musica", "spotify", "playlist", "funk", "sertanejo"],
    },
    emprego: {
      label: "Emprego",
      terms: ["emprego", "vaga", "trabalho", "freela", "freelancer"],
    },
    educacao: {
      label: "Educação",
      terms: ["educacao", "estudo", "concurso", "enem", "vestibular"],
    },
    noticias: {
      label: "Notícias",
      terms: ["noticias", "news", "informacao", "jornalismo"],
    },
    tecnologia: {
      label: "Tecnologia",
      terms: ["tecnologia", "programacao", "ti", "dev", "python"],
    },
    religiao: {
      label: "Religião",
      terms: ["religiao", "igreja", "evangelico", "catolico", "oracao"],
    },
    esportes: {
      label: "Esportes",
      terms: ["esportes", "futebol", "basquete", "corrida", "academia"],
    },
    humor: {
      label: "Humor",
      terms: ["humor", "memes", "engracado", "piadas", "zoeira"],
    },
    namoro: {
      label: "Namoro",
      terms: ["namoro", "relacionamento", "paquera", "solteiros"],
    },
    culinaria: {
      label: "Culinária",
      terms: ["culinaria", "receitas", "cozinha", "gastronomia"],
    },
    investimentos: {
      label: "Investimentos",
      terms: ["investimentos", "acoes", "cripto", "bitcoin", "renda"],
    },
  };

  const INVITE_PATTERNS = {
    whatsapp: /(?:https?:\/\/)?chat\.whatsapp\.com\/[A-Za-z0-9]{10,}/gi,
    telegram: /(?:https?:\/\/)?t\.me\/(?:joinchat\/)?[A-Za-z0-9_\-\+]{5,}/gi,
  };

  const LINK_TYPES = {
    whatsapp: "WhatsApp",
    telegram: "Telegram",
  };

  const STORAGE_KEYS = {
    settings: "fc_settings",
    lastScan: "fc_last_scan",
  };

  const HTML_ENTITY_MAP = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    "#39": "'",
  };

  const UTILITY_PATH_TOKENS = [
    "/login",
    "/signin",
    "/register",
    "/signup",
    "/contato",
    "/contact",
    "/sobre",
    "/about",
    "/termos",
    "/terms",
    "/privacy",
    "/politica",
    "/cookies",
    "/sitemap",
    "/feed",
    "/tag/",
    "/author/",
  ];

  const ASSET_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".svg",
    ".ico",
    ".css",
    ".js",
    ".json",
    ".xml",
    ".woff",
    ".woff2",
  ];

  const INVALID_RESULT_PATTERNS = [
    /convite\s+expirad/i,
    /link\s+expirad/i,
    /grupo\s+expirad/i,
    /invite\s+expired/i,
    /expired\s+invite/i,
    /grupo\s+n[ãa]o\s+encontrad/i,
    /grupo\s+indispon[ií]vel/i,
    /link\s+inv[aá]lid/i,
    /convite\s+inv[aá]lid/i,
    /grupo\s+encerrad/i,
    /grupo\s+fechad/i,
    /grupo\s+banid/i,
    /access\s+denied/i,
    /not\s+found/i,
    /removed/i,
  ];

  const LOW_QUALITY_PATTERNS = [
    /aguarde\s+aprova/i,
    /pedido\s+de\s+entrada/i,
    /solicite\s+acesso/i,
    /grupo\s+privad/i,
    /sob\s+an[áa]lise/i,
  ];

  const MEMBER_COUNT_PATTERNS = [
    /(\d{1,3}(?:[.,]\d{3})*|\d+)\s*(?:\+?\s*)?(?:membros?|members?|participantes?|pessoas?|integrantes?)\b/gi,
    /(?:membros?|members?|participantes?|pessoas?|integrantes?)\s*(?:de|com|:)?\s*(\d{1,3}(?:[.,]\d{3})*|\d+)\b/gi,
  ];

  const MAX_SNIPPET_LENGTH = 200_000;

  function trimText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function safeDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (_) {
      return value;
    }
  }

  function safeDecodeBase64(value) {
    const text = String(value || "").replace(/\s+/g, "");
    if (!text || text.length < 24) {
      return "";
    }

    const candidate = text.replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+/=]/g, "");
    if (candidate.length < 24 || candidate.length % 4 === 1) {
      return "";
    }

    try {
      const decoded = typeof atob === "function"
        ? atob(candidate)
        : Buffer.from(candidate, "base64").toString("utf8");
      const printable = String(decoded || "");
      if (!printable || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(printable)) {
        return "";
      }
      return printable;
    } catch (_) {
      return "";
    }
  }

  function decodeHtmlEntities(value) {
    return String(value || "").replace(
      /&(#x?[0-9a-f]+|[a-z]+);/gi,
      (_, entity) => {
        const normalized = String(entity || "").toLowerCase();
        if (HTML_ENTITY_MAP[normalized]) {
          return HTML_ENTITY_MAP[normalized];
        }
        if (normalized.startsWith("#x")) {
          const codePoint = Number.parseInt(normalized.slice(2), 16);
          return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _;
        }
        if (normalized.startsWith("#")) {
          const codePoint = Number.parseInt(normalized.slice(1), 10);
          return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _;
        }
        return _;
      },
    );
  }

  function normalizeUrl(rawUrl) {
    const input = trimText(rawUrl).replace(/\\\//g, "/");
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
      url.search = "";
      url.hostname = url.hostname.toLowerCase();
      url.pathname = url.pathname.replace(/\/+$/, "");
      return url.toString().replace(/\/+$/, "");
    } catch (_) {
      return "";
    }
  }

  function classifyInviteUrl(url) {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      return "";
    }
    if (normalized.includes("chat.whatsapp.com")) {
      return "whatsapp";
    }
    if (normalized.includes("t.me/")) {
      return "telegram";
    }
    return "";
  }

  function normalizeSearchText(value) {
    return trimText(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function parseMemberCount(value) {
    const text = String(value || "");
    let best = null;

    for (const pattern of MEMBER_COUNT_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      for (const match of text.matchAll(regex)) {
        const rawNumber = String(match[1] || match[0] || "");
        const normalized = Number.parseInt(rawNumber.replace(/[^\d]/g, ""), 10);
        if (Number.isFinite(normalized)) {
          best = best === null ? normalized : Math.max(best, normalized);
        }
      }
    }

    return best;
  }

  function getMemberSizeTier(memberCount) {
    if (!Number.isFinite(memberCount) || memberCount <= 0) {
      return "unknown";
    }
    if (memberCount <= 2) {
      return "tiny";
    }
    if (memberCount <= 9) {
      return "small";
    }
    if (memberCount <= 49) {
      return "medium";
    }
    return "large";
  }

  function getMemberCountScore(memberCount) {
    if (!Number.isFinite(memberCount) || memberCount <= 0) {
      return 0;
    }
    if (memberCount >= 100) {
      return 22;
    }
    if (memberCount >= 50) {
      return 16;
    }
    if (memberCount >= 20) {
      return 10;
    }
    if (memberCount >= 10) {
      return 6;
    }
    if (memberCount <= 2) {
      return -20;
    }
    return -8;
  }

  function getResultSearchText(entry) {
    return normalizeSearchText([
      entry?.url,
      entry?.source,
      entry?.title,
      entry?.context,
      entry?.pageUrl,
      entry?.typeLabel,
      ...(Array.isArray(entry?.sources) ? entry.sources : []),
    ].join(" "));
  }

  function entryMatchesQualityChecks(entry, settings) {
    const haystack = getResultSearchText(entry);
    const searchScore = Number(entry?.searchScore) || 0;
    const memberCount = Number.isFinite(entry?.memberCount)
      ? entry.memberCount
      : parseMemberCount([entry?.context, entry?.title, entry?.source].filter(Boolean).join(" "));
    const memberTier = getMemberSizeTier(memberCount);
    const issues = [];

    if (entry?.isAdult && settings?.adultMode === false) {
      issues.push("adult_disabled");
      return {
        state: "rejected",
        issues,
        memberCount,
        memberTier,
      };
    }

    if (INVALID_RESULT_PATTERNS.some((pattern) => pattern.test(haystack))) {
      issues.push("invalid_or_expired");
      return {
        state: "rejected",
        issues,
        memberCount,
        memberTier,
      };
    }

    if (memberTier === "tiny") {
      issues.push("very_small_group");
    } else if (memberTier === "small") {
      issues.push("small_group");
    } else if (memberTier === "unknown" && searchScore < 20) {
      issues.push("unknown_members");
    }

    if (LOW_QUALITY_PATTERNS.some((pattern) => pattern.test(haystack))) {
      issues.push("low_quality");
    }

    if (issues.length) {
      return {
        state: "suspect",
        issues,
        memberCount,
        memberTier,
      };
    }

    return {
      state: "clean",
      issues,
      memberCount,
      memberTier,
    };
  }

  function annotateEntryQuality(entry, settings) {
    const quality = entryMatchesQualityChecks(entry, settings);
    return {
      ...entry,
      memberCount: Number.isFinite(quality.memberCount) ? quality.memberCount : null,
      memberTier: quality.memberTier,
      qualityState: quality.state,
      qualityIssues: quality.issues,
    };
  }

  function filterEntriesByQuality(entries, settings, mode = "clean") {
    const annotated = (entries || []).map((entry) => annotateEntryQuality(entry, settings));
    const clean = annotated.filter((entry) => entry.qualityState === "clean");
    const suspect = annotated.filter((entry) => entry.qualityState === "suspect");
    const rejected = annotated.filter((entry) => entry.qualityState === "rejected");
    const visible = mode === "all" ? annotated : mode === "suspect" ? suspect : clean;
    return {
      all: annotated,
      clean,
      suspect,
      rejected,
      visible,
    };
  }

  function getCategoryOptions() {
    return Object.entries(CATEGORIES).map(([value, meta]) => ({
      value,
      label: meta.label,
      terms: [...meta.terms],
    }));
  }

  function getCategoryTerms(category) {
    const key = String(category || "all").trim().toLowerCase();
    return [...(CATEGORIES[key]?.terms || [])];
  }

  function buildSearchTerms(keyword, category) {
    const terms = [];
    const keywordTerm = normalizeSearchText(keyword);
    if (keywordTerm) {
      terms.push(keywordTerm);
    }
    for (const term of getCategoryTerms(category)) {
      const normalized = normalizeSearchText(term);
      if (normalized) {
        terms.push(normalized);
      }
    }
    return [...new Set(terms)];
  }

  function buildSearchProfile(settings) {
    return {
      keywordTerm: normalizeSearchText(settings?.keyword),
      categoryTerms: getCategoryTerms(settings?.category)
        .map((term) => normalizeSearchText(term))
        .filter(Boolean),
    };
  }

  function scoreSearchEntry(entry, settings) {
    const haystack = getResultSearchText(entry);
    const profile = buildSearchProfile(settings);
    const matchTerms = [];
    const hasSearchTerms = Boolean(profile.keywordTerm || profile.categoryTerms.length);
    let matched = !hasSearchTerms;
    let score = 0;

    if (profile.keywordTerm && haystack.includes(profile.keywordTerm)) {
      score += 60;
      matchTerms.push(`keyword:${profile.keywordTerm}`);
      matched = true;
    }

    const matchedCategories = profile.categoryTerms.filter((term) => haystack.includes(term));
    if (matchedCategories.length) {
      score += Math.min(matchedCategories.length, 3) * 20;
      matchTerms.push(...matchedCategories.slice(0, 3).map((term) => `category:${term}`));
      matched = true;
    }

    score += getMemberCountScore(entry?.memberCount);

    if (!hasSearchTerms) {
      score = Math.max(score, 1);
    }

    return {
      score,
      matched,
      matchTerms,
    };
  }

  function annotateSearchEntry(entry, settings) {
    const search = scoreSearchEntry(entry, settings);
    return {
      ...entry,
      searchScore: search.score,
      searchMatched: search.matched,
      searchMatches: search.matchTerms,
    };
  }

  function entryMatchesSearch(entry, settings) {
    return scoreSearchEntry(entry, settings).matched;
  }

  function textMatchesSearch(text, settings) {
    return entryMatchesSearch({
      url: "",
      source: "",
      title: String(text || ""),
      context: "",
      pageUrl: "",
      typeLabel: "",
      sources: [],
    }, settings);
  }

  function filterEntriesBySearch(entries, settings) {
    const annotated = (entries || []).map((entry) => annotateSearchEntry(entry, settings));
    return annotated.sort((a, b) => {
      const scoreDelta = (Number(b.searchScore) || 0) - (Number(a.searchScore) || 0);
      if (scoreDelta) {
        return scoreDelta;
      }
      const dateDelta = (Number(b.discoveredAt) || 0) - (Number(a.discoveredAt) || 0);
      if (dateDelta) {
        return dateDelta;
      }
      return String(a.url || "").localeCompare(String(b.url || ""));
    });
  }

  function buildInviteEntry(url, meta = {}) {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      return null;
    }
    const type = classifyInviteUrl(normalized);
    if (!type) {
      return null;
    }

    const source = trimText(meta.source || "");
    const title = trimText(meta.title || "");
    const context = trimText(meta.context || "");
    const pageUrl = trimText(meta.pageUrl || "");

    return {
      url: normalized,
      type,
      typeLabel: LINK_TYPES[type] || type,
      source,
      sources: source ? [source] : [],
      isAdult: Boolean(meta.isAdult),
      memberCount: Number.isFinite(meta.memberCount) ? meta.memberCount : null,
      title,
      context,
      pageUrl,
      discoveredAt: meta.discoveredAt || Date.now(),
    };
  }

  function mergeInviteEntries(entries) {
    const map = new Map();
    for (const entry of entries || []) {
      if (!entry || !entry.url) {
        continue;
      }
      const normalized = normalizeUrl(entry.url);
      const type = entry.type || classifyInviteUrl(normalized);
      if (!normalized || !type) {
        continue;
      }

      const key = `${type}|${normalized}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          url: normalized,
          type,
          typeLabel: LINK_TYPES[type] || type,
          source: trimText(entry.source || ""),
          sources: Array.isArray(entry.sources) && entry.sources.length
            ? [...new Set(entry.sources.map((value) => trimText(value)).filter(Boolean))]
            : (entry.source ? [trimText(entry.source)] : []),
          isAdult: Boolean(entry.isAdult),
          memberCount: Number.isFinite(entry.memberCount) ? entry.memberCount : null,
          title: trimText(entry.title || ""),
          context: trimText(entry.context || ""),
          pageUrl: trimText(entry.pageUrl || ""),
          discoveredAt: entry.discoveredAt || Date.now(),
        });
        continue;
      }

      const nextSources = Array.isArray(entry.sources) ? entry.sources : [];
      const mergedSources = new Set(existing.sources || []);
      if (entry.source) {
        mergedSources.add(trimText(entry.source));
      }
      for (const source of nextSources) {
        mergedSources.add(trimText(source));
      }

      existing.sources = [...mergedSources].filter(Boolean);
      existing.source = existing.source || trimText(entry.source || "");
      existing.isAdult = Boolean(existing.isAdult || entry.isAdult);
      if (!Number.isFinite(existing.memberCount) && Number.isFinite(entry.memberCount)) {
        existing.memberCount = entry.memberCount;
      } else if (Number.isFinite(existing.memberCount) && Number.isFinite(entry.memberCount)) {
        existing.memberCount = Math.max(existing.memberCount, entry.memberCount);
      }
      existing.title = existing.title || trimText(entry.title || "");
      existing.context = existing.context || trimText(entry.context || "");
      existing.pageUrl = existing.pageUrl || trimText(entry.pageUrl || "");
      existing.discoveredAt = Math.min(existing.discoveredAt || Date.now(), entry.discoveredAt || Date.now());
    }

    return [...map.values()];
  }

  function decodeSearchVariants(text) {
    const variants = [];
    const seen = new Set();
    const add = (value) => {
      const normalized = String(value || "").replace(/\\\//g, "/");
      if (!normalized || seen.has(normalized) || normalized.length > MAX_SNIPPET_LENGTH) {
        return;
      }
      seen.add(normalized);
      variants.push(normalized);
    };

    const original = String(text || "");
    add(original);
    add(decodeHtmlEntities(original));
    add(safeDecodeURIComponent(original));
    add(safeDecodeURIComponent(decodeHtmlEntities(original)));
    add(safeDecodeBase64(original));
    add(safeDecodeBase64(decodeHtmlEntities(original)));

    let current = decodeHtmlEntities(original);
    for (let i = 0; i < 2; i += 1) {
      const decoded = safeDecodeURIComponent(current);
      if (decoded === current) {
        break;
      }
      add(decoded);
      current = decoded;
    }

    const base64Matches = original.match(/(?:[A-Za-z0-9+/=]{32,}|[A-Za-z0-9_-]{32,})/g) || [];
    for (const token of base64Matches.slice(0, 20)) {
      add(safeDecodeBase64(token));
    }

    return variants;
  }

  function extractInviteEntriesFromText(text, meta = {}) {
    const entries = [];
    const seen = new Set();

    for (const variant of decodeSearchVariants(text)) {
      for (const [type, pattern] of Object.entries(INVITE_PATTERNS)) {
        const regex = new RegExp(pattern.source, pattern.flags);
        for (const match of variant.matchAll(regex)) {
          const start = Math.max(0, (match.index || 0) - 120);
          const end = Math.min(variant.length, (match.index || 0) + String(match[0] || "").length + 120);
          const snippet = trimText(variant.slice(start, end));
          const entry = buildInviteEntry(match[0], {
            ...meta,
            source: meta.source || "",
            context: snippet || meta.context || "",
            memberCount: parseMemberCount(snippet || meta.context || meta.title || ""),
          });
          if (!entry) {
            continue;
          }
          const key = `${type}|${entry.url}`;
          if (seen.has(key)) {
            continue;
          }
          seen.add(key);
          entries.push(entry);
        }
      }
    }

    const raw = String(text || "");
    const invitationHints = [
      /(?:whatsapp|telegram|chat\.whatsapp\.com|t\.me|joinchat|invite|convite)[^"'<>]{0,120}/gi,
    ];

    for (const pattern of invitationHints) {
      const regex = new RegExp(pattern.source, pattern.flags);
      for (const match of raw.matchAll(regex)) {
        const snippet = trimText(match[0] || "");
        if (!snippet) {
          continue;
        }
        for (const variant of decodeSearchVariants(snippet)) {
          for (const [type, invitePattern] of Object.entries(INVITE_PATTERNS)) {
            const inviteRegex = new RegExp(invitePattern.source, invitePattern.flags);
            for (const inviteMatch of variant.matchAll(inviteRegex)) {
              const entry = buildInviteEntry(inviteMatch[0], {
                ...meta,
                source: meta.source || "",
                context: variant.slice(0, 500),
                memberCount: parseMemberCount(variant),
              });
              if (!entry) {
                continue;
              }
              const key = `${type}|${entry.url}`;
              if (seen.has(key)) {
                continue;
              }
              seen.add(key);
              entries.push(entry);
            }
          }
        }
      }
    }

    return entries;
  }

  function extractPageTitleFromHtml(html) {
    const source = String(html || "").slice(0, MAX_SNIPPET_LENGTH);
    const match = source.match(/<title[^>]*>(.*?)<\/title>/i);
    return match ? trimText(decodeHtmlEntities(match[1])) : "";
  }

  function isUtilityCandidateUrl(url) {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      return true;
    }

    let parsed;
    try {
      parsed = new URL(normalized);
    } catch (_) {
      return true;
    }

    const path = `${parsed.pathname || ""}${parsed.search || ""}`.toLowerCase();
    if (ASSET_EXTENSIONS.some((ext) => path.endsWith(ext))) {
      return true;
    }
    return UTILITY_PATH_TOKENS.some((token) => path.includes(token));
  }

  function scoreCandidateUrl(url, baseUrl) {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      return -1000;
    }

    let score = 0;
    try {
      const parsed = new URL(normalized);
      const path = `${parsed.pathname || ""}`.toLowerCase();
      const lowerUrl = normalized.toLowerCase();

      if (baseUrl) {
        const base = new URL(baseUrl);
        if (parsed.origin === base.origin) {
          score += 35;
        }
      }

      if (path.includes("/group/") || path.includes("/grupo/") || path.includes("/grupos/")) {
        score += 60;
      }
      if (path.includes("/category/") || path.includes("/categoria/")) {
        score += 40;
      }
      if (path.includes("join") || path.includes("invite") || path.includes("convite")) {
        score += 35;
      }
      if (lowerUrl.includes("whatsapp") || lowerUrl.includes("telegram")) {
        score += 20;
      }
      if (isUtilityCandidateUrl(normalized)) {
        score -= 120;
      }
    } catch (_) {
      score -= 50;
    }

    return score;
  }

  function extractJsonUrls(text) {
    const results = [];
    const seen = new Set();
    const source = String(text || "");
    const patterns = [
      /"url"\s*:\s*"([^"]+)"/gi,
      /"href"\s*:\s*"([^"]+)"/gi,
      /"link"\s*:\s*"([^"]+)"/gi,
      /"permalink"\s*:\s*"([^"]+)"/gi,
      /"canonical"\s*:\s*"([^"]+)"/gi,
      /"join(?:chat)?"\s*:\s*"([^"]+)"/gi,
      /"invite(?:Url)?"\s*:\s*"([^"]+)"/gi,
      /"whatsapp(?:Url)?"\s*:\s*"([^"]+)"/gi,
      /"telegram(?:Url)?"\s*:\s*"([^"]+)"/gi,
    ];

    for (const pattern of patterns) {
      const regex = new RegExp(pattern.source, pattern.flags);
      for (const match of source.matchAll(regex)) {
        const normalized = trimText(match[1]);
        if (!normalized || seen.has(normalized)) {
          continue;
        }
        seen.add(normalized);
        results.push(normalized);
      }
    }

    return results;
  }

  function extractCandidateUrlsFromHtml(html, baseUrl) {
    const source = String(html || "").slice(0, MAX_SNIPPET_LENGTH);
    const candidates = [];
    const seen = new Set();
    const base = baseUrl ? new URL(baseUrl) : null;

    const add = (rawUrl) => {
      const cleaned = trimText(rawUrl).replace(/\\\//g, "/");
      if (!cleaned) {
        return;
      }
      let absolute;
      try {
        absolute = new URL(cleaned, baseUrl).toString();
      } catch (_) {
        return;
      }
      const normalized = normalizeUrl(absolute);
      if (!normalized) {
        return;
      }
      if (base && new URL(normalized).origin !== base.origin) {
        return;
      }
      if (seen.has(normalized) || isUtilityCandidateUrl(normalized)) {
        return;
      }
      seen.add(normalized);
      candidates.push({
        url: normalized,
        score: scoreCandidateUrl(normalized, baseUrl),
      });
    };

    const hrefRegex = /\b(?:href|src|data-href)\s*=\s*["']([^"'<> ]+)["']/gi;
    for (const match of source.matchAll(hrefRegex)) {
      add(match[1]);
    }

    const richAttrRegex = /\b(?:data-url|data-link|data-target|data-permalink|data-source|data-canonical|data-join|data-invite|onclick|onmouseover|href|src)\s*=\s*["']([^"'<>]+)["']/gi;
    for (const match of source.matchAll(richAttrRegex)) {
      add(match[1]);
    }

    for (const jsonUrl of extractJsonUrls(source)) {
      add(jsonUrl);
    }

    const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
    for (const match of source.matchAll(urlRegex)) {
      add(match[0]);
    }

    candidates.sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));
    return candidates.map((item) => item.url);
  }

  function escapeCsvCell(value) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  }

  function entriesToCsv(entries) {
    const rows = [
      ["URL", "Tipo", "Fonte", "Fontes", "Pagina", "Titulo", "Contexto"],
    ];

    for (const entry of entries || []) {
      rows.push([
        entry.url || "",
        entry.typeLabel || LINK_TYPES[entry.type] || entry.type || "",
        entry.source || "",
        Array.isArray(entry.sources) ? entry.sources.join(", ") : "",
        entry.pageUrl || "",
        entry.title || "",
        entry.context || "",
      ]);
    }

    return rows
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n");
  }

  function entriesToUrlList(entries) {
    return [...new Set((entries || []).map((entry) => trimText(entry?.url)).filter(Boolean))].join("\n");
  }

  function summarizeEntries(entries) {
    const summary = {
      total: 0,
      whatsapp: 0,
      telegram: 0,
      membersKnown: 0,
    };

    for (const entry of entries || []) {
      summary.total += 1;
      if (entry.type === "whatsapp") {
        summary.whatsapp += 1;
      } else if (entry.type === "telegram") {
        summary.telegram += 1;
      }
      if (Number.isFinite(entry.memberCount)) {
        summary.membersKnown += 1;
      }
    }

    return summary;
  }

  function defaultSettingsFromSources(sourceCatalog) {
    const sources = {};
    for (const source of sourceCatalog || []) {
      sources[source.id] = source.enabledByDefault !== false;
    }
    return {
      includeCurrentTab: true,
      crawlDepth: 2,
      adultMode: false,
      keyword: "",
      category: "all",
      channels: {
        whatsapp: true,
        telegram: true,
      },
      sources,
    };
  }

  function normalizeSettings(rawSettings, sourceCatalog) {
    const defaults = defaultSettingsFromSources(sourceCatalog);
    const incoming = rawSettings && typeof rawSettings === "object" ? rawSettings : {};
    const mergedSources = {};

    for (const source of sourceCatalog || []) {
      const rawValue = incoming.sources ? incoming.sources[source.id] : undefined;
      mergedSources[source.id] = typeof rawValue === "boolean"
        ? rawValue
        : defaults.sources[source.id];
    }

    const crawlDepth = Number.parseInt(incoming.crawlDepth, 10);
    const depth = Number.isFinite(crawlDepth) ? Math.min(4, Math.max(1, crawlDepth)) : defaults.crawlDepth;
    const adultMode = incoming.adultMode === true;
    const keyword = trimText(incoming.keyword || "");
    const category = CATEGORIES[String(incoming.category || "all").trim().toLowerCase()] ? String(incoming.category || "all").trim().toLowerCase() : "all";

    const settings = {
      includeCurrentTab: incoming.includeCurrentTab !== false,
      crawlDepth: depth,
      adultMode,
      keyword,
      category,
      channels: {
        whatsapp: incoming.channels?.whatsapp !== false,
        telegram: incoming.channels?.telegram !== false,
      },
      sources: mergedSources,
    };

    if (!settings.adultMode) {
      for (const source of sourceCatalog || []) {
        if (source.adultOnly) {
          settings.sources[source.id] = false;
        }
      }
    }

    return settings;
  }

  function countEnabledSources(settings) {
    return Object.values(settings?.sources || {}).filter(Boolean).length;
  }

  function selectedSourceIds(settings, sourceCatalog) {
    return (sourceCatalog || [])
      .filter((source) => Boolean(settings?.sources?.[source.id]))
      .map((source) => source.id);
  }

  globalThis.FerramentaConsulta = {
    STORAGE_KEYS,
    LINK_TYPES,
    INVITE_PATTERNS,
    trimText,
    decodeHtmlEntities,
    normalizeUrl,
    classifyInviteUrl,
    buildInviteEntry,
    mergeInviteEntries,
    extractInviteEntriesFromText,
    extractPageTitleFromHtml,
    extractCandidateUrlsFromHtml,
    textMatchesSearch,
    entriesToCsv,
    entriesToUrlList,
    summarizeEntries,
    filterEntriesBySearch,
    filterEntriesByQuality,
    defaultSettingsFromSources,
    normalizeSettings,
    countEnabledSources,
    selectedSourceIds,
    getCategoryOptions,
    buildSearchTerms,
    normalizeSearchText,
    parseMemberCount,
    getMemberSizeTier,
    getMemberCountScore,
    annotateEntryQuality,
    buildSearchProfile,
    scoreSearchEntry,
    annotateSearchEntry,
    scoreCandidateUrl,
  };
})();
