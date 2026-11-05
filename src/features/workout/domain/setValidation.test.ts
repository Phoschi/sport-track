import { describe, expect, it } from 'vitest';
import { completedWarmupSets, completedWorkingSets, isSetComplete } from './setValidation';
import { seg, warmupSet, workoutExercise, workSet } from './testFixtures';

describe('isSetComplete', () => {
  it('accepts zero weight and multiple segments', () => {
    expect(isSetComplete(workSet('1', [seg(0, 12)]))).toBe(true);
    expect(isSetComplete(workSet('1', [seg(50, 3), seg(45, 3)]))).toBe(true);
  });

  it('rejects empty, zero or fractional reps and negative weight', () => {
    for (const segment of [seg(null, 8), seg(50, null), seg(50, 0), seg(50, 2.5), seg(-5, 8)]) {
      expect(isSetComplete(workSet('1', [segment])), JSON.stringify(segment)).toBe(false);
    }
    expect(isSetComplete(workSet('1', []))).toBe(false);
    expect(isSetComplete(workSet('1', [seg(50, 3), seg(45, null)]))).toBe(false);
  });
});

describe('completed sets', () => {
  const exercise = workoutExercise('e', [
    warmupSet('w1', [seg(20, 10)]),
    workSet('s1', [seg(60, 8)]),
    workSet('s2', [seg(60, 7)], false),
    workSet('s3', [seg(60, null)]),
  ]);

  it('keeps only validated and complete working sets', () => {
    expect(completedWorkingSets(exercise).map((set) => set.id)).toEqual(['s1']);
  });

  it('separates warmups', () => {
    expect(completedWarmupSets(exercise)).toEqual([{ id: 'w1', segments: [{ weightKg: 20, reps: 10 }] }]);
  });
});
