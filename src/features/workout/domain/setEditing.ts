import { emptySegment } from './prefill';
import { isSetComplete } from './setValidation';
import type { DraftSegment, WorkoutExercise, WorkoutSet } from './types';

function mapSet(exercise: WorkoutExercise, setId: string, change: (set: WorkoutSet) => WorkoutSet): WorkoutExercise {
  return { ...exercise, sets: exercise.sets.map((set) => (set.id === setId ? change(set) : set)) };
}

// A validated set that becomes incomplete must not keep counting.
function keepValidIfComplete(set: WorkoutSet): WorkoutSet {
  return set.isValidated && !isSetComplete(set) ? { ...set, isValidated: false } : set;
}

export function updateSegment(
  exercise: WorkoutExercise,
  setId: string,
  segmentIndex: number,
  patch: Partial<DraftSegment>,
): WorkoutExercise {
  return mapSet(exercise, setId, (set) =>
    keepValidIfComplete({
      ...set,
      segments: set.segments.map((segment, index) => (index === segmentIndex ? { ...segment, ...patch } : segment)),
    }),
  );
}

/** A load change inside the same set: starts from the previous weight. */
export function addSegment(exercise: WorkoutExercise, setId: string): WorkoutExercise {
  return mapSet(exercise, setId, (set) => ({
    ...set,
    isValidated: false,
    segments: [...set.segments, { weightKg: set.segments.at(-1)?.weightKg ?? null, reps: null }],
  }));
}

export function removeSegment(exercise: WorkoutExercise, setId: string, segmentIndex: number): WorkoutExercise {
  return mapSet(exercise, setId, (set) =>
    set.segments.length <= 1
      ? set
      : keepValidIfComplete({ ...set, segments: set.segments.filter((_, index) => index !== segmentIndex) }),
  );
}

/** Validating an incomplete set does nothing. */
export function toggleValidated(exercise: WorkoutExercise, setId: string): WorkoutExercise {
  return mapSet(exercise, setId, (set) =>
    set.isValidated || isSetComplete(set) ? { ...set, isValidated: !set.isValidated } : set,
  );
}

/** Extra working set: repeats the last working set of today. */
export function addExtraSet(exercise: WorkoutExercise, id: string): WorkoutExercise {
  const lastWorking = exercise.sets.filter((set) => !set.isWarmup).at(-1);
  const segments = lastWorking ? lastWorking.segments.map((segment) => ({ ...segment })) : [emptySegment()];
  return { ...exercise, sets: [...exercise.sets, { id, isWarmup: false, isValidated: false, segments }] };
}

/** Warmups go before working sets, in the order they are added. */
export function addWarmupSet(exercise: WorkoutExercise, id: string): WorkoutExercise {
  const position = exercise.sets.filter((set) => set.isWarmup).length;
  const warmup: WorkoutSet = { id, isWarmup: true, isValidated: false, segments: [emptySegment()] };
  return { ...exercise, sets: [...exercise.sets.slice(0, position), warmup, ...exercise.sets.slice(position)] };
}

export function removeSet(exercise: WorkoutExercise, setId: string): WorkoutExercise {
  return { ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) };
}

/** Working sets beyond the planned count were added during the workout. */
export function isExtraSet(exercise: WorkoutExercise, setId: string): boolean {
  const workingIndex = exercise.sets.filter((set) => !set.isWarmup).findIndex((set) => set.id === setId);
  return workingIndex >= exercise.planned.sets;
}
