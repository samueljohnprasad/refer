import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import Slider from '@react-native-community/slider';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';
import { EmotionChip } from '../components/EmotionChip';
import { EMOTION_OPTIONS, type EmotionOption } from '../data/emotions';
import type { EmotionName, EmotionRating } from '../types';
import type { AIEmotionSuggestion } from '../hooks/useThoughtReframingAI';

interface EmotionStepProps {
  selectedEmotions: EmotionRating[];
  onToggleEmotion: (name: EmotionName) => void;
  onSetIntensity: (name: EmotionName, intensity: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  aiSuggestedEmotions?: AIEmotionSuggestion[];
  isDetectingEmotions?: boolean;
}

const MAX_EMOTIONS: number = 3;

export const EmotionStep: React.FC<EmotionStepProps> = React.memo(
  ({
    selectedEmotions,
    onToggleEmotion,
    onSetIntensity,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    aiSuggestedEmotions = [],
    isDetectingEmotions = false,
  }) => {
    const selectedNames: Set<EmotionName> = useMemo(
      () => new Set(selectedEmotions.map((e) => e.name)),
      [selectedEmotions]
    );

    const aiSuggestedNames: Set<EmotionName> = useMemo(
      () => new Set(aiSuggestedEmotions.map((e) => e.name)),
      [aiSuggestedEmotions]
    );

    const atLimit: boolean = selectedEmotions.length >= MAX_EMOTIONS;

    return (
      <View className="flex-1">
        <StepHeader
          title="How did it make you feel?"
          subtitle={`Select up to ${MAX_EMOTIONS} emotions, then rate intensity.`}
          progress={progress}
          stepNumber={3}
          totalSteps={8}
        />

        {/* AI state — minimal pill, not a banner */}
        {isDetectingEmotions && (
          <View className="flex-row items-center mb-4">
            <ActivityIndicator size="small" color="#94A3B8" />
            <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
              Analysing emotions…
            </Text>
          </View>
        )}

        {aiSuggestedEmotions.length > 0 && !isDetectingEmotions && (
          <Text className="text-[11px] text-slate-400 mb-4 uppercase tracking-wider">
            AI highlighted — tap to confirm
          </Text>
        )}

        {/* Emotion chips */}
        <View className="flex-row flex-wrap mb-6">
          {EMOTION_OPTIONS.map((emotion: EmotionOption) => {
            const isAISuggested: boolean = aiSuggestedNames.has(emotion.name);
            const isSelected: boolean = selectedNames.has(emotion.name);
            return (
              <View key={emotion.name} className="relative">
                <EmotionChip
                  emotion={emotion}
                  isSelected={isSelected}
                  onToggle={() => onToggleEmotion(emotion.name)}
                  disabled={atLimit && !isSelected}
                />
                {/* Subtle AI dot — only if not selected */}
                {isAISuggested && !isSelected && (
                  <View className="absolute -top-0.5 -right-0.5 bg-slate-400 rounded-full h-2 w-2" />
                )}
              </View>
            );
          })}
        </View>

        {/* Intensity sliders */}
        {selectedEmotions.length > 0 && (
          <View>
            <Text className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-4">
              Rate intensity
            </Text>
            {selectedEmotions.map((emotion: EmotionRating) => {
              const option: EmotionOption | undefined = EMOTION_OPTIONS.find(
                (e) => e.name === emotion.name
              );
              return (
                <View
                  key={emotion.name}
                  className="mb-4"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <Text className="text-base mr-2">{option?.emoji}</Text>
                      <Text className="text-sm font-medium text-slate-700">
                        {option?.label}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-slate-900">
                      {emotion.initial_intensity}
                      <Text className="text-xs font-normal text-slate-400">/10</Text>
                    </Text>
                  </View>
                  <Slider
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={emotion.initial_intensity}
                    onValueChange={(val: number) =>
                      onSetIntensity(emotion.name, val)
                    }
                    minimumTrackTintColor="#1E293B"
                    maximumTrackTintColor="#E2E8F0"
                    thumbTintColor="#1E293B"
                    accessibilityLabel={`${option?.label} intensity`}
                    accessibilityValue={{
                      min: 0,
                      max: 10,
                      now: emotion.initial_intensity,
                    }}
                  />
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-[11px] text-slate-300">Mild</Text>
                    <Text className="text-[11px] text-slate-300">Intense</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

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

EmotionStep.displayName = 'EmotionStep';
