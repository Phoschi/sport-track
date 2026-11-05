import type { DraftSegment, Workout, WorkoutExercise, WorkoutSet } from './types';

export function workSet(id: string, segments: DraftSegment[], isValidated = true): WorkoutSet {
  return { id, isWarmup: false, isValidated, segments };
}

export function warmupSet(id: string, segments: DraftSegment[], isValidated = true): WorkoutSet {
  return { id, isWarmup: true, isValidated, segments };
}

export function seg(weightKg: number | null, reps: number | null): DraftSegment {
  return { weightKg, reps };
}

export function workoutExercise(
  id: string,
  sets: WorkoutSet[],
  overrides: Partial<WorkoutExercise> = {},
): WorkoutExercise {
  return {
    id,
    exerciseId: `exercise-${id}`,
    note: '',
    skipped: false,
    planned: { sets: 3, repRange: { min: 8, max: 12 }, supersetWithNext: false },
    previousSetCount: 0,
    sets,
    ...overrides,
  };
}

export function workout(id: string, date: string, exercises: WorkoutExercise[], overrides: Partial<Workout> = {}): Workout {
  return {
    id,
    date,
    startedAt: `${date}T10:00:00.000Z`,
    finishedAt: `${date}T11:00:00.000Z`,
    note: '',
    programId: 'p',
    sessionTemplateId: 's',
    sessionName: 'A',
    exerciseIds: exercises.map((exercise) => exercise.exerciseId),
    exercises,
    ...overrides,
  };
}
