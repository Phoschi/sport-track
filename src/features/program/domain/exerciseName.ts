import type { Exercise } from './types';

/** Case, accent and spacing-insensitive form used to detect duplicates and search. */
export function normalizeExerciseName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/** Clean display form: trimmed, single spaces. */
export function cleanExerciseName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function findExerciseByName(
  exercises: readonly Exercise[],
  name: string,
  exceptId?: string,
): Exercise | undefined {
  const wanted = normalizeExerciseName(name);
  return exercises.find(
    (exercise) => exercise.id !== exceptId && normalizeExerciseName(exercise.name) === wanted,
  );
}
