import { describe, expect, it } from 'vitest';
import { collectProgrammedExerciseIds, isNotTrainedAnymore } from './exerciseStatus';
import { canDeleteProgram } from './mainProgram';
import { planned, program, session } from './testFixtures';

const programs = [
  program('p1', [session('A', [planned('1', false, 'squat')]), session('B', [planned('2', false, 'row')])]),
  program('p2', [session('A', [planned('3', false, 'squat')])]),
];

describe('collectProgrammedExerciseIds', () => {
  it('collects ids across every session of every program', () => {
    expect([...collectProgrammedExerciseIds(programs)].sort()).toEqual(['row', 'squat']);
  });
});

describe('isNotTrainedAnymore', () => {
  it('is false while any program session contains the exercise', () => {
    expect(isNotTrainedAnymore('row', programs)).toBe(false);
  });

  it('is true when no program contains it, including with no programs at all', () => {
    expect(isNotTrainedAnymore('bench', programs)).toBe(true);
    expect(isNotTrainedAnymore('row', [])).toBe(true);
  });
});

describe('canDeleteProgram', () => {
  it('refuses the main program only', () => {
    expect(canDeleteProgram('p1', 'p1')).toBe(false);
    expect(canDeleteProgram('p2', 'p1')).toBe(true);
    expect(canDeleteProgram('p1', undefined)).toBe(true);
  });
});
