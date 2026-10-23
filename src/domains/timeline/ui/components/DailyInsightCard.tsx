import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import type { AiInsight } from '../../model/timeline.types';

interface DailyInsightCardProps {
  insight: AiInsight;
  onPress?: (insight: AiInsight) => void;
}

export const DailyInsightCard = ({ insight, onPress }: DailyInsightCardProps) => {
  const { t } = useTranslation('common');
  // Use timelineSummary if available, else fallback to extracting the first sentence (Point 13)
  const firstSentence = insight.timelineSummary || insight.summary.split(/(?<=[.!?])\s+/)[0] || insight.summary;
  const handlePress = () => onPress?.(insight);

  return (
    <Pressable
      onPress={handlePress}
      className="active:opacity-60 py-2"
    >
      <View className="gap-2">
        <Text 
          className="text-[16px] leading-[23px]"
          style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.primary }}
          numberOfLines={3}
        >
          {firstSentence}
        </Text>
        <Text 
          className="text-[14px]" 
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.pressed }}
        >
          {t('timeline.viewInsight')}
        </Text>
      </View>
    </Pressable>
  );
};
