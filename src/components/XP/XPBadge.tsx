import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "@/constants/palette";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SPRING_BOUNCY } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

interface XPBadgeProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "highlight";
}

const SIZE_CLASSES: Record<string, string> = {
  sm: "px-2 py-0.5",
  md: "px-3 py-1",
  lg: "px-4 py-1.5",
};

const TEXT_SIZE_CLASSES: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const XPBadge: React.FC<XPBadgeProps> = ({
  amount,
  size = "sm",
  variant = "default",
}) => {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue<number>(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    scale.value = withSpring(1, SPRING_BOUNCY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (variant === "highlight") {
    return (
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={GRADIENTS.xpHighlight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-full px-2 py-0.5"
        >
          <Text className={`text-white font-bold ${TEXT_SIZE_CLASSES[size]}`}>
            +{amount} XP
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  // Default: deeply quiet neutral for XP rewards without pulling focus
  return (
    <Animated.View
      style={animatedStyle}
      className={`rounded-full bg-sage-pill px-2 py-0.5 ${SIZE_CLASSES[size]}`}
    >
      <Text className={`happy-font-body-bold text-ink-muted ${TEXT_SIZE_CLASSES[size]}`}>
        +{amount} XP
      </Text>
    </Animated.View>
  );
};
