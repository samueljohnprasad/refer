import { useMemo } from "react";
import { useExerciseStats } from "./useExerciseStats";
import { usePersonalEffectiveness } from "./usePersonalEffectiveness";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import { PRE_POST_FIELDS } from "@/src/constants/insights";
import { average } from "@/src/utils/insights";

// ─── Skill Categories ────────────────────────────────────────────────────────

export type SkillCategory =
  | "reframing"
  | "breathing"
  | "exposure"
  | "mindfulness";

const SKILL_EXERCISE_MAP: Record<SkillCategory, ExerciseType[]> = {
  reframing: ["thought_catcher", "thought_reframing", "abc_analysis"],
  breathing: ["box_breathing", "breathing_478", "mindful_breathing_1min"],
  exposure: [
    "fear_ladder",
    "decatastrophizing",
    "worry_decision_tree",
    "worry_time",
  ],
  mindfulness: [
    "grounding_54321",
    "body_scan_pmr",
    "detached_mindfulness",
    "attention_training",
    "recognizing_rumination",
  ],
};

const SKILL_LABELS: Record<SkillCategory, string> = {
  reframing: "Reframing",
  breathing: "Breathing",
  exposure: "Exposure",
  mindfulness: "Mindfulness",
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WeeklyDataPoint {
  weekStart: string;
  avgDelta: number;
  count: number;
}

export type TrendDirection = "improving" | "stable" | "declining";

export interface SkillTrend {
  skill: SkillCategory;
  label: string;
  weeklyData: WeeklyDataPoint[];
  overallTrend: TrendDirection;
  improvementRate: number;
  message: string;
  totalSessions: number;
}

export interface RelapseAlert {
  category: SkillCategory;
  label: string;
  weeksDecline: number;
  suggestedExercise: ExerciseType | null;
  message: string;
}

export interface SkillProgressionData {
  trends: SkillTrend[];
  relapseAlerts: RelapseAlert[];
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function getISOWeekStart(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function linearRegressionSlope(values: number[]): number {
  if (values.length < 2) return 0;
  const n = values.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return 0;
  return (n * sumXY - sumX * sumY) / denom;
}

function classifyTrend(slope: number): TrendDirection {
  if (slope > 0.3) return "improving";
  if (slope < -0.3) return "declining";
  return "stable";
}

function generateMessage(
  skill: string,
  trend: TrendDirection,
  rate: number,
): string {
  switch (trend) {
    case "improving":
      return `Your ${skill.toLowerCase()} is getting stronger — each session cuts deeper.`;
    case "declining":
      return `This area needs a different approach. Try a different technique.`;
    case "stable":
      return `Steady and consistent. Maintenance is a skill too.`;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSkillProgression(): {
  data: SkillProgressionData | null;
  isLoading: boolean;
} {
  const { data: stats, isLoading } = useExerciseStats();
  const { data: effectiveness } = usePersonalEffectiveness();

  const data = useMemo((): SkillProgressionData | null => {
    if (!stats || stats.totalCompleted < 5) return null;

    const trends: SkillTrend[] = [];
    const relapseAlerts: RelapseAlert[] = [];

    for (const [skill, exerciseTypes] of Object.entries(SKILL_EXERCISE_MAP)) {
      const skillKey = skill as SkillCategory;
      const typeSet = new Set(exerciseTypes);

      // Filter entries for this skill category
      const entries = stats.entries.filter((e) => typeSet.has(e.exercise_type));

      if (entries.length < 3) {
        trends.push({
          skill: skillKey,
          label: SKILL_LABELS[skillKey],
          weeklyData: [],
          overallTrend: "stable",
          improvementRate: 0,
          message: "Not enough sessions yet. Keep practicing!",
          totalSessions: entries.length,
        });
        continue;
      }

      // Compute pre-post delta for each entry
      const entryDeltas: Array<{ week: string; delta: number }> = [];
      for (const entry of entries) {
        const field = PRE_POST_FIELDS[entry.exercise_type];
        if (!field) continue;
        const pre = entry.response?.[field.pre];
        const post = entry.response?.[field.post];
        if (typeof pre !== "number" || typeof post !== "number") continue;
        const delta =
          field.direction === "pre_minus_post" ? pre - post : post - pre;
        entryDeltas.push({ week: getISOWeekStart(entry.completed_at), delta });
      }

      if (entryDeltas.length < 3) {
        trends.push({
          skill: skillKey,
          label: SKILL_LABELS[skillKey],
          weeklyData: [],
          overallTrend: "stable",
          improvementRate: 0,
          message: "Building data. A few more sessions to see trends.",
          totalSessions: entries.length,
        });
        continue;
      }

      // Group by week and compute weekly averages
      const weekMap = new Map<string, number[]>();
      for (const { week, delta } of entryDeltas) {
        if (!weekMap.has(week)) weekMap.set(week, []);
        weekMap.get(week)!.push(delta);
      }

      const weeklyData: WeeklyDataPoint[] = [...weekMap.entries()]
        .map(([weekStart, deltas]) => ({
          weekStart,
          avgDelta: average(deltas) ?? 0,
          count: deltas.length,
        }))
        .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

      // Compute slope (only on last 6 weeks max)
      const recentWeeks = weeklyData.slice(-6);
      const slope = linearRegressionSlope(recentWeeks.map((w) => w.avgDelta));
      const trend = classifyTrend(slope);

      // Improvement rate as % per week
      const firstAvg = recentWeeks[0]?.avgDelta ?? 0;
      const improvementRate =
        firstAvg > 0
          ? Math.round((slope / firstAvg) * 100)
          : Math.round(slope * 100);

      const message = generateMessage(
        SKILL_LABELS[skillKey],
        trend,
        improvementRate,
      );

      trends.push({
        skill: skillKey,
        label: SKILL_LABELS[skillKey],
        weeklyData: recentWeeks,
        overallTrend: trend,
        improvementRate,
        message,
        totalSessions: entries.length,
      });

      // ── Relapse detection ─────────────────────────────────────────────
      // Was improving over 3+ weeks but last 2 weeks show decline
      if (recentWeeks.length >= 4) {
        const allButLast2 = recentWeeks.slice(0, -2);
        const last2 = recentWeeks.slice(-2);
        const priorSlope = linearRegressionSlope(
          allButLast2.map((w) => w.avgDelta),
        );
        const wasImproving = priorSlope > 0.3 && allButLast2.length >= 3;
        const lastDeclining =
          last2.length === 2 && last2[1].avgDelta < last2[0].avgDelta;

        if (wasImproving && lastDeclining) {
          // Find best exercise for this category from effectiveness data
          const bestForCategory =
            effectiveness?.ranked.find((s) => typeSet.has(s.exerciseType))
              ?.exerciseType ?? null;

          relapseAlerts.push({
            category: skillKey,
            label: SKILL_LABELS[skillKey],
            weeksDecline: 2,
            suggestedExercise: bestForCategory,
            message: `Your ${SKILL_LABELS[skillKey].toLowerCase()} scores have risen after being stable. When scores were high before, a different technique might help.`,
          });
        }
      }
    }

    return { trends, relapseAlerts };
  }, [stats, effectiveness]);

  return { data, isLoading };
}
