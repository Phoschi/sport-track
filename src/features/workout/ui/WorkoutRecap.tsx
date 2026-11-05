import { Link } from 'react-router-dom';
import { formatSet } from '../domain/formatSet';
import { completedWarmupSets, completedWorkingSets } from '../domain/setValidation';
import type { Workout } from '../domain/types';
import { isExerciseSkipped } from '../domain/workoutStatus';
import { formatWorkoutDate } from './formatWorkoutDate';
import styles from './WorkoutRecap.module.css';

export function WorkoutRecap({ workout, names }: { workout: Workout; names: ReadonlyMap<string, string> }) {
  return (
    <section>
      <h1>Séance {workout.sessionName} — terminée</h1>
      <p className="muted">{formatWorkoutDate(workout.date)}</p>
      <ul className={styles.list}>
        {workout.exercises.map((exercise) => (
          <li key={exercise.id} className={styles.exercise}>
            <strong>{names.get(exercise.exerciseId) ?? '…'}</strong>
            {exercise.planned.supersetWithNext && <span className={styles.superset}> SS ↓</span>}
            {isExerciseSkipped(exercise) ? (
              <p className={styles.skip}>skip</p>
            ) : (
              <ol className={styles.sets}>
                {completedWarmupSets(exercise).map((set) => (
                  <li key={set.id} className={styles.warmup}>C · {formatSet(set.segments)}</li>
                ))}
                {completedWorkingSets(exercise).map((set, index) => (
                  <li key={set.id}>{index + 1} · {formatSet(set.segments)}</li>
                ))}
              </ol>
            )}
            {exercise.note && <p className="muted">📝 {exercise.note}</p>}
          </li>
        ))}
      </ul>
      {workout.note && <p className="muted">📝 {workout.note}</p>}
      <Link to="/">← Accueil</Link>
    </section>
  );
}
