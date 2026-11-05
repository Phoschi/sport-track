import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { Button } from '../../../shared/ui/Button';
import type { Backup, BackupTables } from '../domain/backupFormat';
import { summarizeBackup } from '../domain/createBackup';

const TABLE_LABELS: Record<keyof BackupTables, string> = {
  exercises: 'Exos',
  programs: 'Programmes',
  workouts: 'Séances',
  bodyWeights: 'Poids du corps',
  measurementSites: 'Zones de mensuration',
  measurements: 'Mensurations',
  settings: 'Réglages',
};

const dateTime = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Paris' });

type RestoreSheetProps = { backup: Backup; restoring: boolean; onConfirm: () => void; onClose: () => void };

export function RestoreSheet({ backup, restoring, onConfirm, onClose }: RestoreSheetProps) {
  const summary = summarizeBackup(backup);
  return (
    <BottomSheet title="Restaurer ce backup ?" onClose={onClose}>
      <p>Backup du {dateTime.format(new Date(backup.exportedAt))}.</p>
      <ul className="muted">
        {(Object.keys(TABLE_LABELS) as (keyof BackupTables)[]).map((name) => (
          <li key={name}>{TABLE_LABELS[name]} : {summary[name]}</li>
        ))}
      </ul>
      <p className="error">Toutes les données actuelles de l'app seront remplacées par celles du backup.</p>
      <Button variant="danger" fullWidth disabled={restoring} onClick={onConfirm}>
        {restoring ? 'Restauration…' : 'Remplacer mes données'}
      </Button>
      <Button fullWidth onClick={onClose}>Annuler</Button>
    </BottomSheet>
  );
}
