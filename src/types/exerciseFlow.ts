/**
 * Unified Exercise Flow Type System
 *
 * Single source of truth for all exercise types, configs, step definitions,
 * response shapes, and the ExerciseEntry DB row interface.
 */

import type React from "react";
import type {
  EmotionName as _EmotionName,
  EmotionRating as _EmotionRating,
  CognitiveDistortionKey as _CognitiveDistortionKey,
} from "@/src/screens/ThoughtReframingScreen/types";

// ─── Re-exports from existing Thought Reframing types ──────────────────────
// These are used across multiple exercises so we re-export for convenience.
export type {
  EmotionName,
  EmotionRating,
  CognitiveDistortionKey,
  CognitiveDistortion,
} from "@/src/screens/ThoughtReframingScreen/types";

// Internal aliases for use within this file
type EmotionName = _EmotionName;
type EmotionRating = _EmotionRating;
type CognitiveDistortionKey = _CognitiveDistortionKey;

// ─── Exercise Type — 36 exercise IDs ────────────────────────────────────────

export type ExerciseType =
  // CBT Core (7)
  | "thought_catcher"
  | "thought_reframing"
  | "gratitude_reframe"
  | "abc_analysis"
  // Mindfulness (5)
  | "box_breathing"
  | "breathing_478"
  | "grounding_54321"
  | "body_scan_pmr"
  | "mindful_breathing_1min"
  // Anxiety (4)
  | "worry_time"
  | "fear_ladder"
  | "decatastrophizing"
  | "worry_decision_tree"
  // Overthinking (4)
  | "recognizing_rumination"
  | "detached_mindfulness"
  | "attention_training";

// ─── Exercise Category ──────────────────────────────────────────────────────

export type ExerciseCategory =
  | "cbt_core"
  | "mindfulness"
  | "anxiety"
  | "overthinking";
export interface CategoryMeta {
  key: ExerciseCategory;
  label: string;
  icon: string;
  description: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    key: "cbt_core",
    label: "CBT Core",
    icon: "cbt_core",
    description: "Cognitive Behavioral Therapy fundamentals",
  },
  {
    key: "mindfulness",
    label: "Mindfulness",
    icon: "mindfulness",
    description: "Breathing, grounding & body awareness",
  },
  {
    key: "anxiety",
    label: "Anxiety",
    icon: "anxiety",
    description: "Worry management & exposure tools",
  },
  {
    key: "overthinking",
    label: "Overthinking",
    icon: "overthinking",
    description: "Break rumination & thought loops",
  },
];

/** Quick lookup by category key */
export const EXERCISE_CATEGORY_META: Record<
  ExerciseCategory,
  { label: string; icon: string; description: string }
> = Object.fromEntries(
  CATEGORY_META.map((m) => [
    m.key,
    { label: m.label, icon: m.icon, description: m.description },
  ]),
) as Record<
  ExerciseCategory,
  { label: string; icon: string; description: string }
>;

// ─── Exercise Status ────────────────────────────────────────────────────────

export type ExerciseStatus = "draft" | "in_progress" | "completed";

// ─── Breathing Pattern (for animated breathing steps) ───────────────────────

export interface BreathingPattern {
  /** Inhale duration in seconds */
  inhale: number;
  /** Hold after inhale in seconds (0 = no hold) */
  holdIn: number;
  /** Exhale duration in seconds */
  exhale: number;
  /** Hold after exhale in seconds (0 = no hold) */
  holdOut: number;
  /** Number of rounds */
  rounds: number;
  /** Visual style */
  visual: "square" | "circle" | "wave";
}

// ─── Timer Config (for timer-based steps) ───────────────────────────────────

export interface TimerStepConfig {
  type: "breathing" | "countdown" | "stopwatch";
  /** Total duration in milliseconds */
  durationMs: number;
  /** Breathing pattern (only for type === 'breathing') */
  pattern?: BreathingPattern;
  /** Whether the user can skip/fast-forward */
  skippable?: boolean;
  /** Label shown during timer */
  label?: string;
}

// ─── AI Step Config ─────────────────────────────────────────────────────────

export interface AIStepConfig<T = Record<string, any>> {
  /** Builds the prompt from the current exercise response state */
  promptBuilder: (response: T, context?: { seed: number }) => string;
  /** JSON Schema for Gemini's structured output */
  responseSchema: Record<string, any>;
  /** Model to use (defaults to 'gemini-3-flash-preview') */
  model?: string;
  /** Maximum number of AI suggestion results */
  maxResults?: number;
}

// ─── Step Props — passed to every step component ────────────────────────────

export interface StepProps<T = Record<string, any>> {
  /** The full exercise response state */
  response: T;
  /** Update response state (shallow merge) */
  onUpdate: (partial: Partial<T>) => void;
  /** Advance to next step */
  onNext: () => void;
  /** Go back to previous step */
  onBack: () => void;
  /** Close / exit the exercise */
  onClose: () => void;
  /** Whether we can go back */
  canGoBack: boolean;
  /** Whether the current step passes validation */
  isValid: boolean;
  /** Progress fraction 0–1 */
  progress: number;
  /** Current 0-indexed step index */
  stepIndex: number;
  /** Total number of steps */
  totalSteps: number;
  /** AI suggestions for this step (if any) */
  aiSuggestions?: any[];
  /** Whether AI is currently loading */
  isAiLoading?: boolean;
  /** Whether the exercise is saving */
  isSaving?: boolean;
  /** Whether this is a read-only view (completed entry) */
  readOnly?: boolean;
}

// ─── Step Definition — describes a single step in an exercise config ────────

export interface ExerciseStepDef<T = Record<string, any>> {
  /** Unique step ID (e.g., 'situation', 'automatic_thought') */
  id: string;
  /** The React component to render for this step */
  component: React.ComponentType<StepProps<T>>;
  /** Human-readable step label */
  label: string;
  /** Validation function — returns true if the step is complete */
  validate: (response: T) => boolean;
  /**
   * Dynamic next step resolver — for branching logic.
   * Returns the step ID to navigate to, or undefined for linear advance.
   */
  next?: (response: T) => string | undefined;
  /** AI configuration for this step (if AI suggestions are shown) */
  ai?: AIStepConfig<T>;
  /** Whether this step is optional (can be skipped) */
  optional?: boolean;
  /** Timer/breathing configuration for this step */
  timerConfig?: TimerStepConfig;
  /** Whether this step should be excluded from progress calculation */
  excludeFromProgress?: boolean;
  /** Override the primary button label for this step (default: 'Continue') */
  nextLabel?: string;
  /** Override the secondary button label for this step */
  secondaryLabel?: string;
  /** Hide the progress header for this step (default: false) */
  hideHeader?: boolean;
  /** Hide the action footer for this step (default: false) */
  hideFooter?: boolean;
}

// ─── Exercise Config — the full definition of an exercise ───────────────────

export interface ExerciseConfig<T = Record<string, any>> {
  /** Unique exercise type ID */
  type: ExerciseType;
  /** Category this exercise belongs to */
  category: ExerciseCategory;
  /** Display title */
  title: string;
  /** Short subtitle */
  subtitle: string;
  /** Exercise-type key resolved to a Hugeicon via exerciseIconRegistry */
  icon: string;
  /** Estimated duration string (e.g., '3-5 min') */
  duration: string;
  /** XP awarded on completion */
  xp: number;
  /** Card background color */
  backgroundColor: string;
  /** Schema version for response data migrations */
  schemaVersion: number;
  /** Ordered array of step definitions */
  steps: ExerciseStepDef<T>[];
  /** Initial empty response state */
  initialResponse: T;
  /**
   * Migrate old response data to the latest schema version.
   * Called when loading a saved entry whose schema_version < this config's schemaVersion.
   */
  migrate?: (oldResponse: any, fromVersion: number) => T;
}

// ─── Exercise Entry — Supabase row shape ────────────────────────────────────

export interface ExerciseEntry {
  id: string;
  user_id: string;
  exercise_type: ExerciseType;
  schema_version: number;
  status: ExerciseStatus;
  current_step: string;
  completed_steps: string[];
  step_index: number;
  response: Record<string, any>;
  step_timings: Record<string, number>;
  selected_date: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

// ─── Save Payload — what useExerciseFlow.getSavePayload() returns ───────────

export interface ExerciseSavePayload {
  exercise_type: ExerciseType;
  schema_version: number;
  status: ExerciseStatus;
  current_step: string;
  completed_steps: string[];
  step_index: number;
  response: Record<string, any>;
  step_timings: Record<string, number>;
  selected_date: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercise Response Types — one per exercise
// ─────────────────────────────────────────────────────────────────────────────

// ── CBT Core ────────────────────────────────────────────────────────────────

export interface ThoughtCatcherResponse {
  situation: string;
  automaticThought: string;
  intensity: number;
  postIntensity?: number;
  // Checker continuation (optional — populated if user taps "Check it")
  isTrue?: "YES" | "NOT SURE" | "NO" | null;
  balancedThought?: string;
}

export interface ThoughtReframingResponse {
  situation: string;
  automaticThought: string;
  selectedEmotions: EmotionRating[];
  selectedDistortions: CognitiveDistortionKey[];
  evidenceFor: string[];
  evidenceAgainst: string[];
  balancedThought: string;
  intensity: number;
  postIntensity?: number;
}

export interface GratitudeReframeResponse {
  currentMood: EmotionName | null;
  moodIntensity: number;
  selectedPrompt: string;
  gratitudeEntries: string[];
  finalMoodIntensity: number;
}

export interface ABCAnalysisResponse {
  activatingEvent: string;
  belief: string;
  consequenceEmotion: string;
  consequenceBehavior: string;
  alternativeBelief: string;
  newConsequence: string;
  preEmotionalIntensity: number;
  postEmotionalIntensity: number;
}

// ── Mindfulness ─────────────────────────────────────────────────────────────

export interface BoxBreathingResponse {
  preCalmRating: number;
  timerCompleted: boolean;
  postCalmRating: number;
}

export interface Breathing478Response {
  preCalmRating: number;
  timerCompleted: boolean;
  postCalmRating: number;
}

export interface Grounding54321Response {
  see: string[];
  touch: string[];
  hear: string[];
  smell: string[];
  taste: string[];
  prePresenceRating: number;
  presenceRating: number;
}

export interface BodyScanPMRResponse {
  preTensionRating: number;
  completedAreas: string[];
  postTensionRating: number;
}

export interface MindfulBreathing1MinResponse {
  preRating: number;
  wanderCount: number;
  reflection: string;
  postRating: number;
}

// ── Anxiety ─────────────────────────────────────────────────────────────────

export interface WorryTimeResponse {
  worryTimeSlot: string;
  worries: string[];
  resolvedWorries: string[];
  actionPlans: Record<string, string>;
  actionOrAcceptStatement: string;
  reflection: string;
  preAnxietyRating: number;
  postAnxietyRating: number;
}

export interface FearLadderResponse {
  fears: string[];
  rankedFears: { fear: string; rating: number }[];
  firstRung: string;
  exposurePlan: string;
  anxietyBefore: number;
  anxietyDuring: number;
  anxietyAfter: number;
  habituationInsight: string;
}

export interface DecatastrophizingResponse {
  fearedCatastrophe: string;
  probability: number;
  copingPlan: string;
  mostLikelyOutcome: string;
  perspective1Week: string;
  perspective1Month: string;
  perspective1Year: string;
  anxietyBefore: number;
  anxietyAfter: number;
}

export interface WorryDecisionTreeResponse {
  worry: string;
  canAct: "yes" | "no" | null;
  actionPlan: string;
  scheduledAction: string;
  acceptanceExercise: string;
  preAnxietyRating: number;
  postAnxietyRating: number;
}

// ── Overthinking ────────────────────────────────────────────────────────────

export interface RecognizingRuminationResponse {
  currentThoughtLoop: string;
  theme: string;
  ruminationTrigger: string;
  timeSpent: string;
  interruptTechnique: string;
  interruptCompleted: boolean;
  preRating: number;
  postRating: number;
}

export interface DetachedMindfulnessResponse {
  observedThought: string;
  preRating: number;
  labelConfirmed: boolean;
  attentionShiftCompleted: boolean;
  checkInRating: number;
  repeatOrContinue: "repeat" | "continue" | null;
}

export interface AttentionTrainingResponse {
  preRating: number;
  sound1Completed: boolean;
  sound2Completed: boolean;
  sound3Completed: boolean;
  rapidSwitchCompleted: boolean;
  expandedAttentionCompleted: boolean;
  postRating: number;
}

// ─── Discriminated Response Union ───────────────────────────────────────────
// Used to type-narrow a response based on exercise_type

export type ExerciseResponseMap = {
  thought_catcher: ThoughtCatcherResponse;
  thought_reframing: ThoughtReframingResponse;
  gratitude_reframe: GratitudeReframeResponse;
  abc_analysis: ABCAnalysisResponse;
  box_breathing: BoxBreathingResponse;
  breathing_478: Breathing478Response;
  grounding_54321: Grounding54321Response;
  body_scan_pmr: BodyScanPMRResponse;
  mindful_breathing_1min: MindfulBreathing1MinResponse;
  worry_time: WorryTimeResponse;
  fear_ladder: FearLadderResponse;
  decatastrophizing: DecatastrophizingResponse;
  worry_decision_tree: WorryDecisionTreeResponse;
  recognizing_rumination: RecognizingRuminationResponse;
  detached_mindfulness: DetachedMindfulnessResponse;
  attention_training: AttentionTrainingResponse;
};

/** Helper: get the response type for a given ExerciseType */
export type ResponseForType<T extends ExerciseType> = ExerciseResponseMap[T];

/** Union of all exercise response types */
export type ExerciseResponse = ExerciseResponseMap[ExerciseType];

// ─── Coping Card ─────────────────────────────────────────────────────────────

export interface CopingCard {
  id: string;
  user_id: string;
  exercise_type: ExerciseType;
  exercise_entry_id?: string;
  original_thought?: string;
  reframe_text: string;
  reframe_label: string;
  starred: boolean;
  archived: boolean;
  created_at: string;
}
