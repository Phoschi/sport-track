import { describe, expect, it } from 'vitest';
import { findLastWorkingSets } from './lastPerformance';
import { seg, warmupSet, workout, workoutExercise, workSet } from './testFixtures';

const squat = (id: string, sets: Parameters<typeof workoutExercise>[1], skipped = false) =>
  workoutExercise(id, sets, { exerciseId: 'squat', skipped });

describe('findLastWorkingSets', () => {
  it('returns the most recent workout across sessions', () => {
    const workouts = [
      workout('old', '2026-11-02', [squat('a', [workSet('1', [seg(60, 8)])])], { sessionName: 'A' }),
      workout('new', '2026-11-04', [squat('b', [workSet('2', [seg(65, 8)])])], { sessionName: 'B' }),
    ];
    expect(findLastWorkingSets('squat', workouts)[0]?.segments).toEqual([{ weightKg: 65, reps: 8 }]);
  });

  it('breaks same-day ties with the start time', () => {
    const workouts = [
      workout('late', '2026-11-04', [squat('a', [workSet('1', [seg(70, 5)])])], { startedAt: '2026-11-04T18:00:00Z' }),
      workout('early', '2026-11-04', [squat('b', [workSet('2', [seg(60, 5)])])], { startedAt: '2026-11-04T08:00:00Z' }),
    ];
    expect(findLastWorkingSets('squat', workouts)[0]?.id).toBe('1');
  });

  it('skips workouts where the exercise was skipped, empty, drafts or warmup only', () => {
    const workouts = [
      workout('done', '2026-11-01', [squat('a', [workSet('real', [seg(60, 8)])])]),
      workout('skipped', '2026-11-02', [squat('b', [workSet('x', [seg(99, 1)])], true)]),
      workout('drafts', '2026-11-03', [squat('c', [workSet('y', [seg(99, 1)], false)])]),
      workout('warmup', '2026-11-04', [squat('d', [warmupSet('z', [seg(20, 10)])])]),
    ];
    expect(findLastWorkingSets('squat', workouts).map((set) => set.id)).toEqual(['real']);
  });

  it('excludes the current workout and returns [] without history', () => {
    const current = workout('current', '2026-11-05', [squat('a', [workSet('1', [seg(60, 8)])])]);
    expect(findLastWorkingSets('squat', [current], 'current')).toEqual([]);
    expect(findLastWorkingSets('bench', [current])).toEqual([]);
  });
});
