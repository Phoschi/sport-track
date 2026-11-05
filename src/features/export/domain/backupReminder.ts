import { daysBetween, toParisDate } from '../../../shared/domain/parisDate';

export const BACKUP_REMINDER_DAYS = 7;

export type BackupAge = { daysSinceExport: number | null; isOverdue: boolean };

/** Overdue when no export was ever made, or the last one is more than 7 calendar days old. */
export function backupAge(lastExportAt: string | undefined, now: Date): BackupAge {
  if (lastExportAt === undefined) return { daysSinceExport: null, isOverdue: true };
  const days = daysBetween(toParisDate(new Date(lastExportAt)), toParisDate(now));
  return { daysSinceExport: days, isOverdue: days > BACKUP_REMINDER_DAYS };
}
