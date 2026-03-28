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
  /** AI-suggested emotions */
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
          subtitle={`Select up to ${MAX_EMOTIONS} emotions and rate their intensity.`}
          progress={progress}
          stepNumber={3}
          totalSteps={8}
        />

        {/* AI suggestion badge */}
        {isDetectingEmotions && (
          <View className="flex-row items-center mb-3 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100">
            <ActivityIndicator size="small" color="#7C3AED" />
            <Text className="text-xs text-purple-600 font-semibold ml-2">
              AI is analyzing your emotions...
            </Text>
          </View>
        )}

        {aiSuggestedEmotions.length > 0 && !isDetectingEmotions && (
          <View className="mb-3 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100">
            <Text className="text-xs text-purple-600 font-semibold">
              ✨ AI detected these emotions — tap to confirm
            </Text>
          </View>
        )}

        {/* Emotion chips */}
        <View className="flex-row flex-wrap mb-4">
          {EMOTION_OPTIONS.map((emotion: EmotionOption) => {
            const isAISuggested: boolean = aiSuggestedNames.has(emotion.name);
            return (
              <View key={emotion.name} className="relative">
                <EmotionChip
                  emotion={emotion}
                  isSelected={selectedNames.has(emotion.name)}
                  onToggle={() => onToggleEmotion(emotion.name)}
                  disabled={atLimit}
                />
                {isAISuggested && !selectedNames.has(emotion.name) && (
                  <View className="absolute -top-1 -right-1 bg-purple-500 rounded-full h-3 w-3 items-center justify-center">
                    <Text className="text-[6px] text-white font-bold">AI</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Intensity sliders for selected emotions */}
        {selectedEmotions.length > 0 && (
          <View className="mt-2">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Rate intensity
            </Text>
            {selectedEmotions.map((emotion: EmotionRating) => {
              const option: EmotionOption | undefined = EMOTION_OPTIONS.find(
                (e) => e.name === emotion.name
              );
              return (
                <View
                  key={emotion.name}
                  className="bg-white rounded-2xl p-4 border border-slate-100 mb-2"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text className="text-lg mr-2">{option?.emoji}</Text>
                      <Text className="text-sm font-semibold text-slate-700">
                        {option?.label}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-blue-600">
                      {emotion.initial_intensity}/10
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
                    minimumTrackTintColor="#3B82F6"
                    maximumTrackTintColor="#E2E8F0"
                    thumbTintColor="#3B82F6"
                    accessibilityLabel={`${option?.label} intensity`}
                    accessibilityValue={{
                      min: 0,
                      max: 10,
                      now: emotion.initial_intensity,
                    }}
                  />
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-xs text-slate-400">Mild</Text>
                    <Text className="text-xs text-slate-400">Intense</Text>
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
