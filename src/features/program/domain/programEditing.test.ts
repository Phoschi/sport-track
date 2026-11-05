import { describe, expect, it } from 'vitest';
import {
  addSession,
  createSession,
  moveSession,
  nextSessionDay,
  nextSessionName,
  removeSession,
  replaceSession,
} from './programEditing';
import { program, session } from './testFixtures';

describe('nextSessionName', () => {
  it('starts at A and takes the first free letter', () => {
    expect(nextSessionName([])).toBe('A');
    expect(nextSessionName([session('1', [], 'A'), session('2', [], 'C')])).toBe('B');
  });

  it('ignores custom names and case', () => {
    expect(nextSessionName([session('1', [], 'Push'), session('2', [], ' a ')])).toBe('B');
  });

  it('falls back to a numbered name after Z', () => {
    const sessions = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((letter) => session(letter));
    expect(nextSessionName(sessions)).toBe('Séance 27');
  });
});

describe('nextSessionDay', () => {
  it('defaults to Monday, then the day after the last session, wrapping after Sunday', () => {
    expect(nextSessionDay([])).toBe(1);
    expect(nextSessionDay([{ ...session('A'), dayOfWeek: 3 }])).toBe(4);
    expect(nextSessionDay([{ ...session('A'), dayOfWeek: 7 }])).toBe(1);
  });
});

describe('session list editing', () => {
  const base = program('p', [session('A'), session('B'), session('C')]);
  const ids = (sessions: { id: string }[]) => sessions.map((item) => item.id);

  it('creates and appends a session', () => {
    const created = createSession(base, 'new');
    expect(created).toMatchObject({ id: 'new', name: 'D', exercises: [] });
    expect(ids(addSession(base, created).sessions)).toEqual(['A', 'B', 'C', 'new']);
  });

  it('replaces, removes and moves without mutating', () => {
    expect(replaceSession(base, { ...session('B'), name: 'Pull' }).sessions[1]?.name).toBe('Pull');
    expect(ids(removeSession(base, 'B').sessions)).toEqual(['A', 'C']);
    expect(ids(moveSession(base, 'C', -1).sessions)).toEqual(['A', 'C', 'B']);
    expect(moveSession(base, 'A', -1)).toBe(base);
    expect(ids(base.sessions)).toEqual(['A', 'B', 'C']);
  });
});
