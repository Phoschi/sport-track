import { liveQuery } from 'dexie';
import type { GymDatabase } from '../../../db/database';
import { createId } from '../../../shared/domain/id';
import { DuplicateExerciseNameError, EmptyNameError, ExerciseInUseError } from '../domain/errors';
import { cleanExerciseName, findExerciseByName } from '../domain/exerciseName';
import type { Exercise } from '../domain/types';
import type { ExerciseRepository, ExerciseUsage } from './ExerciseRepository';

export function createDexieExerciseRepository(database: GymDatabase): ExerciseRepository {
  async function validName(name: string, exceptId?: string): Promise<string> {
    const cleaned = cleanExerciseName(name);
    if (cleaned === '') throw new EmptyNameError();
    const duplicate = findExerciseByName(await database.exercises.toArray(), cleaned, exceptId);
    if (duplicate) throw new DuplicateExerciseNameError(duplicate);
    return cleaned;
  }

  async function getUsage(id: string): Promise<ExerciseUsage> {
    const programs = await database.programs.toArray();
    const programCount = programs.filter((program) =>
      program.sessions.some((session) => session.exercises.some((planned) => planned.exerciseId === id)),
    ).length;
    const workoutCount = await database.workouts.where('exerciseIds').equals(id).count();
    return { programCount, workoutCount };
  }

  return {
    watchAll: () => liveQuery(() => database.exercises.toArray()),

    create: (name) =>
      database.transaction('rw', database.exercises, async () => {
        const exercise: Exercise = { id: createId(), name: await validName(name), createdAt: new Date().toISOString() };
        await database.exercises.add(exercise);
        return exercise;
      }),

    rename: (id, name) =>
      database.transaction('rw', database.exercises, async () => {
        await database.exercises.update(id, { name: await validName(name, id) });
      }),

    delete: (id) =>
      database.transaction('rw', database.exercises, database.programs, database.workouts, async () => {
        const usage = await getUsage(id);
        if (usage.programCount > 0 || usage.workoutCount > 0) throw new ExerciseInUseError();
        await database.exercises.delete(id);
      }),

    getUsage,
  };
}
