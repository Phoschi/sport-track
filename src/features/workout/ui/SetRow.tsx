import { useState } from 'react';
import { NumberField } from '../../../shared/ui/NumberField';
import { isSetComplete } from '../domain/setValidation';
import type { DraftSegment, WorkoutSet } from '../domain/types';
import styles from './SetRow.module.css';

type SetRowProps = {
  set: WorkoutSet;
  label: string;
  /** Rep range reminder, shown on sets beyond last time's history. */
  reminder: string | undefined;
  removable: boolean;
  onSegmentChange: (segmentIndex: number, patch: Partial<DraftSegment>) => void;
  onAddSegment: () => void;
  onRemoveSegment: (segmentIndex: number) => void;
  onToggleValidated: () => void;
  onRemove: () => void;
};

export function SetRow(props: SetRowProps) {
  const { set, label, reminder, removable } = props;
  const [showIncomplete, setShowIncomplete] = useState(false);

  function toggle() {
    const refused = !set.isValidated && !isSetComplete(set);
    setShowIncomplete(refused);
    if (!refused) props.onToggleValidated();
  }

  return (
    <li className={set.isValidated ? `${styles.set} ${styles.validated}` : styles.set}>
      <div className={styles.main}>
        <span className={set.isWarmup ? `${styles.label} ${styles.warmup}` : styles.label}>{label}</span>
        <div className={styles.segments}>
          {set.segments.map((segment, index) => (
            <div key={index} className={styles.segment}>
              <NumberField
                aria-label="Poids (kg)"
                placeholder="kg"
                inputMode="decimal"
                value={segment.weightKg}
                onValueChange={(weightKg) => props.onSegmentChange(index, { weightKg })}
              />
              <NumberField
                aria-label="Reps"
                placeholder="reps"
                inputMode="numeric"
                value={segment.reps}
                onValueChange={(reps) => props.onSegmentChange(index, { reps })}
              />
              {set.segments.length > 1 && (
                <button type="button" className={styles.small} aria-label="Retirer la charge" onClick={() => props.onRemoveSegment(index)}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className={styles.check} aria-pressed={set.isValidated} aria-label="Valider la série" onClick={toggle}>
          ✓
        </button>
      </div>
      <div className={styles.footer}>
        <button type="button" className={styles.link} onClick={props.onAddSegment}>+ charge</button>
        {reminder && <span className="muted">objectif {reminder}</span>}
        {removable && <button type="button" className={styles.link} onClick={props.onRemove}>retirer</button>}
      </div>
      {showIncomplete && <p className="error">Complète poids et reps (reps entières ≥ 1).</p>}
    </li>
  );
}
