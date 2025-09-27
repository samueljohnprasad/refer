import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { moodScoreToColor, clampToMoodScore } from '@/constants/moodColors';

interface MoodChartProps {
  moodScore: number;
  stressLevel: number;
  className?: string;
}

export const MoodChart: React.FC<MoodChartProps> = ({
  moodScore,
  stressLevel,
  className = '',
}) => {
  // Create a simple visual representation of mood vs stress
  const moodPercentage = (moodScore / 10) * 100;
  const stressPercentage = (stressLevel / 10) * 100;

  const toFiveMood = (score10: number): number => {
    // Convert 0..10 mood score to 1..5 scale
    return clampToMoodScore(Math.round(score10 / 2));
  };

  const getMoodColor = (score10: number): string => {
    return moodScoreToColor(toFiveMood(score10));
  };

  const getStressColor = (level: number): string => {
    if (level <= 3) return '#10B981'; // green (low stress)
    if (level <= 6) return '#F59E0B'; // yellow (medium stress)
    return '#EF4444'; // red (high stress)
  };

  return (
    <View className={`${className}`}>
      {/* Mood Bar */}
      <View className="mb-3">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm text-gray-600">Mood</Text>
          <Text className="text-sm font-semibold" style={{ color: getMoodColor(moodScore) }}>
            {moodScore.toFixed(1)}/10
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${moodPercentage}%`,
              backgroundColor: getMoodColor(moodScore)
            }}
          />
        </View>
      </View>

      {/* Stress Bar */}
      <View>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm text-gray-600">Stress</Text>
          <Text className="text-sm font-semibold" style={{ color: getStressColor(stressLevel) }}>
            {stressLevel}/10
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${stressPercentage}%`,
              backgroundColor: getStressColor(stressLevel)
            }}
          />
        </View>
      </View>

      {/* Visual Balance Indicator */}
      <View className="mt-4 flex-row items-center justify-center">
        <View className="flex-row items-center">
          <View 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getMoodColor(moodScore) }}
          />
          <Text className="text-xs text-gray-500 mr-4">Mood</Text>
          
          <View 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getStressColor(stressLevel) }}
          />
          <Text className="text-xs text-gray-500">Stress</Text>
        </View>
      </View>
    </View>
  );
};
