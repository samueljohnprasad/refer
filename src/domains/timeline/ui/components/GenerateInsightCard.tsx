import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface GenerateInsightCardProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
}

export const GenerateInsightCard = ({ 
  onPress, 
  title = "Generate Insight", 
  subtitle = "Tap to reflect on this day" 
}: GenerateInsightCardProps) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      className="bg-[#F0F2F5] dark:bg-gray-800 rounded-[24px] p-6 flex-row items-center justify-center gap-3 active:scale-[0.98] transition-transform"
    >
      <Sparkles size={22} color="#1A1A1A" />
      <View>
        <Text className="text-[17px] font-semibold text-[#1A1A1A] dark:text-white tracking-tight">{title}</Text>
        <Text className="text-[14px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};
