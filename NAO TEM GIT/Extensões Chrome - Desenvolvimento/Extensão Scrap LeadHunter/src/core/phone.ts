const NON_DIGITS = /\D+/g;

export function normalizePhoneBR(input: string): string | null {
  const digits = (input || "").replace(NON_DIGITS, "");
  if (!digits) return null;

  // Accept: 10 or 11 digits (DD + number) or with 55 prefix.
  let national = digits;
  if (national.startsWith("55") && national.length >= 12 && national.length <= 13) {
    national = national.slice(2);
  }

  if (national.length !== 10 && national.length !== 11) return null;

  const ddd = national.slice(0, 2);
  const rest = national.slice(2);
  if (ddd < "11" || ddd > "99") return null;

  // Mobile numbers are 9 digits in most regions; we accept both 8 and 9 digits.
  if (rest.length !== 8 && rest.length !== 9) return null;

  return `+55${national}`;
}

export function waMeUrlFromE164(e164: string): string {
  const digits = e164.replace(NON_DIGITS, "");
  return `https://wa.me/${digits}`;
}

