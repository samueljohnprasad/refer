import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';
import { DistortionCard } from '../components/DistortionCard';
import { COGNITIVE_DISTORTIONS } from '../data/cognitiveDistortions';
import type { CognitiveDistortionKey, CognitiveDistortion } from '../types';

interface CognitiveDistortionStepProps {
  selectedDistortions: CognitiveDistortionKey[];
  onToggle: (key: CognitiveDistortionKey) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

const MAX_DISTORTIONS: number = 2;

export const CognitiveDistortionStep: React.FC<CognitiveDistortionStepProps> = React.memo(
  ({
    selectedDistortions,
    onToggle,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
  }) => {
    const selectedSet: Set<CognitiveDistortionKey> = useMemo(
      () => new Set(selectedDistortions),
      [selectedDistortions]
    );

    const atLimit: boolean = selectedDistortions.length >= MAX_DISTORTIONS;

    return (
      <View className="flex-1">
        <StepHeader
          title="Spot the thinking trap"
          subtitle={`Which pattern might be at play? Pick up to ${MAX_DISTORTIONS}.`}
          progress={progress}
          stepNumber={4}
          totalSteps={8}
        />

        <View className="flex-1">
          {COGNITIVE_DISTORTIONS.map((distortion: CognitiveDistortion) => (
            <DistortionCard
              key={distortion.key}
              distortion={distortion}
              isSelected={selectedSet.has(distortion.key)}
              onToggle={() => onToggle(distortion.key)}
              disabled={atLimit}
            />
          ))}
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

CognitiveDistortionStep.displayName = 'CognitiveDistortionStep';
