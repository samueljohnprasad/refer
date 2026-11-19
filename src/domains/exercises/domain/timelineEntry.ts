// ponytail: pure derivation rules for one My Log entry, matching .agents/exercises.html's `entry()`
// — the user's own words stay theirs (`.arc`), felt-intensity stays in words not numbers (`note()`).
// No JSX, no hooks, no I/O: domain layer only decides WHAT the card says.

export enum FeltAmount {
  VeryMuch = 'very much',
  ALot = 'a lot',
  Somewhat = 'somewhat',
  ALittle = 'a little',
}

export interface ThoughtArcModel {
  fromLabel: string;
  fromText: string;
  toLabel?: string;
  toText?: string;
}

export interface EmotionFelt {
  emotion: string;
  amount: FeltAmount;
}

export interface TimelineNoteModel {
  feltEmotions: readonly EmotionFelt[];
  trapTags: readonly string[];
}

export function describeIntensity(intensity: number): FeltAmount {
  if (intensity >= 9) return FeltAmount.VeryMuch;
  if (intensity >= 7) return FeltAmount.ALot;
  if (intensity >= 4) return FeltAmount.Somewhat;
  return FeltAmount.ALittle;
}

/** The "was → now" quoted pair, only when there's a preview thought to show. */
export function buildThoughtArc(args: {
  previewLabel?: string;
  previewText?: string;
  expandedLabel?: string;
  expandedText?: string;
}): ThoughtArcModel | null {
  if (!args.previewText) return null;
  return {
    fromLabel: args.previewLabel ?? 'You thought',
    fromText: args.previewText,
    toLabel: args.expandedText ? (args.expandedLabel ?? 'You landed on') : undefined,
    toText: args.expandedText,
  };
}

/** The one-sentence "you felt X, trap was Y" note — null when there's nothing to say. */
export function buildTimelineNote(
  emotions?: ReadonlyArray<{ emotion: string; intensity: number }>,
  tags?: ReadonlyArray<string>,
): TimelineNoteModel | null {
  const feltEmotions = (emotions ?? []).map((e) => ({ emotion: e.emotion, amount: describeIntensity(e.intensity) }));
  const trapTags = tags ?? [];
  if (feltEmotions.length === 0 && trapTags.length === 0) return null;
  return { feltEmotions, trapTags };
}

export enum MoveTone {
  Helped = 'helped',
  Flat = 'flat',
  Against = 'against',
}

const LOWER_IS_BETTER = /distress|worry|anxi|stress|fear|anger|tension/i;

/** Colour follows outcome, not direction: mood up and worry down both "helped". `label` is the raw English rating key. */
export function moveTone(label: string, before: number, after: number): MoveTone {
  if (before === after) return MoveTone.Flat;
  const improved = LOWER_IS_BETTER.test(label) ? after < before : after > before;
  return improved ? MoveTone.Helped : MoveTone.Against;
}

const MS_DAY = 86_400_000;

/** "Today" / "Yesterday" / weekday inside the last week / short date after that, matching .agents/exercises.html's `dayLabel`. */
export function dayHeading(date: Date, now: Date = new Date(), locale?: string, labels = { today: 'Today', yesterday: 'Yesterday' }): string {
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const ago = Math.round((startOf(now) - startOf(date)) / MS_DAY);
  if (ago <= 0) return labels.today;
  if (ago === 1) return labels.yesterday;
  return date.toLocaleDateString(locale, ago < 7 ? { weekday: 'long' } : { weekday: 'short', month: 'short', day: 'numeric' });
}
