export function nowIso(): string {
  return new Date().toISOString();
}

export function isoDateOnly(iso: string): string {
  // Returns YYYY-MM-DD
  return iso.slice(0, 10);
}

