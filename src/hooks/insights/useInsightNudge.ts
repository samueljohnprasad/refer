import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExerciseStats } from "./useExerciseStats";
import type { ExerciseCategory } from "@/src/types/exerciseFlow";
import { countBy } from "@/src/utils/insights";
import { categoryLabel, distortionLabel } from "./i18n";

export interface InsightNudge {
  message: string;
  detail: string;
  tone: "encouraging" | "curious" | "celebrating";
  ctaLabel: string;
}

function getTopDistortion(
  entries: { response: Record<string, any> }[],
): { key: string; count: number } | null {
  const counts = countBy(
    entries.flatMap((e) => (e.response?.selectedDistortions as string[]) ?? []),
    (d) => d,
  );
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  if (sorted.length === 0) return null;
  return { key: sorted[0][0], count: sorted[0][1] };
}

export function useInsightNudge(): InsightNudge | null {
  const { t } = useTranslation("common");
  const { data: stats, isLoading } = useExerciseStats();

  return useMemo(() => {
    if (isLoading || !stats) return null;
    if (stats.totalCompleted < 3) return null;

    const { totalCompleted, currentStreak, categoryCount, entries } = stats;

    // Priority 1: Milestone
    const milestones = [100, 50, 25, 10];
    for (const m of milestones) {
      if (totalCompleted === m) {
        return {
          message: t("insights.nudges.completed", { count: m }),
          detail: t("insights.nudges.completedDetail"),
          tone: "celebrating" as const,
          ctaLabel: t("insights.nudges.seePatterns"),
        };
      }
    }

    // Priority 2: Pattern alert — one distortion is dominant
    const reframingEntries = entries.filter(
      (e) => e.exercise_type === "thought_reframing",
    );
    if (reframingEntries.length >= 3) {
      const top = getTopDistortion(reframingEntries);
      if (top && top.count >= 3) {
        return {
          message: t("insights.nudges.topTrap", { label: distortionLabel(t, top.key), count: top.count }),
          detail: t("insights.nudges.nameTrap"),
          tone: "curious" as const,
          ctaLabel: t("insights.nudges.seePatterns"),
        };
      }
    }

    // Priority 3: Streak celebration
    if (currentStreak >= 7) {
      return {
        message: t("insights.nudges.streak", { count: currentStreak }),
        detail: t("insights.nudges.consistency"),
        tone: "celebrating" as const,
        ctaLabel: t("insights.nudges.seeProgress"),
      };
    }

    // Priority 4: Comeback after inactivity
    if (currentStreak === 0 && totalCompleted >= 5) {
      const lastEntry = entries[0];
      if (lastEntry) {
        const daysSince = Math.floor(
          (Date.now() - new Date(lastEntry.completed_at).getTime()) /
            86_400_000,
        );
        if (daysSince >= 3) {
          return {
            message: t("insights.nudges.pickBackUp"),
            detail: t("insights.nudges.keepMomentum"),
            tone: "encouraging" as const,
            ctaLabel: t("insights.ui.startExercise"),
          };
        }
      }
    }

    // Priority 5: Category gap
    const categories: ExerciseCategory[] = [
      "cbt_core",
      "mindfulness",
      "anxiety",
      "overthinking",
    ];
    const emptyCategories = categories.filter((c) => categoryCount[c] === 0);
    if (emptyCategories.length > 0 && totalCompleted >= 5) {
      const suggestion = categoryLabel(t, emptyCategories[0]).toLowerCase();
      return {
        message: t("insights.nudges.notTried", { label: suggestion }),
        detail: t("insights.nudges.tryDifferent"),
        tone: "curious" as const,
        ctaLabel: t("insights.nudges.explore"),
      };
    }

    // Priority 6: Generic encouraging (weekly count)
    const weekCount = stats.completedThisWeek;
    if (weekCount >= 3) {
      return {
        message: t("insights.nudges.weekCount", { count: weekCount }),
        detail: t("insights.nudges.toolkit"),
        tone: "encouraging" as const,
        ctaLabel: t("insights.nudges.seePatterns"),
      };
    }

    return null;
  }, [stats, isLoading]);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
