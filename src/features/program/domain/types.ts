import type { IsoDayOfWeek } from '../../../shared/domain/parisDate';

export type Exercise = {
  id: string;
  name: string;
  createdAt: string;
};

/** `8` is stored as { min: 8, max: 8 }. */
export type RepRange = { min: number; max: number };

export type PlannedExercise = {
  id: string;
  exerciseId: string;
  description?: string;
  sets: number;
  repRange: RepRange;
  supersetWithNext: boolean;
};

export type SessionTemplate = {
  id: string;
  name: string;
  dayOfWeek: IsoDayOfWeek;
  exercises: PlannedExercise[];
};

export type Program = {
  id: string;
  name: string;
  createdAt: string;
  sessions: SessionTemplate[];
};
