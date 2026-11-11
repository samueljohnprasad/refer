import { clamp } from 'lodash-es';

// ponytail: domain scoring utilizing lodash utilities
export const BELIEF_OPTIONS = [
  'Not at all',
  'A little',
  'Somewhat',
  'Mostly',
  'Completely',
] as const;

export const THOUGHT_STARTERS = [
  'I don’t actually know that yet.',
  'One moment isn’t the whole story.',
  'What would I tell a friend?',
] as const;

export function getShiftCopy(before: number, after: number): string {
  const diff = before - after;
  if (diff < 0) {
    return 'You believe it a bit more right now. You still looked at it closely.';
  }
  if (diff === 0) {
    return 'Your belief stayed the same, and you still stopped to check it.';
  }
  if (diff >= 2) {
    return 'You believe it a lot less now.';
  }
  return 'You believe it a little less. That’s room for another view.';
}

export function weighBelief(value: number): number {
  return clamp(0.2 + value * 0.15, 0.1, 0.95);
}

export function formatBeliefSummary(before: number | null, after: number | null): string {
  if (before === null) return '';
  if (before === 0) return BELIEF_OPTIONS[0];
  const beforeLabel = BELIEF_OPTIONS[before];
  if (!beforeLabel) return '';
  if (after === null || after === before) {
    return `${beforeLabel}, still`;
  }
  const afterLabel = BELIEF_OPTIONS[after];
  if (!afterLabel) return `${beforeLabel}, still`;
  return `${beforeLabel}, now ${afterLabel.toLowerCase()}`;
}
