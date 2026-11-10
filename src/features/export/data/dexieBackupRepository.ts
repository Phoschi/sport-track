import { liveQuery } from 'dexie';
import type { GymDatabase } from '../../../db/database';
import { TABLE_NAMES, type BackupTables } from '../domain/backupFormat';
import type { BackupRepository } from './BackupRepository';

export function createDexieBackupRepository(database: GymDatabase): BackupRepository {
  const tables = () => TABLE_NAMES.map((name) => database.table(name));

  return {
    readAll: () =>
      database.transaction('r', tables(), async () => {
        const entries = await Promise.all(TABLE_NAMES.map(async (name) => [name, await database.table(name).toArray()]));
        return Object.fromEntries(entries) as BackupTables;
      }),

    replaceAll: (data) =>
      database.transaction('rw', tables(), async () => {
        for (const name of TABLE_NAMES) {
          await database.table(name).clear();
          await database.table(name).bulkAdd(data[name]);
        }
      }),

    watchLastExportAt: () => liveQuery(async () => (await database.settings.get('lastExportAt'))?.value),

    markExported: async (at) => {
      await database.settings.put({ key: 'lastExportAt', value: at });
    },
  };
}
