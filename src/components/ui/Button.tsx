import React, { type ReactElement } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { SvgAppButton } from "@/src/components/journey/svg-app-button";
import {
  SAGE,
  BRAND_BORDER_STRONG,
  BRAND_SURFACE,
  OTTER_BLUE,
  OTTER_BLUE_TINT,
  TERRACOTTA,
  TERRACOTTA_TINT,
  GOLD,
  INK,
  INK_SOFT,
} from "@/lib/tokens";

// ─── Variant config ──────────────────────────────────────────────────────────

type Variant =
  | "primary"
  | "secondary"
  | "correct"
  | "incorrect"
  | "destructive"
  | "premium"
  | "streak"
  | "ghost"
  | "pill"
  | "danger";

interface VariantConfig {
  faceColor: string;
  rimColor: string;
  labelColor: string;
  disabledFaceColor: string;
  disabledRimColor: string;
}

const VARIANTS: Record<Exclude<Variant, "ghost">, VariantConfig> = {
  primary: {
    faceColor: SAGE[500],
    rimColor: SAGE[700],
    labelColor: BRAND_SURFACE,
    disabledFaceColor: SAGE[200],
    disabledRimColor: SAGE[300],
  },
  secondary: {
    faceColor: BRAND_SURFACE,
    rimColor: BRAND_BORDER_STRONG,
    labelColor: INK_SOFT,
    disabledFaceColor: "#F7F7F7",
    disabledRimColor: "#E5E5E5",
  },
  correct: {
    faceColor: OTTER_BLUE_TINT,
    rimColor: OTTER_BLUE,
    labelColor: "#0A7DB8",
    disabledFaceColor: "#F0F9FF",
    disabledRimColor: "#A0D8F8",
  },
  incorrect: {
    faceColor: TERRACOTTA_TINT,
    rimColor: TERRACOTTA,
    labelColor: "#D10000",
    disabledFaceColor: "#FFF0F0",
    disabledRimColor: "#FFA0A0",
  },
  destructive: {
    faceColor: BRAND_SURFACE,
    rimColor: TERRACOTTA,
    labelColor: TERRACOTTA,
    disabledFaceColor: "#F7F7F7",
    disabledRimColor: "#FFA0A0",
  },
  danger: {
    faceColor: TERRACOTTA,
    rimColor: "#C1272D",
    labelColor: BRAND_SURFACE,
    disabledFaceColor: "#FFF0F0",
    disabledRimColor: "#FFA0A0",
  },
  premium: {
    faceColor: "#9B59B6",
    rimColor: "#7B3AAD",
    labelColor: BRAND_SURFACE,
    disabledFaceColor: "#E8D4FF",
    disabledRimColor: "#B880D8",
  },
  streak: {
    faceColor: GOLD,
    rimColor: "#C89400",
    labelColor: INK,
    disabledFaceColor: "#FFF5D6",
    disabledRimColor: "#E0C060",
  },
  pill: {
    faceColor: BRAND_SURFACE,
    rimColor: BRAND_BORDER_STRONG,
    labelColor: INK,
    disabledFaceColor: "#F7F7F7",
    disabledRimColor: "#E5E5E5",
  },
};

// ─── Size config ─────────────────────────────────────────────────────────────

type Size = "sm" | "md" | "lg" | "xl";

interface SizeConfig {
  height: number;
  radius: number;
  pressDepth: number;
  labelSize: number;
  defaultWidth: number;
}

const SIZES: Record<Size, SizeConfig> = {
  sm: { height: 44, radius: 22, pressDepth: 3, labelSize: 15, defaultWidth: 120 },
  md: { height: 48, radius: 22, pressDepth: 4, labelSize: 16, defaultWidth: 150 },
  lg: { height: 56, radius: 22, pressDepth: 4, labelSize: 17, defaultWidth: 200 },
  xl: { height: 80, radius: 40, pressDepth: 6, labelSize: 20, defaultWidth: 80 },
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface ButtonProps {
  label?: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  width?: number;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  accessibilityLabel?: string;
  haptic?: "none" | "light" | "medium";
  className?: string;
  labelClassName?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Button({
  label = "",
  variant = "primary",
  size = "lg",
  fullWidth = true,
  width,
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  haptic = "light",
  className = "",
}: ButtonProps) {
  const sizeConfig = SIZES[size];
  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    if (isDisabled) return;
    if (haptic === "light")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (haptic === "medium")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePress = () => {
    if (isDisabled) return;
    onPress?.();
  };

  const isFlexGrow = className.includes("flex-1") || className.includes("flex-grow") || className.includes("flex-shrink");
  const shouldBeFullWidth = fullWidth || isFlexGrow;
  const computedWidth = shouldBeFullWidth ? "100%" : (width ?? sizeConfig.defaultWidth);

  // Ghost variant — plain pressable, no depth
  if (variant === "ghost") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        className={className}
        style={{
          height: sizeConfig.height,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: shouldBeFullWidth ? "stretch" : "flex-start",
          width: computedWidth,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={INK_SOFT} />
        ) : label ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {leftIcon}
            <Text
              style={{
                fontFamily: "GeistBold",
                fontSize: sizeConfig.labelSize,
                color: INK_SOFT,
              }}
            >
              {label}
            </Text>
            {rightIcon}
          </View>
        ) : (
          leftIcon ?? rightIcon
        )}
      </Pressable>
    );
  }

  // All other variants — SvgAppButton with 3D depth
  const config = VARIANTS[variant];
  const faceColor = isDisabled ? config.disabledFaceColor : config.faceColor;
  const rimColor = isDisabled ? config.disabledRimColor : config.rimColor;
  const labelColor = isDisabled ? `${config.labelColor}80` : config.labelColor;
  const radius = variant === "pill" ? 9999 : sizeConfig.radius;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={{
        alignSelf: shouldBeFullWidth ? "stretch" : "flex-start",
        width: computedWidth,
      }}
      className={className}
    >
      <SvgAppButton
        width={computedWidth}
        height={sizeConfig.height}
        color={faceColor}
        backgroundColor={rimColor}
        leftRadius={radius}
        rightRadius={radius}
        pressDepth={sizeConfig.pressDepth}
        onPress={handlePress}
        onPressIn={handlePressIn}
        disabled={isDisabled}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={labelColor} />
        ) : label ? (
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            {leftIcon}
            <Text
              style={{
                fontFamily: "GeistBold",
                fontSize: sizeConfig.labelSize,
                letterSpacing: 0.01 * sizeConfig.labelSize,
                color: labelColor,
              }}
            >
              {label}
            </Text>
            {rightIcon}
          </View>
        ) : (
          leftIcon ?? rightIcon
        )}
      </SvgAppButton>
    </View>
  );
}
