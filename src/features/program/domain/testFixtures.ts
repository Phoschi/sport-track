import type { PlannedExercise, Program, SessionTemplate } from './types';

export function planned(id: string, supersetWithNext = false, exerciseId = `exercise-${id}`): PlannedExercise {
  return { id, exerciseId, sets: 3, repRange: { min: 8, max: 12 }, supersetWithNext };
}

export function session(id: string, exercises: PlannedExercise[] = [], name = id): SessionTemplate {
  return { id, name, dayOfWeek: 1, exercises };
}

export function program(id: string, sessions: SessionTemplate[] = []): Program {
  return { id, name: id, createdAt: '', sessions };
}
