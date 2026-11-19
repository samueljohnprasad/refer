// ponytail: the wizard's step order, progress and validity rules — pure, matching thought-catcher.html's `steps`.
import { words } from './words';
import { withoutStarter } from './text';
import type { ThoughtCatcherDraft } from './types';

export type StepId = 'intro' | 'thought' | 'trap' | 'stepUp' | 'balanced' | 'rate2' | 'summary';

export const STEP_ORDER: readonly StepId[] = ['intro', 'thought', 'trap', 'stepUp', 'balanced', 'rate2', 'summary'];
const STAGES: readonly (readonly StepId[])[] = [['thought'], ['trap'], ['balanced', 'rate2']];

export const STAGE_NAMES = ['Thought', 'Trap', 'Fairer thought'] as const;

export type StepUpChoice = 'write' | 'stop' | null;

/** The step-up row is offered once; "None of these" and a decline both end at the summary. */
export function nextStep(step: StepId, trap: ThoughtCatcherDraft['trap'], choice: StepUpChoice): StepId {
  if (step === 'trap') return trap === 'none' || choice === 'stop' ? 'summary' : choice === 'write' ? 'balanced' : 'stepUp';
  return STEP_ORDER[STEP_ORDER.indexOf(step) + 1];
}

/** The step-up row is not shown again: Back from the fair step lands on the trap; from the summary it returns to the trap (or nowhere once checked). */
export function prevStep(step: StepId, checked: boolean): StepId | null {
  if (step === 'summary') return checked ? null : 'trap';
  if (step === 'balanced') return 'trap';
  return STEP_ORDER[STEP_ORDER.indexOf(step) - 1] ?? null;
}

export type WritingKey = 'thought' | 'balanced';

export const WRITING_RULES: Record<WritingKey, { need: number; hint: string; exempt: boolean }> = {
  thought: { need: 1, hint: 'A few words is enough.', exempt: true },
  balanced: { need: 2, hint: 'A short sentence is enough.', exempt: false },
};

export function isWritingStep(step: StepId): step is WritingKey {
  return step === 'thought' || step === 'balanced';
}

export function writingIsValid(key: WritingKey, text: string): boolean {
  const rule = WRITING_RULES[key];
  return words(rule.exempt ? text : withoutStarter(text)) >= rule.need;
}

export function canContinue(step: StepId, draft: ThoughtCatcherDraft): boolean {
  if (step === 'trap') return draft.trap !== null;
  return isWritingStep(step) ? writingIsValid(step, draft[step]) : true;
}

/** Index of the stage the step belongs to; the fair thought stage once the flow is past it. */
export function stageIndexOf(step: StepId): number {
  const i = STAGES.findIndex((s) => s.includes(step));
  return i === -1 ? STAGES.length - 1 : i;
}

/** Fill (0-100) of each stage segment. */
export function stageProgress(step: StepId, checked = false): number[] {
  if (step === 'intro') return [0, 0, 0];
  if (step === 'stepUp') return [100, 100, 0];
  if (step === 'summary') return [100, 100, checked ? 100 : 0];
  const current = STAGES.findIndex((s) => s.includes(step));
  return STAGES.map((steps, g) => {
    if (current > g) return 100;
    if (current < g) return 0;
    return Math.round(((steps.indexOf(step) + 1) / steps.length) * 100);
  });
}

export function nextLabel(step: StepId): string {
  if (step === 'intro') return 'Begin';
  if (step === 'summary') return 'Done';
  return 'Continue';
}
