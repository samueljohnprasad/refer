import type { TFunction } from "i18next";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";
import type { ExerciseTimelineItem } from "./types";

export function getLocalizedExerciseTitle(
  t: TFunction<"exercises">,
  item: ExerciseTimelineItem,
): string {
  return t(`copingCards.exerciseTypes.${item.exerciseType}`, {
    defaultValue: item.title,
  });
}

export function getLocalizedExerciseCategory(
  t: TFunction<"exercises">,
  item: ExerciseTimelineItem,
): string {
  const category = getExerciseConfig(item.exerciseType)?.category;
  return category
    ? t(`categories.${category}`, { defaultValue: item.categoryLabel })
    : item.categoryLabel;
}

export function getLocalizedDistortion(
  t: TFunction<"common">,
  tag: string,
): string {
  const key = tag.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return t(`insights.labels.distortions.${key}`, {
    ns: "common",
    defaultValue: tag,
  });
}

export function getLocalizedLogFieldLabel(
  t: TFunction<"exercises">,
  label: string | undefined,
): string {
  const keyByLabel: Record<string, LogFieldKey> = {
    "Automatic Thought": "automaticThought",
    "Balanced Reframe": "balancedReframe",
    "Initial Thought": "initialThought",
    "Cognitive Reframe": "cognitiveReframe",
    "Activating Event (A)": "activatingEvent",
    "Alternative Belief & Outcome": "alternativeBeliefOutcome",
    "Gratitude Entries": "gratitudeEntries",
    "Reframed Perspective": "reframedPerspective",
  };
  return t(`log.${keyByLabel[label ?? ""] ?? "initialThought"}`);
}

type LogFieldKey =
  | "automaticThought"
  | "balancedReframe"
  | "initialThought"
  | "cognitiveReframe"
  | "activatingEvent"
  | "alternativeBeliefOutcome"
  | "gratitudeEntries"
  | "reframedPerspective";

export function getLocalizedRatingLabel(
  t: TFunction<"exercises">,
  label: string,
): string {
  const key = label.toLowerCase();
  return t(`log.ratingLabels.${key}`, { defaultValue: label });
}

export function formatTimelineTimestamp(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatTimelineDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);
}
