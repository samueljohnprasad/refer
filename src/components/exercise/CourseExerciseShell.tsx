import React, { type ReactNode } from "react";
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
import { SAGE } from "@/lib/tokens";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
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

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable
          accessibilityLabel="Save and exit to Journey"
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
            color={COURSE_EXERCISE_COLORS.inkSoft}
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
            <Text style={styles.skipLabel}>Skip for now</Text>
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
}: {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
}) {
  const isDisabled = disabled || loading;
  const colors = getPrimaryButtonColors(isDisabled);

  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      style={styles.primaryButton}
    >
      <SvgAppButton
        width="100%"
        height={54}
        leftRadius={27}
        rightRadius={27}
        pressDepth={5}
        color={colors.face}
        backgroundColor={colors.rim}
        disabled={isDisabled}
        onPress={onPress}
        contentContainerStyle={styles.primaryButtonContent}
      >
        {loading ? (
          <ActivityIndicator
            color={COURSE_EXERCISE_COLORS.surface}
            size="small"
          />
        ) : (
          <Text style={[styles.primaryLabel, disabled && styles.disabledLabel]}>
            {label}
          </Text>
        )}
      </SvgAppButton>
    </View>
  );
}

function getPrimaryButtonColors(disabled: boolean) {
  return disabled
    ? { face: SAGE[300], rim: SAGE[500] }
    : { face: SAGE[500], rim: SAGE[700] };
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COURSE_EXERCISE_COLORS.background },
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
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
    backgroundColor: COURSE_EXERCISE_COLORS.surfaceMuted,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COURSE_EXERCISE_COLORS.accent,
  },
  progressLabel: {
    minWidth: 43,
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
    textAlign: "right",
  },
  content: { flexGrow: 1 },
  footer: { gap: 2, paddingHorizontal: 22, paddingTop: 10 },
  primaryButton: {
    width: "100%",
    height: 59,
  },
  primaryButtonContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryLabel: {
    color: COURSE_EXERCISE_COLORS.surface,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 16,
  },
  disabledLabel: { color: SAGE[700] },
  skipButton: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  skipLabel: {
    color: SAGE[600],
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 14,
  },
});
