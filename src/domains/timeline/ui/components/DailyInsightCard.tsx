import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { AiInsight } from '../../model/timeline.types';

interface DailyInsightCardProps {
  insight: {
    summary: string;
  };
  onPress?: () => void;
}

export const DailyInsightCard = ({ insight, onPress }: DailyInsightCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-80 active:scale-[0.995]"
    >
      <View className="bg-white rounded-[24px] p-6 dark:bg-gray-900">
        <Text className="text-[17px] font-normal text-[#1A1A1A] dark:text-gray-100 leading-[28px] tracking-tight">
          {insight.summary}
        </Text>
      </View>
    </Pressable>
  );
};
