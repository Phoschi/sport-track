import { useState } from 'react';
import { createId } from '../../../shared/domain/id';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { Button } from '../../../shared/ui/Button';
import { ChipGroup } from '../../../shared/ui/ChipGroup';
import { Stepper } from '../../../shared/ui/Stepper';
import { formatRepRange, parseRepRange } from '../domain/repRange';
import type { Exercise, PlannedExercise, RepRange } from '../domain/types';
import { ExerciseAutocomplete } from './ExerciseAutocomplete';
import { RepRangePicker } from './RepRangePicker';
import styles from './program.module.css';

const SUPERSET_CHIPS = [
  { value: 'no', label: 'Non' },
  { value: 'yes', label: 'Oui' },
] as const;

type PlannedExerciseSheetProps = {
  exercisesById: ReadonlyMap<string, Exercise>;
  initial: PlannedExercise | undefined;
  defaultRepRange: RepRange | undefined;
  /** Label of the superset choice, or undefined when no neighbor can be linked. */
  supersetLabel: string | undefined;
  supersetInitial: boolean;
  onSave: (planned: PlannedExercise, superset: boolean) => void;
  onRemove: (() => void) | undefined;
  onClose: () => void;
};

export function PlannedExerciseSheet(props: PlannedExerciseSheetProps) {
  const { exercisesById, initial, defaultRepRange, supersetLabel, supersetInitial, onSave, onRemove, onClose } = props;
  const [exercise, setExercise] = useState(initial && exercisesById.get(initial.exerciseId));
  const [sets, setSets] = useState(initial?.sets ?? 3);
  const startRange = initial?.repRange ?? defaultRepRange;
  const [repsText, setRepsText] = useState(startRange ? formatRepRange(startRange) : '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [superset, setSuperset] = useState(supersetInitial);
  const [error, setError] = useState('');

  function save() {
    const repRange = parseRepRange(repsText);
    if (!exercise) return setError('Choisis ou crée un exo.');
    if (!repRange) return setError('Reps invalides : 8 ou 4-6.');
    const trimmed = description.trim();
    const planned: PlannedExercise = {
      id: initial?.id ?? createId(),
      exerciseId: exercise.id,
      sets,
      repRange,
      supersetWithNext: initial?.supersetWithNext ?? false,
      ...(trimmed ? { description: trimmed } : {}),
    };
    onSave(planned, supersetLabel !== undefined && superset);
  }

  return (
    <BottomSheet title={initial ? "Modifier l'exo" : 'Ajouter un exo'} onClose={onClose}>
      <ExerciseAutocomplete exercises={[...exercisesById.values()]} selected={exercise} onSelect={setExercise} />
      <Stepper label="Séries" value={sets} min={1} max={10} onChange={setSets} />
      <RepRangePicker value={repsText} onChange={setRepsText} />
      <label>
        Description (optionnel)
        <input value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      {supersetLabel && (
        <div className={styles.field}>
          <span>{supersetLabel}</span>
          <ChipGroup
            label={supersetLabel}
            options={SUPERSET_CHIPS}
            selected={superset ? 'yes' : 'no'}
            onSelect={(value) => setSuperset(value === 'yes')}
          />
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <div className={styles.row}>
        {onRemove && <Button variant="danger" onClick={onRemove}>Retirer</Button>}
        <Button variant="primary" onClick={save}>Enregistrer</Button>
      </div>
    </BottomSheet>
  );
}
