import React from 'react';
import { View } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { LessonScreen } from '@/src/components/ui/LessonScreen';
import { VoiceTextInput } from '../components/VoiceTextInput';

interface SituationStepProps {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  onClose?: () => void;
}

export const SituationStep: React.FC<SituationStepProps> = React.memo(
  ({ value, onChange, onNext, onBack, canGoBack, isValid, progress, onClose }) => {
    return (
      <LessonScreen
        progress={progress}
        trailingLabel="+10 XP"
        onClose={onClose}
        primaryLabel="Continue"
        onPrimaryPress={onNext}
        primaryDisabled={!isValid}
        secondaryLabel={canGoBack ? "Back" : undefined}
        onSecondaryPress={canGoBack ? onBack : undefined}
        backButtonVariant="close-text"
      >
        <StepHeader
          title="What happened?"
          subtitle="Briefly describe the situation that triggered your thoughts."
        />

        <View className="flex-1">
          <VoiceTextInput
            value={value}
            onChangeText={onChange}
            placeholder="e.g., 'My manager didn't respond to my email all day'"
            maxLength={500}
          />
        </View>

      </LessonScreen>
    );
  }
);

SituationStep.displayName = 'SituationStep';
