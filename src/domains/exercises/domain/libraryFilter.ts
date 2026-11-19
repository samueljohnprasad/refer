// ponytail: pure rules for the Lessons library filter chips, matching .agents/exercises.html's
// FILTERS/KEEP — "Any length", "10 min or less" (by the upper end of the range), "Not tried yet".
// No JSX, no hooks, no I/O.

export enum LibraryFilter {
  All = 'all',
  Short = 'short',
  Untried = 'untried',
}

export const LIBRARY_FILTERS: ReadonlyArray<{ key: LibraryFilter; label: string }> = [
  { key: LibraryFilter.All, label: 'Any length' },
  { key: LibraryFilter.Short, label: '10 min or less' },
  { key: LibraryFilter.Untried, label: 'Not tried yet' },
];

const SHORT_MAX_MINUTES = 10;

/** "8-10 min" -> 10, "5 min" -> 5. Unparseable durations never count as short. */
export function maxMinutes(duration: string): number {
  const nums = duration.match(/\d+/g)?.map(Number);
  return nums?.length ? Math.max(...nums) : Infinity;
}

export function filterExercises<T extends { type: string; duration: string }>(
  exercises: readonly T[],
  filter: LibraryFilter,
  triedTypes: ReadonlySet<string>,
): T[] {
  switch (filter) {
    case LibraryFilter.Short:
      return exercises.filter((e) => maxMinutes(e.duration) <= SHORT_MAX_MINUTES);
    case LibraryFilter.Untried:
      return exercises.filter((e) => !triedTypes.has(e.type));
    default:
      return [...exercises];
  }
}
