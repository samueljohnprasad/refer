import { useMemo } from "react";
import { useExerciseStats } from "./useExerciseStats";
import { EXERCISE_CATEGORY_MAP } from "@/src/data/exerciseCategoryMap";
import type { ExerciseCategory, ExerciseType } from "@/src/types/exerciseFlow";
import { CATEGORY_LABELS, PRE_POST_FIELDS } from "@/src/constants/insights";
import { average } from "@/src/utils/insights";

export interface DailyPracticeData {
  day: string;
  date: string;
  count: number;
  score: number;
  isToday: boolean;
  isHighlighted: boolean;
}

export interface WeeklyCBTSummaryData {
  today: {
    qualitativeLabel: string;
    insightText: string;
    score: number;
    maxScore: number;
  };
  sevenDay: {
    averageScore: number;
    dailyData: DailyPracticeData[];
  };
}

export function useWeeklyCBTSummary(): {
  data: WeeklyCBTSummaryData | null;
  isLoading: boolean;
} {
  const { data: stats, isLoading } = useExerciseStats();

  const data = useMemo((): WeeklyCBTSummaryData | null => {
    if (!stats || stats.entries.length === 0) return null;

    const todayMs = new Date().setHours(0, 0, 0, 0);
    const dailyData: DailyPracticeData[] = [];
    let totalScore = 0;
    let daysWithScore = 0;

    // Build 7 day lookback
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayMs);
      d.setDate(d.getDate() - i);
      const dayStart = d.getTime();
      const dayEnd = dayStart + 86_400_000;

      const dayEntries = stats.entries.filter((e) => {
        const t = new Date(e.completed_at).getTime();
        return t >= dayStart && t < dayEnd;
      });

      // Calculate score for the day (e.g. max 10 based on session count and shift)
      const count = dayEntries.length;
      let score = 0;
      if (count > 0) {
        const shifts = getShifts(dayEntries);
        const avgShift = average(shifts) || 0;
        // Base 5 points for showing up, plus up to 5 points for impact (shift)
        score = Math.min(10, 5 + (avgShift * 1.5));
        totalScore += score;
        daysWithScore++;
      }

      dailyData.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.toISOString(),
        count,
        score: Number(score.toFixed(1)),
        isToday: i === 0,
        isHighlighted: false, // Will calculate after finding max
      });
    }

    // Highlight top performing days
    const maxScore = Math.max(...dailyData.map((d) => d.score));
    if (maxScore > 0) {
      dailyData.forEach((d) => {
        if (d.score >= maxScore * 0.8) d.isHighlighted = true;
      });
    }

    const average7DayScore = daysWithScore > 0 ? Number((totalScore / 7).toFixed(1)) : 0;
    const todayData = dailyData[6];

    // Determine Today's Qualitative Label
    let qualitativeLabel = "Rest";
    if (todayData.score >= 8) qualitativeLabel = "Great";
    else if (todayData.score >= 5) qualitativeLabel = "Good";
    else if (todayData.score > 0) qualitativeLabel = "Steady";

    // Determine Today's Insight Text
    const todayEntries = stats.entries.filter((e) => {
      return new Date(e.completed_at).getTime() >= todayMs;
    });

    let insightText = "Take a moment for your mental health today.";
    if (todayEntries.length > 0) {
      const categoryCounts: Record<string, number> = {};
      for (const entry of todayEntries) {
        const cat = EXERCISE_CATEGORY_MAP[entry.exercise_type];
        if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
      const topCat = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
      
      if (topCat) {
        const label = CATEGORY_LABELS[topCat[0] as ExerciseCategory] || topCat[0];
        if (qualitativeLabel === "Great" || qualitativeLabel === "Good") {
          insightText = `Today's practice is great for managing ${label.toLowerCase()}.`;
        } else {
          insightText = `You focused on ${label.toLowerCase()} today.`;
        }
      } else {
        insightText = "Great job showing up for yourself today.";
      }
    }

    return {
      today: {
        qualitativeLabel,
        insightText,
        score: todayData.score,
        maxScore: 10,
      },
      sevenDay: {
        averageScore: average7DayScore,
        dailyData,
      },
    };
  }, [stats]);

  return { data, isLoading };
}

function getShifts(entries: any[]): number[] {
  const shifts: number[] = [];
  for (const entry of entries) {
    const r = entry.response;
    if (!r) continue;
    const field = PRE_POST_FIELDS[entry.exercise_type as ExerciseType];
    if (!field) continue;
    const pre = r[field.pre];
    const post = r[field.post];
    if (typeof pre === "number" && typeof post === "number") {
      shifts.push(
        field.direction === "pre_minus_post" ? pre - post : post - pre,
      );
    }
  }
  return shifts;
}
