export function cleanText(input: unknown, maxLen = 160): string | undefined {
  const s = String(input ?? "").replace(/\s+/g, " ").trim();
  if (!s) return undefined;
  return s.slice(0, maxLen);
}

export function normalizeEmail(input: unknown): string | undefined {
  const s = String(input ?? "").trim().toLowerCase();
  if (!s) return undefined;
  // Basic validation; adapters/regex do the heavy lifting.
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
  return ok ? s : undefined;
}

export function normalizeUrl(input: unknown): string | undefined {
  const s = String(input ?? "").trim();
  if (!s) return undefined;
  try {
    const url = new URL(s, window.location?.origin || undefined);
    // Drop hash to stabilize dedup keys.
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

