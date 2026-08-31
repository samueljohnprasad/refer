import React from "react";
import { View, TouchableOpacity, Text as RNText, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { AnimatedProgressBar } from "@/src/components/progress";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

export interface LessonHeaderProps {
  /** Callback when the close/back button is pressed */
  onClose?: () => void;
  /** Current progress value (0 to 1, or percentage) */
  progress?: number;
  /** Label to show on the trailing edge, e.g., "+10 XP" */
  trailingLabel?: string;
  /** Color of the 'x' close icon */
  iconColor?: string;
  /** Color of the trailing label text */
  trailingLabelColor?: string;
  /** Color of the progress bar fill */
  progressFillColor?: string;
  /** Color of the progress bar track */
  progressTrackColor?: string;
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
  iconColor = "#4F604F",
  trailingLabelColor = "#C8694B",
  progressFillColor = "#5f7f58",
  progressTrackColor = "#e5ede1",
  progressHeight = 12,
  backButtonVariant = "close-icon",
  style,
}) => {
  return (
    <View style={[styles.container, style]} className="flex-row items-center gap-4 px-6 pt-2 pb-6">
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.65}
        className="h-8 w-8 items-center justify-center"
        accessibilityLabel={backButtonVariant === "arrow" ? "Go back" : "Close"}
        accessibilityRole="button"
        disabled={!onClose}
        style={{ opacity: onClose ? 1 : 0 }}
      >
        {backButtonVariant === "close-text" ? (
          <RNText
            style={{
              fontSize: 22,
              lineHeight: 24,
              color: iconColor,
              fontWeight: "700",
            }}
          >
            X
          </RNText>
        ) : backButtonVariant === "close-icon" ? (
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={22}
            color={iconColor}
          />
        ) : (
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={18}
            color={iconColor}
          />
        )}
      </TouchableOpacity>

      <View className="flex-1">
        {typeof progress === "number" ? (
          <AnimatedProgressBar
            progress={progress}
            useGradient={true}
            gradientColors={[SEMANTIC_COLORS.warning.surface, SEMANTIC_COLORS.brand.primary]}
            pulsate={false}
            trackColor={progressTrackColor}
            height={progressHeight}
            progressColor={progressFillColor}
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
        <View className="h-8 w-8" /> /* Balance spacing if no trailing label */
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
