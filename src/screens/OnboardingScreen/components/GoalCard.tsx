import React, { useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { GoalCardConfig } from "../types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GoalCardProps {
  config: GoalCardConfig;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const TAG_STYLES = {
  casual: "bg-sage-50 text-ink-soft",
  recommended: "bg-sage-200 text-sage-600",
  committed: "bg-terracotta-light text-terracotta",
  serious: "bg-terracotta text-white",
} as const;

const GoalCard: React.FC<GoalCardProps> = ({
  config,
  isSelected,
  onSelect,
  index,
}) => {
  const scale = useSharedValue(1);
  const selectionProgress = useSharedValue(0);
  const minuteScale = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      selectionProgress.value = withTiming(1, { duration: 180 });
      minuteScale.value = withSequence(
        withTiming(1.02, { duration: 100 }),
        withTiming(1, { duration: 140 }),
      );
    } else {
      selectionProgress.value = withTiming(0, { duration: 160 });
      minuteScale.value = withTiming(1, { duration: 160 });
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ["#E6ECDF", "#5A7A56"],
    ),
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ["#FFFFFF", "#F1F6ED"],
    ),
  }));

  const minuteAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: minuteScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.985, { duration: 90 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <Animated.View entering={FadeIn.delay(140 + index * 60).duration(220)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, borderStyle]}
        className="flex-row items-center justify-between rounded-2xl border-2 border-b-4 px-[18px] py-4"
      >
        <View>
          <Animated.Text
            style={minuteAnimStyle}
            className={`happy-font-heading text-[22px] ${isSelected ? "text-sage-600" : "text-ink"}`}
          >
            {config.displayLabel ?? `${config.minutes} min`}
          </Animated.Text>
          <Text
            className="happy-font-body text-xs text-ink-muted"
          >
            {config.description}
          </Text>
        </View>
        <View
          className={`rounded-full px-2.5 py-1 ${TAG_STYLES[config.tagVariant]}`}
        >
          <Text
            className="happy-font-body-bold text-[11px] font-bold uppercase tracking-wide"
          >
            {config.tag}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

export default React.memo(GoalCard);
