import React, { useState, useCallback, useEffect } from "react";
import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mic01Icon, StopCircleIcon } from "@hugeicons/core-free-icons";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";
import {
  SAGE,
  BRAND_SURFACE,
  BRAND_BORDER,
  INK,
  INK_MUTED,
} from "@/lib/tokens";
import * as Haptics from "expo-haptics";

interface VoiceTextInputProps {
  /** Current text value */
  value: string;
  /** Called when text changes (via typing or voice) */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum character count */
  maxLength?: number;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Minimum height of the text area */
  minHeight?: number;
  /** Additional className for the outer wrapper */
  className?: string;
}

/**
 * TextInput with an inline voice recording button.
 * Transcribes audio via API after recording finishes.
 */
export const VoiceTextInput: React.FC<VoiceTextInputProps> = React.memo(
  ({
    value,
    onChangeText,
    placeholder = "Start typing or tap mic to speak...",
    maxLength = 500,
    showCharCount = true,
    minHeight = 140,
  }) => {
    const { recordingCurrentState, record, stopRecording } =
      useAudioRecording();
    const { transcribeAudio, isTranscribing } = useTranscribeAudio();
    const [localValue, setLocalValue] = useState(value);

    const isRecording = recordingCurrentState === "recording";

    // Sync local value with prop when not transcribing
    useEffect(() => {
      if (!isTranscribing) {
        setLocalValue(value);
      }
    }, [value, isTranscribing]);

    const handleToggleRecording = useCallback(async (): Promise<void> => {
      if (isRecording) {
        const recorderState = await stopRecording();
        const uri = recorderState?.url;
        if (uri) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result && result.transcript) {
            const separator: string = value.trim().length > 0 ? "\n" : "";
            onChangeText(
              (value + separator + result.transcript).slice(0, maxLength),
            );
          }
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await record();
      }
    }, [
      isRecording,
      record,
      stopRecording,
      transcribeAudio,
      value,
      onChangeText,
      maxLength,
    ]);

    const charCount: number = value.length;

    return (
      <View>
        <View className="relative">
          <TextInput
            value={localValue}
            onChangeText={(text: string) => {
              if (text.length <= maxLength) {
                setLocalValue(text);
                onChangeText(text);
              }
            }}
            placeholder={isRecording ? "Listening..." : placeholder}
            placeholderTextColor={INK_MUTED}
            multiline
            textAlignVertical="top"
            maxLength={maxLength}
            editable={!isTranscribing}
            className="rounded-2xl p-4 pb-16 text-[17px] happy-font-body border-2"
            style={{
              minHeight,
              backgroundColor: isRecording ? SAGE[50] : BRAND_SURFACE,
              borderColor: isRecording ? SAGE[300] : BRAND_BORDER,
              color: INK,
            }}
          />

          {/* Recording button */}
          <View className="absolute right-3 bottom-3 flex-row items-center">
            {isTranscribing && (
              <View
                className="mr-3 flex-row items-center px-3 py-1.5 rounded-full border border-sage-200/50"
                style={{ backgroundColor: SAGE[50] }}
              >
                <ActivityIndicator size="small" color={SAGE[500]} />
                <Text className="text-[13px] font-bold text-sage-600 ml-2 tracking-tight">
                  Transcribing...
                </Text>
              </View>
            )}

            <Pressable
              onPress={handleToggleRecording}
              disabled={isTranscribing}
              accessibilityRole="button"
              accessibilityLabel={
                isRecording ? "Stop recording" : "Start voice input"
              }
              className="h-11 w-11 rounded-full items-center justify-center"
              style={{
                backgroundColor: isRecording ? SAGE[600] : SAGE[500],
                opacity: isTranscribing ? 0.5 : 1,
                shadowColor: SAGE[700],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <HugeiconsIcon
                icon={isRecording ? StopCircleIcon : Mic01Icon}
                size={20}
                color="#ffffff"
                strokeWidth={2}
              />
            </Pressable>
          </View>
        </View>

        {showCharCount && (
          <Text
            className={`text-right mt-1.5 text-[13px] text-slate-500 ${charCount > maxLength * 0.9 ? "text-amber-500" : ""}`}
          >
            {charCount} / {maxLength}
          </Text>
        )}
      </View>
    );
  },
);

VoiceTextInput.displayName = "VoiceTextInput";
