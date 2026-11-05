import { completedWorkingSets, type CompletedSet } from './setValidation';
import type { Workout } from './types';

const mostRecentFirst = (a: Workout, b: Workout) =>
  b.date.localeCompare(a.date) || b.startedAt.localeCompare(a.startedAt);

/**
 * Working sets of the last workout where the exercise was really done:
 * warmups, drafts and skipped occurrences are ignored, whatever the session.
 */
export function findLastWorkingSets(
  exerciseId: string,
  workouts: readonly Workout[],
  excludeWorkoutId?: string,
): CompletedSet[] {
  const candidates = workouts
    .filter((workout) => workout.id !== excludeWorkoutId && workout.exerciseIds.includes(exerciseId))
    .sort(mostRecentFirst);

  for (const workout of candidates) {
    for (const exercise of workout.exercises) {
      if (exercise.exerciseId !== exerciseId || exercise.skipped) continue;
      const sets = completedWorkingSets(exercise);
      if (sets.length > 0) return sets;
    }
  }
  return [];
}
