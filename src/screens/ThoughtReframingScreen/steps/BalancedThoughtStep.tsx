import React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';

interface BalancedThoughtStepProps {
  value: string;
  automaticThought: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const BalancedThoughtStep: React.FC<BalancedThoughtStepProps> = React.memo(
  ({
    value,
    automaticThought,
    onChange,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
  }) => {
    const charCount: number = value.length;
    const maxChars: number = 300;

    return (
      <View className="flex-1">
        <StepHeader
          title="Write a balanced thought"
          subtitle="Replace the original thought with something more realistic and fair."
          progress={progress}
          stepNumber={7}
          totalSteps={8}
        />

        {/* Show original thought for reference */}
        <View className="bg-red-50 rounded-2xl p-3 mb-4 border border-red-100">
          <Text className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
            Original thought
          </Text>
          <Text className="text-sm text-red-700 italic">
            "{automaticThought}"
          </Text>
        </View>

        <View className="flex-1">
          <TextInput
            value={value}
            onChangeText={(text: string) => {
              if (text.length <= maxChars) onChange(text);
            }}
            placeholder="e.g., 'My manager is busy. Not responding immediately doesn't mean they dislike my work.'"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            maxLength={maxChars}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-base text-slate-700 min-h-[120px]"
          />
          <Text className={`text-xs mt-2 text-right ${charCount > maxChars * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
            {charCount}/{maxChars}
          </Text>

          <View className="bg-blue-50 rounded-2xl p-3 mt-3 border border-blue-100">
            <Text className="text-sm text-blue-600 leading-relaxed">
              ✨ This doesn't have to be positive — just fair and realistic.
            </Text>
          </View>
        </View>

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

BalancedThoughtStep.displayName = 'BalancedThoughtStep';
