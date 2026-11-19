// ponytail: maps a finished draft onto the app's real thought_catcher exercise entry (config.ts, schema 4),
// so it shows up in My Log and Practice stats like every other exercise.
import type { ExerciseSavePayload, ThoughtCatcherResponse } from '@/src/types/exerciseFlow';
import type { ThoughtCatcherDraft } from '../domain/types';

const CAUGHT_STEPS = ['intro', 'situation', 'automatic_thought', 'intensity', 'catcher_summary'];
const CHECKED_STEPS = [...CAUGHT_STEPS, 'is_true', 'balanced_thought', 'post_intensity', 'checker_summary'];

export const ymd = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function buildEntryPayload(draft: ThoughtCatcherDraft, now: Date = new Date()): ExerciseSavePayload {
  const response: ThoughtCatcherResponse = {
    situation: draft.situation.trim(),
    automaticThought: draft.thought.trim(),
    intensity: draft.intensity,
    ...(draft.trap && { trap: draft.trap }),
    ...(draft.checked && {
      ...(draft.post !== null && { postIntensity: draft.post }),
      isTrue: draft.isTrue,
      balancedThought: draft.balanced.trim(),
    }),
  };
  const steps = draft.checked ? CHECKED_STEPS : CAUGHT_STEPS;
  return {
    exercise_type: 'thought_catcher',
    schema_version: 4,
    status: 'completed',
    current_step: steps[steps.length - 1],
    completed_steps: steps,
    step_index: steps.length - 1,
    response,
    step_timings: {},
    selected_date: ymd(now),
  };
}
