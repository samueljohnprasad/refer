import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';
import { BulletListInput } from '../components/BulletListInput';
import { getRandomSocraticPrompt } from '../data/cognitiveDistortions';

interface EvidenceAgainstStepProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const EvidenceAgainstStep: React.FC<EvidenceAgainstStepProps> = React.memo(
  ({ items, onAdd, onRemove, onNext, onBack, canGoBack, isValid, progress }) => {
    // Stable random prompt per mount
    const socraticPrompt: string = useMemo(() => getRandomSocraticPrompt(), []);

    return (
      <View className="flex-1">
        <StepHeader
          title="Evidence against this thought"
          subtitle="What facts contradict this thought?"
          progress={progress}
          stepNumber={6}
          totalSteps={8}
        />

        {/* Socratic prompt nudge */}
        <View className="bg-green-50 rounded-2xl p-3 mb-4 border border-green-100">
          <Text className="text-sm text-green-700 leading-relaxed">
            💡 Try asking yourself: "{socraticPrompt}"
          </Text>
        </View>

        <View className="flex-1">
          <BulletListInput
            items={items}
            onAdd={onAdd}
            onRemove={onRemove}
            maxItems={5}
            placeholder="Add a fact that contradicts the thought..."
          />
        </View>

        <StepNavigation
          canGoBack={canGoBack}
          canGoNext={isValid}
          onBack={onBack}
          onNext={onNext}
          nextLabel={items.length === 0 ? 'Skip' : 'Continue'}
        />
      </View>
    );
  }
);

EvidenceAgainstStep.displayName = 'EvidenceAgainstStep';
