import { describe, expect, it } from 'vitest';
import { suggestSegments } from './prefill';

const lastSets = [
  { id: '1', segments: [{ weightKg: 60, reps: 8 }] },
  { id: '2', segments: [{ weightKg: 50, reps: 3 }, { weightKg: 45, reps: 3 }] },
];

describe('suggestSegments', () => {
  it('copies the same set from last time, segments included', () => {
    expect(suggestSegments(0, lastSets)).toEqual([{ weightKg: 60, reps: 8 }]);
    expect(suggestSegments(1, lastSets)).toEqual([{ weightKg: 50, reps: 3 }, { weightKg: 45, reps: 3 }]);
  });

  it('repeats the last known set beyond history', () => {
    expect(suggestSegments(4, lastSets)).toEqual(lastSets[1]?.segments);
  });

  it('returns an empty segment without history', () => {
    expect(suggestSegments(0, [])).toEqual([{ weightKg: null, reps: null }]);
  });

  it('returns copies, not shared references', () => {
    const suggested = suggestSegments(0, lastSets);
    expect(suggested[0]).not.toBe(lastSets[0]?.segments[0]);
  });
});
