import React, { useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/ui/Text";
import { StepLayout } from "@/src/components/exercise/steps/StepLayout";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { EmotionChip } from "@/src/screens/ThoughtReframingScreen/components/EmotionChip";
import type { EmotionName } from "@/src/screens/ThoughtReframingScreen/types";
import { ABC_EMOTION_OPTIONS, getABCEmotionTokenState, createEmotionSelectionStorage } from "./customStepShared";

const MAX_EMOTIONS = 3;

export function ABCConsequenceEmotionStep(
  {
    response,
    onUpdate,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    isSaving,
    readOnly,
    onClose,
  }: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  const { t } = useTranslation("exercises");
  const translateCount = t as unknown as (
    key: string,
    options: { count: number; max: number },
  ) => string;
  const selectedEmotions = useMemo(
    () => getABCEmotionTokenState(response.consequenceEmotion).recognized,
    [response.consequenceEmotion],
  );
  const selectedNames = useMemo(
    () => new Set(selectedEmotions),
    [selectedEmotions],
  );
  const atLimit = selectedEmotions.length >= MAX_EMOTIONS;

  const handleToggle = (name: EmotionName) => {
    const nextSelected = selectedNames.has(name)
      ? selectedEmotions.filter((emotion) => emotion !== name)
      : atLimit
        ? selectedEmotions
        : [...selectedEmotions, name];

    if (nextSelected === selectedEmotions) return;

    const nextValue = createEmotionSelectionStorage(
      response.consequenceEmotion,
    ).serialize(nextSelected);

    onUpdate({ consequenceEmotion: nextValue });
  };

  return (
    <StepLayout
      title="How did you feel?"
      subtitle="Choose what feels closest."
      progress={progress}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      canGoBack={canGoBack}
      isValid={isValid}
      onBack={onBack}
      onClose={onClose}
      onNext={onNext}
      isLoading={isSaving}
      showStepCount={false}
      scrollable
    >
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-[14px] leading-[20px] text-ink-soft">
          {translateCount("flow.ui.abcPickUpTo", { count: MAX_EMOTIONS, max: MAX_EMOTIONS })}
        </Text>
        <Text
          className={
            selectedEmotions.length > 0
              ? "text-[13px] leading-[19px] text-sage-700"
              : "text-[13px] leading-[19px] text-ink-muted"
          }
          accessibilityLabel={translateCount("flow.ui.abcSelectedAccessibility", {
            count: selectedEmotions.length,
            max: MAX_EMOTIONS,
          })}
        >
          {translateCount("flow.ui.abcSelectedCount", {
            count: selectedEmotions.length,
            max: MAX_EMOTIONS,
          })}
        </Text>
      </View>

      <View className="-mx-1 mb-4 flex-row flex-wrap">
        {ABC_EMOTION_OPTIONS.map((emotion) => {
          const isSelected = selectedNames.has(emotion.name);
          return (
            <View key={emotion.name} className="w-1/2 px-1 pb-2">
              <EmotionChip
                emotion={emotion}
                isSelected={isSelected}
                onToggle={() => !readOnly && handleToggle(emotion.name)}
                disabled={atLimit && !isSelected}
                locked={readOnly}
              />
            </View>
          );
        })}
      </View>
    </StepLayout>
  );
}
