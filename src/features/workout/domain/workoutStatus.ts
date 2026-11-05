import type { IsoDate } from '../../../shared/domain/parisDate';
import { completedWorkingSets } from './setValidation';
import type { Workout, WorkoutExercise } from './types';

/** Shown as "skip" in summaries: skipped on purpose, or left without any validated working set. */
export function isExerciseSkipped(exercise: WorkoutExercise): boolean {
  return exercise.skipped || completedWorkingSets(exercise).length === 0;
}

/** Every planned set validated, or skipped on purpose. */
export function isExerciseFilled(exercise: WorkoutExercise): boolean {
  return exercise.skipped || completedWorkingSets(exercise).length >= exercise.planned.sets;
}

export function isFullyLogged(workout: Workout): boolean {
  return workout.exercises.every(isExerciseFilled);
}

/** A forgotten "Terminer" from a previous day is offered only when nothing is left to fill. */
export function shouldOfferFinish(workout: Workout, today: IsoDate): boolean {
  return workout.finishedAt === undefined && workout.date < today && isFullyLogged(workout);
}

export function countSkippedOnFinish(workout: Workout): number {
  return workout.exercises.filter(isExerciseSkipped).length;
}
