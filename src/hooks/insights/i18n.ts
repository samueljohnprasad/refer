import type { TFunction } from "i18next";

import {
  CATEGORY_LABELS,
  DISTORTION_LABELS,
  EXERCISE_LABELS,
} from "@/src/constants/insights";

type LabelMap = Record<string, string>;

export function translateInsightLabel(
  t: TFunction,
  group: "categories" | "distortions" | "exercises" | "triggers",
  key: string,
  labels: LabelMap,
): string {
  return t(`insights.labels.${group}.${key}`, {
    defaultValue: labels[key] ?? key,
  });
}

export function categoryLabel(t: TFunction, key: string): string {
  return translateInsightLabel(t, "categories", key, CATEGORY_LABELS);
}

export function distortionLabel(t: TFunction, key: string): string {
  return translateInsightLabel(t, "distortions", key, DISTORTION_LABELS);
}

export function exerciseLabel(t: TFunction, key: string): string {
  return translateInsightLabel(t, "exercises", key, EXERCISE_LABELS);
}

export function translateInsightCopy(t: TFunction, copy: string): string {
  const keyByCopy: Record<string, string> = {
    Anxiety: "anxiety",
    "CBT Patterns": "cbtPatterns",
    Mindfulness: "mindfulness",
    Overthinking: "overthinking",
    Sessions: "sessionsLabel",
    "Avg Drop": "averageDrop",
    Reframing: "reframing",
    Catcher: "catcher",
    Success: "success",
    "Calm ↑": "calmUp",
    Consistency: "consistency",
    Detachment: "detachment",
    ATT: "attentionTraining",
    "Technique Effectiveness": "techniqueEffectiveness",
    "Anxiety Over Time": "anxietyOverTime",
    "Exercise Effectiveness": "exerciseEffectiveness",
    "Trigger Clusters": "triggerClusters",
    "Your Thinking Traps": "thinkingTraps",
    "Emotion Shift Over Time": "emotionShift",
    "Most Common Emotions": "commonEmotions",
    "Sessions Per Week": "sessionsPerWeek",
    "Your Practice": "calm",
    "Skill Progression": "skillProgression",
    "Therapist Notebook": "therapistsNotebook",
    "Your Progress": "progress",
    "Techniques Used": "techniquesUsed",
  };
  const key = keyByCopy[copy];
  return key ? t(`insights.ui.${key}`, { defaultValue: copy }) : copy;
}
