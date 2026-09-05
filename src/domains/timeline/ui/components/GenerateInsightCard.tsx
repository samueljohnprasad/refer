import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

interface GenerateInsightCardProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
  isGenerating?: boolean;
}

export const GenerateInsightCard = ({ 
  onPress, 
  title = "Generate insight", 
  subtitle, // intentionally ignored to reduce visual noise
  isGenerating = false,
}: GenerateInsightCardProps) => {
  return (
    <Pressable 
      onPress={isGenerating ? undefined : onPress}
      className={`flex-row items-center gap-2.5 py-2.5 px-3 -ml-3 rounded-lg ${!isGenerating ? 'active:bg-black/5' : ''}`}
    >
      {isGenerating ? (
        <ActivityIndicator size="small" color="#666666" />
      ) : (
        <Sparkles size={12} color="#666666" strokeWidth={2.0} />
      )}
      <Text className="text-[14px] text-[#666666]" style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}>
        {isGenerating ? "Generating..." : title}
      </Text>
    </Pressable>
  );
};
