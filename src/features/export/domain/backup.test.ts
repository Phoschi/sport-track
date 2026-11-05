import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION } from '../../../shared/domain/schemaVersion';
import type { BackupTables } from './backupFormat';
import { backupFileName, createBackup, serializeBackup, summarizeBackup, tablesToRestore } from './createBackup';
import { parseBackup } from './parseBackup';

const tables: BackupTables = {
  exercises: [{ id: 'squat', name: 'Squat', createdAt: '' }],
  programs: [{ id: 'p', name: 'PPL', createdAt: '', sessions: [] }],
  workouts: [],
  bodyWeights: [{ date: '2026-11-05', weightKg: 80.4 }],
  measurementSites: [],
  measurements: [],
  settings: [{ key: 'mainProgramId', value: 'p' }, { key: 'lastExportAt', value: '2026-10-01T10:00:00.000Z' }],
};
// 23:30 UTC on Nov 5 is already Nov 6 in Paris.
const backup = createBackup(tables, new Date('2026-11-05T23:30:00Z'));

describe('createBackup', () => {
  it('stamps format, schema version and export time', () => {
    expect(backup).toMatchObject({ format: 'gym-tracker-backup', schemaVersion: SCHEMA_VERSION, exportedAt: '2026-11-05T23:30:00.000Z' });
  });

  it('names the file with the Paris day', () => {
    expect(backupFileName(backup)).toBe('gym-tracker-backup-2026-11-06.json');
  });

  it('counts records per table', () => {
    expect(summarizeBackup(backup)).toEqual({
      exercises: 1, programs: 1, workouts: 0, bodyWeights: 1, measurementSites: 0, measurements: 0, settings: 2,
    });
  });

  it('restores with lastExportAt set to the backup date', () => {
    const restored = tablesToRestore(backup);
    expect(restored.settings).toEqual([
      { key: 'mainProgramId', value: 'p' },
      { key: 'lastExportAt', value: '2026-11-05T23:30:00.000Z' },
    ]);
  });
});

describe('parseBackup', () => {
  const withChange = (change: (value: Record<string, unknown>) => void) => {
    const copy = JSON.parse(serializeBackup(backup)) as Record<string, unknown>;
    change(copy);
    return parseBackup(JSON.stringify(copy));
  };

  it('round-trips a serialized backup', () => {
    expect(parseBackup(serializeBackup(backup))).toEqual({ ok: true, backup });
  });

  it('rejects non-JSON, foreign files and newer schema versions', () => {
    expect(parseBackup('{oops')).toMatchObject({ ok: false });
    expect(parseBackup('{"hello":1}')).toMatchObject({ ok: false, error: expect.stringContaining('pas un backup') });
    expect(withChange((value) => (value.schemaVersion = SCHEMA_VERSION + 1))).toMatchObject({ ok: false, error: expect.stringContaining('plus récente') });
  });

  it('rejects missing tables and malformed records with a precise message', () => {
    expect(withChange((value) => delete (value.tables as Record<string, unknown>).workouts)).toEqual({ ok: false, error: 'Table « workouts » manquante.' });
    expect(withChange((value) => ((value.tables as BackupTables).bodyWeights[0] = { date: '2026-11-05', weightKg: '80' as never }))).toEqual({
      ok: false,
      error: 'Élément 1 de « bodyWeights » invalide.',
    });
  });
});
