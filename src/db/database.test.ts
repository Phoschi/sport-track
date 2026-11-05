import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { GymDatabase } from './database';

describe('GymDatabase schema v1', () => {
  let database: GymDatabase;

  afterEach(async () => {
    await database.delete();
  });

  it('finds workouts by exercise through the multi-entry index', async () => {
    database = new GymDatabase('test-multi-entry');
    const base = { startedAt: '', note: '', sessionName: 'A', exercises: [] };
    await database.workouts.bulkAdd([
      { ...base, id: 'w1', date: '2026-11-02', exerciseIds: ['squat', 'row'] },
      { ...base, id: 'w2', date: '2026-11-04', exerciseIds: ['bench'] },
    ]);
    const withRow = await database.workouts.where('exerciseIds').equals('row').toArray();
    expect(withRow.map((workout) => workout.id)).toEqual(['w1']);
  });

  it('keys measurements by date and site', async () => {
    database = new GymDatabase('test-measurements');
    await database.measurements.put({ date: '2026-11-07', siteId: 'neck', valueCm: 37 });
    await database.measurements.put({ date: '2026-11-07', siteId: 'neck', valueCm: 38 });
    expect(await database.measurements.count()).toBe(1);
    expect((await database.measurements.get(['2026-11-07', 'neck']))?.valueCm).toBe(38);
  });
});
