// ponytail: pure rules for the Fear Ladder — which rung to suggest, and how far a paused run got.
// Ratings are keyed by rung text (see FearLadderResponse), so reordering or deleting never shifts them.

export const DEFAULT_RUNG_RATING = 5;

export function rungRating(ratings: Record<string, number> | undefined, rung: string): number {
  return ratings?.[rung] ?? DEFAULT_RUNG_RATING;
}

/** Rungs from easiest to hardest; ties keep the order they were typed. */
export function rungsByEase(rungs: readonly string[], ratings: Record<string, number> | undefined): string[] {
  return rungs
    .map((text, i) => ({ text, i, r: rungRating(ratings, text) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.text);
}

/** The gentlest rung that is still a real step: the easiest at 3 or above, else the easiest. */
export function suggestedRung(rungs: readonly string[], ratings: Record<string, number> | undefined): string | undefined {
  const byEase = rungsByEase(rungs, ratings);
  return byEase.find((t) => rungRating(ratings, t) >= 3) ?? byEase[0];
}

/** "Rung 2 of 5": where the picked rung sits on the ladder, or undefined until one is picked. */
export function pausedRung(response: Record<string, any> | undefined): { position: number; total: number } | undefined {
  const rungs: unknown = response?.rungs;
  const picked: unknown = response?.pickedRung;
  if (!Array.isArray(rungs) || typeof picked !== "string" || !rungs.includes(picked)) return undefined;
  return { position: rungsByEase(rungs, response?.rungRatings).indexOf(picked) + 1, total: rungs.length };
}
