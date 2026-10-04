import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { EmotionChip } from "@/src/screens/ThoughtReframingScreen/components/EmotionChip";
import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import type { EmotionName, EmotionRating } from "@/src/screens/ThoughtReframingScreen/types";
import { useTranslation } from "react-i18next";
import { StepShell, StepTitle } from "./customStepShared";

export function TREmotionsStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  readOnly,
  progress,
  onClose,
}: StepProps<ThoughtReframingResponse>) {
  const { t: rawTranslate } = useTranslation("exercises");
  const translateUi = rawTranslate as unknown as (
    key: string,
    options: { count: number; total?: number },
  ) => string;
  const MAX_EMOTIONS = 3;

  // Normalise selectedEmotions — config stores EmotionRating[] but could be string[] from old data
  const selectedEmotions: EmotionRating[] = useMemo(() => {
    return (response.selectedEmotions ?? []).map((e) =>
      typeof e === "string"
        ? ({
            name: e,
            initial_intensity: 5,
            final_intensity: 5,
          } as EmotionRating)
        : e,
    );
  }, [response.selectedEmotions]);

  const selectedNames = useMemo(
    () => new Set(selectedEmotions.map((e) => e.name)),
    [selectedEmotions],
  );

  const atLimit = selectedEmotions.length >= MAX_EMOTIONS;

  const handleToggle = (name: EmotionName) => {
    if (selectedNames.has(name)) {
      onUpdate({
        selectedEmotions: selectedEmotions.filter((e) => e.name !== name),
      });
    } else if (!atLimit) {
      const newEmotion: EmotionRating = {
        name,
        initial_intensity: 5,
        final_intensity: 5,
      };
      onUpdate({ selectedEmotions: [...selectedEmotions, newEmotion] });
    }
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="How did it make you feel?"
        subtitle="Choose what feels closest."
      />

      <View className="mb-4 flex-row items-center justify-between">
        <Text variant="label" className="text-ink-soft">
          {translateUi("flow.ui.emotionPickLimit", { count: MAX_EMOTIONS })}
        </Text>
        <Text
          variant="caption"
          className={
            selectedEmotions.length > 0 ? "text-sage-700" : "text-ink-muted"
          }
          accessibilityLabel={translateUi("flow.ui.emotionSelectionCount", {
            count: selectedEmotions.length,
            total: MAX_EMOTIONS,
          })}
        >
          {translateUi("flow.ui.emotionSelectionShort", {
            count: selectedEmotions.length,
            total: MAX_EMOTIONS,
          })}
        </Text>
      </View>

      <View className="-mx-1 flex-row flex-wrap mb-4">
        {EMOTION_OPTIONS.map((emotion) => {
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
    </StepShell>
  );
}
