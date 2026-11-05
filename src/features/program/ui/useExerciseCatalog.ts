import { useMemo } from 'react';
import { useObservable } from '../../../shared/ui/useObservable';
import { useProgramRepositories } from '../data/ProgramRepositoriesContext';
import type { Exercise } from '../domain/types';

export function useExerciseCatalog(): { exercises: Exercise[]; byId: Map<string, Exercise> } {
  const { exercises: repository } = useProgramRepositories();
  const exercises = useObservable(() => repository.watchAll(), [repository]) ?? [];
  const byId = useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), [exercises]);
  return { exercises, byId };
}
