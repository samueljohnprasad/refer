import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";

export const EXERCISE_CATEGORY_MAP: Record<ExerciseType, ExerciseCategory> = {
  // CBT Core
  thought_catcher: "cbt_core",
  thought_reframing: "cbt_core",
  gratitude_reframe: "cbt_core",
  abc_analysis: "cbt_core",
  // Mindfulness
  box_breathing: "mindfulness",
  breathing_478: "mindfulness",
  grounding_54321: "mindfulness",
  body_scan_pmr: "mindfulness",
  mindful_breathing_1min: "mindfulness",
  // Anxiety
  decatastrophizing: "anxiety",
  worry_decision_tree: "anxiety",
  detached_mindfulness: "overthinking",
  attention_training: "overthinking",
};

export function getExerciseCategory(type: ExerciseType): ExerciseCategory {
  return EXERCISE_CATEGORY_MAP[type];
}

export function getExerciseTypesByCategory(
  category: ExerciseCategory,
): ExerciseType[] {
  return (
    Object.entries(EXERCISE_CATEGORY_MAP) as [ExerciseType, ExerciseCategory][]
  )
    .filter(([, cat]) => cat === category)
    .map(([type]) => type);
}
