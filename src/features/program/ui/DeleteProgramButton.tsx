import { Button } from '../../../shared/ui/Button';
import { canDeleteProgram } from '../domain/mainProgram';
import styles from './program.module.css';

type DeleteProgramButtonProps = { programId: string; mainProgramId: string | undefined; onDelete: () => void };

export function DeleteProgramButton({ programId, mainProgramId, onDelete }: DeleteProgramButtonProps) {
  const deletable = canDeleteProgram(programId, mainProgramId);
  return (
    <div className={styles.stack} style={{ marginTop: 'var(--space-6)' }}>
      <Button variant="danger" fullWidth disabled={!deletable} onClick={onDelete}>
        Supprimer le programme
      </Button>
      {!deletable && <p className="muted">Pour le supprimer, choisis d'abord un autre programme principal.</p>}
    </div>
  );
}
