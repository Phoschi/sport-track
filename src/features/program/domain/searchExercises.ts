import { normalizeExerciseName } from './exerciseName';
import type { Exercise } from './types';

const byName = (a: Exercise, b: Exercise) => a.name.localeCompare(b.name, 'fr');

/** Name prefix first, then word prefix, then substring; alphabetical within each group. */
export function searchExercises(exercises: readonly Exercise[], query: string): Exercise[] {
  const wanted = normalizeExerciseName(query);
  if (wanted === '') return [...exercises].sort(byName);

  const rank = (exercise: Exercise): number => {
    const name = normalizeExerciseName(exercise.name);
    if (name.startsWith(wanted)) return 0;
    if (name.includes(` ${wanted}`)) return 1;
    if (name.includes(wanted)) return 2;
    return -1;
  };

  return exercises
    .map((exercise) => ({ exercise, rank: rank(exercise) }))
    .filter((entry) => entry.rank >= 0)
    .sort((a, b) => a.rank - b.rank || byName(a.exercise, b.exercise))
    .map((entry) => entry.exercise);
}
