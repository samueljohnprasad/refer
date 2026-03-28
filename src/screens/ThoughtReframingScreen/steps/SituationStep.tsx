import React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';

interface SituationStepProps {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const SituationStep: React.FC<SituationStepProps> = React.memo(
  ({ value, onChange, onNext, onBack, canGoBack, isValid, progress }) => {
    const charCount: number = value.length;
    const maxChars: number = 500;

    return (
      <View className="flex-1">
        <StepHeader
          title="What happened?"
          subtitle="Briefly describe the situation that triggered your thoughts."
          progress={progress}
          stepNumber={1}
          totalSteps={8}
        />

        <View className="flex-1">
          <TextInput
            value={value}
            onChangeText={(text: string) => {
              if (text.length <= maxChars) onChange(text);
            }}
            placeholder="e.g., 'My manager didn't respond to my email all day'"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            maxLength={maxChars}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-base text-slate-700 min-h-[140px]"
          />
          <Text className={`text-xs mt-2 text-right ${charCount > maxChars * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
            {charCount}/{maxChars}
          </Text>
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

SituationStep.displayName = 'SituationStep';
