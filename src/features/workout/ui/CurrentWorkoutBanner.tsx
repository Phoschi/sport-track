import { useNavigate } from 'react-router-dom';
import { toParisDate } from '../../../shared/domain/parisDate';
import { Button } from '../../../shared/ui/Button';
import { useObservable } from '../../../shared/ui/useObservable';
import { useWorkoutRepository } from '../data/WorkoutRepositoryContext';
import { shouldOfferFinish } from '../domain/workoutStatus';
import { formatWorkoutDate } from './formatWorkoutDate';
import styles from './workout.module.css';

export function CurrentWorkoutBanner() {
  const repository = useWorkoutRepository();
  const current = useObservable(() => repository.watchCurrent(), [repository]);
  const navigate = useNavigate();
  if (!current) return null;

  const offerFinish = shouldOfferFinish(current, toParisDate(new Date()));

  return (
    <aside className={`${styles.block} ${styles.superset}`}>
      <strong>Séance {current.sessionName} en cours</strong>
      <span className="muted">{formatWorkoutDate(current.date)}</span>
      <Button variant="primary" fullWidth onClick={() => navigate(`/workout/${current.id}`)}>Reprendre</Button>
      {offerFinish && (
        <Button fullWidth onClick={() => void repository.finish(current.id)}>Terminer cette séance</Button>
      )}
    </aside>
  );
}
