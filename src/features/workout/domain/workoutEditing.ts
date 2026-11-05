import type { Workout, WorkoutExercise } from './types';

export function replaceExercise(workout: Workout, updated: WorkoutExercise): Workout {
  return { ...workout, exercises: workout.exercises.map((exercise) => (exercise.id === updated.id ? updated : exercise)) };
}

export function setSkipped(exercise: WorkoutExercise, skipped: boolean): WorkoutExercise {
  return { ...exercise, skipped };
}

export function setExerciseNote(exercise: WorkoutExercise, note: string): WorkoutExercise {
  return { ...exercise, note };
}
