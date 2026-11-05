import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../shared/ui/Button';
import { useObservable } from '../../../shared/ui/useObservable';
import { useWorkoutRepository } from '../data/WorkoutRepositoryContext';
import { formatWorkoutDate } from './formatWorkoutDate';
import styles from './workout.module.css';

/** Starts a session, or asks what to do with the workout already in progress. */
export function WorkoutStartPage() {
  const { programId = '', sessionId = '' } = useParams();
  const repository = useWorkoutRepository();
  const current = useObservable(() => repository.watchCurrent(), [repository]);
  const navigate = useNavigate();
  const startRequested = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (current === undefined) return;
    const sameSession = current?.programId === programId && current.sessionTemplateId === sessionId;
    if (current && sameSession) navigate(`/workout/${current.id}`, { replace: true });
    if (current !== null || startRequested.current) return;
    // Guards against the double effect run of StrictMode creating two workouts.
    startRequested.current = true;
    repository.start(programId, sessionId).then(
      (workout) => navigate(`/workout/${workout.id}`, { replace: true }),
      (caught: unknown) => setError(caught instanceof Error ? caught.message : String(caught)),
    );
  }, [current, programId, sessionId, repository, navigate]);

  if (error) {
    return (
      <section>
        <h1>Impossible de démarrer</h1>
        <p className="error">{error}</p>
        <Link to="/programs">← Programmes</Link>
      </section>
    );
  }
  if (!current) return null;

  function cancelAndStart() {
    if (!current || !window.confirm(`Supprimer la séance ${current.sessionName} en cours et tout ce qui y a été saisi ?`)) return;
    void repository.cancel(current.id);
  }

  return (
    <section className={styles.footer}>
      <h1>Une séance est déjà en cours</h1>
      <p>Séance {current.sessionName} du {formatWorkoutDate(current.date)}.</p>
      <Button variant="primary" fullWidth onClick={() => navigate(`/workout/${current.id}`, { replace: true })}>
        Reprendre la séance {current.sessionName}
      </Button>
      <Button variant="danger" fullWidth onClick={cancelAndStart}>Supprimer la séance {current.sessionName} et démarrer</Button>
    </section>
  );
}
