import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GymDatabase } from '../../../db/database';
import { DuplicateExerciseNameError, EmptyNameError, ExerciseInUseError } from '../domain/errors';
import { planned, program, session } from '../domain/testFixtures';
import { createDexieExerciseRepository } from './dexieExerciseRepository';

describe('dexieExerciseRepository', () => {
  let database: GymDatabase;
  let repository: ReturnType<typeof createDexieExerciseRepository>;

  beforeEach(() => {
    database = new GymDatabase(`test-exercises-${crypto.randomUUID()}`);
    repository = createDexieExerciseRepository(database);
  });
  afterEach(() => database.delete());

  it('creates with a cleaned name and rejects empty names', async () => {
    const created = await repository.create('  Curl   marteau ');
    expect(created.name).toBe('Curl marteau');
    await expect(repository.create('   ')).rejects.toBeInstanceOf(EmptyNameError);
  });

  it('rejects duplicates on create and rename, exposing the existing exercise', async () => {
    const curl = await repository.create('Curl marteau');
    const squat = await repository.create('Squat');
    const error = await repository.create('curl MARTEAU').catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(DuplicateExerciseNameError);
    expect((error as DuplicateExerciseNameError).existing.id).toBe(curl.id);
    await expect(repository.rename(squat.id, 'Curl marteau')).rejects.toBeInstanceOf(DuplicateExerciseNameError);
  });

  it('renames in place, keeping the id', async () => {
    const curl = await repository.create('Curl');
    await repository.rename(curl.id, 'Curl marteau haltère');
    await repository.rename(curl.id, 'curl marteau haltère');
    expect(await database.exercises.get(curl.id)).toMatchObject({ id: curl.id, name: 'curl marteau haltère' });
  });

  it('deletes an unused exercise', async () => {
    const curl = await repository.create('Curl');
    await repository.delete(curl.id);
    expect(await database.exercises.count()).toBe(0);
  });

  it('refuses to delete an exercise used in a program or a workout', async () => {
    const inProgram = await repository.create('Squat');
    const inWorkout = await repository.create('Row');
    await database.programs.add(program('p', [session('A', [planned('1', false, inProgram.id)])]));
    await database.workouts.add({
      id: 'w', date: '2026-11-02', startedAt: '', note: '', programId: 'p', sessionTemplateId: 'A', sessionName: 'A', exerciseIds: [inWorkout.id], exercises: [],
    });

    expect(await repository.getUsage(inProgram.id)).toEqual({ programCount: 1, workoutCount: 0 });
    expect(await repository.getUsage(inWorkout.id)).toEqual({ programCount: 0, workoutCount: 1 });
    await expect(repository.delete(inProgram.id)).rejects.toBeInstanceOf(ExerciseInUseError);
    await expect(repository.delete(inWorkout.id)).rejects.toBeInstanceOf(ExerciseInUseError);
    expect(await database.exercises.count()).toBe(2);
  });
});
