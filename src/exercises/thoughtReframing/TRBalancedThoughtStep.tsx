import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";
import { Feather } from "@expo/vector-icons";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { ExerciseCopyText } from "@/src/components/exercise/ExerciseCopyText";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { CBT_COMPOSER_MIN_HEIGHT, StepShell, StepTitle, LoadingRow, AiUnavailableNote } from "./customStepShared";

export function TRBalancedThoughtStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  aiSuggestions,
  isAiLoading,
  aiError,
  readOnly,
  progress,
  onClose,
}: StepProps<ThoughtReframingResponse>) {
  const translateCopy = useExerciseCopy();
  const { t: translateUi } = useTranslation("exercises");
  const { isVoiceEnabled } = useVoiceFeature();
  const { recordingCurrentState, record, stopRecording } = useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showBalancedOptions, setShowBalancedOptions] = useState(false);
  const suggestions = useMemo(() => {
    const automaticThought = response.automaticThought.trim().toLowerCase();
    const seen = new Set<string>();

    return (
      aiSuggestions as
        | Array<{ text?: string; rationale?: string }>
        | undefined
    )
      ?.flatMap((suggestion) => {
        const text = suggestion.text?.trim();
        if (!text) return [];

        const normalized = text.toLowerCase();
        if (normalized === automaticThought || seen.has(normalized)) return [];

        seen.add(normalized);
        return [{ text, rationale: suggestion.rationale?.trim() }];
      })
      .slice(0, 2) ?? [];
  }, [aiSuggestions, response.automaticThought]);
  const isRecording = recordingCurrentState === "recording";

  const handleUseBalancedOption = useCallback(
    (text: string): void => {
      if (readOnly) return;
      void Haptics.selectionAsync();
      onUpdate({ balancedThought: text });
      setShowBalancedOptions(false);
    },
    [onUpdate, readOnly],
  );

  const handleToggleRecording = useCallback(async (): Promise<void> => {
    if (readOnly || !isVoiceEnabled) return;

    setVoiceError(null);
    if (isRecording) {
      try {
        const recorderState = await stopRecording();
        const uri = recorderState?.url;
        if (uri) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result?.transcript) {
            const current = response.balancedThought;
            const separator = current.trim().length > 0 ? "\n" : "";
            onUpdate({
              balancedThought:
                `${current}${separator}${result.transcript}`.slice(0, 300),
            });
          }
        }
      } catch {
        setVoiceError(translateCopy("Voice input unavailable. Type your answer here."));
      }
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await record();
    } catch {
      setVoiceError(translateCopy("Voice input unavailable. Type your answer here."));
    }
  }, [
    isRecording,
    onUpdate,
    readOnly,
    isVoiceEnabled,
    record,
    response.balancedThought,
    stopRecording,
    transcribeAudio,
    translateCopy,
  ]);

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
        title="Write a balanced thought"
        subtitle="Aim for something fair and believable, not forced positive."
      />

      <View
        className="mb-6 pb-5"
        style={{ borderBottomWidth: 1, borderBottomColor: SEMANTIC_COLORS.border.default }}
      >
        <ExerciseCopyText
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="mb-2 text-[13px] leading-[18px] text-sage-700"
        >
          The thought you are testing
        </ExerciseCopyText>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBoldItalic }}
          className="text-[20px] leading-[27px] text-ink"
        >
          {response.automaticThought}
        </Text>
      </View>

      <ExerciseCopyText
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
        className="mb-2 text-[14px] leading-[20px] text-ink"
      >
        Your balanced thought
      </ExerciseCopyText>
      <ExerciseTextComposer
        value={response.balancedThought}
        onChange={(nextValue) => {
          if (!readOnly) onUpdate({ balancedThought: nextValue });
        }}
        placeholder={translateCopy("What is a fairer way to understand this?")}
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
        maxLength={300}
        helperText={translateCopy("Type your first fairer thought before using voice or AI support.")}
        requirementVisible={!readOnly && response.balancedThought.trim().length < 5}
        requirementText={translateCopy("Write at least a few words for a fairer thought to continue.")}
        onWavePress={handleToggleRecording}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        showVoice={!readOnly && isVoiceEnabled}
      />

      {voiceError ? (
        <Text className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          {translateCopy(voiceError)}
        </Text>
      ) : null}

      {!readOnly && (isAiLoading || suggestions.length > 0 || !!aiError) ? (
        <View
          className="mt-5 pt-2"
          style={{ borderTopWidth: 1, borderTopColor: SEMANTIC_COLORS.border.default }}
        >
          <Pressable
            onPress={() => {
              triggerSelectionHaptic();
              setShowBalancedOptions((current) => !current);
            }}
            accessibilityRole="button"
            accessibilityLabel={translateCopy(
              showBalancedOptions
                ? "Hide balanced thought starting points"
                : "Show balanced thought starting points",
            )}
            accessibilityState={{ expanded: showBalancedOptions }}
            className="min-h-12 flex-row items-center justify-between py-3 active:opacity-60"
          >
            <View className="flex-1 pr-4">
              <ExerciseCopyText
                style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                className="text-[14px] leading-[20px] text-sage-700"
              >
                Need a starting point?
              </ExerciseCopyText>
              <ExerciseCopyText className="mt-0.5 text-[12px] leading-[17px] text-ink-soft">
                Optional drafts based on the evidence you added
              </ExerciseCopyText>
            </View>
            <Feather
              name={showBalancedOptions ? "chevron-up" : "chevron-down"}
              size={18}
              color={SEMANTIC_COLORS.brand.pressed}
            />
          </Pressable>

          {showBalancedOptions ? (
            <View className="pb-2">
              {isAiLoading ? (
                <LoadingRow message="Building starting points..." />
              ) : null}
              <AiUnavailableNote visible={!!aiError && !isAiLoading} />

              {!isAiLoading && suggestions.length > 0 ? (
                <View>
                  {suggestions.map((suggestion, index) => (
                    <Pressable
                      key={suggestion.text}
                      onPress={() => handleUseBalancedOption(suggestion.text)}
                      accessibilityRole="button"
                      accessibilityLabel={translateUi(
                        "flow.ui.useBalancedThoughtDraft",
                        { count: index + 1 },
                      )}
                      className="py-4 active:opacity-60"
                      style={{
                        borderTopWidth: 1,
                        borderTopColor: SEMANTIC_COLORS.border.default,
                      }}
                    >
                      <View className="flex-row items-start">
                        <ExerciseCopyText
                          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                          className="flex-1 pr-4 text-[18px] leading-[25px] text-ink"
                        >
                          {suggestion.text}
                        </ExerciseCopyText>
                        <ExerciseCopyText
                          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                          className="text-[13px] leading-[20px] text-sage-700"
                        >
                          Use
                        </ExerciseCopyText>
                      </View>
                      {suggestion.rationale ? (
                        <Text className="mt-2 pr-10 text-[13px] leading-[19px] text-ink-soft">
                          {suggestion.rationale}
                        </Text>
                      ) : null}
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </StepShell>
  );
}
