import React, { useCallback, useRef } from "react";
import { Pressable, View, type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SPRING_BOUNCY } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

// ─── Variant config ───────────────────────────────────────────────────────────

type Variant = "tile" | "answer" | "answer-selected" | "word-bank" | "dashed";

interface VariantConfig {
  faceClass: string;
}

const VARIANTS: Record<Variant, VariantConfig> = {
  tile: {
    faceClass: "bg-white shadow-sm border border-gray-100/50",
  },
  answer: {
    faceClass: "bg-white shadow-sm border border-gray-100/50",
  },
  "answer-selected": {
    faceClass: "bg-sage-50 border border-sage-200",
  },
  "word-bank": {
    faceClass: "bg-white shadow-sm border border-gray-100/50 rounded-full",
  },
  dashed: {
    faceClass: "border-2 border-dashed border-sage-200 bg-brand-surface shadow-none",
  },
};

// ─── Radius ───────────────────────────────────────────────────────────────────

type Radius = "sm" | "md" | "lg" | "xl" | "full";

const RADIUS_CLASS: Record<Radius, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
  full: "rounded-full",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardProps extends ViewProps {
  variant?: Variant;
  radius?: Radius;
  onPress?: () => void;
  haptic?: "none" | "light" | "medium";
  showDepth?: boolean; // Kept for backwards compatibility but ignored visually
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  faceStyle?: any;
  children: React.ReactNode;
}

const DOUBLE_TAP_GUARD_MS = 250;
const PRESS_SCALE = 0.98;

// ─── Component ────────────────────────────────────────────────────────────────

export function Card({
  variant = "tile",
  radius = "md",
  onPress,
  haptic = "light",
  showDepth = true,
  disabled = false,
  className = "",
  contentClassName = "",
  faceStyle,
  style,
  children,
  ...rest
}: CardProps) {
  const config = VARIANTS[variant];
  const radiusClass = RADIUS_CLASS[radius];
  const isInteractive = Boolean(onPress) && !disabled;

  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const pressLock = useRef(false);

  const animatedFaceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    if (!isInteractive || reducedMotion) return;
    scale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
    opacity.value = withSpring(0.95, SPRING_BOUNCY);

    if (haptic === "light") {
      Haptics.selectionAsync();
    } else if (haptic === "medium") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [isInteractive, reducedMotion, scale, opacity, haptic]);

  const handlePressOut = useCallback(() => {
    if (!isInteractive || reducedMotion) return;
    scale.value = withSpring(1, SPRING_BOUNCY);
    opacity.value = withSpring(1, SPRING_BOUNCY);
  }, [isInteractive, reducedMotion, scale, opacity]);

  const handlePress = useCallback(() => {
    if (!isInteractive || pressLock.current) return;

    pressLock.current = true;
    setTimeout(() => {
      pressLock.current = false;
    }, DOUBLE_TAP_GUARD_MS);

    onPress?.();
  }, [isInteractive, onPress]);

  const hasPadding =
    contentClassName.includes("p-") ||
    contentClassName.includes("px-") ||
    contentClassName.includes("py-");
  const paddingClass = hasPadding ? "" : "p-4";

  const cardLayers = (
    <Animated.View
      style={[animatedFaceStyle, faceStyle]}
      className={`${config.faceClass} ${radiusClass}`}
    >
      <View className={`${paddingClass} ${contentClassName}`}>
        {children}
      </View>
    </Animated.View>
  );

  const containerStyle = [
    { position: "relative" } as const,
    style,
  ];

  if (!isInteractive) {
    return (
      <View style={containerStyle} className={className} {...rest}>
        {cardLayers}
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={containerStyle}
      className={className}
      {...rest}
    >
      {cardLayers}
    </Pressable>
  );
}
