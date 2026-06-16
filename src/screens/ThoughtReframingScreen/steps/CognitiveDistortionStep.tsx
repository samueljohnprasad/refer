import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { StepHeader } from '../components/StepHeader';
import { LessonScreen } from '@/src/components/ui/LessonScreen';
import { DistortionCard } from '../components/DistortionCard';
import { COGNITIVE_DISTORTIONS } from '../data/cognitiveDistortions';
import type { CognitiveDistortionKey, CognitiveDistortion } from '../types';
import type { AIDistortionSuggestion } from '../hooks/useThoughtReframingAI';

interface CognitiveDistortionStepProps {
  selectedDistortions: CognitiveDistortionKey[];
  onToggle: (key: CognitiveDistortionKey) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  aiSuggestedDistortions?: AIDistortionSuggestion[];
  isDetectingDistortions?: boolean;
  onClose?: () => void;
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
    aiSuggestedDistortions = [],
    isDetectingDistortions = false,
    onClose,
  }) => {
    const selectedSet: Set<CognitiveDistortionKey> = useMemo(
      () => new Set(selectedDistortions),
      [selectedDistortions]
    );

    const aiSuggestedKeys: Set<CognitiveDistortionKey> = useMemo(
      () => new Set(aiSuggestedDistortions.map((d) => d.key)),
      [aiSuggestedDistortions]
    );

    const atLimit: boolean = selectedDistortions.length >= MAX_DISTORTIONS;

    const sortedDistortions: CognitiveDistortion[] = useMemo(() => {
      if (aiSuggestedDistortions.length === 0) return COGNITIVE_DISTORTIONS;
      const suggested: CognitiveDistortion[] = [];
      const rest: CognitiveDistortion[] = [];
      COGNITIVE_DISTORTIONS.forEach((d) => {
        if (aiSuggestedKeys.has(d.key)) {
          suggested.push(d);
        } else {
          rest.push(d);
        }
      });
      return [...suggested, ...rest];
    }, [aiSuggestedDistortions, aiSuggestedKeys]);

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
          title="Spot the thinking trap"
          subtitle={`Which pattern might be at play? Pick up to ${MAX_DISTORTIONS}.`}
        />

        {/* AI state — quiet inline indicator */}
        {isDetectingDistortions && (
          <View className="flex-row items-center mb-4">
            <ActivityIndicator size="small" color="#94A3B8" />
            <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
              Analysing patterns…
            </Text>
          </View>
        )}

        {aiSuggestedDistortions.length > 0 && !isDetectingDistortions && (
          <Text className="text-[11px] text-slate-400 mb-4 uppercase tracking-wider">
            AI suggestions shown first
          </Text>
        )}

        <View className="flex-1">
          {sortedDistortions.map((distortion: CognitiveDistortion) => {
            const isAISuggested: boolean = aiSuggestedKeys.has(distortion.key);
            const aiSuggestion: AIDistortionSuggestion | undefined =
              aiSuggestedDistortions.find((d) => d.key === distortion.key);

            return (
              <View key={distortion.key}>
                {/* AI explanation — muted, inline */}
                {isAISuggested && aiSuggestion?.explanation && (
                  <Text className="text-[11px] text-slate-400 mb-1 ml-1" numberOfLines={2}>
                    {aiSuggestion.explanation}
                  </Text>
                )}
                <DistortionCard
                  distortion={distortion}
                  isSelected={selectedSet.has(distortion.key)}
                  onToggle={() => onToggle(distortion.key)}
                  disabled={atLimit && !selectedSet.has(distortion.key)}
                />
              </View>
            );
          })}
        </View>

      </LessonScreen>
    );
  }
);

CognitiveDistortionStep.displayName = 'CognitiveDistortionStep';
