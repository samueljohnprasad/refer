# Shared UI Components

Framework: Expo Router / React Native. Styling: NativeWind-style className tokens plus typed raw tokens.

## `src/components/ui/Text.tsx`

```tsx
import React from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { tv, type VariantProps } from "@/lib/tv";

/**
 * Text — typography system mapped to the Duolingo type scale.
 *
 * Variant guide
 * ─────────────
 * display        Largest voice. 36px bold Cormorant. One instance per screen max.
 *                Lesson-complete headline, streak milestone number, onboarding hero.
 *
 * h1             Screen title. 28px. Anchors the user spatially — every major screen
 *                has exactly one. Modal titles, page headers, section introductions.
 *
 * h2             Section heading. 22px. Divides content into discrete groups.
 *                Settings section headers, challenge category names, grouped blocks.
 *
 * h3             Card heading. 18px. Scannable in a thumb-scroll list.
 *                Card titles, lesson names, achievement titles, challenge names.
 *
 * display-italic / h1-italic / h2-italic
 *                Expressive serif italics. Hero pull quotes, celebratory moments,
 *                onboarding emotional beats. Use sparingly — one per screen.
 *
 * body-bold      17px bold Geist. Interactive text — anything the user reads before
 *                making a decision. Answer option text, key instructions, form labels
 *                that precede a tap target.
 *
 * body           17px regular Geist. Informational / non-interactive copy. Explanation
 *                after a correct/incorrect answer, tips, help text, descriptions.
 *                Default color is ink-soft to signal "context, not a prompt to act."
 *
 * caption        13px medium. Secondary metadata below a primary label.
 *                Timestamps, lesson duration estimates, "2 mistakes · 3 min" rows.
 *
 * caption-muted  Same as caption but ink-muted. Truly peripheral info — dates,
 *                counts on inactive items, greyed-out supplementary data.
 *
 * label          14px medium. Form field labels, settings row labels, list item
 *                secondary lines that aren't captions.
 *
 * label-bold     14px bold. Emphasized label — selected state labels, step numbers,
 *                active filter pill text.
 *
 * button-label   17px bold, +0.01em tracking. Matches Button component's label slot.
 *                Use only when rendering a button label outside the Button component.
 *
 * eyebrow        11px bold ALL CAPS, wide tracking, sage-500. Section identifiers
 *                that orient the user. "DAILY REFLECTION", "YOUR PATTERN", "UNIT 2".
 *                Max 3 words — longer strings should use caption or h3 instead.
 *
 * overline       Same as eyebrow but ink-muted. Neutral section label with no brand
 *                accent. Use when the sage colour would compete with nearby content.
 *
 * chip           12px bold. Compact text inside pills, badges, and status chips.
 *                XP labels, duration labels, filter counts — anything inside a
 *                rounded-full container. Inherits ink-soft by default.
 *
 * counter        36px bold Cormorant with tabular numerals. Streak count, XP total,
 *                hearts remaining. Tabular numerals prevent layout shift during
 *                count-up animations. Pair with eyebrow above and caption below.
 *
 * Color override (works with any variant)
 * ────────────────────────────────────────
 * ink / soft / muted   Three ink levels — primary text, secondary, peripheral.
 * sage                 Brand accent — use only where green communicates "active/success".
 * surface              White text — on dark or coloured fills (primary CTA, premium).
 * danger               Cardinal red — error messages, destructive confirmations.
 * streak               Bee-yellow — streak number, XP boost labels.
 * premium              Macaw purple — Super/premium tier labels.
 */
const textTv = tv({
  base: "",
  variants: {
    variant: {
      // ── Heading family (Cormorant) ──────────────────────────────────────────
      // §3 Display — 36px, -0.02em tracking, one instance per screen max
      display:
        "happy-font-heading-bold text-[36px] leading-[39px] tracking-[-0.02em] text-ink",
      // §3 Screen Title (H1) — 28px, -0.01em tracking
      h1: "happy-font-heading text-[28px] leading-[32px] tracking-[-0.01em] text-ink",
      // §3 Section Heading (H2) — 22px, no tracking
      h2: "happy-font-heading text-[22px] leading-[26px] text-ink",
      // §3 Card Heading (H3) — 18px
      h3: "happy-font-heading-medium text-[18px] leading-[22px] text-ink",
      // Italic expressive variants — hero moments, pull quotes
      "display-italic":
        "happy-font-heading-semibold-italic text-[36px] leading-[39px] tracking-[-0.02em] text-ink",
      "h1-italic":
        "happy-font-heading-semibold-italic text-[28px] leading-[32px] tracking-[-0.01em] text-ink",
      "h2-italic":
        "happy-font-heading-medium-italic text-[22px] leading-[26px] text-ink",

      // ── Body family (Geist) ────────────────────────────────────────────────
      // §3 Body Bold — 17px, line-height 1.29 — interactive text, answer options
      "body-bold": "happy-font-body-bold text-[17px] leading-[22px] text-ink",
      // §3 Body Regular — 17px, line-height 1.41 — explanatory / non-interactive
      body: "happy-font-body text-[17px] leading-[24px] text-ink-soft",
      // §3 Caption / Metadata — 13px, medium weight, +0.01em tracking
      caption:
        "happy-font-body-medium text-[13px] leading-[19px] tracking-[0.01em] text-ink-soft",
      "caption-muted":
        "happy-font-body-medium text-[13px] leading-[19px] tracking-[0.01em] text-ink-muted",
      // Label — 14px medium, for form labels and secondary UI text
      label: "happy-font-body-medium text-[14px] leading-[20px] text-ink",
      "label-bold": "happy-font-body-bold text-[14px] leading-[20px] text-ink",
      // §3 Button Label — 17px bold, title case, +0.01em tracking
      "button-label":
        "happy-font-body-bold text-[17px] leading-[22px] tracking-[0.01em] text-brand-surface",
      // §3 Eyebrow — 11px, ALL CAPS, +0.08em tracking, sage accent
      eyebrow:
        "happy-font-body-bold text-[11px] leading-[16px] uppercase tracking-widest text-sage-500",
      // §3 Overline — neutral eyebrow (no sage), for generic section labels
      overline:
        "happy-font-body-bold text-[11px] leading-[16px] uppercase tracking-widest text-ink-muted",
      // §3 Chip — 12px bold, compact pill/badge text
      chip: "happy-font-body-bold text-[12px] leading-[16px] text-ink-soft",
      // §3 Counter / Numeric — tabular numerals, contextual size set via className
      counter:
        "happy-font-heading-bold text-[36px] leading-[36px] tracking-[-0.01em] tabular-nums text-ink",
    },
    color: {
      ink: "text-ink",
      soft: "text-ink-soft",
      muted: "text-ink-muted",
      sage: "text-sage-500",
      surface: "text-brand-surface",
      danger: "text-cardinal-red",
      streak: "text-bee-yellow",
      premium: "text-macaw-purple",
    },
  },
  defaultVariants: { variant: "body" },
});

type TextVariants = VariantProps<typeof textTv>;

interface TextProps extends RNTextProps {
  variant?: TextVariants["variant"];
  color?: TextVariants["color"];
  className?: string;
  allowFontScaling?: boolean;
  children: React.ReactNode;
}

export function Text({
  variant,
  color,
  className,
  allowFontScaling = true,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      className={textTv({ variant, color, class: className })}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={1.5}
      {...rest}
    >
      {children}
    </RNText>
  );
}
```

## `src/components/ui/Button.tsx`

```tsx
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
  disabledLabelColor?: string;
}

const VARIANTS: Record<Exclude<Variant, "ghost">, VariantConfig> = {
  primary: {
    faceColor: SAGE[500],
    rimColor: SAGE[700],
    labelColor: BRAND_SURFACE,
    disabledFaceColor: "#F3F6FA",
    disabledRimColor: "#E9EEF5",
    disabledLabelColor: "#64748B",
  },
  secondary: {
    faceColor: BRAND_SURFACE,
    rimColor: BRAND_BORDER_STRONG,
    labelColor: INK,
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

type Size = "sm" | "md" | "lg" | "xl" | "option";

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
  option: { height: 52, radius: 12, pressDepth: 4, labelSize: 16, defaultWidth: 300 },
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
      Haptics.selectionAsync();
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
  const labelColor = isDisabled 
    ? (config.disabledLabelColor ?? `${config.labelColor}80`)
    : config.labelColor;
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
```

## `src/components/ui/Card.tsx`

```tsx
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
```

## `src/screens/ThoughtReframingScreen/components/EmotionChip.tsx`

```tsx
import React from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { SAGE, BRAND_BORDER, BRAND_SURFACE, INK } from "@/lib/tokens";
import { Feather } from "@expo/vector-icons";
import type { EmotionOption } from "../data/emotions";

interface EmotionChipProps {
  emotion: EmotionOption;
  isSelected: boolean;
  onToggle: () => void;
  /** Optional intensity slider value (0–10) */
  intensity?: number;
  /** Called when intensity changes */
  onIntensityChange?: (value: number) => void;
  disabled?: boolean;
  locked?: boolean;
  suggested?: boolean;
}

export const EmotionChip: React.FC<EmotionChipProps> = React.memo(
  ({
    emotion,
    isSelected,
    onToggle,
    disabled = false,
    locked = false,
    suggested = false,
  }) => {
    const isDisabled = locked || (disabled && !isSelected);

    return (
      <Pressable
        onPress={onToggle}
        disabled={isDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
        accessibilityLabel={`${emotion.label} emotion${suggested ? ", suggested" : ""}`}
        className={`w-full rounded-full border px-3.5 py-2.5 flex-row items-center ${
          isDisabled ? "opacity-45" : ""
        }`}
        style={({ pressed }) => ({
          borderColor: isSelected ? SAGE[600] : BRAND_BORDER,
          backgroundColor: isSelected ? SAGE.selected : BRAND_SURFACE,
          minHeight: 44,
          opacity: pressed ? 0.72 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <Text className="mr-2 text-[17px] leading-[20px]">{emotion.emoji}</Text>
        <Text
          className="flex-1 text-[15px] font-semibold"
          style={{ color: isSelected ? SAGE[800] : INK }}
          numberOfLines={1}
        >
          {emotion.label}
        </Text>
        {isSelected ? (
          <Feather name="check" size={16} color={SAGE[700]} />
        ) : null}
      </Pressable>
    );
  },
);

EmotionChip.displayName = "EmotionChip";
```

## `src/screens/ThoughtReframingScreen/components/DistortionCard.tsx`

```tsx
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Feather } from "@expo/vector-icons";
import { BRAND_BORDER, BRAND_SURFACE, SAGE } from "@/lib/tokens";
import type { CognitiveDistortion } from "../types";

interface DistortionCardProps {
  distortion: CognitiveDistortion;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  locked?: boolean;
  suggested?: boolean;
}

export const DistortionCard: React.FC<DistortionCardProps> = React.memo(
  ({
    distortion,
    isSelected,
    onToggle,
    disabled = false,
    locked = false,
    suggested = false,
  }) => {
    const isDisabled = locked || (disabled && !isSelected);

    return (
      <Pressable
        onPress={onToggle}
        disabled={isDisabled}
        accessibilityRole="checkbox"
        accessibilityLabel={`${distortion.label} thinking pattern${suggested ? ", suggested" : ""}`}
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
        className={`mb-2.5 rounded-2xl border px-4 py-3.5 ${
          isDisabled ? "opacity-50" : ""
        }`}
        style={({ pressed }) => ({
          backgroundColor: isSelected ? SAGE.selected : BRAND_SURFACE,
          borderColor: isSelected ? SAGE[500] : BRAND_BORDER,
          minHeight: 76,
          opacity: pressed ? 0.72 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
      >
        <View className="flex-row items-start">
          <Text className="mr-3 mt-0.5 text-[18px] leading-[22px]">
            {distortion.icon}
          </Text>
          <View className="flex-1">
            <Text
              variant="body-bold"
              className={`text-[15px] leading-[20px] ${
                isSelected ? "text-sage-800" : "text-ink"
              }`}
              numberOfLines={1}
            >
              {distortion.label}
            </Text>
            <Text
              variant="caption"
              color="soft"
              className="mt-1 text-[13px] leading-[18px]"
              numberOfLines={2}
            >
              {distortion.description}
            </Text>
          </View>
          <View
            className="ml-3 h-7 w-7 items-center justify-center rounded-full border"
            style={{
              backgroundColor: isSelected ? SAGE[600] : BRAND_SURFACE,
              borderColor: isSelected ? SAGE[600] : BRAND_BORDER,
            }}
          >
            {isSelected ? (
              <Feather name="check" size={16} color={BRAND_SURFACE} />
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  },
);

DistortionCard.displayName = "DistortionCard";
```

