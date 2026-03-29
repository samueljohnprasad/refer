import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Mic01Icon, StopIcon } from '@hugeicons/core-free-icons';
import useAudioRecording from '@/hooks/useAudioRecording';
import { useTranscribeAudio } from '@/hooks/useTranscribeAudio';
import * as Haptics from 'expo-haptics';

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
    placeholder = 'Start typing or tap mic to speak...',
    maxLength = 500,
    showCharCount = true,
    minHeight = 140,
  }) => {
    const { recordingCurrentState, record, stopRecording } = useAudioRecording();
    const { transcribeAudio, isTranscribing } = useTranscribeAudio();
    const [localValue, setLocalValue] = useState(value);
    
    const isRecording = recordingCurrentState === 'recording';

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
            const separator: string = value.trim().length > 0 ? '\n' : '';
            onChangeText((value + separator + result.transcript).slice(0, maxLength));
          }
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await record();
      }
    }, [isRecording, record, stopRecording, transcribeAudio, value, onChangeText, maxLength]);

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
            placeholder={isRecording ? 'Listening...' : placeholder}
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            maxLength={maxLength}
            editable={!isTranscribing}
            className={`bg-white border rounded-2xl p-4 pb-16 text-base text-slate-700 ${
              isRecording ? 'border-red-200 bg-red-50/30' : 'border-slate-100'
            }`}
            style={{ minHeight }}
          />

          {/* Recording Button */}
          <View className="absolute right-3 bottom-3 flex-row items-center">
            {isTranscribing && (
              <View className="mr-3 flex-row items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text className="text-[13px] font-bold text-slate-400 ml-2 tracking-tight">
                  Transcribing...
                </Text>
              </View>
            )}
            
            <Pressable
              onPress={handleToggleRecording}
              disabled={isTranscribing}
              accessibilityRole="button"
              accessibilityLabel={isRecording ? 'Stop recording' : 'Start voice input'}
              className={`h-12 w-12 rounded-full items-center justify-center shadow-sm ${
                isRecording ? 'bg-red-500' : 'bg-blue-500'
              } ${isTranscribing ? 'opacity-50' : ''}`}
            >
              <HugeiconsIcon
                icon={isRecording ? StopIcon : Mic01Icon}
                size={24}
                color="#ffffff"
              />
            </Pressable>
          </View>
        </View>

        {showCharCount && (
          <Text
            className={`text-xs mt-2 text-right ${
              charCount > maxLength * 0.9 ? 'text-amber-500' : 'text-slate-400'
            }`}
          >
            {charCount}/{maxLength}
          </Text>
        )}
      </View>
    );
  }
);

VoiceTextInput.displayName = 'VoiceTextInput';
