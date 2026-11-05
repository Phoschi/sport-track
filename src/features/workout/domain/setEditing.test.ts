import { describe, expect, it } from 'vitest';
import {
  addExtraSet,
  addSegment,
  addWarmupSet,
  isExtraSet,
  removeSegment,
  removeSet,
  toggleValidated,
  updateSegment,
} from './setEditing';
import { seg, warmupSet, workoutExercise, workSet } from './testFixtures';

const base = workoutExercise('e', [workSet('s1', [seg(60, 8)], false), workSet('s2', [seg(null, null)], false)], {
  planned: { sets: 2, repRange: { min: 6, max: 8 }, supersetWithNext: false },
});
const set = (exercise: typeof base, id: string) => exercise.sets.find((item) => item.id === id);

describe('toggleValidated', () => {
  it('validates a complete set and un-validates on second tap', () => {
    const validated = toggleValidated(base, 's1');
    expect(set(validated, 's1')?.isValidated).toBe(true);
    expect(set(toggleValidated(validated, 's1'), 's1')?.isValidated).toBe(false);
  });

  it('refuses an incomplete set', () => {
    expect(toggleValidated(base, 's2')).toEqual(base);
  });
});

describe('updateSegment', () => {
  it('edits one field', () => {
    expect(set(updateSegment(base, 's2', 0, { weightKg: 17.5 }), 's2')?.segments).toEqual([seg(17.5, null)]);
  });

  it('un-validates a validated set that becomes incomplete, keeps it when still complete', () => {
    const validated = toggleValidated(base, 's1');
    expect(set(updateSegment(validated, 's1', 0, { reps: 7 }), 's1')?.isValidated).toBe(true);
    expect(set(updateSegment(validated, 's1', 0, { reps: null }), 's1')?.isValidated).toBe(false);
  });
});

describe('segments', () => {
  it('adds a segment starting from the previous weight, empty reps, and un-validates', () => {
    const added = addSegment(toggleValidated(base, 's1'), 's1');
    expect(set(added, 's1')).toMatchObject({ isValidated: false, segments: [seg(60, 8), seg(60, null)] });
  });

  it('removes a segment but never the last one', () => {
    const twoSegments = addSegment(base, 's1');
    expect(set(removeSegment(twoSegments, 's1', 1), 's1')?.segments).toEqual([seg(60, 8)]);
    expect(removeSegment(base, 's1', 0)).toEqual(base);
  });
});

describe('extra and warmup sets', () => {
  it('extra set repeats the last working set of today', () => {
    const withExtra = addExtraSet(updateSegment(base, 's2', 0, { weightKg: 55, reps: 6 }), 'x');
    expect(set(withExtra, 'x')).toEqual(workSet('x', [seg(55, 6)], false));
    expect(isExtraSet(withExtra, 'x')).toBe(true);
    expect(isExtraSet(withExtra, 's2')).toBe(false);
  });

  it('warmups are inserted before working sets, in order, and never count as extra', () => {
    const withWarmups = addWarmupSet(addWarmupSet(base, 'w1'), 'w2');
    expect(withWarmups.sets.map((item) => item.id)).toEqual(['w1', 'w2', 's1', 's2']);
    expect(set(withWarmups, 'w1')).toEqual(warmupSet('w1', [seg(null, null)], false));
    expect(isExtraSet(withWarmups, 's2')).toBe(false);
  });

  it('removes a set', () => {
    expect(removeSet(base, 's1').sets.map((item) => item.id)).toEqual(['s2']);
  });
});
