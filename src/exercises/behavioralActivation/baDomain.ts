// ponytail: the prototype's wording rules (.agents/behavioral-activation.html) as pure functions —
// verdict, the guess-vs-felt line, the "higher/lower than before" note, and what is planned next.
import type { BehavioralActivationResponse as R } from "@/src/types/exerciseFlow";
import { MOOD_WORD, isPlanned } from "./activities";

export const RATES = [
  { id: "enjoyment", label: "Enjoyment", exp: "expectedEnjoyment", got: "actualEnjoyment" },
  { id: "accomplishment", label: "Accomplishment", exp: "expectedAccomplishment", got: "actualAccomplishment" },
] as const;

/** Mood scale 0..10 → how heavy the cloud is (1 = heaviest). */
export const heat = (mood: number): number => (10 - mood) / 10;

export function moodVerdict(before: number, after: number): { title: string; sub: string } {
  const a = MOOD_WORD(before).toLowerCase();
  const b = MOOD_WORD(after).toLowerCase();
  if (after > before)
    return { title: "Your mood is higher now.", sub: a !== b ? `From ${a} to ${b} after doing something.` : "A little higher after doing something." };
  if (after === before) return { title: "Your mood stayed about the same.", sub: "That’s okay. One try is one data point." };
  return { title: "Your mood is lower right now.", sub: "That can happen. One try is one data point. A smaller step might feel easier next time." };
}

export function moodComparison(before: number, now: number): string {
  const a = MOOD_WORD(before);
  const b = MOOD_WORD(now);
  if (now === before) return `Same as before: ${b}.`;
  const word = now > before ? "Higher" : "Lower";
  return a !== b ? `${word} than before: ${a} to ${b.toLowerCase()}.` : `A little ${word.toLowerCase()} than before.`;
}

export function feelComparison(r: R): string {
  const dp = r.actualEnjoyment - r.expectedEnjoyment;
  const dm = r.actualAccomplishment - r.expectedAccomplishment;
  if (dp > 0 && dm < 0) return "More enjoyable, less of a win than you guessed.";
  if (dp < 0 && dm > 0) return "Less enjoyable, more of a win than you guessed.";
  if (dp + dm > 0)
    return `It felt better than you guessed.${r.mood <= 3 ? " People often expect less when mood is low, so it’s worth testing again." : ""}`;
  if (dp + dm < 0) return "Lower than you guessed this time. One try is one data point, not the pattern.";
  return "About what you guessed.";
}

/** Next planned activity other than the one just done, counted from `today` (0 = Monday). */
export function nextUp(r: R, today: number): string | undefined {
  const away = (k: string) => (r.plans[k]!.day! - today + 7) % 7;
  return r.activities
    .filter((k) => k !== r.tryNow && isPlanned(r, k))
    .sort((a, b) => away(a) - away(b) || r.plans[a]!.time! - r.plans[b]!.time!)[0];
}

export const mondayFirstToday = (d = new Date()): number => (d.getDay() + 6) % 7;
