import { swapAdjacent, type Direction } from '../../../shared/domain/swapAdjacent';
import type { PlannedExercise, SessionTemplate } from './types';

// A superset flag lives on the upper exercise of a pair. Any pair whose members change
// is unlinked rather than silently re-paired with another exercise.

function withoutSupersetAt(exercises: PlannedExercise[], indexes: number[]): PlannedExercise[] {
  return exercises.map((exercise, index) =>
    indexes.includes(index) ? { ...exercise, supersetWithNext: false } : exercise,
  );
}

function withLastUnlinked(exercises: PlannedExercise[]): PlannedExercise[] {
  return withoutSupersetAt(exercises, [exercises.length - 1]);
}

function withExercises(session: SessionTemplate, exercises: PlannedExercise[]): SessionTemplate {
  return { ...session, exercises: withLastUnlinked(exercises) };
}

export function addPlannedExercise(session: SessionTemplate, exercise: PlannedExercise): SessionTemplate {
  return withExercises(session, [...session.exercises, exercise]);
}

export function updatePlannedExercise(
  session: SessionTemplate,
  updated: PlannedExercise,
): SessionTemplate {
  return withExercises(
    session,
    session.exercises.map((exercise) => (exercise.id === updated.id ? updated : exercise)),
  );
}

export function removePlannedExercise(session: SessionTemplate, plannedId: string): SessionTemplate {
  const index = session.exercises.findIndex((exercise) => exercise.id === plannedId);
  if (index < 0) return session;
  const unlinked = withoutSupersetAt(session.exercises, [index - 1]);
  return withExercises(session, unlinked.filter((exercise) => exercise.id !== plannedId));
}

export function movePlannedExercise(
  session: SessionTemplate,
  plannedId: string,
  direction: Direction,
): SessionTemplate {
  const index = session.exercises.findIndex((exercise) => exercise.id === plannedId);
  const upper = direction === 1 ? index : index - 1;
  // The swapped pair and the exercise above it all get a new "next" exercise.
  const unlinked = withoutSupersetAt(session.exercises, [upper - 1, upper, upper + 1]);
  const swapped = swapAdjacent(unlinked, index, direction);
  return swapped ? withExercises(session, swapped) : session;
}

export function toggleSuperset(session: SessionTemplate, plannedId: string): SessionTemplate {
  return withExercises(
    session,
    session.exercises.map((exercise) =>
      exercise.id === plannedId ? { ...exercise, supersetWithNext: !exercise.supersetWithNext } : exercise,
    ),
  );
}
