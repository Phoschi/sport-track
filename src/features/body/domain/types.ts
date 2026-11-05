import type { IsoDate } from '../../../shared/domain/parisDate';

export type BodyWeight = { date: IsoDate; weightKg: number };

/** Deleting a site archives it so its history survives. */
export type MeasurementSite = {
  id: string;
  name: string;
  order: number;
  archivedAt?: string;
};

export type Measurement = { date: IsoDate; siteId: string; valueCm: number };

export const INITIAL_MEASUREMENT_SITE_NAMES = [
  'Cou',
  'Épaules',
  'Poitrine',
  'Bras droit',
  'Hanches',
  'Cuisse droite',
  'Mollet droit',
] as const;
