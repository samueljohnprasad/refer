import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { Text } from "@/src/components/ui/Text";
import { AIInsightsSectionProps } from "../types";
import { INSIGHTS_ANIMATION_CONFIG } from "../constants";
import { AIInsightsContent } from "./AIInsightsContent";

export const AIInsightsSection = React.memo<AIInsightsSectionProps>(
  (props: AIInsightsSectionProps) => {
    const { t } = useTranslation("journal");
    const [isInsightsOpen, setIsInsightsOpen] = React.useState(true);
    const insightsOpen = useSharedValue(1);

    const insightsChevronStyle = useAnimatedStyle(() => ({
      transform: [
        { rotate: `${interpolate(insightsOpen.value, [0, 1], [0, 180])}deg` },
      ],
    }));

    const toggleInsights = useCallback((): void => {
      setIsInsightsOpen((previousValue) => {
        const nextValue = !previousValue;
        insightsOpen.value = withTiming(
          nextValue ? 1 : 0,
          INSIGHTS_ANIMATION_CONFIG
        );
        return nextValue;
      });
    }, [insightsOpen]);

    const hasAnyData = Boolean(
      props.aiInsights ||
        props.energyLevel !== null ||
        props.stressLevel !== null ||
        props.sleepQuality !== null ||
        props.achievements?.length ||
        props.worries?.length ||
        props.goals?.length ||
        props.triggers?.length ||
        props.copingStrategies?.length ||
        props.physicalSymptoms?.length ||
        props.cognitivePattern ||
        props.suggestedExerciseName ||
        props.nextJournalPrompt ||
        props.strengthSpotlight
    );

    if (!hasAnyData) return null;

    return (
      <View className="mb-8 mt-4 px-1">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t("insights.toggle")}
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
              {t("insights.whatNoticed")}
            </Text>
          </View>
          <Animated.View style={insightsChevronStyle} className="p-1">
            <Feather
              name="chevron-down"
              size={20}
              color={
                props.colorScheme === "dark" ? Colors.dark.text : Colors.light.text
              }
            />
          </Animated.View>
        </TouchableOpacity>

        {isInsightsOpen && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            <AIInsightsContent {...props} />
          </Animated.View>
        )}
      </View>
    );
  }
);

AIInsightsSection.displayName = "AIInsightsSection";
