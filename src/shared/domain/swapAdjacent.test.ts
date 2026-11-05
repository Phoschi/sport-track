import { describe, expect, it } from 'vitest';
import { swapAdjacent } from './swapAdjacent';

describe('swapAdjacent', () => {
  it('swaps with the next or previous item without mutating', () => {
    const items = ['a', 'b', 'c'];
    expect(swapAdjacent(items, 0, 1)).toEqual(['b', 'a', 'c']);
    expect(swapAdjacent(items, 2, -1)).toEqual(['a', 'c', 'b']);
    expect(items).toEqual(['a', 'b', 'c']);
  });

  it('returns null at the edges', () => {
    expect(swapAdjacent(['a', 'b'], 0, -1)).toBeNull();
    expect(swapAdjacent(['a', 'b'], 1, 1)).toBeNull();
    expect(swapAdjacent([], 0, 1)).toBeNull();
  });
});
