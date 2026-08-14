import { normalizeFreeText, normalizeWhatsAppLink, toLowerFreeText } from "./normalizer.js";

const POSITIVE_JOIN_PHRASES = [
  "join chat",
  "join group",
  "enter chat",
  "enter group",
  "entrar no grupo",
  "entrar na conversa",
  "participar do grupo",
];

const FULL_GROUP_PHRASES = [
  "group is full",
  "grupo está cheio",
  "este grupo está cheio",
  "this group is full",
  "can't join because this group is full",
];

const REVOKED_LINK_PHRASES = [
  "invite link was reset",
  "this invite link is no longer valid",
  "link de convite foi redefinido",
  "este link de convite não é mais válido",
  "link inválido",
  "grupo não existe",
  "invite link revoked",
];

function buildValidationText(payload = {}) {
  const pieces = [
    payload.pageTitle,
    payload.headingText,
    payload.bodyText,
    ...(Array.isArray(payload.buttonLabels) ? payload.buttonLabels : []),
    ...(Array.isArray(payload.linkLabels) ? payload.linkLabels : []),
    payload.url,
  ];

  return toLowerFreeText(pieces.filter(Boolean).join(" "));
}

export function isValidWhatsAppInviteFormat(value) {
  return Boolean(normalizeWhatsAppLink(value));
}

export function classifyWhatsAppInvitePage(payload = {}) {
  const normalizedUrl = normalizeWhatsAppLink(payload.url || payload.pageUrl || "");
  const text = buildValidationText(payload);

  if (!normalizedUrl) {
    return "invalid_format";
  }

  if (!text) {
    return "page_not_loaded";
  }

  if (
    FULL_GROUP_PHRASES.some((phrase) => text.includes(phrase))
  ) {
    return "group_full";
  }

  if (
    REVOKED_LINK_PHRASES.some((phrase) => text.includes(phrase))
  ) {
    return "invite_revoked";
  }

  if (
    POSITIVE_JOIN_PHRASES.some((phrase) => text.includes(phrase))
  ) {
    return "join_available";
  }

  if (text.includes("network error") || text.includes("erro de rede")) {
    return "network_error";
  }

  if (text.includes("unavailable") || text.includes("indisponível")) {
    return "unavailable";
  }

  return "manual_review_required";
}

export function buildValidationSummary(payload = {}) {
  return {
    url: normalizeWhatsAppLink(payload.url || payload.pageUrl || ""),
    title: normalizeFreeText(payload.pageTitle || ""),
    suggestion: classifyWhatsAppInvitePage(payload),
  };
}
