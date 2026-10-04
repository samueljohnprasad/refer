import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Text } from "@/src/components/ui/Text";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { V1CheckStatusEnum, type V1CheckStatus } from "@/src/types/journeyLearning";

export function LoadingPracticeScreen({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation("journeys");
  return (
    <LessonScreen
      progress={0}
      onClose={onClose}
      primaryLabel={t("check")}
      primaryDisabled
      onPrimaryPress={() => undefined}
    >
      <View className="flex-1 px-6 pt-10">
        <Skeleton width={88} height={12} radius={6} className="mb-5" />
        <Skeleton width="86%" height={26} radius={8} className="mb-3" />
        <Skeleton width="62%" height={26} radius={8} />

        <View className="mt-10 rounded-3xl border border-brand-border bg-brand-surface p-5">
          <Skeleton width="92%" height={14} radius={7} className="mb-3" />
          <Skeleton width="74%" height={14} radius={7} />
        </View>

        <View className="mt-4 gap-3">
          <Skeleton height={56} radius={16} />
          <Skeleton height={56} radius={16} />
          <Skeleton height={56} radius={16} />
        </View>
      </View>
    </LessonScreen>
  );
}

export function PracticeDataErrorScreen({
  message,
  onClose,
  onSkip,
}: {
  message: string;
  onClose?: () => void;
  onSkip?: () => void;
}) {
  const { t } = useTranslation("journeys");
  // ponytail: ensure user is never trapped when exercise data is invalid
  return (
    <LessonScreen
      progress={0}
      onClose={onClose}
      primaryLabel={onSkip ? t("skipExercise") : t("closePractice")}
      onPrimaryPress={onSkip ?? onClose ?? (() => undefined)}
      secondaryLabel={onSkip && onClose ? t("closePractice") : undefined}
      onSecondaryPress={onClose}
    >
      <View className="flex-1 justify-center px-8">
        <Text variant="h2" color="ink" className="mb-3">
          {t("practiceUnavailable")}
        </Text>
        <Text variant="body" color="soft">
          {message}
        </Text>
      </View>
    </LessonScreen>
  );
}

export function FeedbackPanel({
  canContinueAfterExplanation,
  checkStatus,
  explanationText,
  feedbackText,
}: {
  canContinueAfterExplanation: boolean;
  checkStatus: V1CheckStatus;
  explanationText: string | null;
  feedbackText: string | null;
}) {
  const { t } = useTranslation("journeys");
  if (!feedbackText && !explanationText) {
    return null;
  }

  const isSuccess = checkStatus === V1CheckStatusEnum.Success;
  const helperText =
    !isSuccess && canContinueAfterExplanation
      ? explanationText
      : null;

  return (
    <View className="px-6 pb-6">
      <View
        className="rounded-2xl border px-5 py-5"
        style={{
          backgroundColor: isSuccess ? SEMANTIC_COLORS.selection.surface : SEMANTIC_COLORS.selection.surface,
          borderColor: isSuccess ? SEMANTIC_COLORS.selection.foreground : SEMANTIC_COLORS.border.default,
        }}
      >
        <Text variant="label-bold" color={isSuccess ? "sage" : "soft"}>
          {isSuccess ? t("nice") : t("notQuite")}
        </Text>
        <Text variant="body" color="ink" className="mt-2">
          {feedbackText}
        </Text>
      </View>
      {helperText ? (
        <View
          className="mt-3 rounded-2xl border px-4 py-3"
          style={{ backgroundColor: SEMANTIC_COLORS.selection.surface, borderColor: SEMANTIC_COLORS.selection.foreground }}
        >
          <Text variant="caption" color="sage" className="mb-1">
            {t("reviewThis")}
          </Text>
          <Text variant="body" color="ink">
            {helperText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
