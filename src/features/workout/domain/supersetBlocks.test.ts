import { describe, expect, it } from 'vitest';
import { groupSupersetBlocks } from './supersetBlocks';

const item = (id: string, supersetWithNext = false) => ({ id, planned: { supersetWithNext } });
const ids = (blocks: { id: string }[][]) => blocks.map((block) => block.map((entry) => entry.id).join('+'));

describe('groupSupersetBlocks', () => {
  it('groups linked exercises, including chains', () => {
    expect(ids(groupSupersetBlocks([item('a'), item('b', true), item('c'), item('d', true), item('e', true), item('f')]))).toEqual([
      'a',
      'b+c',
      'd+e+f',
    ]);
  });

  it('handles empty input and a dangling flag on the last exercise', () => {
    expect(groupSupersetBlocks([])).toEqual([]);
    expect(ids(groupSupersetBlocks([item('a', true)]))).toEqual(['a']);
  });
});
