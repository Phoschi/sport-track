import type { DraftSegment, SetSegment, WorkoutExercise, WorkoutSet } from './types';

export type CompletedSet = { id: string; segments: SetSegment[] };

export function isSegmentComplete(segment: DraftSegment): segment is SetSegment {
  const { weightKg, reps } = segment;
  return weightKg !== null && weightKg >= 0 && reps !== null && Number.isInteger(reps) && reps >= 1;
}

export function isSetComplete(set: WorkoutSet): boolean {
  return set.segments.length > 0 && set.segments.every(isSegmentComplete);
}

function completedSets(exercise: WorkoutExercise, warmup: boolean): CompletedSet[] {
  return exercise.sets
    .filter((set) => set.isWarmup === warmup && set.isValidated && isSetComplete(set))
    .map((set) => ({ id: set.id, segments: set.segments.filter(isSegmentComplete) }));
}

/** The only sets that count for prefill, deltas and PRs. */
export function completedWorkingSets(exercise: WorkoutExercise): CompletedSet[] {
  return completedSets(exercise, false);
}

export function completedWarmupSets(exercise: WorkoutExercise): CompletedSet[] {
  return completedSets(exercise, true);
}
