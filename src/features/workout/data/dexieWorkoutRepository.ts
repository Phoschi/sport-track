import { liveQuery } from 'dexie';
import type { GymDatabase } from '../../../db/database';
import { createId } from '../../../shared/domain/id';
import { createWorkout } from '../domain/createWorkout';
import { SessionNotFoundError, WorkoutInProgressError } from '../domain/errors';
import type { Workout } from '../domain/types';
import type { WorkoutRepository } from './WorkoutRepository';

export function createDexieWorkoutRepository(database: GymDatabase, now: () => Date = () => new Date()): WorkoutRepository {
  // Few hundred workouts a year: a scan is simpler than an extra index.
  async function findCurrent(): Promise<Workout | null> {
    return (await database.workouts.filter((workout) => workout.finishedAt === undefined).first()) ?? null;
  }

  async function getById(id: string): Promise<Workout | null> {
    return (await database.workouts.get(id)) ?? null;
  }

  return {
    watchCurrent: () => liveQuery(findCurrent),
    watchById: (id) => liveQuery(() => getById(id)),
    getById,

    start: (programId, sessionId) =>
      database.transaction('rw', database.workouts, database.programs, async () => {
        const current = await findCurrent();
        if (current) throw new WorkoutInProgressError(current.id);
        const program = await database.programs.get(programId);
        const session = program?.sessions.find((candidate) => candidate.id === sessionId);
        if (!program || !session) throw new SessionNotFoundError();
        const exerciseIds = session.exercises.map((planned) => planned.exerciseId);
        const history = await database.workouts.where('exerciseIds').anyOf(exerciseIds).toArray();
        const workout = createWorkout({ program, session, history, now: now(), createId });
        await database.workouts.add(workout);
        return workout;
      }),

    save: async (workout) => {
      await database.workouts.put(workout);
    },

    finish: async (id) => {
      await database.workouts.update(id, { finishedAt: now().toISOString() });
    },

    cancel: (id) =>
      database.transaction('rw', database.workouts, async () => {
        const workout = await database.workouts.get(id);
        if (workout && workout.finishedAt === undefined) await database.workouts.delete(id);
      }),

    watchExerciseNames: () =>
      liveQuery(async () => new Map((await database.exercises.toArray()).map((exercise) => [exercise.id, exercise.name]))),
  };
}
