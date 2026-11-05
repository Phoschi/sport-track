import { SCHEMA_VERSION } from '../../../shared/domain/schemaVersion';
import { BACKUP_FORMAT, TABLE_NAMES, type Backup, type BackupTables } from './backupFormat';

export type ParseBackupResult = { ok: true; backup: Backup } | { ok: false; error: string };

type Check = (value: unknown) => boolean;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isString: Check = (value) => typeof value === 'string';
const isNumber: Check = (value) => typeof value === 'number' && Number.isFinite(value);
const isArray: Check = Array.isArray;

// Shallow checks on the fields indexes and screens rely on: enough to reject a wrong file
// without duplicating every type.
const RECORD_SHAPES: Record<keyof BackupTables, Record<string, Check>> = {
  exercises: { id: isString, name: isString },
  programs: { id: isString, name: isString, sessions: isArray },
  workouts: { id: isString, date: isString, exerciseIds: isArray, exercises: isArray },
  bodyWeights: { date: isString, weightKg: isNumber },
  measurementSites: { id: isString, name: isString },
  measurements: { date: isString, siteId: isString, valueCm: isNumber },
  settings: { key: isString },
};

function invalidTable(name: keyof BackupTables, value: unknown): string | null {
  if (!Array.isArray(value)) return `Table « ${name} » manquante.`;
  const shape = Object.entries(RECORD_SHAPES[name]);
  const badIndex = value.findIndex((record) => !isObject(record) || shape.some(([key, check]) => !check(record[key])));
  return badIndex >= 0 ? `Élément ${badIndex + 1} de « ${name} » invalide.` : null;
}

export function parseBackup(text: string): ParseBackupResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "Ce fichier n'est pas du JSON valide." };
  }
  if (!isObject(raw) || raw.format !== BACKUP_FORMAT) return { ok: false, error: "Ce fichier n'est pas un backup Gym Tracker." };
  if (!isNumber(raw.schemaVersion) || (raw.schemaVersion as number) > SCHEMA_VERSION) {
    return { ok: false, error: 'Backup créé par une version plus récente de l’app : mets l’app à jour.' };
  }
  if (!isString(raw.exportedAt) || !isObject(raw.tables)) return { ok: false, error: 'Backup incomplet.' };
  const tables = raw.tables;
  for (const name of TABLE_NAMES) {
    const error = invalidTable(name, tables[name]);
    if (error) return { ok: false, error };
  }
  return { ok: true, backup: raw as Backup };
}
