import type { Observable } from '../../../shared/data/observable';
import type { Program } from '../domain/types';

export interface ProgramRepository {
  watchAll(): Observable<Program[]>;
  /** Emits null when the program does not exist. */
  watchById(id: string): Observable<Program | null>;
  watchMainProgramId(): Observable<string | undefined>;
  /** The first program ever created becomes the main one. Throws EmptyNameError. */
  create(name: string): Promise<Program>;
  /** Throws EmptyNameError. */
  save(program: Program): Promise<void>;
  /** Throws MainProgramDeletionError for the main program. */
  delete(id: string): Promise<void>;
  setMain(id: string): Promise<void>;
}
