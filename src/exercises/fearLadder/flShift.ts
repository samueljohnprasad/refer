// ponytail: the summary's honest wording (.agents/fear-ladder.html): "lower" only when the number really
// dropped, "higher" when it did not. Pure; no UI.

export function shiftCopy(before: number, now: number): { verdict: string; note: string } {
  const diff = before - now;
  if (diff < 0) {
    return { verdict: `${-diff} higher`, note: "Harder than you expected. You stayed anyway, which is what counts. Repeat this rung before you climb." };
  }
  if (diff === 0) {
    return { verdict: "No change", note: "Same as you expected. Repeat this rung until it eases, then move up." };
  }
  return {
    verdict: `${diff} lower`,
    note: diff >= 3
      ? "Much easier than you predicted. Your brain just learned this is safer than it feared."
      : "A little easier than you predicted. Keep going and it keeps easing.",
  };
}

/** What to do next: climb only once the picked rung is low enough and a harder one exists. */
export function nextLine(now: number, upRung: string | undefined): string {
  return now <= 3 && upRung
    ? `Your anxiety is low enough to try “${upRung}” next.`
    : "Repeat this rung a few times, until it drops to about 3, then climb.";
}
