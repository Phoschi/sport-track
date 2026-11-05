import { describe, expect, it } from 'vitest';
import { cleanExerciseName, findExerciseByName, normalizeExerciseName } from './exerciseName';
import type { Exercise } from './types';

const exercise = (id: string, name: string): Exercise => ({ id, name, createdAt: '' });

describe('normalizeExerciseName', () => {
  it('ignores case, accents and extra spaces', () => {
    expect(normalizeExerciseName('  Développé   Couché ')).toBe('developpe couche');
    expect(normalizeExerciseName('EXTENSION TRICEPS (HALTÈRE)')).toBe('extension triceps (haltere)');
  });
});

describe('cleanExerciseName', () => {
  it('keeps case and accents but trims spaces', () => {
    expect(cleanExerciseName('  Curl   marteau ')).toBe('Curl marteau');
  });
});

describe('findExerciseByName', () => {
  const catalog = [exercise('1', 'Curl marteau haltère'), exercise('2', 'Squat')];

  it('finds a duplicate despite different spelling', () => {
    expect(findExerciseByName(catalog, 'curl  MARTEAU haltere')?.id).toBe('1');
  });

  it('ignores the exercise being renamed', () => {
    expect(findExerciseByName(catalog, 'Squat', '2')).toBeUndefined();
    expect(findExerciseByName(catalog, 'Squat', '1')?.id).toBe('2');
  });

  it('returns undefined when nothing matches', () => {
    expect(findExerciseByName(catalog, 'Curl')).toBeUndefined();
  });
});
