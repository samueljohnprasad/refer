import type { MotivationAnswer } from "@/src/screens/OnboardingScreen/types";
import type { CourseCatalogListItem } from "@/src/types/journeyV5";

export interface MotivationCourseMetadata {
  readonly motivation: MotivationAnswer;
  readonly titleKeyword: string;
  readonly fallbackTitle: string;
}

export const MOTIVATION_COURSE_TARGETS: Record<MotivationAnswer, MotivationCourseMetadata> = {
  anxiety: {
    motivation: "anxiety",
    titleKeyword: "quieting the storm",
    fallbackTitle: "Quieting the Storm",
  },
  mood: {
    motivation: "mood",
    titleKeyword: "finding light",
    fallbackTitle: "Finding Light Again",
  },
  stress: {
    motivation: "stress",
    titleKeyword: "steady under pressure",
    fallbackTitle: "Steady Under Pressure",
  },
  self_understanding: {
    motivation: "self_understanding",
    titleKeyword: "coming home",
    fallbackTitle: "Coming Home to Yourself",
  },
  sleep: {
    motivation: "sleep",
    titleKeyword: "sleep reset",
    fallbackTitle: "Sleep Reset",
  },
};

// ponytail: resolve course id matching user motivation from catalog; returns null if not selected
export function resolveCourseForMotivation(
  motivation: MotivationAnswer | undefined,
  catalog: CourseCatalogListItem[] = [],
): string | null {
  if (!motivation) return null;

  const target = MOTIVATION_COURSE_TARGETS[motivation];
  if (!target) return null;

  const matched = catalog.find((c) =>
    c.title.toLowerCase().includes(target.titleKeyword.toLowerCase()),
  );

  return matched?.id ?? null;
}
