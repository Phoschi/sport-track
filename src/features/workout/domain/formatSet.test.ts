import { describe, expect, it } from 'vitest';
import { formatSet } from './formatSet';

describe('formatSet', () => {
  it('formats a simple set with a French decimal comma', () => {
    expect(formatSet([{ weightKg: 17.5, reps: 8 }])).toBe('17,5kg × 8');
  });

  it('formats load changes inside one set', () => {
    expect(formatSet([{ weightKg: 50, reps: 3 }, { weightKg: 45, reps: 3 }])).toBe('50/45kg × 3+3');
  });
});
