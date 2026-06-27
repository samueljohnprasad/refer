/**
 * Rating Extractor Map
 *
 * Config-driven mapping from ExerciseType → before/after rating field names.
 * To add a new exercise's shift badge to the timeline, add ONE line here.
 *
 * `invertScale: true` means higher values = better (e.g. Calm goes UP).
 * Default (false) means lower values = better (e.g. Distress goes DOWN).
 */

import type { ExerciseType } from "@/src/types/exerciseFlow";

export interface RatingExtractorConfig {
  /** Human-readable label shown on the shift badge (e.g. "Distress") */
  readonly label: string;
  /** Key in the response JSON for the "before" rating */
  readonly beforeKey: string;
  /** Key in the response JSON for the "after" rating */
  readonly afterKey: string;
  /** When true, a higher post-value = improvement (e.g. Calm, Presence) */
  readonly invertScale?: boolean;
}

export const RATING_EXTRACTOR_MAP: Partial<
  Record<ExerciseType, RatingExtractorConfig>
> = {
  // ── CBT Core ────────────────────────────────────────────────────────
  thought_catcher: {
    label: "Distress",
    beforeKey: "intensity",
    afterKey: "postIntensity",
  },
  thought_reframing: {
    label: "Distress",
    beforeKey: "intensity",
    afterKey: "postIntensity",
  },
  gratitude_reframe: {
    label: "Mood",
    beforeKey: "moodIntensity",
    afterKey: "finalMoodIntensity",
    invertScale: true,
  },
  abc_analysis: {
    label: "Emotion",
    beforeKey: "preEmotionalIntensity",
    afterKey: "postEmotionalIntensity",
  },

  // ── Mindfulness ─────────────────────────────────────────────────────
  box_breathing: {
    label: "Calm",
    beforeKey: "preCalmRating",
    afterKey: "postCalmRating",
    invertScale: true,
  },
  breathing_478: {
    label: "Calm",
    beforeKey: "preCalmRating",
    afterKey: "postCalmRating",
    invertScale: true,
  },
  grounding_54321: {
    label: "Presence",
    beforeKey: "prePresenceRating",
    afterKey: "presenceRating",
    invertScale: true,
  },
  body_scan_pmr: {
    label: "Tension",
    beforeKey: "preTensionRating",
    afterKey: "postTensionRating",
  },
  mindful_breathing_1min: {
    label: "Calm",
    beforeKey: "preRating",
    afterKey: "postRating",
    invertScale: true,
  },

  // ── Anxiety ─────────────────────────────────────────────────────────
  worry_time: {
    label: "Anxiety",
    beforeKey: "preAnxietyRating",
    afterKey: "postAnxietyRating",
  },
  fear_ladder: {
    label: "Anxiety",
    beforeKey: "anxietyBefore",
    afterKey: "anxietyAfter",
  },
  decatastrophizing: {
    label: "Anxiety",
    beforeKey: "anxietyBefore",
    afterKey: "anxietyAfter",
  },
  worry_decision_tree: {
    label: "Anxiety",
    beforeKey: "preAnxietyRating",
    afterKey: "postAnxietyRating",
  },

  // ── Overthinking ────────────────────────────────────────────────────
  recognizing_rumination: {
    label: "Rumination",
    beforeKey: "preRating",
    afterKey: "postRating",
  },
  detached_mindfulness: {
    label: "Distress",
    beforeKey: "preRating",
    afterKey: "checkInRating",
  },
  attention_training: {
    label: "Focus",
    beforeKey: "preRating",
    afterKey: "postRating",
    invertScale: true,
  },
};
