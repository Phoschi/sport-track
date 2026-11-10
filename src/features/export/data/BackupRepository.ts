import type { Observable } from '../../../shared/data/observable';
import type { BackupTables } from '../domain/backupFormat';

export interface BackupRepository {
  readAll(): Promise<BackupTables>;
  /** Wipes every table and writes the given data, all or nothing. */
  replaceAll(tables: BackupTables): Promise<void>;
  watchLastExportAt(): Observable<string | undefined>;
  markExported(at: string): Promise<void>;
}
