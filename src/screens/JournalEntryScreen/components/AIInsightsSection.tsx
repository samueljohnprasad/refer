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
    physicalSymptoms,
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
      Boolean(physicalSymptoms && physicalSymptoms.length > 0);

    console.log(
      "DEBUG - Achievements:",
      achievements,
      "Worries:",
      worries,
      "Triggers:",
      triggers
    );

    if (!hasAnyData) return null;

    return (
      <View className="bg-white/85 rounded-2xl p-5 mb-8 border border-brand-border">
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
              <Feather name="cpu" size={16} color="#CE82FF" />
            </View>
            <Text variant="h3" className="ml-3">
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

            {physicalSymptoms && physicalSymptoms.length > 0 && (
              <InsightTagsSection
                {...INSIGHT_TAG_CONFIGS.physicalSymptoms}
                items={physicalSymptoms}
              />
            )}

            {/* AI Synthesis Narrative */}
            {aiInsights && (
              <View className="mt-2 pt-3.5 border-t border-brand-border/30">
                <Text variant="body" className="text-ink text-[15px] leading-[24px]">
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
