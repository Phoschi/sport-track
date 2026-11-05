import { useEffect, useState } from 'react';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { Button } from '../../../shared/ui/Button';
import type { ExerciseUsage } from '../data/ExerciseRepository';
import { useProgramRepositories } from '../data/ProgramRepositoriesContext';
import type { Exercise } from '../domain/types';
import styles from './program.module.css';

function usageReason({ programCount, workoutCount }: ExerciseUsage): string | null {
  const parts = [
    programCount > 0 ? `${programCount} programme(s)` : '',
    workoutCount > 0 ? `${workoutCount} séance(s) faite(s)` : '',
  ].filter(Boolean);
  return parts.length > 0 ? `Utilisé dans ${parts.join(' et ')} : suppression impossible.` : null;
}

export function ExerciseSheet({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const { exercises: repository } = useProgramRepositories();
  const [name, setName] = useState(exercise.name);
  const [usage, setUsage] = useState<ExerciseUsage>();
  const [error, setError] = useState('');

  useEffect(() => {
    repository.getUsage(exercise.id).then(setUsage, () => setError("Impossible de vérifier l'utilisation."));
  }, [repository, exercise.id]);

  function act(action: Promise<unknown>) {
    action.then(onClose, (caught: unknown) => setError(caught instanceof Error ? caught.message : String(caught)));
  }

  const reason = usage ? usageReason(usage) : null;

  return (
    <BottomSheet title="Exo" onClose={onClose}>
      <label>
        Nom
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <p className="muted">Renommer conserve tout l'historique.</p>
      {error && <p className="error">{error}</p>}
      <Button variant="primary" fullWidth onClick={() => act(repository.rename(exercise.id, name))}>
        Renommer
      </Button>
      <div className={styles.stack}>
        <Button variant="danger" fullWidth disabled={!usage || reason !== null} onClick={() => act(repository.delete(exercise.id))}>
          Supprimer
        </Button>
        {reason && <p className="muted">{reason}</p>}
      </div>
    </BottomSheet>
  );
}
