import type { EmotionName } from '../../ThoughtReframingScreen/types';

// ─── Fallback Prompts ───────────────────────────────────────────────
// Used when AI generation fails or is loading.

export interface GratitudePromptOption {
  id: string;
  text: string;
  category: string;
}

/** Generic fallback prompts — mood-agnostic */
export const FALLBACK_PROMPTS: GratitudePromptOption[] = [
  {
    id: 'fb-1',
    text: 'What small moment today made you smile, even briefly?',
    category: 'moments',
  },
  {
    id: 'fb-2',
    text: 'Who is someone that made your day a little better recently?',
    category: 'people',
  },
  {
    id: 'fb-3',
    text: 'What is one thing about your body or health you can appreciate right now?',
    category: 'health',
  },
];

/** Mood-specific fallback prompts for when AI is unavailable */
export const MOOD_PROMPTS: Partial<Record<EmotionName, GratitudePromptOption[]>> = {
  anxious: [
    { id: 'anx-1', text: 'What is one thing that feels safe and stable in your life right now?', category: 'safety' },
    { id: 'anx-2', text: 'Think of a time you overcame worry — what helped?', category: 'resilience' },
    { id: 'anx-3', text: 'What small comfort can you notice around you at this moment?', category: 'present' },
  ],
  sad: [
    { id: 'sad-1', text: 'What is one kind thing someone has done for you recently?', category: 'kindness' },
    { id: 'sad-2', text: 'What is a memory that still warms your heart?', category: 'memory' },
    { id: 'sad-3', text: 'What is one part of your routine that gives you a bit of comfort?', category: 'comfort' },
  ],
  frustrated: [
    { id: 'fru-1', text: 'Despite the frustration, what is one thing that went okay today?', category: 'perspective' },
    { id: 'fru-2', text: 'What is a skill or strength you used recently, even if the result wasn\'t perfect?', category: 'strength' },
    { id: 'fru-3', text: 'Who in your life understands you and has your back?', category: 'support' },
  ],
  overwhelmed: [
    { id: 'ovw-1', text: 'What is one thing on your plate that you\'ve already handled?', category: 'progress' },
    { id: 'ovw-2', text: 'What is something simple that brings you peace — a song, a place, a person?', category: 'peace' },
    { id: 'ovw-3', text: 'What would you thank your past self for doing?', category: 'self' },
  ],
  angry: [
    { id: 'ang-1', text: 'What is something you value about yourself that anger can\'t take away?', category: 'values' },
    { id: 'ang-2', text: 'Who has shown you patience or understanding when you needed it?', category: 'patience' },
    { id: 'ang-3', text: 'What is one thing in your environment right now that feels good?', category: 'environment' },
  ],
};

/**
 * Returns mood-specific prompts if available, otherwise generic fallbacks.
 */
export const getPromptsForMood = (mood: EmotionName | null): GratitudePromptOption[] => {
  if (mood && MOOD_PROMPTS[mood]) {
    return MOOD_PROMPTS[mood]!;
  }
  return FALLBACK_PROMPTS;
};
