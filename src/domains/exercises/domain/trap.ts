// Trap choice rules (AD-15): no React, no I/O, no clock read.
import type { CognitiveDistortionKey } from '../../../screens/ThoughtReframingScreen/types';
import type { TrapType } from '../../onboarding/domain/enums';

export type TrapChoice = CognitiveDistortionKey | 'not_sure' | 'none';
export type TrapEscape = Extract<TrapChoice, 'not_sure' | 'none'>;

/** Label-table order; ties in `rankTraps` and the padding of the chip row follow it. */
export const TRAP_KEYS: readonly CognitiveDistortionKey[] = [
  'all_or_nothing', 'catastrophizing', 'mind_reading', 'overgeneralizing', 'personalizing',
  'filtering', 'should_statements', 'fortune_telling', 'emotional_reasoning', 'labeling',
];

/** The one label table: i18n keys in the `exercises` namespace. */
export const TRAP_LABEL_KEYS = {
  all_or_nothing: 'thoughtCatcher.trapName.all_or_nothing',
  catastrophizing: 'thoughtCatcher.trapName.catastrophizing',
  mind_reading: 'thoughtCatcher.trapName.mind_reading',
  overgeneralizing: 'thoughtCatcher.trapName.overgeneralizing',
  personalizing: 'thoughtCatcher.trapName.personalizing',
  filtering: 'thoughtCatcher.trapName.filtering',
  should_statements: 'thoughtCatcher.trapName.should_statements',
  fortune_telling: 'thoughtCatcher.trapName.fortune_telling',
  emotional_reasoning: 'thoughtCatcher.trapName.emotional_reasoning',
  labeling: 'thoughtCatcher.trapName.labeling',
  not_sure: 'thoughtCatcher.trapNotSure',
  none: 'thoughtCatcher.trapNone',
} as const satisfies Record<TrapChoice, string>;

export const trapDefinitionKey = (key: CognitiveDistortionKey) => `thoughtCatcher.trapDefinition.${key}` as const;

const FROM_TRAP_TYPE: Record<`${TrapType}`, TrapChoice> = {
  mind_reading: 'mind_reading',
  overgeneralizing: 'overgeneralizing',
  catastrophizing: 'catastrophizing',
  labeling: 'labeling',
  fortune_telling: 'fortune_telling',
  all_or_nothing: 'all_or_nothing',
  should: 'should_statements',
};

/** The only place the older `TrapType` is read. Values already a `TrapChoice` pass through; unknowns map to undefined. */
export function fromTrapType(value: string | null | undefined): TrapChoice | undefined {
  if (!value) return undefined;
  if (value in FROM_TRAP_TYPE) return FROM_TRAP_TYPE[value as `${TrapType}`];
  return value in TRAP_LABEL_KEYS ? (value as TrapChoice) : undefined;
}

/** Trap keys by pick count desc, ties by table order; escapes and unknown values are dropped. */
export function rankTraps(rows: ReadonlyArray<{ response?: { trap?: string } | null }>): CognitiveDistortionKey[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const t = r.response?.trap;
    if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return TRAP_KEYS.filter((k) => counts.has(k)).sort((a, b) => counts.get(b)! - counts.get(a)!);
}

/** The first row of chips is the three most-picked traps, padded from table order; `rest` sits behind "More". */
export function splitTraps(picks: readonly CognitiveDistortionKey[]): { top: CognitiveDistortionKey[]; rest: CognitiveDistortionKey[] } {
  const top = [...picks, ...TRAP_KEYS.filter((k) => !picks.includes(k))].slice(0, 3);
  return { top, rest: TRAP_KEYS.filter((k) => !top.includes(k)) };
}
