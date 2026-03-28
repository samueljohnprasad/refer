import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';
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
  /** AI-suggested distortions */
  aiSuggestedDistortions?: AIDistortionSuggestion[];
  isDetectingDistortions?: boolean;
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

    // Sort: AI-suggested first, then the rest
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
      <View className="flex-1">
        <StepHeader
          title="Spot the thinking trap"
          subtitle={`Which pattern might be at play? Pick up to ${MAX_DISTORTIONS}.`}
          progress={progress}
          stepNumber={4}
          totalSteps={8}
        />

        {/* AI loading */}
        {isDetectingDistortions && (
          <View className="flex-row items-center mb-3 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100">
            <ActivityIndicator size="small" color="#7C3AED" />
            <Text className="text-xs text-purple-600 font-semibold ml-2">
              AI is detecting thinking traps...
            </Text>
          </View>
        )}

        {/* AI suggestions banner */}
        {aiSuggestedDistortions.length > 0 && !isDetectingDistortions && (
          <View className="mb-3 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100">
            <Text className="text-xs text-purple-600 font-semibold">
              ✨ AI detected {aiSuggestedDistortions.length} thinking trap{aiSuggestedDistortions.length > 1 ? 's' : ''} — shown first below
            </Text>
          </View>
        )}

        <View className="flex-1">
          {sortedDistortions.map((distortion: CognitiveDistortion) => {
            const isAISuggested: boolean = aiSuggestedKeys.has(distortion.key);
            const aiSuggestion: AIDistortionSuggestion | undefined =
              aiSuggestedDistortions.find((d) => d.key === distortion.key);

            return (
              <View key={distortion.key}>
                {isAISuggested && (
                  <View className="flex-row items-center mb-1 ml-1">
                    <View className="bg-purple-500 rounded-full px-2 py-0.5 mr-2">
                      <Text className="text-[9px] text-white font-bold">AI DETECTED</Text>
                    </View>
                    {aiSuggestion?.explanation && (
                      <Text className="text-xs text-purple-500 flex-1" numberOfLines={1}>
                        {aiSuggestion.explanation}
                      </Text>
                    )}
                  </View>
                )}
                <DistortionCard
                  distortion={distortion}
                  isSelected={selectedSet.has(distortion.key)}
                  onToggle={() => onToggle(distortion.key)}
                  disabled={atLimit}
                />
              </View>
            );
          })}
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
