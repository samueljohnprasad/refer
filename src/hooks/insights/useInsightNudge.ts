import { useMemo } from "react";
import { useExerciseStats } from "./useExerciseStats";
import type { ExerciseCategory } from "@/src/types/exerciseFlow";
import { DISTORTION_LABELS, CATEGORY_LABELS } from "@/src/constants/insights";
import { countBy } from "@/src/utils/insights";

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
          message: `You just completed your ${m}th exercise!`,
          detail: "That's real dedication to your mental health.",
          tone: "celebrating" as const,
          ctaLabel: "See your patterns",
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
          message: `${DISTORTION_LABELS[top.key] || capitalize(top.key)} is your #1 thinking trap (${top.count}x).`,
          detail: "Naming it is the first step to taming it.",
          tone: "curious" as const,
          ctaLabel: "See your patterns",
        };
      }
    }

    // Priority 3: Streak celebration
    if (currentStreak >= 7) {
      return {
        message: `${currentStreak}-day streak! You're building a real habit.`,
        detail: "Consistency is the #1 predictor of progress.",
        tone: "celebrating" as const,
        ctaLabel: "See your progress",
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
            message: "It's been a few days · ready to pick back up?",
            detail: "Even one exercise keeps the momentum going.",
            tone: "encouraging" as const,
            ctaLabel: "Start an exercise",
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
      const suggestion = CATEGORY_LABELS[emptyCategories[0]].toLowerCase();
      return {
        message: `You haven't tried ${suggestion} yet.`,
        detail: "Trying different approaches helps you find what works best.",
        tone: "curious" as const,
        ctaLabel: "Explore exercises",
      };
    }

    // Priority 6: Generic encouraging (weekly count)
    const weekCount = stats.completedThisWeek;
    if (weekCount >= 3) {
      return {
        message: `${weekCount} exercises this week · you're on a roll.`,
        detail: "Each one strengthens your mental toolkit.",
        tone: "encouraging" as const,
        ctaLabel: "See your patterns",
      };
    }

    return null;
  }, [stats, isLoading]);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
