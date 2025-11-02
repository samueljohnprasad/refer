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

/**
 * Presentational component for AI insights section
 * Collapsible section with animated chevron
 */
export const AIInsightsSection = React.memo<AIInsightsSectionProps>(
  ({ aiInsights, colorScheme }: AIInsightsSectionProps) => {
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

    return (
      <View className="bg-background-50 dark:bg-background-900 rounded-2xl p-5 mb-6 shadow-soft-1">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Toggle AI Insights"
          activeOpacity={0.8}
          onPress={toggleInsights}
          className="flex-row items-center mb-4 pb-3 border-b border-outline-100 dark:border-outline-800 justify-between"
        >
          <View className="flex-row items-center">
            <Feather name="eye" size={22} color="#7B61FF" />
            <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 ml-2">
              AI Insights
            </Text>
          </View>
          <Animated.View style={insightsChevronStyle} className="p-1">
            <Feather
              name="chevron-down"
              size={18}
              color={
                colorScheme === "dark" ? Colors.dark.text : Colors.light.text
              }
            />
          </Animated.View>
        </TouchableOpacity>
        {isInsightsOpen && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(120)}
            layout={Layout.springify().damping(20).stiffness(180)}
          >
            <Text className="text-base leading-6 text-typography-600 dark:text-typography-300 tracking-[0.2px]">
              {aiInsights || ""}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  }
);

AIInsightsSection.displayName = "AIInsightsSection";
