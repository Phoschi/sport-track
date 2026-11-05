import { useState } from 'react';
import { createId } from '../../../shared/domain/id';
import { Button } from '../../../shared/ui/Button';
import { formatRepRange } from '../../program/domain/repRange';
import { addExtraSet, addSegment, addWarmupSet, isExtraSet, removeSegment, removeSet, toggleValidated, updateSegment } from '../domain/setEditing';
import type { WorkoutExercise } from '../domain/types';
import { setExerciseNote, setSkipped } from '../domain/workoutEditing';
import { SetRow } from './SetRow';
import styles from './workout.module.css';

type ExerciseLogCardProps = {
  exercise: WorkoutExercise;
  name: string;
  onChange: (exercise: WorkoutExercise) => void;
};

export function ExerciseLogCard({ exercise, name, onChange }: ExerciseLogCardProps) {
  const [showNote, setShowNote] = useState(exercise.note !== '');
  const { planned } = exercise;
  const range = formatRepRange(planned.repRange);
  let workingIndex = 0;

  return (
    <section className={styles.exercise}>
      <header>
        <h3 className={styles.exerciseName}>{name}</h3>
        <p className="muted">
          {planned.sets} × {range}
          {planned.description ? ` · ${planned.description}` : ''}
        </p>
      </header>
      {exercise.skipped ? (
        <Button fullWidth onClick={() => onChange(setSkipped(exercise, false))}>Exo sauté — reprendre</Button>
      ) : (
        <>
          <ol className={styles.sets}>
            {exercise.sets.map((set) => {
              const index = set.isWarmup ? -1 : workingIndex++;
              return (
                <SetRow
                  key={set.id}
                  set={set}
                  label={set.isWarmup ? 'C' : String(index + 1)}
                  reminder={!set.isWarmup && index >= exercise.previousSetCount ? range : undefined}
                  removable={set.isWarmup || isExtraSet(exercise, set.id)}
                  onSegmentChange={(segmentIndex, patch) => onChange(updateSegment(exercise, set.id, segmentIndex, patch))}
                  onAddSegment={() => onChange(addSegment(exercise, set.id))}
                  onRemoveSegment={(segmentIndex) => onChange(removeSegment(exercise, set.id, segmentIndex))}
                  onToggleValidated={() => onChange(toggleValidated(exercise, set.id))}
                  onRemove={() => onChange(removeSet(exercise, set.id))}
                />
              );
            })}
          </ol>
          <div className={styles.actions}>
            <Button onClick={() => onChange(addExtraSet(exercise, createId()))}>+ Série</Button>
            <Button onClick={() => onChange(addWarmupSet(exercise, createId()))}>+ Chauffe</Button>
            <Button onClick={() => setShowNote(true)} disabled={showNote}>Note</Button>
            <Button variant="ghost" onClick={() => onChange(setSkipped(exercise, true))}>Sauter</Button>
          </div>
        </>
      )}
      {showNote && (
        <textarea
          aria-label={`Note pour ${name}`}
          placeholder="Note sur l'exo"
          value={exercise.note}
          onChange={(event) => onChange(setExerciseNote(exercise, event.target.value))}
        />
      )}
    </section>
  );
}
