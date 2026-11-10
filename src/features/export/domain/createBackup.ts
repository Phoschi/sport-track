import { toParisDate } from '../../../shared/domain/parisDate';
import { SCHEMA_VERSION } from '../../../shared/domain/schemaVersion';
import { BACKUP_FORMAT, TABLE_NAMES, type Backup, type BackupTables } from './backupFormat';

export function createBackup(tables: BackupTables, now: Date): Backup {
  return { format: BACKUP_FORMAT, schemaVersion: SCHEMA_VERSION, exportedAt: now.toISOString(), tables };
}

export function serializeBackup(backup: Backup): string {
  return JSON.stringify(backup, null, 2);
}

export function backupFileName(backup: Backup): string {
  return `gym-tracker-backup-${toParisDate(new Date(backup.exportedAt))}.json`;
}

export type BackupSummary = Record<keyof BackupTables, number>;

export function summarizeBackup(backup: Backup): BackupSummary {
  return Object.fromEntries(TABLE_NAMES.map((name) => [name, backup.tables[name].length])) as BackupSummary;
}

/** The restored data matches that export, so the backup reminder restarts from its date. */
export function tablesToRestore(backup: Backup): BackupTables {
  const settings = backup.tables.settings.filter((record) => record.key !== 'lastExportAt');
  return { ...backup.tables, settings: [...settings, { key: 'lastExportAt', value: backup.exportedAt }] };
}
