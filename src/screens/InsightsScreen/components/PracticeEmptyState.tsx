import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import HappiMascot from "@/src/screens/OnboardingScreen/components/HappiMascot";

type PracticeEmptyStateProps = {
  onChooseExercise: () => void;
};

function BaselineMark({ value }: { value: string }) {
  return (
    <View
      className="h-9 w-9 items-center justify-center rounded-full border-2 bg-white"
      style={{ borderColor: SEMANTIC_COLORS.brand.pressed }}
    >
      <Text variant="label-bold" color="sage">
        {value}
      </Text>
    </View>
  );
}

export function PracticeEmptyState({ onChooseExercise }: PracticeEmptyStateProps) {
  const { t } = useTranslation("common");

  return (
    <View className="flex-1 bg-brand-surface px-5 pb-28 pt-8">
      <View>
        <Text variant="eyebrow">
          {t("timelineAnalytics.practice.baseline")}
        </Text>
        <Text variant="display" className="mt-4 max-w-[320px]">
          {t("timelineAnalytics.practice.headline")}
        </Text>
        <Text variant="body" className="mt-3 max-w-[340px]">
          {t("timelineAnalytics.practice.description")}
        </Text>
      </View>

      {/* ponytail: Happi target mascot motivates 3-exercise baseline milestone */}
      <View className="my-4 items-center justify-center">
        <HappiMascot expression="target" size={130} />
      </View>

      <View className="mt-4 rounded-[20px] border border-sage-200 bg-sage-50/40 px-5 pb-5 pt-6">
        <View className="h-12 justify-center">
          <View className="absolute left-4 right-4 h-px bg-sage-200" />
          <View className="flex-row items-center justify-between">
            <BaselineMark value="1" />
            <BaselineMark value="2" />
            <BaselineMark value="3" />
          </View>
        </View>
        <Text variant="caption" className="mt-4">
          {t("timelineAnalytics.practice.milestone")}
        </Text>
      </View>

      <View className="flex-1" />
      <Button
        size="md"
        fullWidth={false}
        width={232}
        label={t("timelineAnalytics.practice.chooseExercise")}
        onPress={onChooseExercise}
        accessibilityLabel={t("timelineAnalytics.practice.chooseExercise")}
        className="mb-2"
      />
    </View>
  );
}
