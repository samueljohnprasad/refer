/**
 * Types for the CBT Thought Reframing exercise.
 */

// ─── Emotion Types ──────────────────────────────────────────────────
export type EmotionName =
  | 'anxious'
  | 'sad'
  | 'angry'
  | 'ashamed'
  | 'hopeless'
  | 'guilty'
  | 'frustrated'
  | 'fearful'
  | 'overwhelmed'
  | 'lonely';

export interface EmotionRating {
  name: EmotionName;
  initial_intensity: number;
  final_intensity: number;
}

// ─── Cognitive Distortion Types ─────────────────────────────────────
export type CognitiveDistortionKey =
  | 'all_or_nothing'
  | 'catastrophizing'
  | 'mind_reading'
  | 'overgeneralizing'
  | 'personalizing'
  | 'filtering'
  | 'should_statements'
  | 'fortune_telling'
  | 'emotional_reasoning'
  | 'labeling';

export interface CognitiveDistortion {
  key: CognitiveDistortionKey;
  label: string;
  description: string;
  example: string;
  icon: string;
}

// ─── Entry (Supabase Row) ───────────────────────────────────────────
export interface ThoughtReframingEntry {
  id: string;
  user_id: string;
  situation: string;
  automatic_thought: string;
  emotions: EmotionRating[];
  cognitive_distortions: CognitiveDistortionKey[];
  evidence_for: string[];
  evidence_against: string[];
  balanced_thought: string;
  completed: boolean;
  created_at: string;
  selected_date: string;
}

// ─── Step Flow ──────────────────────────────────────────────────────
export type ThoughtReframingStep =
  | 'intro'
  | 'situation'
  | 'automatic_thought'
  | 'emotions'
  | 'distortions'
  | 'evidence_for'
  | 'evidence_against'
  | 'balanced_thought'
  | 're_evaluate'
  | 'summary';

export interface ThoughtReframingFormState {
  situation: string;
  automaticThought: string;
  selectedEmotions: EmotionRating[];
  selectedDistortions: CognitiveDistortionKey[];
  evidenceFor: string[];
  evidenceAgainst: string[];
  balancedThought: string;
}

export type ThoughtReframingAction =
  | { type: 'SET_SITUATION'; payload: string }
  | { type: 'SET_AUTOMATIC_THOUGHT'; payload: string }
  | { type: 'TOGGLE_EMOTION'; payload: EmotionName }
  | { type: 'SET_EMOTION_INTENSITY'; payload: { name: EmotionName; intensity: number } }
  | { type: 'SET_EMOTION_FINAL_INTENSITY'; payload: { name: EmotionName; intensity: number } }
  | { type: 'TOGGLE_DISTORTION'; payload: CognitiveDistortionKey }
  | { type: 'ADD_EVIDENCE_FOR'; payload: string }
  | { type: 'REMOVE_EVIDENCE_FOR'; payload: number }
  | { type: 'ADD_EVIDENCE_AGAINST'; payload: string }
  | { type: 'REMOVE_EVIDENCE_AGAINST'; payload: number }
  | { type: 'SET_BALANCED_THOUGHT'; payload: string }
  | { type: 'RESET' };
