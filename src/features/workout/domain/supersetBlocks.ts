type Linkable = { planned: { supersetWithNext: boolean } };

/** Consecutive exercises linked by supersetWithNext form one block. */
export function groupSupersetBlocks<T extends Linkable>(exercises: readonly T[]): T[][] {
  const blocks: T[][] = [];
  let linkedToPrevious = false;
  for (const exercise of exercises) {
    const current = blocks.at(-1);
    if (linkedToPrevious && current) current.push(exercise);
    else blocks.push([exercise]);
    linkedToPrevious = exercise.planned.supersetWithNext;
  }
  return blocks;
}
