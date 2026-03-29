import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import Slider from '@react-native-community/slider';
import { StepHeader } from '../../ThoughtReframingScreen/components/StepHeader';
import { StepNavigation } from '../../ThoughtReframingScreen/components/StepNavigation';
import { EmotionChip } from '../../ThoughtReframingScreen/components/EmotionChip';
import {
  EMOTION_OPTIONS,
  type EmotionOption,
} from '../../ThoughtReframingScreen/data/emotions';
import type { EmotionName } from '../../ThoughtReframingScreen/types';

interface MoodStepProps {
  currentMood: EmotionName | null;
  moodIntensity: number;
  onSelectMood: (mood: EmotionName) => void;
  onSetIntensity: (intensity: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const MoodStep: React.FC<MoodStepProps> = React.memo(
  ({
    currentMood,
    moodIntensity,
    onSelectMood,
    onSetIntensity,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
  }) => {
    const selectedOption: EmotionOption | undefined = useMemo(
      () => EMOTION_OPTIONS.find((e) => e.name === currentMood),
      [currentMood]
    );

    return (
      <View className="flex-1">
        <StepHeader
          title="How are you feeling?"
          subtitle="Pick the emotion that best describes your current state."
          progress={progress}
          stepNumber={1}
          totalSteps={4}
        />

        {/* Emotion chips — single select */}
        <View className="flex-row flex-wrap mb-6">
          {EMOTION_OPTIONS.map((emotion: EmotionOption) => {
            const isSelected: boolean = currentMood === emotion.name;
            return (
              <EmotionChip
                key={emotion.name}
                emotion={emotion}
                isSelected={isSelected}
                onToggle={() => onSelectMood(emotion.name)}
                disabled={false}
              />
            );
          })}
        </View>

        {/* Intensity slider — only visible after mood selection */}
        {currentMood && selectedOption && (
          <View className="mb-4">
            <Text className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-4">
              Rate intensity
            </Text>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Text className="text-base mr-2">{selectedOption.emoji}</Text>
                <Text className="text-sm font-medium text-slate-700">
                  {selectedOption.label}
                </Text>
              </View>
              <Text className="text-sm font-bold text-slate-900">
                {moodIntensity}
                <Text className="text-xs font-normal text-slate-400">/10</Text>
              </Text>
            </View>
            <Slider
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={moodIntensity}
              onValueChange={onSetIntensity}
              minimumTrackTintColor="#1E293B"
              maximumTrackTintColor="#E2E8F0"
              thumbTintColor="#1E293B"
              accessibilityLabel={`${selectedOption.label} intensity`}
              accessibilityValue={{
                min: 0,
                max: 10,
                now: moodIntensity,
              }}
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-[11px] text-slate-300">Mild</Text>
              <Text className="text-[11px] text-slate-300">Intense</Text>
            </View>
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

MoodStep.displayName = 'MoodStep';
