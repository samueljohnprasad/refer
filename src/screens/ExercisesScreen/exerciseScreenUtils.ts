import type { ExerciseCategory, ExerciseType } from "@/src/types/exerciseFlow";

export interface NutrieBadgeTheme {
  bg: string;
  text: string;
  iconColor: string;
  rim: string;
  cardRim: string;
  sf: string;
  feather: string;
}

const CATEGORY_BADGE_THEME: Record<ExerciseCategory, NutrieBadgeTheme> = {
  cbt_core: {
    bg: "#e6f0e2",
    text: "#29452a",
    iconColor: "#44633f",
    rim: "#44633f",
    cardRim: "#e5e5e5",
    sf: "brain.head.profile",
    feather: "cpu",
  },
  mindfulness: {
    bg: "#e2eef8",
    text: "#29452a",
    iconColor: "#44633f",
    rim: "#44633f",
    cardRim: "#e5e5e5",
    sf: "leaf",
    feather: "feather",
  },
  anxiety: {
    bg: "#fde5dc",
    text: "#29452a",
    iconColor: "#44633f",
    rim: "#44633f",
    cardRim: "#e5e5e5",
    sf: "cloud",
    feather: "cloud",
  },
  overthinking: {
    bg: "#fdf0d2",
    text: "#29452a",
    iconColor: "#44633f",
    rim: "#44633f",
    cardRim: "#e5e5e5",
    sf: "sparkles",
    feather: "zap",
  },
};

export const EXERCISE_HUE: Record<string, string> = {
  thought_catcher: "#e6f0e2",
  thought_reframing: "#fdf0d2",
  gratitude_reframe: "#fdf0d2",
  abc_analysis: "#e2eef8",
  behavioral_activation: "#fde5dc",
  box_breathing: "#e2eef8",
  breathing_478: "#e2eef8",
  grounding_54321: "#e2eef8",
  body_scan_pmr: "#e2eef8",
  mindful_breathing_1min: "#e2eef8",
  decatastrophizing: "#fde5dc",
  worry_decision_tree: "#fde5dc",
  fear_ladder: "#ece6f7",
  detached_mindfulness: "#fdf0d2",
  attention_training: "#fdf0d2",
};

export function getExerciseHue(type: string, category?: string): string {
  if (EXERCISE_HUE[type]) return EXERCISE_HUE[type];
  if (category && CATEGORY_BADGE_THEME[category as ExerciseCategory]) {
    return CATEGORY_BADGE_THEME[category as ExerciseCategory].bg;
  }
  return "#e6f0e2";
}

export function getCategoryBadgeTheme(category: string): NutrieBadgeTheme {
  return CATEGORY_BADGE_THEME[category as ExerciseCategory] ?? CATEGORY_BADGE_THEME.cbt_core;
}

export const THOUGHT_CATCHER_ROUTE = "/tabs/screens/thought-catcher";

export type PracticeLaunchParams = Partial<
  Record<
    "practiceSessionId" | "pathId" | "pathVersion" | "practiceSource" | "practiceId",
    string
  >
>;

// AD-12: the single redirect. thought_catcher opens the wizard unless a past entry is read-only.
export function buildExerciseRoute(
  type: ExerciseType,
  options?: { entryId?: string; readOnly?: boolean; practice?: PracticeLaunchParams },
): string {
  if (type === "thought_catcher" && !options?.readOnly) {
    const query = Object.entries(options?.practice ?? {})
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join("&");
    return query ? `${THOUGHT_CATCHER_ROUTE}?${query}` : THOUGHT_CATCHER_ROUTE;
  }

  const params = [`type=${encodeURIComponent(type)}`];

  if (options?.entryId) params.push(`entryId=${encodeURIComponent(options.entryId)}`);
  if (options?.readOnly) params.push("readOnly=true");

  return `/tabs/screens/exercise-flow?${params.join("&")}`;
}
