import type { RepRange } from './types';

const MAX_REPS = 100;
const RANGE_PATTERN = /^(\d+)(?:\s*[-–]\s*(\d+))?$/;

/** Accepts "8" or "4-6". Returns null for empty, zero, reversed or non-numeric input. */
export function parseRepRange(input: string): RepRange | null {
  const match = RANGE_PATTERN.exec(input.trim());
  if (!match) return null;
  const min = Number(match[1]);
  const max = match[2] === undefined ? min : Number(match[2]);
  if (min < 1 || max < min || max > MAX_REPS) return null;
  return { min, max };
}

export function formatRepRange({ min, max }: RepRange): string {
  return min === max ? String(min) : `${min}-${max}`;
}
