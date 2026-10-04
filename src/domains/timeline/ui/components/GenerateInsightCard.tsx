import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
// ponytail: use native expo-symbols instead of lucide
import { SymbolView } from 'expo-symbols';
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

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
      className={`flex-row items-center gap-2.5 py-2.5 px-3 rounded-lg ${!isGenerating ? 'active:bg-black/5' : ''}`}
    >
      {isGenerating ? (
        <ActivityIndicator size="small" color="#666666" />
      ) : (
        <SymbolView name="sparkles" size={12} tintColor="#666666" />
      )}
      <Text className="text-[14px] text-[#666666]" style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}>
        {isGenerating ? t('timeline.generating') : title || t('timeline.generate')}
      </Text>
    </Pressable>
  );
};
