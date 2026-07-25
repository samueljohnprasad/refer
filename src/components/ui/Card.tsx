import React, { useCallback, useRef } from "react";
import { Pressable, View, type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SPRING_BOUNCY } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

// ─── Variant config ───────────────────────────────────────────────────────────

type Variant = "tile" | "answer" | "answer-selected" | "word-bank" | "dashed" | "solid";

interface VariantConfig {
  faceClass: string;
  rimClass: string;
}

const VARIANTS: Record<Variant, VariantConfig> = {
  tile: {
    faceClass: "bg-white border-2 border-gray-100",
    rimClass: "bg-gray-200",
  },
  answer: {
    faceClass: "bg-white border-2 border-gray-100",
    rimClass: "bg-gray-200",
  },
  "answer-selected": {
    faceClass: "bg-sage-50 border-2 border-sage-200",
    rimClass: "bg-sage-300",
  },
  "word-bank": {
    faceClass: "bg-white border-2 border-gray-100 rounded-full",
    rimClass: "bg-gray-200 rounded-full",
  },
  dashed: {
    faceClass: "border-2 border-dashed border-sage-200 bg-brand-surface shadow-none",
    rimClass: "bg-transparent",
  },
  solid: {
    faceClass: "border-0",
    rimClass: "",
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
  rimStyle?: any;
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
  rimStyle,
  style,
  children,
  ...rest
}: CardProps) {
  const config = VARIANTS[variant];
  const radiusClass = RADIUS_CLASS[radius];
  const isInteractive = Boolean(onPress) && !disabled;

  const reducedMotion = useReducedMotion();
  const pressY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const pressLock = useRef(false);

  const animatedFaceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    if (!isInteractive || reducedMotion) return;
    pressY.value = withTiming(4, { duration: 20 });
    opacity.value = withTiming(0.95, { duration: 20 });

    if (haptic === "light") {
      Haptics.selectionAsync();
    } else if (haptic === "medium") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [isInteractive, reducedMotion, pressY, opacity, haptic]);

  const handlePressOut = useCallback(() => {
    if (!isInteractive || reducedMotion) return;
    pressY.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
    opacity.value = withTiming(1, { duration: 150 });
  }, [isInteractive, reducedMotion, pressY, opacity]);

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
    <>
      {showDepth && isInteractive && (
        <Animated.View
          style={rimStyle}
          className={`absolute left-0 right-0 top-[4px] bottom-[-4px] ${config.rimClass} ${radiusClass}`}
        />
      )}
      <Animated.View
        style={[animatedFaceStyle, faceStyle]}
        className={`${config.faceClass} ${radiusClass}`}
      >
        <View className={`${paddingClass} ${contentClassName}`}>
          {children}
        </View>
      </Animated.View>
    </>
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
