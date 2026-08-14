export type Platform =
  | "generic"
  | "google_search"
  | "google_maps"
  | "linkedin"
  | "olx"
  | "directory"
  | "institutional";

export function detectPlatform(loc: Location): Platform {
  return detectPlatformParts(loc.hostname, loc.pathname || "/");
}

export function detectPlatformFromUrl(url: string): Platform {
  try {
    const parsed = new URL(url);
    return detectPlatformParts(parsed.hostname, parsed.pathname || "/");
  } catch {
    return "generic";
  }
}

function detectPlatformParts(hostname: string, path: string): Platform {
  const host = hostname.replace(/^www\./, "");

  if (host === "google.com" || host.endsWith(".google.com")) {
    if (path.startsWith("/search")) return "google_search";
    if (path.startsWith("/maps")) return "google_maps";
  }
  if (host === "linkedin.com") return "linkedin";
  if (host === "olx.com.br") return "olx";

  // Simple heuristic
  if (/(contato|contact|sobre|about|empresa|company)/i.test(path)) return "institutional";
  if (/(diretorio|directory|lista|listagem)/i.test(path)) return "directory";
  return "generic";
}
