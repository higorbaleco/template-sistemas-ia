export const PHONE_REGEX =
  /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?(?:9?\d{4})[-\s]?\d{4}/g;

export const EMAIL_REGEX =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

