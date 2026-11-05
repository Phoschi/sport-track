import { describe, expect, it } from 'vitest';
import { planned, program, session } from '../../program/domain/testFixtures';
import { createWorkout } from './createWorkout';
import { seg, workout, workoutExercise, workSet } from './testFixtures';

let counter = 0;
const createId = () => `id-${++counter}`;

const template = session('A', [
  { ...planned('1', true, 'squat'), sets: 3, description: 'Pieds serrés' },
  { ...planned('2', false, 'curl'), sets: 2 },
]);
const history = [
  workout('w1', '2026-11-02', [
    workoutExercise('x', [workSet('a', [seg(60, 8)]), workSet('b', [seg(62.5, 6)])], { exerciseId: 'squat' }),
  ]),
];

describe('createWorkout', () => {
  const created = createWorkout({ program: program('p', [template]), session: template, history, now: new Date('2026-11-05T22:50:00Z'), createId });

  it('links to the program session and is dated by the Paris start day', () => {
    expect(created).toMatchObject({ programId: 'p', sessionTemplateId: 'A', sessionName: 'A', date: '2026-11-05', note: '' });
    expect(created.finishedAt).toBeUndefined();
    expect(created.exerciseIds).toEqual(['squat', 'curl']);
  });

  it('snapshots the plan', () => {
    expect(created.exercises[0]?.planned).toEqual({ sets: 3, repRange: { min: 8, max: 12 }, supersetWithNext: true, description: 'Pieds serrés' });
    expect(created.exercises[1]?.planned).not.toHaveProperty('description');
  });

  it('prefills planned sets as unvalidated drafts from history', () => {
    const squat = created.exercises[0];
    expect(squat?.previousSetCount).toBe(2);
    expect(squat?.sets.map((set) => set.segments)).toEqual([[seg(60, 8)], [seg(62.5, 6)], [seg(62.5, 6)]]);
    expect(squat?.sets.every((set) => !set.isValidated && !set.isWarmup)).toBe(true);
  });

  it('leaves fields empty without history', () => {
    expect(created.exercises[1]?.sets.map((set) => set.segments)).toEqual([[seg(null, null)], [seg(null, null)]]);
    expect(created.exercises[1]?.previousSetCount).toBe(0);
  });

  it('dates a late-night start on the start day', () => {
    const lateNight = createWorkout({ program: program('p'), session: template, history: [], now: new Date('2026-11-05T22:59:00Z'), createId });
    expect(lateNight.date).toBe('2026-11-05');
  });
});
