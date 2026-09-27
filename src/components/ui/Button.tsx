import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { ActivityIndicator, type DimensionValue, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { SvgAppButton } from "@/src/domains/journey/ui/components/svg-app-button";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import {
  VARIANTS,
  SIZES,
  type ButtonProps,
} from "./button.config";

export * from "./button.config";

// ─── Component ───────────────────────────────────────────────────────────────

export function Button({
  label = "",
  variant = "primary",
  size = "lg",
  round = false,
  height,
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
  labelClassName = "",
}: ButtonProps) {
  const sizeConfig = SIZES[size];
  const isDisabled = disabled || loading;
  const isFlexGrow = className.includes("flex-1") || className.includes("flex-grow") || className.includes("flex-shrink");
  const shouldBeFullWidth = fullWidth || isFlexGrow;
  const computedWidth: DimensionValue = shouldBeFullWidth ? "100%" : (width ?? sizeConfig.defaultWidth);
  const computedHeight = height ?? (round && width ? width : sizeConfig.height);
  // ponytail: all tactile buttons use full pill radius like lesson footer
  const radius = round || variant !== "ghost" ? computedHeight / 2 : sizeConfig.radius;
  const pressDepth = round && width && width <= 56 ? 3 : sizeConfig.pressDepth;

  const handlePressIn = () => {
    if (isDisabled) return;
    if (haptic === "light") Haptics.selectionAsync();
    if (haptic === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePress = () => {
    if (isDisabled) return;
    onPress?.();
  };

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
          height: computedHeight,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: shouldBeFullWidth ? "stretch" : "flex-start",
          width: computedWidth,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={SEMANTIC_COLORS.text.secondary} />
        ) : label ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {leftIcon}
            <Text
              className={labelClassName}
              style={{
                fontFamily: APP_FONT_FAMILIES.bold,
                fontSize: sizeConfig.labelSize,
                color: SEMANTIC_COLORS.text.secondary,
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

  // All other variants — canonical 3D tactile button via SvgAppButton
  const config = VARIANTS[variant];
  const faceColor = isDisabled ? config.disabledFaceColor : config.faceColor;
  const rimColor = isDisabled ? config.disabledRimColor : config.rimColor;
  const labelColor = isDisabled 
    ? (config.disabledLabelColor ?? config.labelColor)
    : config.labelColor;

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
        height={computedHeight}
        leftRadius={radius}
        rightRadius={radius}
        pressDepth={pressDepth}
        color={faceColor as string}
        backgroundColor={rimColor as string}
        disabled={isDisabled}
        onPress={handlePress}
        onPressIn={handlePressIn}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={labelColor as string} />
        ) : label ? (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {leftIcon}
            <Text
              className={labelClassName}
              style={{
                fontFamily: APP_FONT_FAMILIES.bold,
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

