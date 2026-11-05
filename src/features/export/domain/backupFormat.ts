import type { BodyWeight, Measurement, MeasurementSite } from '../../body/domain/types';
import type { Exercise, Program } from '../../program/domain/types';
import type { Workout } from '../../workout/domain/types';
import type { SettingRecord } from '../../../shared/domain/settings';

export const BACKUP_FORMAT = 'gym-tracker-backup';

/** Every table of the database, as plain JSON-serializable arrays. */
export type BackupTables = {
  exercises: Exercise[];
  programs: Program[];
  workouts: Workout[];
  bodyWeights: BodyWeight[];
  measurementSites: MeasurementSite[];
  measurements: Measurement[];
  settings: SettingRecord[];
};

export type Backup = {
  format: typeof BACKUP_FORMAT;
  schemaVersion: number;
  exportedAt: string;
  tables: BackupTables;
};

export const TABLE_NAMES = [
  'exercises',
  'programs',
  'workouts',
  'bodyWeights',
  'measurementSites',
  'measurements',
  'settings',
] as const satisfies readonly (keyof BackupTables)[];
