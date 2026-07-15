import React from 'react';
import { View, Text } from 'react-native';

interface DailyInsightCardProps {
  insight: {
    summary: string;
  };
}

export const DailyInsightCard = ({ insight }: DailyInsightCardProps) => {
  return (
    <View className="bg-white rounded-[24px] p-6 dark:bg-gray-900">
      <Text className="text-[17px] font-normal text-[#1A1A1A] dark:text-gray-100 leading-[28px] tracking-tight">
        {insight.summary}
      </Text>
    </View>
  );
};
