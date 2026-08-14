const MULTIPLIERS: Array<{ suffix: string; value: number }> = [
  { suffix: 'b', value: 1_000_000_000 },
  { suffix: 'bi', value: 1_000_000_000 },
  { suffix: 'bn', value: 1_000_000_000 },
  { suffix: 'm', value: 1_000_000 },
  { suffix: 'mi', value: 1_000_000 },
  { suffix: 'milhao', value: 1_000_000 },
  { suffix: 'milhões', value: 1_000_000 },
  { suffix: 'milhoes', value: 1_000_000 },
  { suffix: 'k', value: 1_000 },
  { suffix: 'mil', value: 1_000 },
];

export function parseCount(input: string | null | undefined): number | null {
  if (!input) return null;
  const raw = input
    .trim()
    .toLowerCase()
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ');

  // Drop common labels (best-effort)
  const cleaned = raw
    .replace(/curtidas?|likes?/g, '')
    .replace(/coment[aá]rios?|comments?/g, '')
    .replace(/visualiza[cç][oõ]es?|views?/g, '')
    .replace(/,?\s*(de)?\s*(conta|usu[aá]rios?).*$/g, '')
    .trim();

  if (!cleaned) return null;

  // Normalize decimal separators. If both '.' and ',' exist, assume '.' thousands and ',' decimal (pt-BR),
  // otherwise allow either as decimal.
  let numberPart = cleaned;
  let multiplier = 1;

  for (const { suffix, value } of MULTIPLIERS) {
    const re = new RegExp(`\\b${escapeRegExp(suffix)}\\b`, 'i');
    if (re.test(numberPart)) {
      multiplier = value;
      numberPart = numberPart.replace(re, '').trim();
      break;
    }
  }

  // Remove plus sign and surrounding text (e.g. "1.2K+")
  numberPart = numberPart.replace(/\+/g, '').trim();

  const hasDot = numberPart.includes('.');
  const hasComma = numberPart.includes(',');

  if (hasDot && hasComma) {
    // Assume dot thousands separators and comma decimal.
    numberPart = numberPart.replace(/\./g, '').replace(',', '.');
  } else if (hasComma && !hasDot) {
    // Comma as decimal.
    numberPart = numberPart.replace(',', '.');
  } else {
    // Dot as decimal; remove commas as thousands separators.
    numberPart = numberPart.replace(/,/g, '');
  }

  // Strip any remaining non-number chars
  numberPart = numberPart.replace(/[^0-9.]/g, '');
  if (!numberPart) return null;

  const value = Number(numberPart);
  if (!Number.isFinite(value)) return null;

  return Math.round(value * multiplier);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

