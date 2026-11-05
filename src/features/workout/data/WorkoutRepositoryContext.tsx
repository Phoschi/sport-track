import { createContext, useContext, type ReactNode } from 'react';
import type { WorkoutRepository } from './WorkoutRepository';

const WorkoutRepositoryContext = createContext<WorkoutRepository | null>(null);

/** The implementation is chosen by the app's composition root, never by the UI. */
export function WorkoutRepositoryProvider(props: { value: WorkoutRepository; children: ReactNode }) {
  return <WorkoutRepositoryContext value={props.value}>{props.children}</WorkoutRepositoryContext>;
}

export function useWorkoutRepository(): WorkoutRepository {
  const repository = useContext(WorkoutRepositoryContext);
  if (!repository) throw new Error('WorkoutRepositoryProvider is missing');
  return repository;
}
