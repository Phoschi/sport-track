import { useCallback, useEffect, useRef, useState } from 'react';
import type { Workout } from '../domain/types';
import { useWorkoutRepository } from '../data/WorkoutRepositoryContext';

export type WorkoutEditor = {
  /** undefined while loading, null when not found. */
  workout: Workout | null | undefined;
  update: (change: (workout: Workout) => Workout) => void;
  /** Resolves once every pending write is stored. */
  flush: () => Promise<void>;
  reload: () => Promise<void>;
  saveFailed: boolean;
};

/**
 * Local state is the source of truth while logging (no cursor jumps from live queries);
 * every change is written immediately, in order, so closing the app loses nothing.
 */
export function useWorkoutEditor(workoutId: string): WorkoutEditor {
  const repository = useWorkoutRepository();
  const [workout, setWorkout] = useState<Workout | null>();
  const [saveFailed, setSaveFailed] = useState(false);
  const latest = useRef<Workout | null>(null);
  const writes = useRef<Promise<void>>(Promise.resolve());

  const reload = useCallback(async () => {
    const loaded = await repository.getById(workoutId);
    latest.current = loaded;
    setWorkout(loaded);
  }, [repository, workoutId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const persist = useCallback(
    (next: Workout) => {
      writes.current = writes.current
        .then(() => repository.save(next))
        .then(() => setSaveFailed(false))
        .catch((error: unknown) => {
          console.error('Workout save failed', error);
          setSaveFailed(true);
        });
    },
    [repository],
  );

  const update = useCallback(
    (change: (current: Workout) => Workout) => {
      if (!latest.current) return;
      const next = change(latest.current);
      latest.current = next;
      setWorkout(next);
      persist(next);
    },
    [persist],
  );

  useEffect(() => {
    // iOS may kill a backgrounded PWA without warning: write the latest state when hidden.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && latest.current) persist(latest.current);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [persist]);

  return { workout, update, flush: () => writes.current, reload, saveFailed };
}
