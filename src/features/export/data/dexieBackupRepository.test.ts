import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GymDatabase } from '../../../db/database';
import { program } from '../../program/domain/testFixtures';
import { workout } from '../../workout/domain/testFixtures';
import { createBackup, tablesToRestore } from '../domain/createBackup';
import { createDexieBackupRepository } from './dexieBackupRepository';

describe('dexieBackupRepository', () => {
  let database: GymDatabase;
  let repository: ReturnType<typeof createDexieBackupRepository>;

  beforeEach(async () => {
    database = new GymDatabase(`test-backup-${crypto.randomUUID()}`);
    repository = createDexieBackupRepository(database);
    await database.exercises.add({ id: 'squat', name: 'Squat', createdAt: '' });
    await database.programs.add(program('p'));
    await database.workouts.add(workout('w', '2026-11-02', []));
    await database.bodyWeights.add({ date: '2026-11-05', weightKg: 80 });
    await database.measurements.add({ date: '2026-11-07', siteId: 'neck', valueCm: 37 });
    await database.settings.put({ key: 'mainProgramId', value: 'p' });
  });
  afterEach(() => database.delete());

  it('reads every table', async () => {
    const tables = await repository.readAll();
    expect(Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.length]))).toEqual({
      exercises: 1, programs: 1, workouts: 1, bodyWeights: 1, measurementSites: 0, measurements: 1, settings: 1,
    });
  });

  it('restores an export exactly, replacing newer data', async () => {
    const backup = createBackup(await repository.readAll(), new Date('2026-11-05T10:00:00Z'));
    await database.exercises.add({ id: 'bench', name: 'Développé', createdAt: '' });
    await database.workouts.clear();

    await repository.replaceAll(tablesToRestore(backup));

    expect(await database.exercises.toArray()).toEqual(backup.tables.exercises);
    expect(await database.workouts.toArray()).toEqual(backup.tables.workouts);
    expect(await database.measurements.get(['2026-11-07', 'neck'])).toBeDefined();
    expect((await database.settings.get('lastExportAt'))?.value).toBe('2026-11-05T10:00:00.000Z');
  });

  it('leaves data untouched when the restore fails midway', async () => {
    const before = await repository.readAll();
    const broken = { ...before, workouts: [workout('a', '2026-11-01', []), workout('a', '2026-11-01', [])] };
    await expect(repository.replaceAll(broken)).rejects.toThrow();
    expect(await repository.readAll()).toEqual(before);
  });

  it('records the export date', async () => {
    await repository.markExported('2026-11-05T10:00:00.000Z');
    expect((await database.settings.get('lastExportAt'))?.value).toBe('2026-11-05T10:00:00.000Z');
  });
});
