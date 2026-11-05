import type { CompletedSet } from './setValidation';
import type { DraftSegment } from './types';

const EMPTY_SEGMENT: DraftSegment = { weightKg: null, reps: null };

/** Same set as last time; beyond it, repeat the last known set. */
export function suggestSegments(index: number, lastSets: readonly CompletedSet[]): DraftSegment[] {
  const source = lastSets[index] ?? lastSets.at(-1);
  return source ? source.segments.map((segment) => ({ ...segment })) : [{ ...EMPTY_SEGMENT }];
}

export function emptySegment(): DraftSegment {
  return { ...EMPTY_SEGMENT };
}
