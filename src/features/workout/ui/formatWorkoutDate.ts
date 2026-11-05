import type { IsoDate } from '../../../shared/domain/parisDate';

const formatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

/** "jeudi 5 novembre" — the date is already a Paris calendar day. */
export function formatWorkoutDate(date: IsoDate): string {
  return formatter.format(new Date(`${date}T00:00:00Z`));
}
