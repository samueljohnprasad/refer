import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { AIInsightsSectionProps } from "../types";
import { INSIGHTS_ANIMATION_CONFIG } from "../constants";
import { InsightMetricsCard } from "./InsightMetricsCard";
import { InsightTagsSection, INSIGHT_TAG_CONFIGS } from "./InsightTagsSection";
import { Text } from "@/src/components/ui/Text";

/**
 * AI Insights section — restructured so the resonant reflection leads.
 *
 * Information hierarchy:
 * 1. Hero reflection (aiInsights) — what the AI noticed, specific and personal
 * 2. Cognitive pattern — gentle CBT pattern identification (only when present)
 * 3. Strength spotlight — specific strength demonstrated (only when present)
 * 4. CBT exercise bridge — recommended exercise + why it fits
 * 5. Vitality & Balance — metrics (sleep only when explicitly mentioned)
 * 6. Tag chips — achievements, goals, worries, triggers, coping, symptoms
 * 7. Next journal prompt — forward-looking question to drive return visit
 */
export const AIInsightsSection = React.memo<AIInsightsSectionProps>(
  ({
    aiInsights,
    colorScheme,
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
  }: AIInsightsSectionProps) => {
    const [isInsightsOpen, setIsInsightsOpen] = React.useState<boolean>(true);
    const insightsOpen = useSharedValue<number>(1);

    const insightsChevronStyle = useAnimatedStyle(() => ({
      transform: [
        {
          rotate: `${interpolate(insightsOpen.value, [0, 1], [0, 180])}deg`,
        },
      ],
    }));

    const toggleInsights = useCallback((): void => {
      setIsInsightsOpen((prev: boolean) => {
        const next: boolean = !prev;
        insightsOpen.value = withTiming(
          next ? 1 : 0,
          INSIGHTS_ANIMATION_CONFIG
        );
        return next;
      });
    }, [insightsOpen]);

    const hasAnyData: boolean =
      Boolean(aiInsights) ||
      energyLevel !== null ||
      stressLevel !== null ||
      sleepQuality !== null ||
      Boolean(achievements && achievements.length > 0) ||
      Boolean(worries && worries.length > 0) ||
      Boolean(goals && goals.length > 0) ||
      Boolean(triggers && triggers.length > 0) ||
      Boolean(copingStrategies && copingStrategies.length > 0) ||
      Boolean(physicalSymptoms && physicalSymptoms.length > 0) ||
      Boolean(cognitivePattern) ||
      Boolean(suggestedExerciseName) ||
      Boolean(nextJournalPrompt) ||
      Boolean(strengthSpotlight);

    if (!hasAnyData) return null;

    const hasCBTBridge = Boolean(suggestedExerciseName && suggestedExercise);
    const hasMetrics =
      energyLevel !== null || stressLevel !== null || sleepQuality !== null;
    const hasTagData =
      Boolean(achievements && achievements.length > 0) ||
      Boolean(goals && goals.length > 0) ||
      Boolean(worries && worries.length > 0) ||
      Boolean(triggers && triggers.length > 0) ||
      Boolean(copingStrategies && copingStrategies.length > 0) ||
      Boolean(physicalSymptoms && physicalSymptoms.length > 0);

    return (
      <View className="mb-8 mt-4 px-1">
        {/* ── Header ── */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Toggle AI Insights"
          accessibilityState={{ expanded: isInsightsOpen }}
          activeOpacity={0.8}
          onPress={toggleInsights}
          className="flex-row items-center mb-4 pb-3 border-b border-brand-border/40 justify-between"
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-macaw-purple-tint border border-macaw-purple/20 items-center justify-center">
              <Text className="text-[16px]">✨</Text>
            </View>
            <Text variant="h3" className="ml-3">
              What I noticed
            </Text>
          </View>
          <Animated.View style={insightsChevronStyle} className="p-1">
            <Feather
              name="chevron-down"
              size={20}
              color={
                colorScheme === "dark" ? Colors.dark.text : Colors.light.text
              }
            />
          </Animated.View>
        </TouchableOpacity>

        {isInsightsOpen && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            {/* ── 1. Hero: AI Reflection ── */}
            {aiInsights && (
              <View className="mb-6 mt-2">
                <Text
                  className="text-ink text-[16px] leading-[26px]"
                >
                  {aiInsights}
                </Text>
              </View>
            )}

            {/* ── 2. Cognitive Pattern (CBT) ── */}
            {cognitivePattern && (
              <View className="flex-row items-start mb-4">
                <View className="w-7 h-7 rounded-full bg-macaw-purple-tint/30 items-center justify-center mr-3 mt-0.5">
                  <Feather
                    name="layers"
                    size={13}
                    color="#CE82FF"
                  />
                </View>
                <Text
                  className="text-ink text-[15px] leading-[24px] flex-1"
                >
                  {cognitivePattern}
                </Text>
              </View>
            )}

            {/* ── 3. Strength Spotlight ── */}
            {strengthSpotlight && (
              <View className="flex-row items-start mb-6">
                <View className="w-7 h-7 rounded-full bg-gold-tint/40 items-center justify-center mr-3 mt-0.5">
                  <Feather
                    name="star"
                    size={13}
                    color="#D97706"
                  />
                </View>
                <Text
                  className="text-ink text-[15px] leading-[24px] flex-1"
                >
                  {strengthSpotlight}
                </Text>
              </View>
            )}

            {/* ── 4. CBT Exercise Bridge ── */}
            {hasCBTBridge && (
              <View className="mb-4 bg-sage-50 rounded-xl p-4 border border-sage-100/60">
                <View className="flex-row items-center mb-2">
                  <Feather name="book-open" size={14} color="#4A7C59" />
                  <Text
                    variant="label-bold"
                    className="ml-2 text-[12px] uppercase tracking-wide"
                    style={{ color: "#4A7C59" }}
                  >
                    Try this exercise
                  </Text>
                </View>
                <Text
                  variant="body-bold"
                  className="text-ink text-[15px] mb-1"
                >
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
                  accessibilityLabel={`Open ${suggestedExerciseName} exercise`}
                >
                  <Text
                    className="text-[13px] font-semibold mr-1"
                    style={{ color: "#4A7C59" }}
                  >
                    Open exercise
                  </Text>
                  <Feather name="arrow-right" size={13} color="#4A7C59" />
                </TouchableOpacity>
              </View>
            )}

            {/* ── Divider before supporting data ── */}
            {(hasMetrics || hasTagData) && (
              <View className="border-t border-brand-border/30 mb-4" />
            )}

            {/* ── 5. Vitality Metrics (sleep only when explicitly mentioned) ── */}
            <InsightMetricsCard
              energyLevel={energyLevel ?? null}
              stressLevel={stressLevel ?? null}
              sleepQuality={sleepQuality ?? null}
            />

            {/* ── 6. Tag Sections ── */}
            {achievements && achievements.length > 0 && (
              <InsightTagsSection
                {...INSIGHT_TAG_CONFIGS.achievements}
                items={achievements}
              />
            )}

            {goals && goals.length > 0 && (
              <InsightTagsSection
                {...INSIGHT_TAG_CONFIGS.goals}
                items={goals}
              />
            )}

            {worries && worries.length > 0 && (
              <InsightTagsSection
                {...INSIGHT_TAG_CONFIGS.worries}
                items={worries}
              />
            )}

            {triggers && triggers.length > 0 && (
              <InsightTagsSection
                {...INSIGHT_TAG_CONFIGS.triggers}
                items={triggers}
              />
            )}

            {copingStrategies && copingStrategies.length > 0 && (
              <InsightTagsSection
                {...INSIGHT_TAG_CONFIGS.copingStrategies}
                items={copingStrategies}
              />
            )}

            {physicalSymptoms && physicalSymptoms.length > 0 && (
              <InsightTagsSection
                {...INSIGHT_TAG_CONFIGS.physicalSymptoms}
                items={physicalSymptoms}
              />
            )}

            {/* ── 7. Next Journal Prompt (return-visit hook) ── */}
            {nextJournalPrompt && (
              <View className="mt-3 pt-3.5 border-t border-brand-border/30">
                <View className="flex-row items-center mb-2">
                  <Feather name="edit-3" size={13} color="#888" />
                  <Text
                    variant="caption"
                    className="ml-1.5 text-ink-soft text-[12px] uppercase tracking-wide"
                  >
                    Next time, try exploring
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
          </Animated.View>
        )}
      </View>
    );
  }
);

AIInsightsSection.displayName = "AIInsightsSection";
