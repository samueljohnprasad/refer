// ponytail: sentence helpers from .agents/thought-catcher.html — pure string rules, no UI.
import { STARTERS as FIXED_STARTERS } from './scoring';
import exercises from '@/src/locales/en/exercises.json';

// the eight fair-thought stems count as starters too: a stem alone is not an answer
const STARTERS = [...FIXED_STARTERS, ...Object.values(exercises.thoughtCatcher.stem)];

export const tidy = (s: string): string =>
  s.trim().replace(/^["“‘']+|["”’']+$/g, '').replace(/[.!?]+$/, '');

/** Lowercases common sentence openers only; names and "I" stay as typed. */
export const lcFirst = (s: string): string =>
  /^(My|A|An|The|We|They|He|She|It|Our|Someone|This|That|Today|Yesterday|At|In|On|After|Before|During)\b/.test(s)
    ? s[0].toLowerCase() + s.slice(1)
    : s;

export const situationPhrase = (situation: string): string => lcFirst(tidy(situation));

/** A tapped starter alone is not an answer: strip it before counting words. */
export function withoutStarter(text: string): string {
  const x = text.trim();
  const prefix = STARTERS.find((s) => x.startsWith(s.trim()));
  return prefix ? x.slice(prefix.trim().length) : x;
}

/** A starter goes in front of what is there; tapping never wipes the user's words. */
export function prependStarter(current: string, starter: string): string {
  const cur = current.trim();
  const old = STARTERS.find((s) => cur.startsWith(s.trim()));
  const rest = old ? cur.slice(old.trim().length).trim() : cur;
  return starter + (old || /^I\b/.test(rest) ? rest : rest.charAt(0).toLowerCase() + rest.slice(1));
}
