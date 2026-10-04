import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Add01Icon,
  AudioWave01Icon,
  Cancel01Icon,
  StopCircleIcon,
} from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";
import { Text } from "@/src/components/ui/Text";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import {
  ComposerMeta,
  ComposerShell,
  composerStyles,
} from "@/src/components/exercise/ExerciseComposerParts";
import type { ExerciseTextComposerProps } from "@/src/components/exercise/ExerciseTextComposer";

type ListComposerProps = Extract<ExerciseTextComposerProps, { mode: "list" }>;

export function ExerciseTextListComposer(props: ListComposerProps) {
  const { t } = useTranslation("exercises");
  const {
    items,
    onAdd,
    onRemove,
    maxItems,
    maxLength,
    placeholder,
    readOnly = false,
    addLabel,
    minHeight = 118,
    helperText,
    requirementText,
    requirementVisible,
    statusText,
    statusVisible,
    autoFocus = true,
  } = props;
  const { isVoiceEnabled } = useVoiceFeature();
  const [value, setValue] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const { recordedStatus, recordingCurrentState, record, stopRecording } =
    useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const processedRecordingUrlRef = useRef<string | null>(null);
  const isRecording = recordingCurrentState === "recording";
  const hasReachedMaxItems = maxItems !== undefined && items.length >= maxItems;
  const canAdd = value.trim().length > 0 && !hasReachedMaxItems;

  const commitValue = (nextValue: string) => {
    const normalized = nextValue.trim();
    const boundedValue =
      typeof maxLength === "number"
        ? normalized.slice(0, maxLength)
        : normalized;
    if (!boundedValue || hasReachedMaxItems) return;
    onAdd(boundedValue);
    setValue("");
    setVoiceError(null);
  };

  useEffect(() => {
    const uri = recordedStatus?.url;
    if (
      !recordedStatus?.isFinished ||
      !uri ||
      processedRecordingUrlRef.current === uri
    )
      return;
    processedRecordingUrlRef.current = uri;
    let cancelled = false;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    void transcribeAudio(uri)
      .then((result) => {
        if (!cancelled && result?.transcript) commitValue(result.transcript);
      })
      .catch(() => {
        if (!cancelled)
          setVoiceError(t("flow.ui.copy.text_composer_voice_unavailable"));
      });
    return () => {
      cancelled = true;
    };
  }, [recordedStatus, transcribeAudio, t]);

  const handleToggleRecording = async () => {
    if (!isVoiceEnabled) return;
    setVoiceError(null);
    if (isRecording) {
      try {
        const uri = (await stopRecording())?.url;
        if (uri) {
          processedRecordingUrlRef.current = uri;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result?.transcript) commitValue(result.transcript);
        }
      } catch {
        setVoiceError(t("flow.ui.copy.text_composer_voice_unavailable"));
      }
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await record();
    } catch {
      setVoiceError(t("flow.ui.copy.text_composer_recording_failed"));
    }
  };

  const activePlaceholder =
    placeholder ??
    t(
      isVoiceEnabled
        ? "flow.ui.copy.text_composer_voice_placeholder"
        : "flow.ui.copy.text_composer_item_placeholder",
    );

  return (
    <View>
      {items.length > 0 ? (
        <View className="mb-3 border-t border-sage-100/70">
          {items.map((item, index) => (
            <View
              key={`${item}-${index}`}
              className="min-h-[52px] flex-row items-start border-b border-sage-100/70 py-3"
            >
              <View
                className="mr-3 mt-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: SEMANTIC_COLORS.border.selected }}
              />
              <Text className="flex-1 pr-2 text-[15px] leading-[21px] text-ink">
                {item}
              </Text>
              {!readOnly ? (
                <Pressable
                  onPress={() => onRemove(index)}
                  accessibilityRole="button"
                  accessibilityLabel={t(
                    "flow.ui.copy.text_composer_remove_item_accessibility",
                    { index: index + 1, item },
                  )}
                  className="h-11 w-11 items-center justify-center active:opacity-60"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={16}
                    color={SEMANTIC_COLORS.brand.primary}
                  />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
      {!readOnly && (!hasReachedMaxItems || isRecording || isTranscribing) ? (
        <>
          <ComposerShell
            value={value}
            onChange={(nextValue) => {
              if (!maxLength || nextValue.length <= maxLength)
                setValue(nextValue);
            }}
            placeholder={
              isRecording
                ? t("flow.ui.copy.text_composer_listening")
                : activePlaceholder
            }
            minHeight={minHeight}
            autoFocus={autoFocus}
            onSubmitEditing={() => commitValue(value)}
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            maxLength={maxLength}
            submitBehavior="submit"
            footer={
              <View style={composerStyles.footer}>
                {isVoiceEnabled ? (
                  <Pressable
                    onPress={handleToggleRecording}
                    disabled={
                      isTranscribing || (hasReachedMaxItems && !isRecording)
                    }
                    accessibilityRole="button"
                    accessibilityLabel={t(
                      isRecording
                        ? "flow.ui.copy.text_composer_stop_recording_item"
                        : "flow.ui.copy.text_composer_start_voice_input",
                    )}
                    accessibilityState={{
                      busy: isTranscribing,
                      selected: isRecording,
                    }}
                    style={({ pressed }) => [
                      composerStyles.waveButton,
                      isRecording && composerStyles.waveButtonRecording,
                      pressed && composerStyles.pressed,
                    ]}
                  >
                    {isTranscribing ? (
                      <ActivityIndicator
                        size="small"
                        color={SEMANTIC_COLORS.text.secondary}
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={isRecording ? StopCircleIcon : AudioWave01Icon}
                        size={20}
                        color={
                          isRecording
                            ? SEMANTIC_COLORS.surface.primary
                            : SEMANTIC_COLORS.text.secondary
                        }
                        strokeWidth={2}
                      />
                    )}
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={() => commitValue(value)}
                  disabled={!canAdd || isRecording}
                  accessibilityRole="button"
                  accessibilityLabel={t(
                    "flow.ui.copy.text_composer_add_item_accessibility",
                  )}
                  accessibilityState={{ disabled: !canAdd || isRecording }}
                  style={({ pressed }) => [
                    composerStyles.inlineActionButton,
                    {
                      backgroundColor:
                        canAdd && !isRecording
                          ? SEMANTIC_COLORS.brand.primary
                          : SEMANTIC_COLORS.surface.elevated,
                      borderColor:
                        canAdd && !isRecording
                          ? SEMANTIC_COLORS.brand.primary
                          : SEMANTIC_COLORS.surface.secondary,
                      opacity: canAdd && !isRecording ? 1 : 0.62,
                    },
                    pressed && composerStyles.pressed,
                  ]}
                >
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={18}
                    color={
                      canAdd && !isRecording
                        ? SEMANTIC_COLORS.surface.primary
                        : SEMANTIC_COLORS.brand.primary
                    }
                    strokeWidth={2}
                  />
                  <Text
                    className="ml-2 text-[14px] font-bold"
                    style={{
                      color:
                        canAdd && !isRecording
                          ? SEMANTIC_COLORS.surface.primary
                          : SEMANTIC_COLORS.brand.primary,
                    }}
                  >
                    {addLabel ?? t("flow.ui.copy.text_composer_add_item")}
                  </Text>
                </Pressable>
              </View>
            }
          />
          {voiceError ? (
            <Text className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              {voiceError}
            </Text>
          ) : null}
        </>
      ) : null}
      <ComposerMeta
        helperText={helperText}
        requirementText={requirementText}
        requirementVisible={requirementVisible}
        statusText={statusText}
        statusVisible={statusVisible}
      />
    </View>
  );
}
