export const STORAGE_KEYS = {
  APP_STATE: "gpf_app_state_v1",
};

export const SEARCH_CONTEXT_KEY = "gpf";
export const VALIDATION_CONTEXT_KEY = "gpfv";

export const GOOGLE_SEARCH_BASE = "https://www.google.com/search";
export const GOOGLE_PAGE_SIZE = 10;

export const SOURCE_DEFINITIONS = {
  google: {
    label: "Google geral",
    queryPrefix: "",
  },
  facebook: {
    label: "Facebook",
    queryPrefix: "site:facebook.com",
  },
  youtube: {
    label: "YouTube",
    queryPrefix: "site:youtube.com",
  },
  tiktok: {
    label: "TikTok",
    queryPrefix: "site:tiktok.com",
  },
  reddit: {
    label: "Reddit",
    queryPrefix: "site:reddit.com",
  },
  instagram: {
    label: "Instagram",
    queryPrefix: "site:instagram.com",
  },
  linkedin: {
    label: "LinkedIn",
    queryPrefix: "site:linkedin.com",
  },
  x: {
    label: "X/Twitter",
    queryPrefix: "(site:x.com OR site:twitter.com)",
  },
};

export const SOURCE_OPTIONS = Object.entries(SOURCE_DEFINITIONS).map(([value, config]) => ({
  value,
  label: config.label,
}));

export const DEPTH_OPTIONS = [
  { value: "quick", label: "Rápida" },
  { value: "medium", label: "Média" },
  { value: "deep", label: "Profunda" },
];

export const CAMPAIGN_STATUSES = ["draft", "active", "paused", "completed", "archived"];
export const QUERY_STATUSES = ["pending", "running", "completed", "failed", "blocked"];
export const LINK_STATUSES = ["new", "pending_validation", "valid", "invalid", "duplicate", "removed"];

export const AUTO_VALIDATION_STATUSES = [
  "not_checked",
  "valid_format",
  "invalid_format",
  "page_loaded",
  "page_not_loaded",
  "join_available",
  "group_full",
  "invite_revoked",
  "unavailable",
  "manual_review_required",
  "network_error",
  "unknown",
];

export const MANUAL_STATUSES = [
  "valid",
  "invalid",
  "group_full",
  "invite_revoked",
  "out_of_niche",
  "duplicate",
  "priority",
  "joined",
  "not_joined",
  "not_tested",
];

export const DEFAULT_SETTINGS = {
  maxConcurrentTabs: 2,
  batchSize: 2,
  delayBetweenSearchesMs: 1200,
  perQueryTimeoutMs: 45000,
  noResultBackoffMs: 400,
  earlyYieldThreshold: 1,
  closeTabsAfterCollect: true,
  openValidationInNewTab: true,
  exportOnlyValid: false,
  exportOnlyPending: false,
};

export const DEFAULT_STATE = {
  campaigns: [],
  searchQueries: [],
  pageScans: [],
  groupLinks: [],
  activeExecution: null,
  settings: DEFAULT_SETTINGS,
};

export const QUICK_WHATSAPP_PATTERNS = ["https://chat.whatsapp.com"];
export const MEDIUM_WHATSAPP_PATTERNS = ["https://chat.whatsapp.com", "chat.whatsapp.com", "grupo whatsapp"];
export const DEEP_WHATSAPP_PATTERNS = [
  "https://chat.whatsapp.com",
  "chat.whatsapp.com",
  "grupo whatsapp",
  "grupos whatsapp",
  "link de grupo",
];
