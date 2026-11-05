import { describe, expect, it } from 'vitest';
import {
  addPlannedExercise,
  movePlannedExercise,
  removePlannedExercise,
  toggleSuperset,
  updatePlannedExercise,
} from './sessionEditing';
import { planned, session } from './testFixtures';
import type { SessionTemplate } from './types';

/** "a>b c" means a is in superset with b, c is alone. */
const layout = (template: SessionTemplate) =>
  template.exercises.map((exercise) => exercise.id + (exercise.supersetWithNext ? '>' : ' ')).join('').trim();

describe('addPlannedExercise', () => {
  it('appends at the end', () => {
    expect(layout(addPlannedExercise(session('A', [planned('a')]), planned('b')))).toBe('a b');
  });

  it('never leaves a superset flag on the last exercise', () => {
    expect(layout(addPlannedExercise(session('A'), planned('a', true)))).toBe('a');
  });
});

describe('updatePlannedExercise', () => {
  it('replaces the matching exercise', () => {
    const updated = updatePlannedExercise(session('A', [planned('a')]), { ...planned('a'), sets: 5 });
    expect(updated.exercises[0]?.sets).toBe(5);
  });
});

describe('toggleSuperset', () => {
  it('links and unlinks with the next exercise', () => {
    const linked = toggleSuperset(session('A', [planned('a'), planned('b')]), 'a');
    expect(layout(linked)).toBe('a>b');
    expect(layout(toggleSuperset(linked, 'a'))).toBe('a b');
  });

  it('ignores the last exercise', () => {
    expect(layout(toggleSuperset(session('A', [planned('a'), planned('b')]), 'b'))).toBe('a b');
  });

  it('allows chains', () => {
    expect(layout(session('A', [planned('a', true), planned('b', true), planned('c')]))).toBe('a>b>c');
  });
});

describe('removePlannedExercise', () => {
  it('unlinks the exercise above so it does not pair with a new neighbor', () => {
    const template = session('A', [planned('a', true), planned('b'), planned('c')]);
    expect(layout(removePlannedExercise(template, 'b'))).toBe('a c');
  });

  it('keeps unrelated supersets', () => {
    const template = session('A', [planned('a', true), planned('b'), planned('c', true), planned('d')]);
    expect(layout(removePlannedExercise(template, 'a'))).toBe('b c>d');
  });

  it('ignores unknown ids', () => {
    const template = session('A', [planned('a')]);
    expect(removePlannedExercise(template, 'zzz')).toBe(template);
  });
});

describe('movePlannedExercise', () => {
  it('moves down and unlinks every pair that changes', () => {
    const template = session('A', [planned('a', true), planned('b', true), planned('c', true), planned('d')]);
    expect(layout(movePlannedExercise(template, 'b', 1))).toBe('a c b d');
  });

  it('moves up and unlinks every pair that changes', () => {
    const template = session('A', [planned('a', true), planned('b', true), planned('c'), planned('d')]);
    expect(layout(movePlannedExercise(template, 'c', -1))).toBe('a c b d');
  });

  it('keeps distant supersets', () => {
    const template = session('A', [planned('a'), planned('b'), planned('c', true), planned('d')]);
    expect(layout(movePlannedExercise(template, 'b', -1))).toBe('b a c>d');
  });

  it('does nothing at the edges', () => {
    const template = session('A', [planned('a'), planned('b')]);
    expect(movePlannedExercise(template, 'a', -1)).toBe(template);
    expect(movePlannedExercise(template, 'b', 1)).toBe(template);
  });
});
