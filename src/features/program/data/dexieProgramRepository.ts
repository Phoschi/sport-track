import { liveQuery } from 'dexie';
import type { GymDatabase } from '../../../db/database';
import { createId } from '../../../shared/domain/id';
import { EmptyNameError, MainProgramDeletionError } from '../domain/errors';
import { canDeleteProgram } from '../domain/mainProgram';
import type { Program } from '../domain/types';
import type { ProgramRepository } from './ProgramRepository';

const MAIN_PROGRAM_KEY = 'mainProgramId';

export function createDexieProgramRepository(database: GymDatabase): ProgramRepository {
  async function readMainProgramId(): Promise<string | undefined> {
    const record = await database.settings.get(MAIN_PROGRAM_KEY);
    return record?.value;
  }

  function setMain(id: string): Promise<void> {
    return database.settings.put({ key: MAIN_PROGRAM_KEY, value: id }).then(() => undefined);
  }

  function cleanName(name: string): string {
    const cleaned = name.trim();
    if (cleaned === '') throw new EmptyNameError();
    return cleaned;
  }

  return {
    watchAll: () => liveQuery(() => database.programs.toCollection().sortBy('createdAt')),
    watchById: (id) => liveQuery(async () => (await database.programs.get(id)) ?? null),
    watchMainProgramId: () => liveQuery(readMainProgramId),

    create: (name) =>
      database.transaction('rw', database.programs, database.settings, async () => {
        const program: Program = { id: createId(), name: cleanName(name), createdAt: new Date().toISOString(), sessions: [] };
        await database.programs.add(program);
        if ((await readMainProgramId()) === undefined) await setMain(program.id);
        return program;
      }),

    save: async (program) => {
      await database.programs.put({ ...program, name: cleanName(program.name) });
    },

    delete: (id) =>
      database.transaction('rw', database.programs, database.settings, async () => {
        if (!canDeleteProgram(id, await readMainProgramId())) throw new MainProgramDeletionError();
        await database.programs.delete(id);
      }),

    setMain,
  };
}
