import type { Observable } from '../../../shared/data/observable';
import type { Exercise } from '../domain/types';

export type ExerciseUsage = { programCount: number; workoutCount: number };

export interface ExerciseRepository {
  watchAll(): Observable<Exercise[]>;
  /** Throws EmptyNameError or DuplicateExerciseNameError. */
  create(name: string): Promise<Exercise>;
  /** Throws EmptyNameError or DuplicateExerciseNameError. History follows the stable id. */
  rename(id: string, name: string): Promise<void>;
  /** Throws ExerciseInUseError if any program or workout references it. */
  delete(id: string): Promise<void>;
  getUsage(id: string): Promise<ExerciseUsage>;
}
