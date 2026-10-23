// ponytail: pure helpers for CBT history log presentation and formatting
import type { HistoryLogItem } from "../hooks/useCBTHistory";
import {
  getExerciseConfig,
  getCategoryMeta,
} from "@/src/data/exerciseRegistry";

const LEGACY_LOG_META = {
  catcher: { label: "Thought Catcher" },
  reframing: { label: "Thought Reframing" },
  gratitude: { label: "Gratitude Reframe" },
};

export function getHistoryXp(item: HistoryLogItem): number {
  if (item.type === "unified" && item.exerciseType) {
    return getExerciseConfig(item.exerciseType)?.xp ?? 0;
  }
  if (item.type === "catcher") return 10;
  if (item.type === "reframing") return 15;
  if (item.type === "gratitude") return 10;
  return 0;
}

export function formatStatus(item: HistoryLogItem): {
  label: string;
  isComplete: boolean;
  xpEarned: number;
} {
  if (
    item.status === "checker_completed" ||
    item.status === "completed" ||
    item.status === "summary"
  ) {
    return { label: "Completed", isComplete: true, xpEarned: getHistoryXp(item) };
  }
  if (item.status === "catcher_completed") {
    return { label: "Ready to Reframe", isComplete: false, xpEarned: 0 };
  }
  return { label: "Resume", isComplete: false, xpEarned: 0 };
}

export function getLogPresentation(item: HistoryLogItem): {
  heading: string;
  title: string;
} {
  if (item.type === "unified" && item.exerciseType) {
    const config = getExerciseConfig(item.exerciseType);
    const categoryMeta = config ? getCategoryMeta(config.category) : null;
    return {
      heading: categoryMeta?.label ?? "Exercise",
      title: config?.title ?? item.title ?? "Exercise",
    };
  }
  if (item.type === "catcher") {
    return {
      heading: LEGACY_LOG_META.catcher.label,
      title: item.title?.trim() || "Untitled Session",
    };
  }
  if (item.type === "reframing") {
    return {
      heading: LEGACY_LOG_META.reframing.label,
      title: item.title?.trim() || "Untitled Session",
    };
  }
  return {
    heading: LEGACY_LOG_META.gratitude.label,
    title: item.title?.trim() || "Untitled Session",
  };
}
