import React, { useCallback, useRef } from "react";
import { Pressable, View, type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SPRING_DUOLINGO_PRESS } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { BRAND_BORDER_STRONG, SAGE } from "@/lib/tokens";

// ─── Variant config ───────────────────────────────────────────────────────────
// Each variant defines the face border, shadow colour, and shadow depth.
// The face uses a uniform border — depth comes only from the shadow layer.

type Variant = "tile" | "answer" | "answer-selected" | "word-bank";

interface VariantConfig {
  faceClass: string;
  shadowColor: string;
  shadowDepth: number;
}

const VARIANTS: Record<Variant, VariantConfig> = {
  tile: {
    faceClass: "border-2 border-brand-border bg-brand-surface",
    shadowColor: BRAND_BORDER_STRONG,
    shadowDepth: 3,
  },
  answer: {
    faceClass: "border-2 border-brand-border bg-brand-surface",
    shadowColor: BRAND_BORDER_STRONG,
    shadowDepth: 4,
  },
  "answer-selected": {
    faceClass: "border-2 border-sage-500 bg-sage-selected",
    shadowColor: SAGE[500],
    shadowDepth: 4,
  },
  "word-bank": {
    faceClass: "border-2 border-brand-border bg-brand-surface rounded-full",
    shadowColor: BRAND_BORDER_STRONG,
    shadowDepth: 3,
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

interface CardProps extends Omit<ViewProps, "style"> {
  variant?: Variant;
  radius?: Radius;
  onPress?: () => void;
  haptic?: "none" | "light" | "medium";
  showDepth?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

const DOUBLE_TAP_GUARD_MS = 250;

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
  children,
  ...rest
}: CardProps) {
  const config = VARIANTS[variant];
  const radiusClass = RADIUS_CLASS[radius];
  const shadowDepth = showDepth ? config.shadowDepth : 0;
  const isInteractive = Boolean(onPress) && !disabled;

  const reducedMotion = useReducedMotion();
  const pressY = useSharedValue(0);
  const pressLock = useRef(false);

  const animatedFaceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!isInteractive || reducedMotion) return;
    pressY.value = withSpring(shadowDepth, SPRING_DUOLINGO_PRESS);
  }, [isInteractive, reducedMotion, pressY, shadowDepth]);

  const handlePressOut = useCallback(() => {
    if (!isInteractive || reducedMotion) return;
    pressY.value = withSpring(0, SPRING_DUOLINGO_PRESS);
  }, [isInteractive, reducedMotion, pressY]);

  const handlePress = useCallback(() => {
    if (!isInteractive || pressLock.current) return;

    pressLock.current = true;
    setTimeout(() => {
      pressLock.current = false;
    }, DOUBLE_TAP_GUARD_MS);

    if (haptic === "light")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (haptic === "medium")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    onPress?.();
  }, [isInteractive, haptic, onPress]);

  const hasPadding = contentClassName.includes("p-") || contentClassName.includes("px-") || contentClassName.includes("py-");
  const paddingClass = hasPadding ? "" : "p-4";

  const cardLayers = (
    <>
      {showDepth ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: shadowDepth,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: config.shadowColor,
          }}
          className={radiusClass}
        />
      ) : null}

      {/* Face — springs down into shadow on press */}
      <Animated.View
        style={animatedFaceStyle}
        className={`${config.faceClass} ${radiusClass}`}
      >
        <View className={`${paddingClass} ${contentClassName}`}>{children}</View>
      </Animated.View>
    </>
  );

  if (!isInteractive) {
    return (
      <View
        style={{ position: "relative", paddingBottom: shadowDepth }}
        className={className}
        {...rest}
      >
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
      style={{ position: "relative", paddingBottom: shadowDepth }}
      className={className}
      {...rest}
    >
      {cardLayers}
    </Pressable>
  );
}
