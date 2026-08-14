import { describe, expect, it } from 'vitest';
import { parseCount } from './parseCount';

describe('parseCount', () => {
  it('parses plain integers', () => {
    expect(parseCount('123')).toBe(123);
    expect(parseCount('  1,234 ')).toBe(1234);
  });

  it('parses k/m suffixes (en)', () => {
    expect(parseCount('3.4K')).toBe(3400);
    expect(parseCount('1.2M')).toBe(1_200_000);
  });

  it('parses pt-BR "mil" and comma decimals', () => {
    expect(parseCount('1,2 mil')).toBe(1200);
    expect(parseCount('10,5 mil curtidas')).toBe(10500);
  });

  it('handles mixed separators', () => {
    expect(parseCount('1.234,5 mil')).toBe(1_234_500);
  });

  it('returns null for empty', () => {
    expect(parseCount('')).toBeNull();
    expect(parseCount(null)).toBeNull();
  });
});

