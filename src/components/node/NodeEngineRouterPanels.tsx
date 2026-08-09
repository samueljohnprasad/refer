import React from "react";
import { View } from "react-native";
import { BRAND_BORDER, SAGE } from "@/lib/tokens";
import { Text } from "@/src/components/ui/Text";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import { V1CheckStatusEnum, type V1CheckStatus } from "@/src/types/journeyLearning";

export function LoadingPracticeScreen({ onClose }: { onClose?: () => void }) {
  return (
    <LessonScreen
      progress={0}
      onClose={onClose}
      primaryLabel="Check"
      primaryDisabled
      onPrimaryPress={() => undefined}
    >
      <View className="flex-1 justify-center px-8">
        <Text variant="body" color="soft">
          Loading practice…
        </Text>
      </View>
    </LessonScreen>
  );
}

export function PracticeDataErrorScreen({
  message,
  onClose,
}: {
  message: string;
  onClose?: () => void;
}) {
  return (
    <LessonScreen
      progress={0}
      onClose={onClose}
      primaryLabel="Close"
      onPrimaryPress={onClose ?? (() => undefined)}
    >
      <View className="flex-1 justify-center px-8">
        <Text variant="h2" color="ink" className="mb-3">
          Practice data needs v1 content.
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
          backgroundColor: isSuccess ? SAGE.selected : SAGE[50],
          borderColor: isSuccess ? SAGE[200] : BRAND_BORDER,
        }}
      >
        <Text variant="label-bold" color={isSuccess ? "sage" : "soft"}>
          {isSuccess ? "Nice." : "Not quite."}
        </Text>
        <Text variant="body" color="ink" className="mt-2">
          {feedbackText}
        </Text>
      </View>
      {helperText ? (
        <View
          className="mt-3 rounded-2xl border px-4 py-3"
          style={{ backgroundColor: SAGE.selected, borderColor: SAGE[200] }}
        >
          <Text variant="caption" color="sage" className="mb-1">
            Review this
          </Text>
          <Text variant="body" color="ink">
            {helperText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
