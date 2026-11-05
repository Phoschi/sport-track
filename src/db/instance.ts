import { GymDatabase } from './database';

/** Single app-wide connection. Imported by repositories and the composition root only. */
export const database = new GymDatabase();
