import { formatDecimal } from '../../../shared/domain/formatNumber';
import type { SetSegment } from './types';

/** "60kg × 8", or "50/45kg × 3+3" for a set with load changes. */
export function formatSet(segments: readonly SetSegment[]): string {
  const weights = segments.map((segment) => formatDecimal(segment.weightKg)).join('/');
  const reps = segments.map((segment) => segment.reps).join('+');
  return `${weights}kg × ${reps}`;
}
