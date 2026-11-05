/** Calendar day in Europe/Paris, formatted YYYY-MM-DD. */
export type IsoDate = string;

/** 1 = Monday … 7 = Sunday (ISO 8601). */
export type IsoDayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const PARIS_TIME_ZONE = 'Europe/Paris';

// en-CA formats as YYYY-MM-DD, which avoids manual padding.
const parisDayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: PARIS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function toParisDate(instant: Date): IsoDate {
  return parisDayFormatter.format(instant);
}

// Date strings are parsed as UTC midnight so arithmetic never crosses a DST change.
function parseUtc(date: IsoDate): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  const result = parseUtc(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

export function isoDayOfWeek(date: IsoDate): IsoDayOfWeek {
  const sundayBased = parseUtc(date).getUTCDay();
  return (sundayBased === 0 ? 7 : sundayBased) as IsoDayOfWeek;
}

export function mondayOfWeek(date: IsoDate): IsoDate {
  return addDays(date, 1 - isoDayOfWeek(date));
}

export function sundayOfWeek(date: IsoDate): IsoDate {
  return addDays(mondayOfWeek(date), 6);
}

/** Whole calendar days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((parseUtc(to).getTime() - parseUtc(from).getTime()) / 86_400_000);
}
