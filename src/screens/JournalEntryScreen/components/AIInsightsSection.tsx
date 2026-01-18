import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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

/**
 * Enhanced AI insights section with metrics and tag cards
 * Collapsible section with animated chevron
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
      Boolean(copingStrategies && copingStrategies.length > 0);

    if (!hasAnyData) return null;

    return (
      <View className="bg-white/80 dark:bg-gray-900/80 rounded-3xl p-5 mb-6">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Toggle AI Insights"
          activeOpacity={0.8}
          onPress={toggleInsights}
          className="flex-row items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 justify-between"
        >
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 items-center justify-center">
              <Feather name="cpu" size={18} color="#6366F1" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-50 ml-3">
              AI Insights
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
            layout={Layout.springify().damping(20).stiffness(180)}
          >
            {/* Wellness Metrics Card */}
            <InsightMetricsCard
              energyLevel={energyLevel ?? null}
              stressLevel={stressLevel ?? null}
              sleepQuality={sleepQuality ?? null}
            />

            {/* Tag Sections */}
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

            {/* AI Summary Text */}
            {aiInsights && (
              <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mt-2">
                <View className="flex-row items-center mb-2">
                  <Feather name="message-circle" size={16} color="#6B7280" />
                  <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2">
                    Summary
                  </Text>
                </View>
                <Text className="text-base leading-6 text-gray-700 dark:text-gray-300 tracking-wide">
                  {aiInsights}
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
