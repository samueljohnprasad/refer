import React, { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";
import { SvgAppButton } from "@/src/domains/journey/ui/components/svg-app-button";

interface CourseExerciseShellProps {
  children: ReactNode;
  progress: number;
  trailingLabel: string;
  onClose?: () => void;
  primaryLabel: string;
  primaryDisabled: boolean;
  hidePrimary?: boolean;
  onPrimaryPress: () => void;
  onSkip?: () => void;
}

export function CourseExerciseShell({
  children,
  progress,
  trailingLabel,
  onClose,
  primaryLabel,
  primaryDisabled,
  hidePrimary = false,
  onPrimaryPress,
  onSkip,
}: CourseExerciseShellProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("exercises");

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable
          accessibilityLabel={t("runtime.saveAndExitJourney")}
          accessibilityRole="button"
          disabled={!onClose}
          hitSlop={8}
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeButton,
            !onClose && styles.hidden,
            pressed && styles.pressedIcon,
          ]}
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={22}
            color={SEMANTIC_COLORS.text.secondary}
          />
        </Pressable>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.max(0, Math.min(progress, 1)) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>{trailingLabel}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        {!hidePrimary ? (
          <CourseExercisePrimaryButton
            label={primaryLabel}
            disabled={primaryDisabled}
            onPress={onPrimaryPress}
          />
        ) : null}
        {onSkip ? (
          <Pressable
            accessibilityRole="button"
            onPress={onSkip}
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.pressedIcon,
            ]}
          >
            <Text style={styles.skipLabel}>{t("runtime.skipForNow")}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function CourseExercisePrimaryButton({
  label,
  disabled = false,
  loading = false,
  onPress,
  leftIcon,
  rightIcon,
  height = 64,
  fontSize,
  pressDepth = 6,
  faceColor,
  rimColor,
}: {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  height?: number;
  fontSize?: number;
  pressDepth?: number;
  faceColor?: string;
  rimColor?: string;
}) {
  const isDisabled = disabled || loading;
  const defaultColors = getPrimaryButtonColors(isDisabled);
  const color = faceColor && !isDisabled ? faceColor : (defaultColors.face as string);
  const backgroundColor = rimColor && !isDisabled ? rimColor : (defaultColors.rim as string);
  const radius = height / 2;

  const handlePressIn = () => {
    if (!isDisabled) {
      Haptics.selectionAsync();
    }
  };

  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      style={[styles.primaryButton, { height: height + pressDepth }]}
    >
      <SvgAppButton
        width="100%"
        height={height}
        leftRadius={radius}
        rightRadius={radius}
        pressDepth={pressDepth}
        color={color}
        backgroundColor={backgroundColor}
        disabled={isDisabled}
        onPress={onPress ?? (() => {})}
        onPressIn={handlePressIn}
        contentContainerStyle={styles.primaryButtonContent}
      >
        {loading ? (
          <ActivityIndicator
            color="#FFFFFF"
            size="small"
          />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {leftIcon}
            <Text
              style={[
                styles.primaryLabel,
                fontSize ? { fontSize } : null,
                disabled && styles.disabledLabel,
              ]}
            >
              {label}
            </Text>
            {rightIcon}
          </View>
        )}
      </SvgAppButton>
    </View>
  );
}

function getPrimaryButtonColors(disabled: boolean) {
  return disabled
    ? { face: SEMANTIC_COLORS.disabled.surface, rim: SEMANTIC_COLORS.disabled.border }
    : { face: SEMANTIC_COLORS.brand.primary, rim: SEMANTIC_COLORS.brand.pressed };
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SEMANTIC_COLORS.surface.primary },
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  closeButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  hidden: { opacity: 0 },
  pressedIcon: { opacity: 0.55 },
  progressTrack: {
    height: 12,
    flex: 1,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  progressLabel: {
    minWidth: 43,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 12,
    textAlign: "right",
  },
  content: { flexGrow: 1, paddingTop: 4, paddingBottom: 48 },
  footer: { gap: 16, paddingHorizontal: 22, paddingTop: 10 },
  primaryButton: {
    width: "100%",
    height: 70,
  },
  primaryButtonContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryLabel: {
    color: "#FFFFFF",
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 19,
    letterSpacing: 0.5,
  },
  disabledLabel: { color: SEMANTIC_COLORS.text.disabled },
  skipButton: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  skipLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 15,
  },
});
