import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GymDatabase } from '../../../db/database';
import { EmptyNameError, MainProgramDeletionError } from '../domain/errors';
import { createDexieProgramRepository } from './dexieProgramRepository';

const firstValue = <T>(observable: { subscribe(next: (value: T) => void): { unsubscribe(): void } }) =>
  new Promise<T>((resolve) => {
    const subscription = observable.subscribe((value) => {
      resolve(value);
      queueMicrotask(() => subscription.unsubscribe());
    });
  });

describe('dexieProgramRepository', () => {
  let database: GymDatabase;
  let repository: ReturnType<typeof createDexieProgramRepository>;

  beforeEach(() => {
    database = new GymDatabase(`test-programs-${crypto.randomUUID()}`);
    repository = createDexieProgramRepository(database);
  });
  afterEach(() => database.delete());

  it('makes the first program main, not the following ones', async () => {
    const first = await repository.create('PPL');
    await repository.create('Full body');
    expect(await firstValue(repository.watchMainProgramId())).toBe(first.id);
  });

  it('switches the main program', async () => {
    await repository.create('PPL');
    const second = await repository.create('Full body');
    await repository.setMain(second.id);
    expect(await firstValue(repository.watchMainProgramId())).toBe(second.id);
  });

  it('refuses to delete the main program but deletes others', async () => {
    const main = await repository.create('PPL');
    const other = await repository.create('Full body');
    await expect(repository.delete(main.id)).rejects.toBeInstanceOf(MainProgramDeletionError);
    await repository.delete(other.id);
    expect((await firstValue(repository.watchAll())).map((program) => program.id)).toEqual([main.id]);
  });

  it('saves edits and rejects empty names', async () => {
    const created = await repository.create('PPL');
    await repository.save({ ...created, name: ' Push Pull Legs ' });
    expect((await firstValue(repository.watchById(created.id)))?.name).toBe('Push Pull Legs');
    await expect(repository.save({ ...created, name: '' })).rejects.toBeInstanceOf(EmptyNameError);
    await expect(repository.create(' ')).rejects.toBeInstanceOf(EmptyNameError);
  });
});
