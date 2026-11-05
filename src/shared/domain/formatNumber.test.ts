import { describe, expect, it } from 'vitest';
import { formatDecimal, parseDecimal } from './formatNumber';

describe('formatDecimal', () => {
  it('uses a comma and drops useless zeros', () => {
    expect(formatDecimal(17.5)).toBe('17,5');
    expect(formatDecimal(60)).toBe('60');
    expect(formatDecimal(0)).toBe('0');
  });

  it('hides floating point noise', () => {
    expect(formatDecimal(0.1 + 0.2)).toBe('0,3');
  });

  it('does not group thousands', () => {
    expect(formatDecimal(1200)).toBe('1200');
  });
});

describe('parseDecimal', () => {
  it('accepts comma and dot', () => {
    expect(parseDecimal('17,5')).toBe(17.5);
    expect(parseDecimal('17.5')).toBe(17.5);
    expect(parseDecimal(' 40 ')).toBe(40);
  });

  it('rejects garbage', () => {
    expect(parseDecimal('')).toBeNull();
    expect(parseDecimal('abc')).toBeNull();
    expect(parseDecimal('1,2,3')).toBeNull();
  });
});
