import type { IsoDate } from '../../../shared/domain/parisDate';
import type { PlannedExercise } from '../../program/domain/types';

/** null = field left empty. Only validated sets are guaranteed complete. */
export type DraftSegment = { weightKg: number | null; reps: number | null };

/** A segment of a validated set: every value is present. */
export type SetSegment = { weightKg: number; reps: number };

export type WorkoutSet = {
  id: string;
  isWarmup: boolean;
  /** Prefilled values are suggestions until the set is validated with ✓. */
  isValidated: boolean;
  segments: DraftSegment[];
};

/** Copy of the plan at workout time, so later program edits don't rewrite history. */
export type PlannedSnapshot = Pick<PlannedExercise, 'sets' | 'repRange' | 'supersetWithNext' | 'description'>;

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  note: string;
  skipped: boolean;
  planned: PlannedSnapshot;
  /** Working sets done the last time, used to remind the rep range on sets beyond it. */
  previousSetCount: number;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  date: IsoDate;
  startedAt: string;
  finishedAt?: string;
  note: string;
  programId: string;
  sessionTemplateId: string;
  sessionName: string;
  /** Denormalized for the "last time this exercise was done" index. */
  exerciseIds: string[];
  exercises: WorkoutExercise[];
};
