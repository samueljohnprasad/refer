/**
 * Types for the CBT Gratitude Reframe exercise.
 */

import type { EmotionName } from '../ThoughtReframingScreen/types';

// ─── Step Flow ──────────────────────────────────────────────────────
export type GratitudeStep =
  | 'intro'
  | 'mood'
  | 'prompts'
  | 'reflection'
  | 'reevaluate'
  | 'summary';

// ─── Form State ─────────────────────────────────────────────────────
export interface GratitudeFormState {
  /** The single emotion the user is feeling right now */
  currentMood: EmotionName | null;
  /** Initial intensity (0–10) */
  moodIntensity: number;
  /** The gratitude prompt the user chose (AI or custom) */
  selectedPrompt: string;
  /** 1–3 gratitude entries the user writes */
  gratitudeEntries: string[];
  /** Re-evaluated intensity after reflection (0–10) */
  finalMoodIntensity: number;
}

// ─── Reducer Actions ────────────────────────────────────────────────
export type GratitudeAction =
  | { type: 'SET_MOOD'; payload: EmotionName }
  | { type: 'SET_MOOD_INTENSITY'; payload: number }
  | { type: 'SET_SELECTED_PROMPT'; payload: string }
  | { type: 'ADD_GRATITUDE_ENTRY'; payload: string }
  | { type: 'REMOVE_GRATITUDE_ENTRY'; payload: number }
  | { type: 'UPDATE_GRATITUDE_ENTRY'; payload: { index: number; text: string } }
  | { type: 'SET_FINAL_MOOD_INTENSITY'; payload: number }
  | { type: 'RESET' };

// ─── Supabase Row ───────────────────────────────────────────────────
export interface GratitudeEntry {
  id: string;
  user_id: string;
  current_mood: EmotionName;
  initial_intensity: number;
  final_intensity: number;
  selected_prompt: string;
  gratitude_entries: string[];
  completed: boolean;
  created_at: string;
  selected_date: string;
}
