import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { HorizontalBarChart } from "@/src/screens/InsightsScreen/components/HorizontalBarChart";
import { BigStat } from "@/src/screens/InsightsScreen/components/BigStat";
import { TRIGGER_LABELS } from "@/src/constants/insights";
import type { DeepDiveConfig, DeepDiveComputedData } from "./types";

export const overthinkingConfig: DeepDiveConfig = {
  category: "overthinking",
  title: "Overthinking",
  color: "#5a7a56",
  fieldMappings: [
    {
      exerciseType: "recognizing_rumination",
      preField: "preRating",
      postField: "postRating",
      direction: "pre_minus_post",
    },
    {
      exerciseType: "detached_mindfulness",
      preField: "preRating",
      postField: "checkInRating",
      direction: "pre_minus_post",
    },
    {
      exerciseType: "attention_training",
      preField: "preRating",
      postField: "postRating",
      direction: "pre_minus_post",
    },
  ],
  statPills: [
    { label: "Sessions", getValue: (d) => String(d.totalSessions) },
    {
      label: "Detachment",
      getValue: (d) => String(d.custom.detachmentCount ?? 0),
    },
    {
      label: "ATT",
      getValue: (d) => String(d.custom.attentionTrainingCount ?? 0),
    },
    {
      label: "Avg Drop",
      getValue: (d) =>
        d.avgShift !== null ? `−${d.avgShift.toFixed(1)}` : null,
    },
  ],
  customAggregator: (entries) => {
    const triggerCounts: Record<string, number> = {};
    for (const entry of entries) {
      if (entry.exercise_type === "recognizing_rumination") {
        const theme = entry.response?.theme;
        if (typeof theme === "string" && theme) {
          triggerCounts[theme] = (triggerCounts[theme] || 0) + 1;
        }
      }
    }
    const ruminationTriggers = Object.entries(triggerCounts)
      .map(([key, count]) => ({
        trigger: TRIGGER_LABELS[key] || key.replace(/_/g, " "),
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const detachmentCount = entries.filter(
      (e) => e.exercise_type === "detached_mindfulness",
    ).length;
    const attentionTrainingCount = entries.filter(
      (e) => e.exercise_type === "attention_training",
    ).length;

    return { ruminationTriggers, detachmentCount, attentionTrainingCount };
  },
  sections: [
    {
      key: "triggers",
      title: "Rumination Triggers",
      render: (data: DeepDiveComputedData) => {
        const triggers = data.custom.ruminationTriggers as {
          trigger: string;
          count: number;
        }[];
        if (!triggers?.length) return null;
        return (
          <HorizontalBarChart
            data={triggers.map((t) => ({ label: t.trigger, value: t.count }))}
            barColor="#5a7a56"
          />
        );
      },
    },
    {
      key: "progress",
      title: "Your Progress",
      render: (data: DeepDiveComputedData) => {
        if (data.avgShift === null) return null;
        return (
          <BigStat
            value={`−${data.avgShift.toFixed(1)}`}
            subtitle="average overthinking reduction per session"
          />
        );
      },
    },
    {
      key: "techniques",
      title: "Techniques Used",
      render: (data: DeepDiveComputedData) => {
        const det = data.custom.detachmentCount ?? 0;
        const att = data.custom.attentionTrainingCount ?? 0;
        return (
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="happy-font-heading-bold text-[28px] text-ink">
                {det}
              </Text>
              <Text className="happy-font-body text-[11px] text-ink-muted mt-0.5 text-center">
                Detached Mindfulness
              </Text>
            </View>
            <View className="items-center">
              <Text className="happy-font-heading-bold text-[28px] text-ink">
                {att}
              </Text>
              <Text className="happy-font-body text-[11px] text-ink-muted mt-0.5 text-center">
                Attention Training
              </Text>
            </View>
          </View>
        );
      },
    },
  ],
};
