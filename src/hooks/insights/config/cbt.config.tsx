import React from "react";
import { Text } from "@/components/ui/text";
import { SAGE } from "@/lib/tokens";
import { HorizontalBarChart } from "@/src/screens/InsightsScreen/components/HorizontalBarChart";
import { TrendLine } from "@/src/screens/InsightsScreen/components/TrendLine";
import { DISTORTION_LABELS } from "@/src/constants/insights";
import { CBTPracticeScoreCard } from "@/src/components/insights/CBTPracticeScoreCard";
import { ThoughtPatternsCard } from "@/src/components/insights/ThoughtPatternsCard";
import { BeliefDecayCard } from "@/src/components/insights/BeliefDecayCard";
import { average, countBy } from "@/src/utils/insights";
import { getWeekKey } from "@/src/utils/insights/timeRange";
import type { DeepDiveConfig, DeepDiveComputedData } from "./types";

export const cbtConfig: DeepDiveConfig = {
  category: "cbt_core",
  title: "CBT Patterns",
  color: SAGE[500],
  exerciseTypes: ["thought_reframing", "thought_catcher"],
  fieldMappings: [],
  statPills: [
    {
      label: "Reframing",
      getValue: (d) => String(d.custom.totalReframingSessions ?? 0),
    },
    {
      label: "Catcher",
      getValue: (d) => String(d.custom.totalCatcherSessions ?? 0),
    },
    {
      label: "Success",
      getValue: (d) => {
        const rate = d.custom.reframeSuccessRate;
        return rate !== null ? `${Math.round(rate * 100)}%` : null;
      },
    },
  ],
  customAggregator: (entries) => {
    const reframingEntries = entries.filter(
      (e) => e.exercise_type === "thought_reframing",
    );
    const catcherEntries = entries.filter(
      (e) => e.exercise_type === "thought_catcher",
    );

    // Distortion frequency
    const distortionCounts = countBy(
      reframingEntries.flatMap(
        (e) => (e.response?.selectedDistortions as string[]) ?? [],
      ),
      (d) => d,
    );
    const distortionBars = Object.entries(distortionCounts)
      .map(([key, count]) => ({
        key,
        label: DISTORTION_LABELS[key] || key,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Emotion shift trend by week
    const weekBuckets: Record<string, number[]> = {};
    for (const entry of reframingEntries) {
      const weekKey = getWeekKey(entry.completed_at);
      const emotions = entry.response?.selectedEmotions;
      if (!Array.isArray(emotions)) continue;
      for (const em of emotions) {
        if (
          typeof em.initial_intensity === "number" &&
          typeof em.final_intensity === "number"
        ) {
          if (!weekBuckets[weekKey]) weekBuckets[weekKey] = [];
          weekBuckets[weekKey].push(em.initial_intensity - em.final_intensity);
        }
      }
    }
    const emotionShiftTrend = Object.entries(weekBuckets)
      .map(([week, shifts]) => ({ week, avgShift: average(shifts)! }))
      .sort((a, b) => a.week.localeCompare(b.week));

    // Emotion frequency
    const emotionCounts = countBy(
      reframingEntries.flatMap((e) => {
        const emotions = e.response?.selectedEmotions;
        if (!Array.isArray(emotions)) return [];
        return emotions.map((em: any) => em.name).filter(Boolean);
      }),
      (name) => name,
    );
    const emotionCountsList = Object.entries(emotionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Reframe success rate
    let reframeSuccessRate: number | null = null;
    if (reframingEntries.length > 0) {
      const successes = reframingEntries.filter((entry) => {
        const emotions = entry.response?.selectedEmotions;
        if (!Array.isArray(emotions)) return false;
        return emotions.some(
          (em: any) =>
            typeof em.initial_intensity === "number" &&
            typeof em.final_intensity === "number" &&
            em.initial_intensity - em.final_intensity >= 2,
        );
      }).length;
      reframeSuccessRate = successes / reframingEntries.length;
    }

    return {
      distortionBars,
      emotionShiftTrend,
      emotionCounts: emotionCountsList,
      reframeSuccessRate,
      totalReframingSessions: reframingEntries.length,
      totalCatcherSessions: catcherEntries.length,
    };
  },
  sections: [
    {
      key: "distortions",
      title: "Your Thinking Traps",
      render: (data: DeepDiveComputedData) => {
        const bars = data.custom.distortionBars as { label: string; count: number }[];
        if (!bars?.length) return null;
        return (
          <HorizontalBarChart
            data={bars.map((d) => ({ label: d.label, value: d.count }))}
          />
        );
      },
    },
    {
      key: "emotion_shift",
      title: "Emotion Shift Over Time",
      render: (data: DeepDiveComputedData) => {
        const trend = data.custom.emotionShiftTrend as { week: string; avgShift: number }[];
        if (!trend || trend.length < 2) return null;
        return (
          <>
            <TrendLine
              data={trend.map((d) => ({ label: d.week, value: d.avgShift }))}
              color={SAGE[500]}
            />
            <Text className="happy-font-body text-[11px] text-ink-muted mt-2">
              Higher = emotions decreased more after reframing
            </Text>
          </>
        );
      },
    },
    {
      key: "emotions",
      title: "Most Common Emotions",
      render: (data: DeepDiveComputedData) => {
        const emotions = data.custom.emotionCounts as { name: string; count: number }[];
        if (!emotions?.length) return null;
        return (
          <HorizontalBarChart
            data={emotions.slice(0, 5).map((d) => ({
              label: d.name.charAt(0).toUpperCase() + d.name.slice(1),
              value: d.count,
            }))}
            barColor={SAGE[400]}
          />
        );
      },
    },
    {
      key: "cbt-practice-score",
      title: "Practice Score",
      render: () => <CBTPracticeScoreCard />,
    },
    {
      key: "thought-patterns",
      title: "Thought Patterns",
      render: () => <ThoughtPatternsCard />,
    },
    {
      key: "belief-decay",
      title: "Belief Decay",
      render: () => <BeliefDecayCard />,
    },
  ],
};
