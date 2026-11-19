// ponytail: direct port of thought-catcher.html's WORD(v) label scale (0-10 believability).
export function WORD(v: number): string {
  if (v === 0) return 'Not at all';
  if (v <= 3) return 'A little';
  if (v <= 6) return 'Partly';
  if (v <= 9) return 'Mostly';
  return 'Completely';
}

export const REALITY_SAID: Record<'YES' | 'NOT SURE' | 'NO', string> = {
  YES: 'It still feels true.',
  'NOT SURE': 'You weren’t sure yet.',
  NO: 'It doesn’t fully hold up.',
};

export const STARTERS = ['It’s possible that ', 'Even though ', 'I don’t know yet if ', 'A kinder way to see it: '];

/** Maps the wizard's continuous 0-10 believability to onboarding's 0-4 BELIEF_OPTIONS bucket. */
export function toBeliefBucket(intensity: number): number {
  return Math.max(0, Math.min(4, Math.round(intensity / 2.5)));
}

export interface BelievabilityChange {
  headline: string;
  sub: string;
  /** post − before: negative means it feels less believable */
  delta: number;
}

/** What the summary says about how the believability moved — never a grade. */
export function describeChange(before: number, after: number): BelievabilityChange {
  const delta = after - before;
  const a = WORD(before);
  const b = WORD(after);
  const lw = b.toLowerCase();
  if (delta < 0) {
    return { delta, headline: 'It feels less believable now.', sub: a !== b ? `From ${a.toLowerCase()} to ${lw}, after you checked it.` : `Still ${lw}, a little less than before.` };
  }
  if (delta === 0) {
    return { delta, headline: 'It feels about as believable.', sub: 'That’s okay. You still paused and checked it.' };
  }
  return { delta, headline: 'It feels more believable right now.', sub: 'Looking closely can do that for a while. You can come back to it later.' };
}

/** The live line under the second rating. */
export function compareLine(before: number, after: number): string {
  const a = WORD(before);
  const b = WORD(after);
  if (after < before) return a !== b ? `Less believable than before: ${a} to ${b.toLowerCase()}.` : 'A little less believable than before.';
  if (after === before) return `Same as before: ${b}.`;
  return a !== b ? `More believable than before: ${a} to ${b.toLowerCase()}.` : 'A little more believable than before.';
}
