import React, { useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { PricingPlanConfig } from "../types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PricingTierCardProps {
  plan: PricingPlanConfig;
  isSelected: boolean;
  onSelect: () => void;
}

const PricingTierCard: React.FC<PricingTierCardProps> = ({
  plan,
  isSelected,
  onSelect,
}) => {
  const scale = useSharedValue(1);
  const selectionProgress = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      selectionProgress.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      selectionProgress.value = withSpring(0, { damping: 20, stiffness: 300 });
    }
  }, [isSelected]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withSpring(0.95, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 200 }),
    );
    onSelect();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[cardStyle, plan.isDecoy ? { opacity: 0.85 } : undefined]}
      className="relative rounded-2xl border-2 px-4 py-3.5"
    >
      {plan.badge && (
        <View className="absolute -top-2.5 right-3 rounded-full bg-gold px-2.5 py-0.5">
          <Text className="text-[10px] font-extrabold uppercase tracking-wide text-sage-700">
            {plan.badge}
          </Text>
        </View>
      )}
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-sm font-semibold ${plan.isDecoy ? "text-ink-soft" : "text-ink"}`}
        >
          {plan.label}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className={`text-lg ${plan.isDecoy ? "text-ink-soft" : "text-sage-600"}`}
          >
            {plan.price}
          </Text>
          {plan.savings && (
            <View className="rounded bg-terracotta px-1.5 py-0.5">
              <Text className="text-[10px] font-bold text-white">
                {plan.savings}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text className="mt-0.5 text-[11px] text-ink-muted">{plan.perUnit}</Text>
      {plan.featured && (
        <Text
          style={{ fontFamily: "CormorantMedium" }}
          className="mt-1 text-xs italic text-sage-600"
        >
          365 days of showing up for yourself
        </Text>
      )}
    </AnimatedPressable>
  );
};

export default React.memo(PricingTierCard);
