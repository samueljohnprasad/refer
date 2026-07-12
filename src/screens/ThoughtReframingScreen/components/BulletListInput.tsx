import React, { useState, useCallback } from 'react';
import { View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon, Add01Icon, Mic01Icon, StopIcon } from '@hugeicons/core-free-icons';
import useAudioRecording from '@/hooks/useAudioRecording';
import { useTranscribeAudio } from '@/hooks/useTranscribeAudio';
import * as Haptics from 'expo-haptics';
import GlowyInput from '@/src/components/GlowyInput';

interface BulletListInputProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  maxItems?: number;
  placeholder?: string;
}

export const BulletListInput: React.FC<BulletListInputProps> = React.memo(
  ({
    items,
    onAdd,
    onRemove,
    maxItems,
    placeholder = 'Type or use voice...',
  }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const { recordingCurrentState, record, stopRecording } = useAudioRecording();
    const { transcribeAudio, isTranscribing } = useTranscribeAudio();
    
    const isRecording = recordingCurrentState === 'recording';

    const handleAdd = useCallback((): void => {
      const trimmed: string = inputValue.trim();
      if (trimmed.length === 0) return;
      onAdd(trimmed);
      setInputValue('');
    }, [inputValue, onAdd]);

    const handleToggleRecording = useCallback(async (): Promise<void> => {
      if (isRecording) {
        const recorderState = await stopRecording();
        const uri = recorderState?.url;
        if (uri) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result && result.transcript) {
            onAdd(result.transcript);
          }
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await record();
      }
    }, [isRecording, record, stopRecording, transcribeAudio, onAdd]);

    const canAdd: boolean = inputValue.trim().length > 0 && (!maxItems || items.length < maxItems);

    return (
      <View>
        {items.map((item: string, index: number) => (
          <View
            key={`${item}-${index}`}
            className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-2 border border-slate-100"
          >
            <View className="h-2 w-2 rounded-full bg-blue-400 mr-3" />
            <Text className="flex-1 text-sm text-slate-700">{item}</Text>
            <Pressable
              onPress={() => onRemove(index)}
              accessibilityRole="button"
              className="h-8 w-8 rounded-full bg-slate-50 items-center justify-center active:bg-slate-100"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} color="#94A3B8" />
            </Pressable>
          </View>
        ))}

        <GlowyInput
          message={inputValue}
          setMessage={setInputValue}
          placeholder={placeholder}
          handleSendMessage={handleAdd}
          handleSubmitEditing={handleAdd}
          onWavePress={handleToggleRecording}
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          submitIcon={Add01Icon}
          alwaysShowVoice={true}
        />

        {maxItems && (
          <Text className="text-xs text-slate-400 mt-2 text-right">
            {items.length}/{maxItems} items
          </Text>
        )}
      </View>
    );
  }
);

BulletListInput.displayName = 'BulletListInput';
