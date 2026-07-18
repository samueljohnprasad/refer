import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useAppDispatch } from "@/src/store/hooks";
import { setAssistantMessage } from "@/src/store/slices/happyAssistantSlice";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";
import { Feather } from "@expo/vector-icons";
import { StepLayout } from "./StepLayout";
import { SAGE } from "@/lib/tokens";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
import { SuggestionCards, type SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import type { StepProps, AISuggestionItem } from "@/src/types/exerciseFlow";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";

interface TextInputStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  placeholder?: string;
  maxLength?: number;
  tipText?: string;
  validationMessage?: string;
  psychoeducationText?: string;
  suggestions?: SuggestionItem[];
  suggestionsTitle?: string;
  referenceQuote?: { label?: string; text: string };
  composerMinHeight?: number;
  requirementText?: string;
  statusText?: string;
  showVoice?: boolean;
  showStepCount?: boolean;
  composerGlow?: boolean;
  alwaysShowVoice?: boolean;
  showExamplesInitially?: boolean;
}

export const TextInputStep: React.FC<TextInputStepProps> = React.memo(
  ({
    response,
    onUpdate,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    title,
    subtitle,
    fieldKey,
    placeholder = "Type here...",
    maxLength = 500,
    tipText,
    isSaving,
    validationMessage,
    psychoeducationText,
    aiSuggestions,
    isAiLoading,
    aiLoadingMessage,
    suggestions,
    suggestionsTitle,
    readOnly,
    referenceQuote,
    composerMinHeight,
    requirementText = "Add or revise your response to continue.",
    statusText,
    showVoice = false,
    showStepCount = true,
    composerGlow = false,
    alwaysShowVoice = false,
    showExamplesInitially = false,
  }) => {
    const dispatch = useAppDispatch();
    const responseRecord = response as Record<string, unknown>;
    const rawValue = responseRecord[fieldKey];
    const value = typeof rawValue === "string" ? rawValue : "";
    const [showExamples, setShowExamples] = useState(showExamplesInitially);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const { recordingCurrentState, record, stopRecording } = useAudioRecording();
    const { transcribeAudio, isTranscribing } = useTranscribeAudio();
    const aiExampleSuggestions =
      aiSuggestions?.slice(0, 2).map((suggestion: AISuggestionItem) => ({
        label: suggestion.text,
        emoji: suggestion.emoji,
        rationale: suggestion.rationale,
      })) || [];
    const staticExampleSuggestions = suggestions?.slice(0, 2) || [];
    const hasExamples =
      isAiLoading ||
      aiExampleSuggestions.length > 0 ||
      staticExampleSuggestions.length > 0;
    const updateField = (text: string) => {
      onUpdate({ [fieldKey]: text } as Partial<typeof response>);
    };
    const isRecording = recordingCurrentState === "recording";

    const handleToggleRecording = useCallback(async (): Promise<void> => {
      if (readOnly || !showVoice) return;

      setVoiceError(null);

      if (isRecording) {
        try {
          const recorderState = await stopRecording();
          const uri = recorderState?.url;

          if (uri) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            const result = await transcribeAudio(uri);
            if (result?.transcript) {
              updateField(
                `${value}${value.trim() ? " " : ""}${result.transcript}`.trim(),
              );
            }
          }
        } catch {
          setVoiceError("Voice input unavailable. You can type this instead.");
        }
        return;
      }

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await record();
      } catch {
        setVoiceError("Voice input unavailable. You can type this instead.");
      }
    }, [
      isRecording,
      readOnly,
      record,
      showVoice,
      stopRecording,
      transcribeAudio,
      value,
    ]);

    useEffect(() => {
      if (validationMessage && value.trim().length > 0) {
        dispatch(setAssistantMessage(validationMessage));
      } else {
        dispatch(setAssistantMessage(null));
      }
      return () => {
        dispatch(setAssistantMessage(null));
      };
    }, [validationMessage, value, dispatch]);

    return (
      <StepLayout
        title={title}
        subtitle={subtitle}
        progress={progress}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        canGoBack={canGoBack}
        isValid={isValid}
        onBack={onBack}
        onNext={onNext}
        isLoading={isSaving}
        showStepCount={showStepCount}
      >
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        {referenceQuote && (
          <FadeInItem index={0}>
            <View className="rounded-xl p-4 mb-4 bg-sage-50/80 border border-sage-200/60 shadow-sm">
              <Text className="text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1">
                {referenceQuote.label ?? "Caught Thought"}
              </Text>
              <Text className="text-base font-medium text-slate-800 italic leading-relaxed">
                “{referenceQuote.text}”
              </Text>
            </View>
          </FadeInItem>
        )}

        <FadeInItem index={referenceQuote ? 1 : 0}>
          <View style={{ zIndex: 10 }}>
            <ExerciseTextComposer
              value={value}
              onChange={updateField}
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholder={placeholder}
              minHeight={composerMinHeight}
              maxLength={maxLength}
              requirementVisible={!readOnly && !isValid}
              requirementText={requirementText}
              statusVisible={Boolean(statusText) && isValid}
              statusText={statusText}
              onWavePress={handleToggleRecording}
              isRecording={isRecording}
              isTranscribing={isTranscribing}
              showVoice={!readOnly && showVoice}
              alwaysShowVoice={alwaysShowVoice}
              glow={composerGlow}
            />
          </View>
        </FadeInItem>

        {voiceError ? (
          <Text className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            {voiceError}
          </Text>
        ) : null}

        {tipText && (
          <FadeInItem index={referenceQuote ? 2 : 1}>
            <View className="mb-4 flex-row items-start border-t border-sage-100/70 px-1 pt-3">
              <View className="mr-3 mt-[2px]">
                <Feather name="camera" size={15} color={SAGE[600]} />
              </View>
              <Text
                variant="caption"
                className="text-[13px] leading-[19px] flex-1 text-sage-800"
              >
                {tipText}
              </Text>
            </View>
          </FadeInItem>
        )}

        {hasExamples && (
          <FadeInItem index={referenceQuote ? 3 : 2}>
            <View className="mb-4">
              <Pressable
                onPress={() => setShowExamples((current) => !current)}
                accessibilityRole="button"
                accessibilityState={{ expanded: showExamples }}
                className="flex-row items-center justify-between py-2 active:opacity-70"
              >
                <Text variant="label-bold" className="text-[14px] text-ink">
                  Need an example?
                </Text>
                <HugeiconsIcon
                  icon={showExamples ? ArrowUp01Icon : ArrowDown01Icon}
                  size={16}
                  color={SAGE[600]}
                  strokeWidth={2}
                />
              </Pressable>

              {showExamples && staticExampleSuggestions.length > 0 && (
                <SuggestionCards
                  title={suggestionsTitle || ""}
                  suggestions={staticExampleSuggestions}
                  currentValue={value}
                  onSelect={updateField}
                  readOnly={readOnly}
                />
              )}

              {showExamples && (
                <View className={isAiLoading ? "min-h-[88px] justify-center" : ""}>
                  {(isAiLoading || aiExampleSuggestions.length > 0) && (
                    <SuggestionCards
                      title=""
                      suggestions={aiExampleSuggestions}
                      isLoading={isAiLoading}
                      loadingMessage={aiLoadingMessage}
                      onSelect={updateField}
                      currentValue={value}
                    />
                  )}
                </View>
              )}

              {!showExamples && isAiLoading && (
                <Text variant="caption" className="text-[13px] text-ink-soft">
                  Preparing examples in the background.
                </Text>
              )}
            </View>
          </FadeInItem>
        )}
      </StepLayout>
    );
  },
);

TextInputStep.displayName = "TextInputStep";
