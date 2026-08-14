function safeUrl(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return null;
  }

  try {
    if (/^https?:\/\//i.test(raw)) {
      return new URL(raw);
    }

    return new URL(`https://${raw}`);
  } catch {
    return null;
  }
}

export function normalizeWhatsAppLink(value) {
  const url = safeUrl(value);

  if (!url) {
    return null;
  }

  if (url.hostname !== "chat.whatsapp.com" && url.hostname !== "www.chat.whatsapp.com") {
    return null;
  }

  const [inviteCode] = url.pathname.split("/").filter(Boolean);

  if (!inviteCode) {
    return null;
  }

  return `https://chat.whatsapp.com/${inviteCode}`;
}

export function normalizeFreeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

export function toLowerFreeText(value) {
  return normalizeFreeText(value).toLowerCase();
}
