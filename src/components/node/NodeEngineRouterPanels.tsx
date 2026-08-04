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
  canContinueAfterSupport,
  checkStatus,
  feedbackText,
  supportText,
}: {
  canContinueAfterSupport: boolean;
  checkStatus: V1CheckStatus;
  feedbackText: string | null;
  supportText: string | null;
}) {
  if (!feedbackText && !supportText) {
    return null;
  }

  const isSuccess = checkStatus === V1CheckStatusEnum.Success;
  const helperText =
    !isSuccess && canContinueAfterSupport
      ? supportText ?? "Use the example, then continue. This still counts as practice."
      : null;

  return (
    <View className="flex-1 justify-center px-6 pb-16">
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
            Use this clue
          </Text>
          <Text variant="body" color="ink">
            {helperText}
          </Text>
        </View>
      ) : null}
      {!isSuccess && !helperText ? (
        <Text variant="caption" color="soft" className="mt-3 px-1">
          Try again with the clue in mind.
        </Text>
      ) : null}
    </View>
  );
}

export function SupportPanel({ supportText }: { supportText: string | null }) {
  if (!supportText) {
    return null;
  }

  return (
    <View
      className="mx-6 mt-4 rounded-2xl border px-4 py-3"
      style={{ backgroundColor: SAGE.selected, borderColor: SAGE[200] }}
    >
      <Text variant="body" color="ink">
        {supportText}
      </Text>
    </View>
  );
}
