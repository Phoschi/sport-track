import { describe, expect, it } from 'vitest';
import { searchExercises } from './searchExercises';
import type { Exercise } from './types';

const catalog: Exercise[] = ['Curl marteau haltère', 'Curl barre', 'Rowing poulie', 'Extension triceps', 'Écarté poulie'].map(
  (name, index) => ({ id: String(index), name, createdAt: '' }),
);
const names = (results: Exercise[]) => results.map((exercise) => exercise.name);

describe('searchExercises', () => {
  it('returns everything alphabetically for an empty query', () => {
    expect(names(searchExercises(catalog, '  '))).toEqual([
      'Curl barre',
      'Curl marteau haltère',
      'Écarté poulie',
      'Extension triceps',
      'Rowing poulie',
    ]);
  });

  it('ranks name prefix before word prefix before substring', () => {
    expect(names(searchExercises(catalog, 'pou'))).toEqual(['Écarté poulie', 'Rowing poulie']);
    expect(names(searchExercises(catalog, 'r'))).toEqual(['Rowing poulie', 'Curl barre', 'Curl marteau haltère', 'Écarté poulie', 'Extension triceps']);
  });

  it('ignores accents and case', () => {
    expect(names(searchExercises(catalog, 'ECARTE'))).toEqual(['Écarté poulie']);
    expect(names(searchExercises(catalog, 'haltere'))).toEqual(['Curl marteau haltère']);
  });

  it('returns nothing when no exercise matches', () => {
    expect(searchExercises(catalog, 'squat')).toEqual([]);
  });
});
