import type { ReactNode } from 'react';
import { database } from '../db/instance';
import { createDexieExerciseRepository } from '../features/program/data/dexieExerciseRepository';
import { createDexieProgramRepository } from '../features/program/data/dexieProgramRepository';
import { ProgramRepositoriesProvider } from '../features/program/data/ProgramRepositoriesContext';

// Composition root: swap these factories to move from IndexedDB to a server.
const programRepositories = {
  exercises: createDexieExerciseRepository(database),
  programs: createDexieProgramRepository(database),
};

export function RepositoryProviders({ children }: { children: ReactNode }) {
  return <ProgramRepositoriesProvider value={programRepositories}>{children}</ProgramRepositoriesProvider>;
}
