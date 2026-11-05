import { Button } from '../../../shared/ui/Button';
import { groupSupersetBlocks } from '../domain/supersetBlocks';
import type { Workout } from '../domain/types';
import { replaceExercise } from '../domain/workoutEditing';
import { countSkippedOnFinish } from '../domain/workoutStatus';
import { ExerciseLogCard } from './ExerciseLogCard';
import { formatWorkoutDate } from './formatWorkoutDate';
import styles from './workout.module.css';

type WorkoutLoggerProps = {
  workout: Workout;
  names: ReadonlyMap<string, string>;
  saveFailed: boolean;
  onUpdate: (change: (workout: Workout) => Workout) => void;
  onFinish: () => void;
  onCancel: () => void;
};

export function WorkoutLogger({ workout, names, saveFailed, onUpdate, onFinish, onCancel }: WorkoutLoggerProps) {
  function confirmFinish() {
    const skipped = countSkippedOnFinish(workout);
    if (skipped === 0 || window.confirm(`${skipped} exo(s) seront marqués skip. Terminer quand même ?`)) onFinish();
  }

  function confirmCancel() {
    if (window.confirm('Annuler la séance ? Tout ce qui a été saisi sera supprimé.')) onCancel();
  }

  return (
    <section>
      <h1>Séance {workout.sessionName}</h1>
      <p className="muted">{formatWorkoutDate(workout.date)}</p>
      {saveFailed && <p className={styles.alert}>La dernière sauvegarde a échoué. Ne ferme pas l'app.</p>}
      {groupSupersetBlocks(workout.exercises).map((block) => (
        <div key={block[0]?.id} className={block.length > 1 ? `${styles.block} ${styles.superset}` : styles.block}>
          {block.length > 1 && <span className={styles.supersetTag}>Superset</span>}
          {block.map((exercise) => (
            <ExerciseLogCard
              key={exercise.id}
              exercise={exercise}
              name={names.get(exercise.exerciseId) ?? '…'}
              onChange={(updated) => onUpdate((current) => replaceExercise(current, updated))}
            />
          ))}
        </div>
      ))}
      <div className={styles.footer}>
        <label>
          Note de séance
          <textarea value={workout.note} onChange={(event) => onUpdate((current) => ({ ...current, note: event.target.value }))} />
        </label>
        <Button variant="primary" fullWidth onClick={confirmFinish}>Terminer</Button>
        <Button variant="danger" fullWidth onClick={confirmCancel}>Annuler la séance</Button>
      </div>
    </section>
  );
}
