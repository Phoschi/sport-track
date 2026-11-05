import Dexie, { type EntityTable } from 'dexie';
import type { Exercise, Program } from '../features/program/domain/types';
import type { Workout } from '../features/workout/domain/types';
import type { BodyWeight, Measurement, MeasurementSite } from '../features/body/domain/types';
import type { SettingRecord } from '../shared/domain/settings';

export const DATABASE_NAME = 'gym-tracker';

/** Only repositories may import this. UI goes through repository interfaces. */
export class GymDatabase extends Dexie {
  exercises!: EntityTable<Exercise, 'id'>;
  programs!: EntityTable<Program, 'id'>;
  workouts!: EntityTable<Workout, 'id'>;
  bodyWeights!: EntityTable<BodyWeight, 'date'>;
  measurementSites!: EntityTable<MeasurementSite, 'id'>;
  measurements!: Dexie.Table<Measurement, [string, string]>;
  settings!: EntityTable<SettingRecord, 'key'>;

  constructor(name = DATABASE_NAME) {
    super(name);
    // Only indexed fields are listed; every other field is stored as-is.
    this.version(1).stores({
      exercises: 'id, name',
      programs: 'id',
      workouts: 'id, date, *exerciseIds',
      bodyWeights: 'date',
      measurementSites: 'id, order',
      measurements: '[date+siteId], siteId, date',
      settings: 'key',
    });
  }
}
