// AD-21: rotation by arithmetic on the entry ordinal, so the no-repeat rules hold by construction.
// ordinal = count of rung-3 entries before this sitting.
export type StemId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ExampleId = 1 | 2 | 3 | 4;
const STEM_COUNT = 8;
const EXAMPLE_COUNT = 4;
const STEMS_PER_ENTRY = 3;

const clean = (ordinal: number): number => (Number.isFinite(ordinal) ? Math.max(0, Math.floor(ordinal)) : 0);

/** Three of the eight stem numbers (1-8). Consecutive ordinals share none, so never the same three. */
export function pickStems(ordinal: number): StemId[] {
  const start = clean(ordinal) * STEMS_PER_ENTRY;
  return Array.from({ length: STEMS_PER_ENTRY }, (_, i) => ((start + i) % STEM_COUNT) + 1 as StemId);
}

/** One of the four fair-thought example numbers (1-4); never repeats on consecutive ordinals. */
export function pickExample(ordinal: number): ExampleId {
  return ((clean(ordinal) % EXAMPLE_COUNT) + 1) as ExampleId;
}
