import React from 'react';
import { View } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';
import { VoiceTextInput } from '../components/VoiceTextInput';

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
          <VoiceTextInput
            value={value}
            onChangeText={onChange}
            placeholder="e.g., 'My manager didn't respond to my email all day'"
            maxLength={500}
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

SituationStep.displayName = 'SituationStep';
