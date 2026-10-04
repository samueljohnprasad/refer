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
    bg: "#E8FBF0",
    text: "#22C55E",
    iconColor: "#22C55E",
    rim: "#16A34A",
    cardRim: "#C4EED4",
    sf: "brain.head.profile",
    feather: "cpu",
  },
  mindfulness: {
    bg: "#E4F6FC",
    text: "#00A3D9",
    iconColor: "#00A3D9",
    rim: "#0084B4",
    cardRim: "#BCE5F5",
    sf: "leaf",
    feather: "feather",
  },
  anxiety: {
    bg: "#FFEDE8",
    text: "#FF6B4A",
    iconColor: "#FF6B4A",
    rim: "#E04B2A",
    cardRim: "#FED2C7",
    sf: "cloud",
    feather: "cloud",
  },
  overthinking: {
    bg: "#F0EDFF",
    text: "#6B5CE7",
    iconColor: "#6B5CE7",
    rim: "#5243C7",
    cardRim: "#DDD2FC",
    sf: "sparkles",
    feather: "zap",
  },
};

export function getCategoryBadgeTheme(category: string): NutrieBadgeTheme {
  return CATEGORY_BADGE_THEME[category as ExerciseCategory] ?? CATEGORY_BADGE_THEME.cbt_core;
}

export function buildExerciseRoute(
  type: ExerciseType,
  options?: { entryId?: string; readOnly?: boolean },
): string {
  const params = [`type=${encodeURIComponent(type)}`];

  if (options?.entryId) params.push(`entryId=${encodeURIComponent(options.entryId)}`);
  if (options?.readOnly) params.push("readOnly=true");

  return `/tabs/screens/exercise-flow?${params.join("&")}`;
}
