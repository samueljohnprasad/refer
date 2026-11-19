// ponytail: crisis-phrase guard ported verbatim from .agents/onboarding.html. A match never blocks or
// grades the text — it keeps it and opens the help sheet. Never logged, never sent to analytics.
const CRISIS = /\b((kill|hurt|cut)(ing)? myself|kms|end (my life|it all)|wanna die|want(ed)? to die|wish i (was|were) dead|better off (dead|without me)|suicid\w*|self[- ]?harm\w*|overdos\w*|no reason to live|can'?t go on|can ?not go on|do(n'?t| not) want to be here)\b/i;

export function matchesCrisis(text: string): boolean {
  return CRISIS.test(text.replace(/[’‘]/g, "'"));
}
