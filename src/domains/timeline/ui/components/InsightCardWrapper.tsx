import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface InsightCardWrapperProps {
  date: string;
  children: ReactNode;
}

export const InsightCardWrapper = ({ date, children }: InsightCardWrapperProps) => {
  const parsedDate = new Date(date);
  const month = parsedDate.toLocaleString('default', { month: 'short' }); // e.g., "Oct"
  const day = parsedDate.getDate(); // e.g., 14

  return (
    <View className="flex-row w-full mb-6">
      {/* Left Axis: Timeline Bar and Date */}
      <View className="w-16 items-center pt-2">
        <Text className="text-xs font-semibold text-gray-800 uppercase tracking-widest">{month}</Text>
        <Text className="text-2xl font-light text-gray-400 mt-0.5">{day}</Text>
        {/* The connecting vertical line */}
        <View className="w-[1px] bg-gray-200 flex-1 mt-4 -mb-10" />
      </View>
      
      {/* Right Content Area: Renders either the Shimmer, DailyInsightCard, or GenerateInsightCard */}
      <View className="flex-1 pr-4">
        {children}
      </View>
    </View>
  );
};
