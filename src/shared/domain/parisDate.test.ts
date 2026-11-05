import { describe, expect, it } from 'vitest';
import { addDays, isoDayOfWeek, mondayOfWeek, sundayOfWeek, toParisDate } from './parisDate';

describe('toParisDate', () => {
  it('uses Paris time, not UTC, near midnight (winter, UTC+1)', () => {
    expect(toParisDate(new Date('2026-11-01T23:30:00Z'))).toBe('2026-11-02');
  });

  it('uses Paris time near midnight (summer, UTC+2)', () => {
    expect(toParisDate(new Date('2026-07-05T22:30:00Z'))).toBe('2026-07-06');
    expect(toParisDate(new Date('2026-07-05T21:30:00Z'))).toBe('2026-07-05');
  });
});

describe('isoDayOfWeek', () => {
  it('returns 1 for Monday and 7 for Sunday', () => {
    expect(isoDayOfWeek('2026-11-02')).toBe(1);
    expect(isoDayOfWeek('2026-11-07')).toBe(6);
    expect(isoDayOfWeek('2026-11-08')).toBe(7);
  });
});

describe('week bounds', () => {
  it('finds Monday and Sunday of the week', () => {
    expect(mondayOfWeek('2026-11-05')).toBe('2026-11-02');
    expect(sundayOfWeek('2026-11-05')).toBe('2026-11-08');
  });

  it('treats Sunday as the end of the week, not the start', () => {
    expect(mondayOfWeek('2026-11-08')).toBe('2026-11-02');
  });

  it('crosses month and DST boundaries', () => {
    expect(mondayOfWeek('2026-03-29')).toBe('2026-03-23');
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
  });
});
