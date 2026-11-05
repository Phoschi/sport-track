import { Link } from 'react-router-dom';
import type { Direction } from '../../../shared/domain/swapAdjacent';
import { Button } from '../../../shared/ui/Button';
import type { Exercise, SessionTemplate } from '../domain/types';
import { DAY_NAMES } from './dayLabels';
import { PlannedExerciseRow } from './PlannedExerciseRow';
import styles from './SessionCard.module.css';

type SessionCardProps = {
  programId: string;
  session: SessionTemplate;
  exercisesById: ReadonlyMap<string, Exercise>;
  onEditSession: () => void;
  onAddExercise: () => void;
  onEditExercise: (plannedId: string) => void;
  onMoveExercise: (plannedId: string, direction: Direction) => void;
};

export function SessionCard(props: SessionCardProps) {
  const { programId, session, exercisesById, onEditSession, onAddExercise, onEditExercise, onMoveExercise } = props;
  const lastIndex = session.exercises.length - 1;

  return (
    <article className={styles.card}>
      <button type="button" className={styles.header} onClick={onEditSession}>
        <span className={styles.title}>{session.name}</span>
        <span className="muted">{DAY_NAMES[session.dayOfWeek]} ✎</span>
      </button>
      {session.exercises.length === 0 && <p className="muted">Aucun exo.</p>}
      <ol className={styles.exercises}>
        {session.exercises.map((planned, index) => (
          <PlannedExerciseRow
            key={planned.id}
            planned={planned}
            exerciseName={exercisesById.get(planned.exerciseId)?.name ?? '…'}
            canMoveUp={index > 0}
            canMoveDown={index < lastIndex}
            onEdit={() => onEditExercise(planned.id)}
            onMove={(direction) => onMoveExercise(planned.id, direction)}
          />
        ))}
      </ol>
      <Button variant="ghost" fullWidth onClick={onAddExercise}>+ Exo</Button>
      {session.exercises.length > 0 && (
        <Link className={styles.start} to={`/workout/start/${programId}/${session.id}`}>▶ Démarrer la séance {session.name}</Link>
      )}
    </article>
  );
}
