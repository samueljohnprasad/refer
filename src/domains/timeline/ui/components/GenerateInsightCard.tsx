import React from 'react';
import { Text, Pressable, ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface GenerateInsightCardProps {
  onPress: () => void;
  title?: string;
  isGenerating?: boolean;
}

export const GenerateInsightCard = ({ 
  onPress, 
  title,
  isGenerating = false,
}: GenerateInsightCardProps) => {
  const { t } = useTranslation('common');

  return (
    <Pressable 
      onPress={isGenerating ? undefined : onPress}
      className={`flex-row items-center gap-2.5 py-2.5 ${!isGenerating ? 'active:opacity-60' : ''}`}
    >
      {isGenerating ? (
        <ActivityIndicator size="small" color={SEMANTIC_COLORS.text.secondary} />
      ) : (
        <View className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: SEMANTIC_COLORS.text.tertiary }} />
      )}
      <Text className="text-[14px]" style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.secondary }}>
        {isGenerating ? t('timeline.generating') : title || t('timeline.generate')}
      </Text>
    </Pressable>
  );
};
