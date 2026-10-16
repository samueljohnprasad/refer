import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  TouchableOpacity,
  Text as RNText,
  StyleSheet,
  StyleProp,
  ViewStyle,
  type ColorValue,
} from "react-native";
import { AnimatedProgressBar } from "@/src/components/progress";
import { SymbolView } from "expo-symbols";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export interface LessonHeaderProps {
  /** Callback when the close/back button is pressed */
  onClose?: () => void;
  /** Current progress value (0 to 1, or percentage) */
  progress?: number;
  /** Label to show on the trailing edge, e.g., "+10 XP" */
  trailingLabel?: string;
  /** Color of the 'x' close icon */
  iconColor?: ColorValue;
  /** Color of the trailing label text */
  trailingLabelColor?: ColorValue;
  /** Color of the progress bar fill */
  progressFillColor?: ColorValue;
  /** Color of the progress bar track */
  progressTrackColor?: ColorValue;
  /** Height of the progress bar */
  progressHeight?: number;
  /** Type of back button to show */
  backButtonVariant?: "close-text" | "close-icon" | "arrow";
  /** Optional container style */
  style?: StyleProp<ViewStyle>;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  onClose,
  progress,
  trailingLabel,
  iconColor = SEMANTIC_COLORS.text.secondary,
  trailingLabelColor = SEMANTIC_COLORS.brand.pressed,
  progressFillColor = SEMANTIC_COLORS.brand.primary,
  progressTrackColor = SEMANTIC_COLORS.brand.soft,
  progressHeight = 8,
  backButtonVariant = "close-icon",
  style,
}) => {
  const { t } = useTranslation("journeys");
  return (
    <View style={[styles.container, style]} className="flex-row items-center gap-3 px-5 pt-2 pb-4">
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        className="h-10 w-10 items-center justify-center rounded-full bg-black/[0.04] active:bg-black/[0.08]"
        accessibilityLabel={backButtonVariant === "arrow" ? t("goBack") : t("closePractice")}
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        disabled={!onClose}
        style={{ opacity: onClose ? 1 : 0 }}
      >
        {backButtonVariant === "close-text" ? (
          <RNText
            style={{
              fontSize: 20,
              lineHeight: 22,
              color: iconColor,
              fontWeight: "700",
            }}
          >
            X
          </RNText>
        ) : backButtonVariant === "close-icon" ? (
          <SymbolView name="xmark" size={18} tintColor={iconColor} weight="medium" />
        ) : (
          <SymbolView name="arrow.left" size={18} tintColor={iconColor} weight="medium" />
        )}
      </TouchableOpacity>

      <View className="flex-1">
        {typeof progress === "number" ? (
          // ponytail: solid brand fill on soft track, no muddy gradient smear
          <AnimatedProgressBar
            progress={progress}
            useGradient={false}
            pulsate={false}
            trackColor={progressTrackColor}
            height={progressHeight}
            progressColor={progressFillColor}
            borderRadius={progressHeight / 2}
          />
        ) : null}
      </View>

      {trailingLabel ? (
        <RNText
          style={{
            color: trailingLabelColor,
            fontSize: 14,
            fontWeight: "700",
          }}
          className="happy-font-body-bold"
        >
          {trailingLabel}
        </RNText>
      ) : (
        <View className="h-10 w-10" /> /* Balance spacing if no trailing label */
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
