import { describe, expect, it } from 'vitest';
import { formatRepRange, parseRepRange } from './repRange';

describe('parseRepRange', () => {
  it('parses a single value and a range', () => {
    expect(parseRepRange('8')).toEqual({ min: 8, max: 8 });
    expect(parseRepRange(' 4 - 6 ')).toEqual({ min: 4, max: 6 });
    expect(parseRepRange('4–6')).toEqual({ min: 4, max: 6 });
  });

  it('rejects invalid input', () => {
    for (const input of ['', 'abc', '0', '6-4', '4-', '-4', '4-6-8', '101', '4.5']) {
      expect(parseRepRange(input), input).toBeNull();
    }
  });
});

describe('formatRepRange', () => {
  it('collapses equal bounds', () => {
    expect(formatRepRange({ min: 8, max: 8 })).toBe('8');
    expect(formatRepRange({ min: 4, max: 6 })).toBe('4-6');
  });

  it('round-trips with parseRepRange', () => {
    const range = parseRepRange('10-12');
    expect(range && formatRepRange(range)).toBe('10-12');
  });
});
