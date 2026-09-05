/**
 * Mental Health Journey Types
 * Content JSONB shapes for mental health node types (learn, exercise, journal, quiz,
 * mood_check, chest, checkpoint, practice, ai_insight).
 *
 * These types describe the `content` JSONB column on `journey_template_nodes`
 * and the `response_data` JSONB column on `user_node_completions`.
 *
 * Also includes user streak and Insight Points ledger types.
 */

import type { SectionListItem } from "./sectionMap";

// ============================================================================
// Node Content Types (content JSONB per node_type)
// ============================================================================

// ---------------------------------------------------------------------------
// Learn Node
// ---------------------------------------------------------------------------

/** A single card in a Learn node carousel */
export interface LearnCard {
  /** Display text — max 40 words */
  text: string;
  /** Key to resolve illustration asset (image component or icon) */
  visual_key: string;
}

/** Content shape for `node_type = 'learn'` */
export interface LearnContent {
  cards: LearnCard[];
}

// ---------------------------------------------------------------------------
// Exercise Node
// ---------------------------------------------------------------------------

/** Input type for a single exercise step */
export type ExerciseInputType =
  | "text"
  | "slider"
  | "picker"
  | "multi_choice"
  | "rating";

/** A single step in an exercise wizard */
export interface ExerciseStep {
  /** Prompt/instruction displayed to the user */
  prompt: string;
  /** Input type determines the rendered input component */
  input_type: ExerciseInputType;
  /** Placeholder text for text inputs */
  placeholder?: string;
  /** Options for picker / multi_choice inputs */
  options?: string[];
  /** For multi_choice — correct answer index (for scored exercises like "Spot the Trap") */
  correct_index?: number;
  /** Explanation shown after answering (for scored exercises) */
  explanation?: string;
  /** Whether multiple selections are allowed (multi_choice) */
  allow_multiple?: boolean;
  /** Minimum selections required (multi_choice) */
  min_selections?: number;
  /** Slider min value */
  min?: number;
  /** Slider max value */
  max?: number;
  /** Slider step increment */
  step?: number;
  /** Label for slider min end */
  label_min?: string;
  /** Label for slider max end */
  label_max?: string;
  /** Haptic feedback intensity for this step */
  haptic?: "light" | "medium" | "heavy";
}

/** Breathing exercise config (used by Box Breathing, 4-7-8, etc.) */
export interface BreathingConfig {
  pattern: "box" | "4-7-8" | "simple";
  inhale_seconds: number;
  hold_in_seconds: number;
  exhale_seconds: number;
  hold_out_seconds: number;
  rounds: number;
  visual: "square" | "circle" | "wave";
}

/** Body scan area config (used by PMR) */
export interface BodyScanArea {
  name: string;
  tense_seconds: number;
  release_seconds: number;
  instruction: string;
}

/** Body scan config */
export interface BodyScanConfig {
  areas: BodyScanArea[];
}

/** Content shape for `node_type = 'exercise'` */
export interface ExerciseContent {
  steps: ExerciseStep[];
  /** Optional special exercise type for custom renderers */
  exercise_type?: "breathing" | "body_scan" | "grounding" | "standard";
  /** Config for breathing exercises */
  breathing_config?: BreathingConfig;
  /** Config for body scan / PMR exercises */
  body_scan_config?: BodyScanConfig;
}

// ---------------------------------------------------------------------------
// Journal Node
// ---------------------------------------------------------------------------

/** Content shape for `node_type = 'journal'` */
export interface JournalContent {
  /** The guided journaling prompt */
  prompt: string;
  /** Whether to capture mood before writing */
  mood_before: boolean;
  /** Whether to capture mood after writing */
  mood_after: boolean;
  /** Whether voice-to-text is enabled (Phase 3 — false for Phase 1) */
  voice_enabled: boolean;
  /** Tags for categorizing this journal entry (for AI analysis) */
  tags?: string[];
}

// ---------------------------------------------------------------------------
// Quiz Node
// ---------------------------------------------------------------------------

/** A single quiz question */
export interface QuizQuestion {
  /** Question text */
  text: string;
  /** Answer options */
  options: string[];
  /** 0-indexed correct answer */
  correct_index: number;
  /** Explanation shown after answering (correct or incorrect) */
  explanation: string;
}

/** Content shape for `node_type = 'quiz'` */
export interface QuizContent {
  questions: QuizQuestion[];
}

// ---------------------------------------------------------------------------
// Mood Check Node
// ---------------------------------------------------------------------------

/** Content shape for `node_type = 'mood_check'` */
export interface MoodCheckContent {
  /** Prompt text (e.g., "How anxious do you feel right now?") */
  prompt: string;
  /** Number of mood levels (typically 5) */
  scale: number;
  /** Whether to show an optional text note input */
  note_enabled: boolean;
  /** Labels for each mood level */
  labels?: string[];
  /** Optional comparison note (e.g., for final mood checks) */
  comparison_note?: string;
}

// ---------------------------------------------------------------------------
// Chest Node
// ---------------------------------------------------------------------------

/** Reward rarity tier */
export type ChestRarity = "common" | "uncommon" | "rare" | "legendary";

/** Content shape for `node_type = 'chest'` */
export interface ChestContent {
  /** Type of reward (audio, prompt, theme, avatar, streak_freeze, badge) */
  reward_type: string;
  /** Key to resolve the actual reward asset */
  reward_key: string;
  /** Human-readable name */
  reward_name: string;
  /** Description of what the user unlocked */
  reward_description: string;
  /** Rarity determines visual effects (sparkle → fireworks) */
  rarity: ChestRarity;
}

// ---------------------------------------------------------------------------
// Checkpoint Node
// ---------------------------------------------------------------------------

/** Suggested next journey after completing a checkpoint */
export interface NextJourneySuggestion {
  slug: string;
  title: string;
  reason: string;
}

/** Content shape for `node_type = 'checkpoint'` */
export interface CheckpointContent {
  /** Badge identifier key */
  badge_key: string;
  /** Human-readable badge name */
  badge_name: string;
  /** Description of the achievement */
  badge_description: string;
  /** List of skills/techniques learned in this section */
  skills_recap: string[];
  /** Whether to show mood before/after comparison from section mood checks */
  show_mood_comparison: boolean;
  /** Whether this is the final journey checkpoint */
  is_journey_complete?: boolean;
  /** Suggested next journey (shown on final checkpoint) */
  next_journey_suggestion?: NextJourneySuggestion;
}

// ---------------------------------------------------------------------------
// Practice Node (Phase 2 — define type now for forward compat)
// ---------------------------------------------------------------------------

/** Content shape for `node_type = 'practice'` */
export interface PracticeContent {
  /** Steps identical to exercise but with new scenario context */
  steps: ExerciseStep[];
  /** Reference to original exercise node this practices */
  original_node_id?: string;
}

// ---------------------------------------------------------------------------
// AI Insight Node (Phase 3 — define type now for forward compat)
// ---------------------------------------------------------------------------

/** Content shape for `node_type = 'ai_insight'` */
export interface AIInsightContent {
  /** Which aspects to analyze */
  analysis_types: (
    | "mood_arc"
    | "journal_themes"
    | "thought_patterns"
    | "technique_effectiveness"
  )[];
  /** Scope: journey-wide or section-specific */
  scope: "journey" | "section";
}

// ---------------------------------------------------------------------------
// Discriminated Union: NodeContent
// ---------------------------------------------------------------------------

/**
 * Union of all possible node content shapes.
 * Use the parent node's `nodeType` field to discriminate.
 */
export type NodeContent =
  | LearnContent
  | ExerciseContent
  | JournalContent
  | QuizContent
  | MoodCheckContent
  | ChestContent
  | CheckpointContent
  | PracticeContent
  | AIInsightContent;

// ============================================================================
// Mental Health Node Type Enum
// ============================================================================

/** Extended node types for mental health journey nodes */
export enum MentalHealthNodeType {
  LEARN = "learn",
  EXERCISE = "exercise",
  JOURNAL = "journal",
  QUIZ = "quiz",
  MOOD_CHECK = "mood_check",
  CHEST = "chest",
  CHECKPOINT = "checkpoint",
  PRACTICE = "practice",
  AI_INSIGHT = "ai_insight",
  MILESTONE = "milestone",
  /** Legacy types from existing journey system */
  LESSON = "lesson",
}

// ============================================================================
// Extended Template Types (mental health additions to existing templates)
// ============================================================================

/** Journey category for catalog filtering */
export type JourneyCategory =
  | "general"
  | "anxiety"
  | "mood"
  | "stress"
  | "growth"
  | "sleep"
  | "anger"
  | "grief"
  | "relationships"
  | "self_compassion";

/** Journey difficulty level */
export type JourneyDifficulty = "beginner" | "intermediate" | "advanced";

/**
 * Mental health fields added to JourneyTemplate via ALTER TABLE.
 * Extend the existing JourneyTemplate with these.
 */
export interface MentalHealthJourneyFields {
  /** Content category for catalog filtering */
  category: JourneyCategory;
  /** Difficulty level */
  difficulty: JourneyDifficulty;
  /** Estimated days to complete */
  estimatedDays: number | null;
  /** Total node count */
  totalNodes: number;
  /** Color theme key for visual theming */
  colorThemeKey: string | null;
  /** Icon key for catalog display */
  iconKey: string | null;
}

/**
 * Extended template node with mental health content.
 * Adds the `content` JSONB and metadata columns to the base JourneyTemplateNode.
 */
export interface MentalHealthTemplateNode {
  /** UUID from DB */
  id: string;
  /** 0-indexed position within the unit */
  nodeIndex: number;
  /** Extended node type (learn, exercise, journal, quiz, mood_check, etc.) */
  nodeType: string;
  /** Links to actual content/exercise */
  taskId: string;
  /** Rewards granted on completion */
  rewards: Array<{ type: string; amount: number; icon: string }>;
  /** Rich content JSONB — shape varies by nodeType */
  content: NodeContent;
  /** Human-readable title */
  title: string | null;
  /** Short description */
  description: string | null;
  /** Base XP reward */
  xpReward: number;
  /** Estimated completion time in minutes */
  estimatedMinutes: number;
  /** Icon key for map display */
  iconKey: string | null;
  /** Visual variant key for ConfigDrivenNode */
  variantKey: string;
  /** Extensible metadata */
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Response Data Types (user answers stored in user_node_completions)
// ============================================================================

/** Response data for exercise nodes */
export interface ExerciseResponseData {
  /** User's answers for each step (keyed by step index) */
  steps: Array<{
    stepIndex: number;
    value: string | number | string[];
  }>;
}

/** Response data for journal nodes */
export interface JournalResponseData {
  /** The user's journal text */
  text: string;
  /** Word count */
  wordCount: number;
  /** Emotion tags selected */
  emotionTags?: string[];
}

/** Response data for quiz nodes */
export interface QuizResponseData {
  /** Per-question answers */
  answers: Array<{
    questionIndex: number;
    selectedIndex: number;
    correct: boolean;
  }>;
  /** Total correct count */
  score: number;
  /** Total questions */
  total: number;
  /** Whether user got a perfect score (bonus XP) */
  perfectBonus: boolean;
}

/** Response data for mood check nodes */
export interface MoodCheckResponseData {
  /** Mood rating 1-5 */
  moodRating: number;
  /** Optional note */
  note: string | null;
}

/** Response data for chest nodes */
export interface ChestResponseData {
  /** What was unlocked */
  rewardType: string;
  rewardKey: string;
  rarity: ChestRarity;
}

/** Union of all response data shapes */
export type NodeResponseData =
  | ExerciseResponseData
  | JournalResponseData
  | QuizResponseData
  | MoodCheckResponseData
  | ChestResponseData
  | Record<string, unknown>;

// ============================================================================
// User Streak Types
// ============================================================================

/** User streak state — matches `user_streaks` table */
export interface UserStreak {
  userId: string;
  currentStreak: number;
  lastActivityDate: string;
  restDaysUsedThisWeek: number;
  weekStartDate: string;
  updatedAt: string;
}

/** Response from the `update_user_streak()` RPC */
export interface UpdateStreakResponse {
  currentStreak: number;
  streakChanged: boolean;
  milestone: number;
}

/** Streak milestone thresholds */
export const STREAK_MILESTONES: readonly number[] = [
  3, 7, 14, 30, 60, 100, 365,
] as const;

// ============================================================================
// Insight Points (IP) Ledger Types
// ============================================================================

/** Sources of Insight Points */
export type IPSource =
  | "node_completion"
  | "streak_bonus"
  | "perfect_day"
  | "daily_challenge"
  | "chest_reward"
  | "milestone_reward"
  | "quiz_perfect_bonus"
  | "early_bird_bonus"
  | "night_owl_bonus";

/** A single entry in the Insight Points ledger */
export interface IPLedgerEntry {
  id: string;
  userId: string;
  amount: number;
  source: IPSource;
  sourceId: string | null;
  journeyId: string | null;
  metadata: Record<string, unknown> | null;
  earnedAt: string;
}

/** Aggregated IP totals from the `user_ip_totals` view */
export interface IPTotals {
  totalIp: number;
  todayIp: number;
  weekIp: number;
}

// ============================================================================
// User Node Completion (immutable log)
// ============================================================================

/** A single row in the `user_node_completions` table */
export interface UserNodeCompletion {
  id: string;
  userId: string;
  nodeId: string;
  journeyId: string;
  enrollmentId: string | null;
  nodeType: string;
  responseData: NodeResponseData | null;
  xpEarned: number;
  durationSeconds: number | null;
  moodBefore: number | null;
  moodAfter: number | null;
  completedAt: string;
}

// ============================================================================
// Node Completion Payload (what the hook accepts)
// ============================================================================

/** Payload to complete a mental health node */
export interface CompleteNodePayload {
  nodeId: string;
  journeyId: string;
  enrollmentId: string;
  nodeType: string;
  responseData: NodeResponseData;
  durationSeconds: number;
  moodBefore?: number;
  moodAfter?: number;
}

/** Result returned after completing a node */
export interface CompleteNodeResult {
  /** Total XP earned (base + bonuses) */
  xpEarned: number;
  /** Updated total IP */
  newTotalXP: number;
  /** Whether the streak was updated */
  streakUpdated: boolean;
  /** Streak info (if changed) */
  streak: UpdateStreakResponse | null;
  /** Whether this completion finished a section */
  sectionCompleted: boolean;
  /** Whether this completion finished the journey */
  journeyCompleted: boolean;
}

// ============================================================================
// Catalog Types (extended for mental health)
// ============================================================================

/** Extended catalog item with mental health fields */
export interface MentalHealthJourneyListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconUrl: string | null;
  colorScheme: string;
  category: JourneyCategory;
  difficulty: JourneyDifficulty;
  estimatedDays: number | null;
  totalNodes: number;
  completedNodes: number;
  isEnrolled: boolean;
  enrollmentId: string | null;
  enrollmentStatus: "active" | "completed" | "paused" | "abandoned" | null;
  colorThemeKey: string | null;
  iconKey: string | null;
  activeSection: number | null;
  activeUnit: number | null;
  activeSectionUnit: number | null;
  sections: SectionListItem[];
}
