import { toParisDate } from '../../../shared/domain/parisDate';
import type { PlannedExercise, Program, SessionTemplate } from '../../program/domain/types';
import { findLastWorkingSets } from './lastPerformance';
import { suggestSegments } from './prefill';
import type { PlannedSnapshot, Workout, WorkoutExercise } from './types';

export type CreateWorkoutInput = {
  program: Program;
  session: SessionTemplate;
  history: readonly Workout[];
  now: Date;
  createId: () => string;
};

function snapshot(planned: PlannedExercise): PlannedSnapshot {
  const { sets, repRange, supersetWithNext, description } = planned;
  return { sets, repRange: { ...repRange }, supersetWithNext, ...(description ? { description } : {}) };
}

function createExercise(planned: PlannedExercise, input: CreateWorkoutInput): WorkoutExercise {
  const lastSets = findLastWorkingSets(planned.exerciseId, input.history);
  return {
    id: input.createId(),
    exerciseId: planned.exerciseId,
    note: '',
    skipped: false,
    planned: snapshot(planned),
    previousSetCount: lastSets.length,
    sets: Array.from({ length: planned.sets }, (_, index) => ({
      id: input.createId(),
      isWarmup: false,
      isValidated: false,
      segments: suggestSegments(index, lastSets),
    })),
  };
}

/** Copies the session plan and prefills every working set from history. Dated by its Paris start day. */
export function createWorkout(input: CreateWorkoutInput): Workout {
  const exercises = input.session.exercises.map((planned) => createExercise(planned, input));
  return {
    id: input.createId(),
    date: toParisDate(input.now),
    startedAt: input.now.toISOString(),
    note: '',
    programId: input.program.id,
    sessionTemplateId: input.session.id,
    sessionName: input.session.name,
    exerciseIds: [...new Set(exercises.map((exercise) => exercise.exerciseId))],
    exercises,
  };
}
