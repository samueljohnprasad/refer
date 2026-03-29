import React, { useState, useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon, Add01Icon } from '@hugeicons/core-free-icons';
import { StepHeader } from '../../ThoughtReframingScreen/components/StepHeader';
import { StepNavigation } from '../../ThoughtReframingScreen/components/StepNavigation';
import { VoiceTextInput } from '../../ThoughtReframingScreen/components/VoiceTextInput';

interface ReflectionStepProps {
  selectedPrompt: string;
  gratitudeEntries: string[];
  onAddEntry: (text: string) => void;
  onRemoveEntry: (index: number) => void;
  onUpdateEntry: (index: number, text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

const MAX_ENTRIES: number = 3;

export const ReflectionStep: React.FC<ReflectionStepProps> = React.memo(
  ({
    selectedPrompt,
    gratitudeEntries,
    onAddEntry,
    onRemoveEntry,
    onUpdateEntry,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
  }) => {
    const [currentInput, setCurrentInput] = useState<string>('');

    const handleAdd = useCallback((): void => {
      const trimmed: string = currentInput.trim();
      if (trimmed.length >= 3 && gratitudeEntries.length < MAX_ENTRIES) {
        onAddEntry(trimmed);
        setCurrentInput('');
      }
    }, [currentInput, gratitudeEntries.length, onAddEntry]);

    const canAddMore: boolean = gratitudeEntries.length < MAX_ENTRIES;

    return (
      <View className="flex-1">
        <StepHeader
          title="What are you grateful for?"
          subtitle={`Write up to ${MAX_ENTRIES} things. Even small ones count.`}
          progress={progress}
          stepNumber={3}
          totalSteps={4}
        />

        {/* Selected prompt as context */}
        <View className="bg-slate-50 rounded-2xl p-3 mb-6 border border-slate-100">
          <Text className="text-[11px] text-slate-300 uppercase tracking-wider mb-1">
            Your prompt
          </Text>
          <Text className="text-sm text-slate-600 leading-relaxed italic">
            "{selectedPrompt}"
          </Text>
        </View>

        {/* Existing entries */}
        {gratitudeEntries.map((entry: string, index: number) => (
          <View
            key={`entry-${index}`}
            className="flex-row items-start bg-white rounded-2xl p-4 mb-3 border border-slate-100"
          >
            <Text className="text-lg mr-3">🌿</Text>
            <Text className="flex-1 text-sm text-slate-700 leading-relaxed">
              {entry}
            </Text>
            <Pressable
              onPress={() => onRemoveEntry(index)}
              accessibilityRole="button"
              accessibilityLabel={`Remove entry ${index + 1}`}
              className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center ml-2 active:bg-slate-200"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} color="#94A3B8" />
            </Pressable>
          </View>
        ))}

        {/* Input for new entry */}
        {canAddMore && (
          <View className="mb-4">
            <VoiceTextInput
              value={currentInput}
              onChangeText={setCurrentInput}
              placeholder={
                gratitudeEntries.length === 0
                  ? 'e.g., "My morning coffee was really good today"'
                  : 'Add another thing you appreciate…'
              }
              maxLength={300}
              showCharCount={false}
              minHeight={100}
            />

            {/* Add button */}
            {currentInput.trim().length >= 3 && (
              <Pressable
                onPress={handleAdd}
                accessibilityRole="button"
                accessibilityLabel="Add gratitude entry"
                className="flex-row items-center justify-center mt-3 h-10 rounded-xl bg-slate-100 active:bg-slate-200"
              >
                <HugeiconsIcon icon={Add01Icon} size={16} color="#475569" />
                <Text className="text-sm font-medium text-slate-600 ml-2">
                  Add entry ({gratitudeEntries.length}/{MAX_ENTRIES})
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Filled state indicator */}
        {!canAddMore && (
          <View className="bg-green-50 rounded-2xl p-3 mb-4 border border-green-100">
            <Text className="text-sm text-green-700 text-center font-medium">
              ✓ {MAX_ENTRIES} entries — great job!
            </Text>
          </View>
        )}

        <StepNavigation
          canGoBack={canGoBack}
          canGoNext={isValid}
          onBack={onBack}
          onNext={onNext}
        />
      </View>
    );
  }
);

ReflectionStep.displayName = 'ReflectionStep';
