// ponytail: pure rules for the ABC chain, matching .agents/abc-analysis.html — what the sentence says,
// how strong a feeling reads, what the three belief checks add up to. No JSX, no hooks, no I/O.

export const ABC_MAX_FEEL = 3;

export const ABC_SCENES = [
  { event: 'My manager hasn’t replied to my email since this morning', placeholder: '“They’re annoyed with me.”', thoughts: ['They’re annoyed with me.', 'I always get this wrong.'] },
  { event: 'A friend cancelled our plans an hour before', placeholder: '“They don’t really want to see me.”', thoughts: ['They don’t really want to see me.', 'I’m not a priority to anyone.'] },
] as const;

export const ABC_THOUGHT_STARTERS = ['They think I ', 'I always ', 'What if ', 'I should '] as const;
export const ABC_FAIR_STARTERS = ['It’s possible that ', 'Even though ', 'I don’t know yet if ', 'A kinder way to see it: '] as const;

export type AbcCheckKey = 'fact' | 'friend' | 'help';

export const ABC_CHECKS: ReadonlyArray<{ key: AbcCheckKey; question: string; options: readonly string[] }> = [
  { key: 'fact', question: 'Is it a fact, or a guess?', options: ['A fact', 'A guess', 'Not sure'] },
  { key: 'friend', question: 'Would you say it to a friend?', options: ['Yes', 'Not sure', 'No'] },
  { key: 'help', question: 'Does believing it help you?', options: ['Yes', 'Not sure', 'No'] },
];

const CHECK_PART: Record<AbcCheckKey, Record<string, string>> = {
  fact: { 'A fact': 'you called it a fact', 'A guess': 'you called it a guess', 'Not sure': 'you weren’t sure if it’s a fact' },
  friend: { Yes: 'you’d say it to a friend', No: 'you wouldn’t say it to a friend', 'Not sure': 'you’re not sure you’d say it to a friend' },
  help: { Yes: 'believing it helps', No: 'believing it doesn’t help', 'Not sure': 'you’re not sure it helps' },
};

export type AbcChecks = Partial<Record<AbcCheckKey, string>>;

export const capitalize = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

export function joinAnd(parts: readonly string[]): string {
  return parts.length < 2 ? (parts[0] ?? '') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

export function abcChecksSummary(checks: AbcChecks | undefined): string {
  const parts = ABC_CHECKS.filter(({ key }) => checks?.[key]).map(({ key }) => CHECK_PART[key][checks![key]!]);
  return parts.length ? capitalize(`${joinAnd(parts)}.`) : '';
}

export function nextUnansweredCheck(checks: AbcChecks | undefined): number {
  const i = ABC_CHECKS.findIndex(({ key }) => !checks?.[key]);
  return i < 0 ? ABC_CHECKS.length - 1 : i;
}

export const checksComplete = (checks: AbcChecks | undefined): boolean => ABC_CHECKS.every(({ key }) => !!checks?.[key]);

export function abcStrength(v: number): string {
  if (v === 0) return 'None';
  if (v <= 3) return 'Mild';
  if (v <= 6) return 'Medium';
  if (v <= 9) return 'Strong';
  return 'Very strong';
}

/** Strips a tapped starter so a starter alone never counts as the user's own words. */
export function ownWords(text: string): string {
  const x = text.trim();
  const starter = [...ABC_FAIR_STARTERS, ...ABC_THOUGHT_STARTERS].find((s) => x.startsWith(s.trim()));
  return starter ? x.slice(starter.trim().length) : x;
}

/** A starter goes in front of what is there; tapping never wipes the user's words. */
export function applyStarter(current: string, starter: string, all: readonly string[]): string {
  const cur = current.trim();
  const old = all.find((s) => cur.startsWith(s.trim()));
  const rest = old ? cur.slice(old.trim().length).trim() : cur;
  return starter + (old || /^I\b/.test(rest) ? rest : rest.charAt(0).toLowerCase() + rest.slice(1));
}

const OPENERS = /^(My|A|An|The|We|They|He|She|It|Our|Someone|This|That|Today|Yesterday|At|In|On|After|Before|During)\b/;
const lowerOpener = (s: string) => (OPENERS.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const stripEnd = (s: string) => s.trim().replace(/[.!?]+$/, '');

export type SentenceSegment = { text: string; gap?: 'A' | 'B' | 'C'; empty?: boolean };

/** "When {A}, I thought “{B}”, and felt {C}." with every unwritten part as an empty gap. */
export function abcSentence(opts: { event: string; belief: string; feel: string; verb?: string; withFeel?: boolean }): SentenceSegment[] {
  const { event, belief, feel, verb = 'thought', withFeel = true } = opts;
  const a = lowerOpener(stripEnd(event));
  const b = stripEnd(belief);
  const out: SentenceSegment[] = [
    { text: 'When ' },
    a ? { text: a, gap: 'A' } : { text: 'A', gap: 'A', empty: true },
    { text: `, I ${verb} ` },
    ...(b ? [{ text: '“' }, { text: b, gap: 'B' as const }, { text: '”' }] : [{ text: 'B', gap: 'B' as const, empty: true }]),
  ];
  if (withFeel) out.push({ text: ', and felt ' }, feel ? { text: feel, gap: 'C' } : { text: 'C', gap: 'C', empty: true });
  out.push({ text: '.' });
  return out;
}

export function abcVerdict(pre: number, post: number): { title: string; sub: string; better: boolean } {
  const a = abcStrength(pre).toLowerCase();
  const b = abcStrength(post).toLowerCase();
  if (post < pre) return { title: 'The feeling is less strong now.', sub: a !== b ? `From ${a} to ${b}, after you checked the thought.` : `Still ${b}, a little less than before.`, better: true };
  if (post === pre) return { title: 'The feeling is about the same.', sub: 'That’s okay. Some thoughts take more than one look.', better: true };
  return { title: 'The feeling is stronger right now.', sub: 'Looking closely can do that for a while. You can come back to this later.', better: false };
}

export function abcComparison(pre: number, post: number): string {
  const a = abcStrength(pre);
  const b = abcStrength(post);
  if (post < pre) return a !== b ? `Less strong than before: ${a} to ${b.toLowerCase()}.` : 'A little less strong than before.';
  if (post === pre) return `Same as before: ${b}.`;
  return a !== b ? `Stronger than before: ${a} to ${b.toLowerCase()}.` : 'A little stronger than before.';
}
