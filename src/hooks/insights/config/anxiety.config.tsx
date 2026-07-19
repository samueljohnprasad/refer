import React from "react";
import { Text } from "@/components/ui/Text";
import { HorizontalBarChart } from "@/src/screens/InsightsScreen/components/HorizontalBarChart";
import { TrendLine } from "@/src/screens/InsightsScreen/components/TrendLine";
import { EXERCISE_LABELS } from "@/src/constants/insights";
import { average } from "@/src/utils/insights";
import { PersonalEffectivenessCard } from "@/src/components/insights/PersonalEffectivenessCard";
import { TriggerClusterCard } from "@/src/components/insights/TriggerClusterCard";
import type { DeepDiveConfig, DeepDiveComputedData } from "./types";
import type { ExerciseType } from "@/src/types/exerciseFlow";

export const anxietyConfig: DeepDiveConfig = {
  category: "anxiety",
  title: "Anxiety",
  color: "#c8694b",
  fieldMappings: [
    {
      exerciseType: "worry_decision_tree",
      preField: "preAnxietyRating",
      postField: "postAnxietyRating",
      direction: "pre_minus_post",
    },
    {
      exerciseType: "decatastrophizing",
      preField: "anxietyBefore",
      postField: "anxietyAfter",
      direction: "pre_minus_post",
    },
  ],
  statPills: [
    { label: "Sessions", getValue: (d) => String(d.totalSessions) },
    {
      label: "Avg Drop",
      getValue: (d) =>
        d.avgShift !== null ? `−${d.avgShift.toFixed(1)}` : null,
    },
  ],
  customAggregator: (entries) => {
    const byType: Record<string, { total: number; count: number }> = {};
    for (const entry of entries) {
      const pre =
        entry.response?.preAnxietyRating ?? entry.response?.anxietyBefore;
      const post =
        entry.response?.postAnxietyRating ?? entry.response?.anxietyAfter;
      if (typeof pre !== "number" || typeof post !== "number") continue;
      const type = entry.exercise_type;
      if (!byType[type]) byType[type] = { total: 0, count: 0 };
      byType[type].total += pre - post;
      byType[type].count++;
    }
    const techniques = Object.entries(byType)
      .map(([type, { total, count }]) => ({
        type: type as ExerciseType,
        label: EXERCISE_LABELS[type as ExerciseType] || type,
        avgReduction: total / count,
        count,
      }))
      .sort((a, b) => b.avgReduction - a.avgReduction);
    return { techniques };
  },
  sections: [
    {
      key: "techniques",
      title: "Technique Effectiveness",
      render: (data: DeepDiveComputedData) => {
        const techniques = data.custom.techniques as {
          label: string;
          avgReduction: number;
        }[];
        if (!techniques?.length) return null;
        return (
          <>
            <HorizontalBarChart
              data={techniques.map((t) => ({
                label: t.label,
                value: Math.round(t.avgReduction * 10) / 10,
              }))}
              barColor="#c8694b"
            />
            <Text className="happy-font-body text-[11px] text-ink-muted mt-2">
              Average anxiety reduction per technique
            </Text>
          </>
        );
      },
    },
    {
      key: "trend",
      title: "Anxiety Over Time",
      render: (data: DeepDiveComputedData) => {
        if (data.sessions.length < 2) return null;
        return (
          <>
            <TrendLine
              data={data.sessions.slice(-12).map((s) => ({
                label: s.date.slice(5, 10),
                value: s.shift,
              }))}
              color="#c8694b"
            />
            <Text className="happy-font-body text-[11px] text-ink-muted mt-2">
              Higher = greater anxiety reduction per session
            </Text>
          </>
        );
      },
    },
    {
      key: "personal-effectiveness",
      title: "Exercise Effectiveness",
      render: () => <PersonalEffectivenessCard />,
    },
    {
      key: "trigger-clusters",
      title: "Trigger Clusters",
      render: () => <TriggerClusterCard />,
    },
  ],
};
