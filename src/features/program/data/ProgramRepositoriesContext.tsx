import { createContext, useContext, type ReactNode } from 'react';
import type { ExerciseRepository } from './ExerciseRepository';
import type { ProgramRepository } from './ProgramRepository';

export type ProgramRepositories = {
  exercises: ExerciseRepository;
  programs: ProgramRepository;
};

const ProgramRepositoriesContext = createContext<ProgramRepositories | null>(null);

/** Implementations are chosen by the app's composition root, never by the UI. */
export function ProgramRepositoriesProvider(props: { value: ProgramRepositories; children: ReactNode }) {
  return <ProgramRepositoriesContext value={props.value}>{props.children}</ProgramRepositoriesContext>;
}

export function useProgramRepositories(): ProgramRepositories {
  const repositories = useContext(ProgramRepositoriesContext);
  if (!repositories) throw new Error('ProgramRepositoriesProvider is missing');
  return repositories;
}
