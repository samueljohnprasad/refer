import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { AIInsightsSectionProps } from "../types";
import { InsightMetricsCard } from "./InsightMetricsCard";
import { InsightTagsSection, INSIGHT_TAG_CONFIGS } from "./InsightTagsSection";

export const AIInsightsContent = React.memo<AIInsightsSectionProps>(
  ({
    aiInsights,
    energyLevel,
    stressLevel,
    sleepQuality,
    achievements,
    worries,
    goals,
    triggers,
    copingStrategies,
    physicalSymptoms,
    cognitivePattern,
    suggestedExerciseName,
    suggestedExercise,
    nextJournalPrompt,
    strengthSpotlight,
  }) => {
    const { t } = useTranslation("journal");
    const hasCBTBridge = Boolean(suggestedExerciseName && suggestedExercise);
    const hasMetrics =
      energyLevel !== null || stressLevel !== null || sleepQuality !== null;
    const hasTagData = Boolean(
      achievements?.length ||
        goals?.length ||
        worries?.length ||
        triggers?.length ||
        copingStrategies?.length ||
        physicalSymptoms?.length
    );

    return (
      <>
        {aiInsights && (
          <View className="mb-6 mt-2">
            <Text className="text-ink text-[16px] leading-[26px]">
              {aiInsights}
            </Text>
          </View>
        )}

        {cognitivePattern && (
          <View className="flex-row items-start mb-4">
            <View className="w-7 h-7 rounded-full bg-macaw-purple-tint/30 items-center justify-center mr-3 mt-0.5">
              <Feather name="layers" size={13} color="#CE82FF" />
            </View>
            <Text className="text-ink text-[15px] leading-[24px] flex-1">
              {cognitivePattern}
            </Text>
          </View>
        )}

        {strengthSpotlight && (
          <View className="flex-row items-start mb-6">
            <View className="w-7 h-7 rounded-full bg-gold-tint/40 items-center justify-center mr-3 mt-0.5">
              <Feather name="star" size={13} color="#D97706" />
            </View>
            <Text className="text-ink text-[15px] leading-[24px] flex-1">
              {strengthSpotlight}
            </Text>
          </View>
        )}

        {hasCBTBridge && (
          <View className="mb-4 bg-sage-50 rounded-xl p-4 border border-sage-100/60">
            <View className="flex-row items-center mb-2">
              <Feather name="book-open" size={14} color="#4A7C59" />
              <Text
                variant="label-bold"
                className="ml-2 text-[12px] uppercase tracking-wide"
                style={{ color: "#4A7C59" }}
              >
                {t("insights.tryExercise")}
              </Text>
            </View>
            <Text variant="body-bold" className="text-ink text-[15px] mb-1">
              {suggestedExerciseName}
            </Text>
            <Text
              variant="body"
              className="text-ink-soft text-[13px] leading-[19px]"
            >
              {suggestedExercise}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className="mt-3 flex-row items-center self-start"
              accessibilityRole="button"
              accessibilityLabel={t("insights.openExercise", {
                name: suggestedExerciseName,
              })}
            >
              <Text
                className="text-[13px] font-semibold mr-1"
                style={{ color: "#4A7C59" }}
              >
                {t("insights.openExerciseAction")}
              </Text>
              <Feather name="arrow-right" size={13} color="#4A7C59" />
            </TouchableOpacity>
          </View>
        )}

        {(hasMetrics || hasTagData) && (
          <View className="border-t border-brand-border/30 mb-4" />
        )}

        <InsightMetricsCard
          energyLevel={energyLevel ?? null}
          stressLevel={stressLevel ?? null}
          sleepQuality={sleepQuality ?? null}
        />

        <InsightTagList items={achievements} config={INSIGHT_TAG_CONFIGS.achievements} />
        <InsightTagList items={goals} config={INSIGHT_TAG_CONFIGS.goals} />
        <InsightTagList items={worries} config={INSIGHT_TAG_CONFIGS.worries} />
        <InsightTagList items={triggers} config={INSIGHT_TAG_CONFIGS.triggers} />
        <InsightTagList
          items={copingStrategies}
          config={INSIGHT_TAG_CONFIGS.copingStrategies}
        />
        <InsightTagList
          items={physicalSymptoms}
          config={INSIGHT_TAG_CONFIGS.physicalSymptoms}
        />

        {nextJournalPrompt && (
          <View className="mt-3 pt-3.5 border-t border-brand-border/30">
            <View className="flex-row items-center mb-2">
              <Feather name="edit-3" size={13} color="#888" />
              <Text
                variant="caption"
                className="ml-1.5 text-ink-soft text-[12px] uppercase tracking-wide"
              >
                {t("insights.nextTime")}
              </Text>
            </View>
            <Text
              variant="body"
              className="text-ink text-[14px] leading-[22px]"
              style={{ fontStyle: "italic" }}
            >
              "{nextJournalPrompt}"
            </Text>
          </View>
        )}
      </>
    );
  }
);

interface InsightTagListProps {
  items?: string[] | null;
  config: Omit<React.ComponentProps<typeof InsightTagsSection>, "items">;
}

function InsightTagList({ items, config }: InsightTagListProps): JSX.Element | null {
  if (!items?.length) return null;
  return <InsightTagsSection {...config} items={items} />;
}

AIInsightsContent.displayName = "AIInsightsContent";
