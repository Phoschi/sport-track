export type Direction = -1 | 1;

/** Swaps the item at `index` with its neighbor. Returns null when out of bounds. */
export function swapAdjacent<T>(items: readonly T[], index: number, direction: Direction): T[] | null {
  const target = index + direction;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return null;
  const result = [...items];
  [result[index], result[target]] = [result[target] as T, result[index] as T];
  return result;
}
