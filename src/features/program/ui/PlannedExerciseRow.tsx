import type { Direction } from '../../../shared/domain/swapAdjacent';
import { formatRepRange } from '../domain/repRange';
import type { PlannedExercise } from '../domain/types';
import styles from './SessionCard.module.css';

type PlannedExerciseRowProps = {
  planned: PlannedExercise;
  exerciseName: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onEdit: () => void;
  onMove: (direction: Direction) => void;
};

export function PlannedExerciseRow({ planned, exerciseName, canMoveUp, canMoveDown, onEdit, onMove }: PlannedExerciseRowProps) {
  return (
    <li className={styles.exercise}>
      <button type="button" className={styles.exerciseMain} onClick={onEdit}>
        <span className={styles.exerciseName}>{exerciseName}</span>
        <span className="muted">
          {planned.sets} × {formatRepRange(planned.repRange)}
          {planned.description ? ` · ${planned.description}` : ''}
        </span>
      </button>
      <div className={styles.moves}>
        <button type="button" disabled={!canMoveUp} onClick={() => onMove(-1)} aria-label="Monter">↑</button>
        <button type="button" disabled={!canMoveDown} onClick={() => onMove(1)} aria-label="Descendre">↓</button>
      </div>
      {planned.supersetWithNext && <span className={styles.superset}>SS</span>}
    </li>
  );
}
