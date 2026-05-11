import React, { useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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
      selectionProgress.value = withSpring(1, { damping: 15, stiffness: 200 });
      minuteScale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 400 }),
        withSpring(1, { damping: 12, stiffness: 200 }),
      );
    } else {
      selectionProgress.value = withTiming(0, { duration: 200 });
      minuteScale.value = withTiming(1, { duration: 200 });
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ["#E8E2D2", "#5A7A56"],
    ),
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ["#FFFCF5", "#EEF2E8"],
    ),
  }));

  const minuteAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: minuteScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 80).duration(400)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, borderStyle]}
        className="flex-row items-center justify-between rounded-2xl border-2 border-b-4 px-[18px] py-4"
      >
        <View>
          <Animated.Text
            style={[{ fontFamily: "CormorantSemiBold" }, minuteAnimStyle]}
            className={`text-[22px] ${isSelected ? "text-sage-600" : "text-ink"}`}
          >
            {config.minutes} min
          </Animated.Text>
          <Text className="text-xs text-ink-muted">{config.description}</Text>
        </View>
        <View
          className={`rounded-full px-2.5 py-1 ${TAG_STYLES[config.tagVariant]}`}
        >
          <Text className="text-[11px] font-bold uppercase tracking-wide">
            {config.tag}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

export default React.memo(GoalCard);
