import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";

interface CourseExerciseFooterProps {
  hidePrimary: boolean;
  primaryDisabled: boolean;
  primaryLoading: boolean;
  primaryLabel: string;
  skipLabel?: string;
  onPrimaryPress: () => void;
  onSkip?: () => void;
}

export function CourseExerciseFooter({
  hidePrimary,
  primaryDisabled,
  primaryLoading,
  primaryLabel,
  skipLabel,
  onPrimaryPress,
  onSkip,
}: CourseExerciseFooterProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("exercises");

  return (
    <View
      className="absolute inset-x-0 bottom-0 gap-0.5 bg-brand-surface px-6 pt-3.5"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {!hidePrimary ? (
        <View className="w-full">
          <CourseExercisePrimaryButton
            label={primaryLabel}
            disabled={primaryDisabled}
            loading={primaryLoading}
            onPress={onPrimaryPress}
          />
        </View>
      ) : null}
      {onSkip ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: primaryLoading }}
          disabled={primaryLoading}
          onPress={onSkip}
          className={`min-h-12 items-center justify-center active:opacity-55 ${primaryLoading ? "opacity-45" : ""}`}
        >
          <Text className="happy-font-body-medium text-[13px] text-ink-soft">
            {skipLabel ?? t("runtime.skipForNow")}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
