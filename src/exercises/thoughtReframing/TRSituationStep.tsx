import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SuggestionCards, SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import { ReflectionDisclosure } from "@/src/components/exercise/ReflectionStepSections";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import * as Haptics from "expo-haptics";
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { CBT_COMPOSER_MIN_HEIGHT, StepShell, StepTitle, InlineFactHint, LoadingRow, AiUnavailableNote, SITUATION_SUGGESTIONS } from "./customStepShared";

export function TRSituationStep({
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
  const [showSituationExamples, setShowSituationExamples] = useState(false);
  const { recordingCurrentState, record, stopRecording } = useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const situationText = response.situation.trim();
  const isSituationValid = situationText.length >= 5;
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
    return SITUATION_SUGGESTIONS.map((suggestion) => ({
      ...suggestion,
      label: translateCopy(suggestion.label),
    }));
  }, [aiSuggestions, translateCopy]);
  const exampleSuggestions = useMemo(
    () => suggestions.slice(0, 2),
    [suggestions],
  );
  const isRecording = recordingCurrentState === "recording";
  const canOfferExamples = !readOnly && exampleSuggestions.length > 0;
  const canUseExamples =
    canOfferExamples && showSituationExamples && !isAiLoading;

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
              situation: `${response.situation}${response.situation.trim() ? " " : ""}${result.transcript}`.trim(),
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
  }, [isRecording, onUpdate, readOnly, isVoiceEnabled, record, response.situation, stopRecording, transcribeAudio, translateCopy]);

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
        title="What happened?"
        subtitle="Start with the moment, not what it meant."
      />
      <InlineFactHint text="Write what a camera could have seen or heard." />

      <ExerciseTextComposer
        value={response.situation}
        onChange={(nextValue) => onUpdate({ situation: nextValue })}
        placeholder={translateCopy("What happened...")}
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
        maxLength={400}
        requirementVisible={!readOnly && !isSituationValid}
        requirementText={translateCopy("Write a few words to start.")}
        statusVisible={isSituationValid}
        statusText={translateCopy("This stays with what happened.")}
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

      <AiUnavailableNote
        visible={showSituationExamples && !!aiError && !isAiLoading}
      />

      {canOfferExamples ? (
        <ReflectionDisclosure
          expanded={showSituationExamples}
          onToggle={() => setShowSituationExamples((current) => !current)}
        >
          {showSituationExamples && isAiLoading ? (
            <LoadingRow message="Finding relevant examples..." />
          ) : null}

          {canUseExamples ? (
            <View className="mb-4">
              <SuggestionCards
                title=""
                helperText={translateCopy("Borrow the structure, then make the words yours.")}
                actionLabel={translateCopy("Use")}
                suggestions={exampleSuggestions}
                currentValue={response.situation}
                onSelect={(v) => {
                  onUpdate({ situation: v });
                  setShowSituationExamples(false);
                }}
              />
            </View>
          ) : null}
        </ReflectionDisclosure>
      ) : null}
    </StepShell>
  );
}
