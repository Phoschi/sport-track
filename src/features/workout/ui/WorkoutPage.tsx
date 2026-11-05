import { Link, useNavigate, useParams } from 'react-router-dom';
import { useObservable } from '../../../shared/ui/useObservable';
import { useWorkoutRepository } from '../data/WorkoutRepositoryContext';
import { useWorkoutEditor } from './useWorkoutEditor';
import { WorkoutLogger } from './WorkoutLogger';
import { WorkoutRecap } from './WorkoutRecap';

export function WorkoutPage() {
  const { workoutId = '' } = useParams();
  const repository = useWorkoutRepository();
  const names = useObservable(() => repository.watchExerciseNames(), [repository]) ?? new Map<string, string>();
  const { workout, update, flush, reload, saveFailed } = useWorkoutEditor(workoutId);
  const navigate = useNavigate();

  if (workout === undefined) return null;
  if (workout === null) {
    return (
      <section>
        <h1>Séance introuvable</h1>
        <Link to="/">← Accueil</Link>
      </section>
    );
  }
  if (workout.finishedAt !== undefined) return <WorkoutRecap workout={workout} names={names} />;

  return (
    <WorkoutLogger
      workout={workout}
      names={names}
      saveFailed={saveFailed}
      onUpdate={update}
      onFinish={async () => {
        await flush();
        await repository.finish(workout.id);
        await reload();
        window.scrollTo(0, 0);
      }}
      onCancel={async () => {
        await flush();
        await repository.cancel(workout.id);
        navigate('/', { replace: true });
      }}
    />
  );
}
