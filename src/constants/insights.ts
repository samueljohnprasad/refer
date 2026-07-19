import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";

export type TimeRange = "7d" | "30d" | "all";

export const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "all", label: "All" },
];

export interface PrePostField {
  pre: string;
  post: string;
  direction: "pre_minus_post" | "post_minus_pre";
}

export const PRE_POST_FIELDS: Partial<Record<ExerciseType, PrePostField>> = {
  box_breathing: {
    pre: "preCalmRating",
    post: "postCalmRating",
    direction: "post_minus_pre",
  },
  breathing_478: {
    pre: "preCalmRating",
    post: "postCalmRating",
    direction: "post_minus_pre",
  },
  body_scan_pmr: {
    pre: "preTensionRating",
    post: "postTensionRating",
    direction: "pre_minus_post",
  },
  mindful_breathing_1min: {
    pre: "preRating",
    post: "postRating",
    direction: "post_minus_pre",
  },
  grounding_54321: {
    pre: "prePresenceRating",
    post: "presenceRating",
    direction: "post_minus_pre",
  },
  worry_decision_tree: {
    pre: "preAnxietyRating",
    post: "postAnxietyRating",
    direction: "pre_minus_post",
  },
  decatastrophizing: {
    pre: "anxietyBefore",
    post: "anxietyAfter",
    direction: "pre_minus_post",
  },
  detached_mindfulness: {
    pre: "preRating",
    post: "checkInRating",
    direction: "pre_minus_post",
  },
  attention_training: {
    pre: "preRating",
    post: "postRating",
    direction: "pre_minus_post",
  },
  abc_analysis: {
    pre: "preEmotionalIntensity",
    post: "postEmotionalIntensity",
    direction: "pre_minus_post",
  },
};

export const DISTORTION_LABELS: Record<string, string> = {
  all_or_nothing: "All-or-Nothing",
  catastrophizing: "Catastrophizing",
  mind_reading: "Mind Reading",
  overgeneralizing: "Overgeneralizing",
  personalizing: "Personalizing",
  filtering: "Mental Filtering",
  should_statements: "Should Statements",
  fortune_telling: "Fortune Telling",
  emotional_reasoning: "Emotional Reasoning",
  labeling: "Labeling",
};

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  cbt_core: "CBT",
  anxiety: "Anxiety",
  mindfulness: "Mindfulness",
  overthinking: "Overthinking",
};

export const TRIGGER_LABELS: Record<string, string> = {
  past_regret: "Past Regret",
  self_criticism: "Self-Criticism",
  relationship: "Relationship",
  work: "Work/Performance",
  health: "Health",
  other: "Other",
};

export const EXERCISE_LABELS: Partial<Record<ExerciseType, string>> = {
  decatastrophizing: "Decatastrophizing",
  worry_decision_tree: "Decision Tree",
  thought_reframing: "Thought Reframing",
  thought_catcher: "Thought Catcher",
  box_breathing: "Box Breathing",
  breathing_478: "4-7-8 Breathing",
  body_scan_pmr: "Body Scan",
  grounding_54321: "5-4-3-2-1 Grounding",
  mindful_breathing_1min: "Mindful Breathing",
  detached_mindfulness: "Detached Mindfulness",
  attention_training: "Attention Training",
  abc_analysis: "ABC Analysis",
  gratitude_reframe: "Gratitude Reframe",
};
