import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import {
  VARIANTS,
  SIZES,
  type ButtonProps,
} from "./button.config";

export * from "./button.config";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const computedWidth = shouldBeFullWidth ? "100%" : (width ?? sizeConfig.defaultWidth);
  const computedHeight = height ?? (round && width ? width : sizeConfig.height);
  const radius = round ? 9999 : (variant === "pill" ? 9999 : sizeConfig.radius);
  const pressDepth = round && width && width <= 56 ? 3 : sizeConfig.pressDepth;

  const pressY = useSharedValue(0);

  const handlePressIn = () => {
    if (isDisabled) return;
    if (haptic === "light") Haptics.selectionAsync();
    if (haptic === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    pressY.value = withTiming(pressDepth, { duration: 20 });
  };

  const handlePressOut = () => {
    if (isDisabled) return;
    pressY.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
  };

  const handlePress = () => {
    if (isDisabled) return;
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));

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

  // All other variants — 3D tactile button
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
      {/* Rim (Shadow Base) */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: pressDepth,
          height: computedHeight,
          backgroundColor: rimColor,
          borderRadius: radius,
        }}
      />
      
      {/* 3D Face */}
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[
          {
            height: computedHeight,
            backgroundColor: faceColor,
            borderRadius: radius,
            borderColor: config.faceStrokeColor || rimColor,
            borderWidth: config.faceStrokeWidth ? config.faceStrokeWidth / 2 : 1,
            justifyContent: "center",
            alignItems: "center",
          },
          !config.faceStrokeWidth && {
            borderWidth: 0,
          },
          animatedStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={labelColor} />
        ) : label ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
      </AnimatedPressable>
    </View>
  );
}

