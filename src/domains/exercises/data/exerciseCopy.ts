// ponytail: prototype-only chat-picker copy (reply/why) from .agents/exercises.html's EX array,
// layered over exerciseRegistry.ts rather than editing its schema — mirrors how useHomeScene wraps
// ReflectionData instead of touching its shape.
//
// `last` (resume) copy is prototype-only demo text and is skipped: the real app drives
// "pick up again" from live data (useRecentExercises / useRecentPracticeCompletion).
import type { ExerciseCategory, ExerciseType } from '@/src/types/exerciseFlow';
import type { ReplyGlyphKind } from '../ui/presentation/components/ExerciseArt';

export interface ExerciseReplyCopy {
  glyph: ReplyGlyphKind;
  reply: string;
  why: string;
}

export const EXERCISE_REPLY_COPY: Partial<Record<ExerciseType, ExerciseReplyCopy>> = {
  thought_reframing: {
    glyph: 'loop',
    reply: 'A thought keeps going round',
    why: 'Thoughts on a loop loosen once they are written down and checked against the facts.',
  },
  abc_analysis: {
    glyph: 'sting',
    reply: 'Something happened and it stung',
    why: 'The sting usually comes from the belief in the middle, not the event itself. We will find it.',
  },
  behavioral_activation: {
    glyph: 'empty',
    reply: 'I have no energy for anything',
    why: 'Waiting to feel like it keeps mood low. One small thing, tried and rated, shows what actually helps.',
  },
  fear_ladder: {
    glyph: 'avoid',
    reply: 'I keep avoiding something',
    why: 'Avoiding makes the fear bigger. We will make it small steps and try the easiest one.',
  },
};

export const AUTO_FALLBACK: ExerciseReplyCopy = {
  glyph: 'unsure',
  reply: 'Not sure. Pick one for me',
  why: 'Nothing to name yet? That is fine. This one is short and a gentle way in.',
};

/** One line under each library category heading (.agents/exercises.html's BLURB). */
export const CATEGORY_BLURB: Record<ExerciseCategory, string> = {
  cbt_core: 'Catch a thought and weigh it fairly',
  mindfulness: 'Settle your body and your attention',
  anxiety: 'Face a worry at its own pace',
  overthinking: 'Step out of the loop',
};

/** Exercises that wear the "New" badge. */
export const NEW_EXERCISE_TYPES: ReadonlySet<ExerciseType> = new Set<ExerciseType>(["behavioral_activation", "fear_ladder"]);
