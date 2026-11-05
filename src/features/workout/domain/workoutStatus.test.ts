import { describe, expect, it } from 'vitest';
import { countSkippedOnFinish, isExerciseSkipped, isFullyLogged, shouldOfferFinish } from './workoutStatus';
import { seg, warmupSet, workout, workoutExercise, workSet } from './testFixtures';

const plan = { sets: 2, repRange: { min: 8, max: 8 }, supersetWithNext: false };
const full = workoutExercise('full', [workSet('1', [seg(60, 8)]), workSet('2', [seg(60, 8)])], { planned: plan });
const partial = workoutExercise('partial', [workSet('1', [seg(60, 8)]), workSet('2', [seg(60, 8)], false)], { planned: plan });
const warmupOnly = workoutExercise('warmup', [warmupSet('w', [seg(20, 10)])], { planned: plan });
const skipped = workoutExercise('skipped', [], { planned: plan, skipped: true });

describe('isExerciseSkipped', () => {
  it('is true when skipped on purpose or without validated working sets', () => {
    expect(isExerciseSkipped(skipped)).toBe(true);
    expect(isExerciseSkipped(warmupOnly)).toBe(true);
    expect(isExerciseSkipped(partial)).toBe(false);
  });
});

describe('isFullyLogged', () => {
  it('requires every planned set validated, a skip counting as filled', () => {
    expect(isFullyLogged(workout('w', '2026-11-04', [full, skipped]))).toBe(true);
    expect(isFullyLogged(workout('w', '2026-11-04', [full, partial]))).toBe(false);
  });
});

describe('shouldOfferFinish', () => {
  it('offers only for a fully logged unfinished workout from a previous day', () => {
    const { finishedAt: _finishedAt, ...unfinished } = workout('w', '2026-11-04', [full, skipped]);
    expect(shouldOfferFinish(unfinished, '2026-11-05')).toBe(true);
    expect(shouldOfferFinish(unfinished, '2026-11-04')).toBe(false);
    expect(shouldOfferFinish(workout('w', '2026-11-04', [full]), '2026-11-05')).toBe(false);
    expect(shouldOfferFinish({ ...unfinished, exercises: [partial] }, '2026-11-05')).toBe(false);
  });
});

describe('countSkippedOnFinish', () => {
  it('counts exercises that will show as skip', () => {
    expect(countSkippedOnFinish(workout('w', '2026-11-04', [full, partial, warmupOnly, skipped]))).toBe(2);
  });
});
