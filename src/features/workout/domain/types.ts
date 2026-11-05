import type { IsoDate } from '../../../shared/domain/parisDate';
import type { PlannedExercise } from '../../program/domain/types';

export type SetSegment = { weightKg: number; reps: number };

export type WorkoutSet = {
  id: string;
  isWarmup: boolean;
  segments: SetSegment[];
};

/** Copy of the plan at workout time, so later program edits don't rewrite history. */
export type PlannedSnapshot = Pick<PlannedExercise, 'sets' | 'repRange' | 'supersetWithNext' | 'description'>;

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  note: string;
  skipped: boolean;
  planned: PlannedSnapshot;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  date: IsoDate;
  startedAt: string;
  finishedAt?: string;
  note: string;
  programId?: string;
  sessionTemplateId?: string;
  sessionName: string;
  /** Denormalized for the "last time this exercise was done" index. */
  exerciseIds: string[];
  exercises: WorkoutExercise[];
};
