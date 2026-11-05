import type { Observable } from '../../../shared/data/observable';
import type { Workout } from '../domain/types';

export interface WorkoutRepository {
  /** The unfinished workout, or null. There is never more than one. */
  watchCurrent(): Observable<Workout | null>;
  watchById(id: string): Observable<Workout | null>;
  getById(id: string): Promise<Workout | null>;
  /** Throws WorkoutInProgressError or SessionNotFoundError. */
  start(programId: string, sessionId: string): Promise<Workout>;
  save(workout: Workout): Promise<void>;
  finish(id: string): Promise<void>;
  /** Deletes an unfinished workout started by mistake. */
  cancel(id: string): Promise<void>;
  /** Current names, so renaming an exercise updates the whole history. */
  watchExerciseNames(): Observable<ReadonlyMap<string, string>>;
}
