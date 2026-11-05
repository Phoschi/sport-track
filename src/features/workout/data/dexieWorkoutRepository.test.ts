import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GymDatabase } from '../../../db/database';
import { planned, program, session } from '../../program/domain/testFixtures';
import { SessionNotFoundError, WorkoutInProgressError } from '../domain/errors';
import { seg, workout, workoutExercise, workSet } from '../domain/testFixtures';
import { createDexieWorkoutRepository } from './dexieWorkoutRepository';

const firstValue = <T>(observable: { subscribe(next: (value: T) => void): { unsubscribe(): void } }) =>
  new Promise<T>((resolve) => {
    const subscription = observable.subscribe((value) => {
      resolve(value);
      queueMicrotask(() => subscription.unsubscribe());
    });
  });

describe('dexieWorkoutRepository', () => {
  let database: GymDatabase;
  let repository: ReturnType<typeof createDexieWorkoutRepository>;
  const squat = (id: string, weightKg: number, skipped = false) =>
    workoutExercise(id, [workSet(id, [seg(weightKg, 8)])], { exerciseId: 'squat', skipped });

  beforeEach(async () => {
    database = new GymDatabase(`test-workouts-${crypto.randomUUID()}`);
    repository = createDexieWorkoutRepository(database, () => new Date('2026-11-05T09:00:00Z'));
    await database.programs.add(program('p', [session('A', [planned('1', false, 'squat')])]));
  });
  afterEach(() => database.delete());

  it('starts from the last workout where the exercise was really done', async () => {
    await database.workouts.bulkAdd([
      workout('done', '2026-11-02', [squat('a', 60)]),
      workout('skipped', '2026-11-04', [squat('b', 99, true)]),
    ]);
    const started = await repository.start('p', 'A');
    expect(started.date).toBe('2026-11-05');
    expect(started.exercises[0]?.sets[0]?.segments).toEqual([seg(60, 8)]);
    expect(await firstValue(repository.watchCurrent())).toMatchObject({ id: started.id });
  });

  it('refuses a second workout while one is in progress', async () => {
    const started = await repository.start('p', 'A');
    const error = await repository.start('p', 'A').catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(WorkoutInProgressError);
    expect((error as WorkoutInProgressError).workoutId).toBe(started.id);
  });

  it('refuses an unknown session', async () => {
    await expect(repository.start('p', 'Z')).rejects.toBeInstanceOf(SessionNotFoundError);
  });

  it('finishes, then allows a new start', async () => {
    const started = await repository.start('p', 'A');
    await repository.finish(started.id);
    expect((await repository.getById(started.id))?.finishedAt).toBe('2026-11-05T09:00:00.000Z');
    expect(await firstValue(repository.watchCurrent())).toBeNull();
    await expect(repository.start('p', 'A')).resolves.toBeDefined();
  });

  it('cancels only an unfinished workout', async () => {
    const started = await repository.start('p', 'A');
    await repository.cancel(started.id);
    expect(await repository.getById(started.id)).toBeNull();
    await database.workouts.add(workout('old', '2026-11-01', []));
    await repository.cancel('old');
    expect(await repository.getById('old')).not.toBeNull();
  });

  it('exposes current exercise names', async () => {
    await database.exercises.add({ id: 'squat', name: 'Squat barre', createdAt: '' });
    expect((await firstValue(repository.watchExerciseNames())).get('squat')).toBe('Squat barre');
  });
});
