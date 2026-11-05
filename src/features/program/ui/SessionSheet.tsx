import { useState } from 'react';
import type { Direction } from '../../../shared/domain/swapAdjacent';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { Button } from '../../../shared/ui/Button';
import { ChipGroup } from '../../../shared/ui/ChipGroup';
import type { SessionTemplate } from '../domain/types';
import { DAY_CHIPS } from './dayLabels';
import styles from './program.module.css';

type SessionSheetProps = {
  session: SessionTemplate;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (session: SessionTemplate) => void;
  onMove: (direction: Direction) => void;
  onDelete: () => void;
  onClose: () => void;
};

/** Changes are saved immediately: no "save" button to forget between two sets. */
export function SessionSheet({ session, canMoveUp, canMoveDown, onChange, onMove, onDelete, onClose }: SessionSheetProps) {
  const [name, setName] = useState(session.name);

  function commitName() {
    const trimmed = name.trim();
    if (trimmed === '') setName(session.name);
    else if (trimmed !== session.name) onChange({ ...session, name: trimmed });
  }

  function confirmDelete() {
    const count = session.exercises.length;
    if (count === 0 || window.confirm(`Supprimer la séance ${session.name} et ses ${count} exo(s) ?`)) onDelete();
  }

  return (
    <BottomSheet title={`Séance ${session.name}`} onClose={onClose}>
      <label>
        Nom
        <input value={name} onChange={(event) => setName(event.target.value)} onBlur={commitName} />
      </label>
      <div className={styles.field}>
        <span>Jour prévu</span>
        <ChipGroup
          label="Jour prévu"
          options={DAY_CHIPS}
          selected={session.dayOfWeek}
          onSelect={(dayOfWeek) => onChange({ ...session, dayOfWeek })}
        />
      </div>
      <div className={styles.row}>
        <Button disabled={!canMoveUp} onClick={() => onMove(-1)}>↑ Monter</Button>
        <Button disabled={!canMoveDown} onClick={() => onMove(1)}>↓ Descendre</Button>
      </div>
      <Button variant="danger" fullWidth onClick={confirmDelete}>Supprimer la séance</Button>
    </BottomSheet>
  );
}
