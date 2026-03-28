import React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';

interface AutomaticThoughtStepProps {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const AutomaticThoughtStep: React.FC<AutomaticThoughtStepProps> = React.memo(
  ({ value, onChange, onNext, onBack, canGoBack, isValid, progress }) => {
    const charCount: number = value.length;
    const maxChars: number = 300;

    return (
      <View className="flex-1">
        <StepHeader
          title="What thought popped up?"
          subtitle="Write down the first thought that came to mind."
          progress={progress}
          stepNumber={2}
          totalSteps={8}
        />

        {/* Educational tip */}
        <View className="bg-amber-50 rounded-2xl p-3 mb-4 border border-amber-100">
          <Text className="text-sm text-amber-700 leading-relaxed">
            💡 Automatic thoughts are the first things that come to mind — they feel true, but they're not always accurate.
          </Text>
        </View>

        <View className="flex-1">
          <TextInput
            value={value}
            onChangeText={(text: string) => {
              if (text.length <= maxChars) onChange(text);
            }}
            placeholder="e.g., 'They think my work isn't good enough'"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            maxLength={maxChars}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-base text-slate-700 min-h-[120px]"
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

AutomaticThoughtStep.displayName = 'AutomaticThoughtStep';
