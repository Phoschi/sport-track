import type { Program } from './types';

export function collectProgrammedExerciseIds(programs: readonly Program[]): Set<string> {
  const ids = new Set<string>();
  for (const program of programs) {
    for (const session of program.sessions) {
      for (const planned of session.exercises) ids.add(planned.exerciseId);
    }
  }
  return ids;
}

/** Computed, never stored: true when no session of any program contains the exercise. */
export function isNotTrainedAnymore(exerciseId: string, programs: readonly Program[]): boolean {
  return !collectProgrammedExerciseIds(programs).has(exerciseId);
}
