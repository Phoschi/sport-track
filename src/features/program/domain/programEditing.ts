import type { IsoDayOfWeek } from '../../../shared/domain/parisDate';
import { swapAdjacent, type Direction } from '../../../shared/domain/swapAdjacent';
import type { Program, SessionTemplate } from './types';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** First letter not already used as a session name. */
export function nextSessionName(sessions: readonly SessionTemplate[]): string {
  const used = new Set(sessions.map((session) => session.name.trim().toUpperCase()));
  const letter = [...LETTERS].find((candidate) => !used.has(candidate));
  return letter ?? `Séance ${sessions.length + 1}`;
}

/** Day after the last session's day, so a new session rarely needs its day changed. */
export function nextSessionDay(sessions: readonly SessionTemplate[]): IsoDayOfWeek {
  const last = sessions.at(-1);
  return last ? (((last.dayOfWeek % 7) + 1) as IsoDayOfWeek) : 1;
}

export function createSession(program: Program, id: string): SessionTemplate {
  return {
    id,
    name: nextSessionName(program.sessions),
    dayOfWeek: nextSessionDay(program.sessions),
    exercises: [],
  };
}

export function addSession(program: Program, session: SessionTemplate): Program {
  return { ...program, sessions: [...program.sessions, session] };
}

export function replaceSession(program: Program, updated: SessionTemplate): Program {
  return {
    ...program,
    sessions: program.sessions.map((session) => (session.id === updated.id ? updated : session)),
  };
}

export function removeSession(program: Program, sessionId: string): Program {
  return { ...program, sessions: program.sessions.filter((session) => session.id !== sessionId) };
}

export function moveSession(program: Program, sessionId: string, direction: Direction): Program {
  const index = program.sessions.findIndex((session) => session.id === sessionId);
  const sessions = swapAdjacent(program.sessions, index, direction);
  return sessions ? { ...program, sessions } : program;
}
