import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';
import { VoiceTextInput } from '../components/VoiceTextInput';

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
          <VoiceTextInput
            value={value}
            onChangeText={onChange}
            placeholder="e.g., 'They think my work isn't good enough'"
            maxLength={300}
          />
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
