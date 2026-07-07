import React from "react";
import { TrendLine } from "@/src/screens/InsightsScreen/components/TrendLine";
import { BigStat } from "@/src/screens/InsightsScreen/components/BigStat";
import { average } from "@/src/utils/insights";
import { getTimeRangeDays } from "@/src/utils/insights/timeRange";
import { SkillProgressionCard } from "@/src/components/insights/SkillProgressionCard";
import { TherapistNotebookCard } from "@/src/components/insights/TherapistNotebookCard";
import type { DeepDiveConfig, DeepDiveComputedData } from "./types";

export const mindfulnessConfig: DeepDiveConfig = {
  category: "mindfulness",
  title: "Mindfulness",
  color: "#5a7a56",
  fieldMappings: [
    { exerciseType: "box_breathing", preField: "preCalmRating", postField: "postCalmRating", direction: "post_minus_pre" },
    { exerciseType: "breathing_478", preField: "preCalmRating", postField: "postCalmRating", direction: "post_minus_pre" },
    { exerciseType: "body_scan_pmr", preField: "preTensionRating", postField: "postTensionRating", direction: "pre_minus_post" },
    { exerciseType: "mindful_breathing_1min", preField: "preRating", postField: "postRating", direction: "post_minus_pre" },
    { exerciseType: "grounding_54321", preField: "prePresenceRating", postField: "presenceRating", direction: "post_minus_pre" },
  ],
  statPills: [
    { label: "Sessions", getValue: (d) => String(d.totalSessions) },
    {
      label: "Calm ↑",
      getValue: (d) => (d.avgShift !== null ? `+${d.avgShift.toFixed(1)}` : null),
    },
    {
      label: "Consistency",
      getValue: (d) => {
        const rate = d.custom.consistencyRate;
        return rate !== undefined ? `${Math.round(rate * 100)}%` : null;
      },
    },
  ],
  customAggregator: (entries) => {
    const uniqueDays = new Set(entries.map((e) => e.completed_at.slice(0, 10)));
    const rangeDays = 30;
    const consistencyRate = Math.min(uniqueDays.size / rangeDays, 1);
    return { consistencyRate };
  },
  sections: [
    {
      key: "weekly",
      title: "Sessions Per Week",
      render: (data: DeepDiveComputedData) => {
        if (data.sessionsPerWeek.length < 2) return null;
        return (
          <TrendLine
            data={data.sessionsPerWeek.map((w) => ({
              label: w.week,
              value: w.count,
            }))}
            color="#5a7a56"
          />
        );
      },
    },
    {
      key: "calm",
      title: "Your Practice",
      render: (data: DeepDiveComputedData) => {
        if (data.avgShift === null) return null;
        return (
          <BigStat
            value={`+${data.avgShift.toFixed(1)}`}
            subtitle="average calm improvement per session"
          />
        );
      },
    },
    {
      key: "consistency",
      title: "Consistency",
      render: (data: DeepDiveComputedData) => {
        const rate = data.custom.consistencyRate;
        if (rate === undefined) return null;
        return (
          <BigStat
            value={`${Math.round(rate * 100)}%`}
            subtitle="of days with a mindfulness practice"
          />
        );
      },
    },
    {
      key: "skill-progression",
      title: "Skill Progression",
      render: () => <SkillProgressionCard />,
    },
    {
      key: "therapist-notebook",
      title: "Therapist Notebook",
      render: () => <TherapistNotebookCard />,
    },
  ],
};
