import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import type { AiInsight } from '../../model/timeline.types';

interface DailyInsightCardProps {
  insight: {
    summary: string;
    timelineSummary?: string;
  };
  onPress?: () => void;
}

export const DailyInsightCard = ({ insight, onPress }: DailyInsightCardProps) => {
  // Use timelineSummary if available, else fallback to extracting the first sentence (Point 13)
  const firstSentence = insight.timelineSummary || insight.summary.split(/(?<=[.!?])\s+/)[0] || insight.summary;

  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-60 py-1"
    >
      <View className="gap-2">
        <Text 
          className="text-[15px] text-[#1A1A1A] leading-[22px]" 
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          numberOfLines={2}
        >
          {firstSentence}
        </Text>
        <Text 
          className="text-[14px]" 
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: "#5F7F58" }}
        >
          View insight
        </Text>
      </View>
    </Pressable>
  );
};
