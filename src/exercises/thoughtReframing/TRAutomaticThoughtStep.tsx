import { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SuggestionCards, SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
import { Feather } from "@expo/vector-icons";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import * as Haptics from "expo-haptics";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { CBT_COMPOSER_MIN_HEIGHT, StepShell, ExampleDetailRow, LoadingRow, AiUnavailableNote, THOUGHT_SUGGESTIONS } from "./customStepShared";
import { ExerciseCopyText } from "@/src/components/exercise/ExerciseCopyText";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

export function TRAutomaticThoughtStep({
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
  aiSuggestions,
  isAiLoading,
  aiError,
}: StepProps<ThoughtReframingResponse>) {
  const translateCopy = useExerciseCopy();
  const { isVoiceEnabled } = useVoiceFeature();
  const [showThoughtSuggestions, setShowThoughtSuggestions] = useState(false);
  const { recordingCurrentState, record, stopRecording } = useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const thoughtText = response.automaticThought.trim();
  const isThoughtValid = thoughtText.length >= 5;
  const suggestions = useMemo<SuggestionItem[]>(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const uniqueLabels = new Set<string>();
      const result: SuggestionItem[] = [];
      for (const s of aiSuggestions as Array<{
        text?: string;
        label?: string;
      }>) {
        const txt = s?.text || s?.label;
        if (txt && typeof txt === "string" && txt.trim()) {
          const normalized = txt.trim();
          if (!uniqueLabels.has(normalized)) {
            uniqueLabels.add(normalized);
            result.push({
              label: normalized,
            });
          }
        }
      }
      if (result.length > 0) {
        return result;
      }
    }
    return THOUGHT_SUGGESTIONS.map((suggestion) => ({
      ...suggestion,
      label: translateCopy(suggestion.label),
    }));
  }, [aiSuggestions, translateCopy]);
  const visibleThoughtSuggestions = useMemo(
    () => suggestions.slice(0, 2),
    [suggestions],
  );
  const canUseThoughtSuggestions =
    !readOnly &&
    showThoughtSuggestions &&
    !isAiLoading &&
    visibleThoughtSuggestions.length > 0;
  const isRecording = recordingCurrentState === "recording";
  const useThoughtExample = useCallback(
    (value: string) => {
      onUpdate({ automaticThought: value });
      setShowThoughtSuggestions(false);
    },
    [onUpdate],
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
            onUpdate({
              automaticThought: `${response.automaticThought}${response.automaticThought.trim() ? " " : ""}${result.transcript}`.trim(),
            });
          }
        }
      } catch {
        setVoiceError(translateCopy("Voice input unavailable. You can type this instead."));
      }
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await record();
    } catch {
      setVoiceError(translateCopy("Voice input unavailable. You can type this instead."));
    }
  }, [isRecording, onUpdate, readOnly, isVoiceEnabled, record, response.automaticThought, stopRecording, transcribeAudio, translateCopy]);

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
      <View className="mb-6 mt-2">
        <ExerciseCopyText variant="h1" className="mb-3">
          What thought ran through your mind?
        </ExerciseCopyText>
      </View>

      {!!response.situation.trim() && (
        <View className="mb-8 flex-row items-start gap-3 opacity-60">
          <Feather name="calendar" size={16} color={SEMANTIC_COLORS.brand.pressed} style={{ marginTop: 2 }} />
          <View className="flex-1">
            <ExerciseCopyText
              variant="caption"
              className="mb-0.5 text-[12px] uppercase tracking-wider text-ink"
            >
              What happened
            </ExerciseCopyText>
            <Text className="text-[15px] leading-[22px] italic text-ink-soft">
              "{response.situation.trim()}"
            </Text>
          </View>
        </View>
      )}

      <View className="mb-4">
        <ExerciseCopyText className="text-[16px] leading-[23px] text-ink-soft">
          Try to capture the thought exactly as it occurred, even if it feels
          irrational or raw.
        </ExerciseCopyText>
      </View>

      <ExerciseTextComposer
        value={response.automaticThought}
        onChange={(nextValue) => onUpdate({ automaticThought: nextValue })}
        placeholder={translateCopy("e.g., 'They're all judging me because I'm quiet.'")}
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
        maxLength={300}
        requirementVisible={!readOnly && !isThoughtValid}
        requirementText={translateCopy("Write a few words to continue.")}
        statusVisible={isThoughtValid}
        statusText={translateCopy("Keep the thought exactly as it showed up.")}
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

      {!readOnly && visibleThoughtSuggestions.length > 0 && (
        <Pressable
          onPress={() => setShowThoughtSuggestions((current) => !current)}
          accessibilityRole="button"
          accessibilityLabel={translateCopy(
            showThoughtSuggestions ? "Hide examples" : "Show optional examples",
          )}
          accessibilityState={{ expanded: showThoughtSuggestions }}
          className="mb-2 mt-1 flex-row items-center justify-between border-t border-sage-100/70 py-3 active:opacity-70"
        >
          <ExerciseCopyText variant="label-bold" className="text-[14px] text-sage-700">
            {showThoughtSuggestions ? "Hide examples" : "Need an example?"}
          </ExerciseCopyText>
          <Feather
            name={showThoughtSuggestions ? "chevron-up" : "chevron-down"}
            size={18}
            color={SEMANTIC_COLORS.brand.pressed}
          />
        </Pressable>
      )}

      {showThoughtSuggestions && isAiLoading && (
        <LoadingRow message="Finding starting points..." />
      )}
      {showThoughtSuggestions && (
        <AiUnavailableNote visible={!!aiError && !isAiLoading} />
      )}

      {showThoughtSuggestions && (
        <View>
          <ExampleDetailRow
            scenario={translateCopy("I made a small mistake at work...")}
            thought={translateCopy("I'm going to get fired and lose everything.")}
            onUse={readOnly ? undefined : useThoughtExample}
          />
          <ExampleDetailRow
            scenario={translateCopy("A friend didn't reply to my text...")}
            thought={translateCopy("They're bored of me and are ignoring me on purpose.")}
            onUse={readOnly ? undefined : useThoughtExample}
          />

          {canUseThoughtSuggestions ? (
            <View className="pt-3">
              <ExerciseCopyText
                variant="label-bold"
                className="mb-2 text-[14px] text-sage-700"
              >
                Optional starters
              </ExerciseCopyText>
              <SuggestionCards
                title=""
                actionLabel={translateCopy("Use")}
                suggestions={visibleThoughtSuggestions}
                currentValue={response.automaticThought}
                onSelect={useThoughtExample}
              />
            </View>
          ) : null}
        </View>
      )}
    </StepShell>
  );
}
