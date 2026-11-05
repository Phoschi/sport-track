import { describe, expect, it } from 'vitest';
import { backupAge } from './backupReminder';

const now = new Date('2026-11-12T10:00:00Z');

describe('backupAge', () => {
  it('is overdue when never exported', () => {
    expect(backupAge(undefined, now)).toEqual({ daysSinceExport: null, isOverdue: true });
  });

  it('is not overdue up to 7 days, overdue after', () => {
    expect(backupAge('2026-11-05T08:00:00Z', now)).toEqual({ daysSinceExport: 7, isOverdue: false });
    expect(backupAge('2026-11-04T08:00:00Z', now)).toEqual({ daysSinceExport: 8, isOverdue: true });
  });

  it('counts Paris calendar days', () => {
    // 23:30 UTC on Nov 4 is Nov 5 in Paris.
    expect(backupAge('2026-11-04T23:30:00Z', now).daysSinceExport).toBe(7);
  });
});
