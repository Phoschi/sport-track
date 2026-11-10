import { useRef, useState, type ChangeEvent } from 'react';
import { Button } from '../../../shared/ui/Button';
import { useObservable } from '../../../shared/ui/useObservable';
import { useBackupRepository } from '../data/BackupRepositoryContext';
import type { Backup } from '../domain/backupFormat';
import { backupAge } from '../domain/backupReminder';
import { backupFileName, createBackup, serializeBackup, tablesToRestore } from '../domain/createBackup';
import { parseBackup } from '../domain/parseBackup';
import { deliverFile } from './deliverFile';
import { RestoreSheet } from './RestoreSheet';
import styles from './BackupPanel.module.css';

function ageLabel(days: number | null): string {
  if (days === null) return 'Aucun backup pour l’instant.';
  if (days === 0) return 'Dernier backup : aujourd’hui.';
  return `Dernier backup : il y a ${days} jour${days > 1 ? 's' : ''}.`;
}

export function BackupPanel() {
  const repository = useBackupRepository();
  const lastExportAt = useObservable(() => repository.watchLastExportAt(), [repository]);
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Backup | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const age = backupAge(lastExportAt, new Date());

  async function exportBackup() {
    setBusy(true);
    try {
      const backup = createBackup(await repository.readAll(), new Date());
      const result = await deliverFile(backupFileName(backup), serializeBackup(backup));
      if (result !== 'cancelled') await repository.markExported(backup.exportedAt);
      setMessage(result === 'cancelled' ? null : { text: 'Backup créé.', isError: false });
    } catch (error) {
      setMessage({ text: `Échec du backup : ${error instanceof Error ? error.message : String(error)}`, isError: true });
    } finally {
      setBusy(false);
    }
  }

  async function pickFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const result = parseBackup(await file.text());
    if (result.ok) setPending(result.backup);
    else setMessage({ text: result.error, isError: true });
  }

  async function restore(backup: Backup) {
    setBusy(true);
    try {
      await repository.replaceAll(tablesToRestore(backup));
      setPending(null);
      setMessage({ text: 'Données restaurées.', isError: false });
    } catch (error) {
      setMessage({ text: `Échec, rien n'a été modifié : ${error instanceof Error ? error.message : String(error)}`, isError: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.panel}>
      <h3>Backup</h3>
      <p className={age.isOverdue ? styles.overdue : 'muted'}>{ageLabel(age.daysSinceExport)}</p>
      <Button variant="primary" fullWidth disabled={busy} onClick={exportBackup}>Sauvegarder mes données</Button>
      <Button fullWidth disabled={busy} onClick={() => fileInput.current?.click()}>Restaurer un backup</Button>
      <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={pickFile} />
      {message && <p className={message.isError ? 'error' : 'muted'}>{message.text}</p>}
      {pending && <RestoreSheet backup={pending} restoring={busy} onConfirm={() => restore(pending)} onClose={() => setPending(null)} />}
    </div>
  );
}
