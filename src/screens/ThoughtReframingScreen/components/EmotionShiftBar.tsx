import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { EmotionRating } from '../types';
import { EMOTION_OPTIONS, type EmotionOption } from '../data/emotions';

interface EmotionShiftBarProps {
  emotions: EmotionRating[];
}

/**
 * Displays before → after emotion intensity comparison bars.
 */
export const EmotionShiftBar: React.FC<EmotionShiftBarProps> = React.memo(
  ({ emotions }) => {
    return (
      <View className="gap-4">
        {emotions.map((emotion: EmotionRating) => {
          const option: EmotionOption | undefined = EMOTION_OPTIONS.find(
            (e) => e.name === emotion.name
          );
          const label: string = option?.label ?? emotion.name;
          const emoji: string = option?.emoji ?? '😶';
          const shift: number = emotion.initial_intensity - emotion.final_intensity;
          const isReduced: boolean = shift > 0;
          const isIncreased: boolean = shift < 0;

          return (
            <View key={emotion.name} className="bg-white rounded-2xl p-4 border border-slate-100">
              {/* Emotion label row */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{emoji}</Text>
                  <Text className="text-sm font-semibold text-slate-700">
                    {label}
                  </Text>
                </View>
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    isReduced
                      ? 'bg-green-50'
                      : isIncreased
                        ? 'bg-red-50'
                        : 'bg-slate-50'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isReduced
                        ? 'text-green-600'
                        : isIncreased
                          ? 'text-red-600'
                          : 'text-slate-400'
                    }`}
                  >
                    {isReduced ? `−${shift}` : isIncreased ? `+${Math.abs(shift)}` : 'No change'}
                  </Text>
                </View>
              </View>

              {/* Before bar */}
              <View className="mb-2">
                <Text className="text-xs text-slate-400 mb-1">Before</Text>
                <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-red-300 rounded-full"
                    style={{ width: `${emotion.initial_intensity * 10}%` }}
                  />
                </View>
                <Text className="text-xs text-slate-500 text-right mt-0.5">
                  {emotion.initial_intensity}/10
                </Text>
              </View>

              {/* After bar */}
              <View>
                <Text className="text-xs text-slate-400 mb-1">After</Text>
                <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: `${emotion.final_intensity * 10}%` }}
                  />
                </View>
                <Text className="text-xs text-slate-500 text-right mt-0.5">
                  {emotion.final_intensity}/10
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
);

EmotionShiftBar.displayName = 'EmotionShiftBar';
