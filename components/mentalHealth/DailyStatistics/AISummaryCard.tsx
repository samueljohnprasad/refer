import React, { useState } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import { Feather } from '@expo/vector-icons';

interface AISummaryCardProps {
  summary: string;
  className?: string;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  summary,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [fadeAnim] = useState(new Animated.Value(0.7));

  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded);
    
    // Gentle breathing animation on interaction
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const shouldTruncate = summary.length > 120;
  const displayText = isExpanded ? summary : (shouldTruncate ? `${summary.substring(0, 120)}...` : summary);

  return (
    <Animated.View 
      className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-sm ${className}`}
      style={{ opacity: fadeAnim }}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
            <Feather name="activity" size={16} color="#3B82F6" />
          </View>
          <Text className="text-lg font-semibold text-gray-800 flex-1">
            AI Daily Summary
          </Text>
        </View>
        
        <View className="bg-blue-100 rounded-full px-2 py-1">
          <Text className="text-blue-700 text-xs font-medium">
            Insights
          </Text>
        </View>
      </View>
      
      <Pressable onPress={shouldTruncate ? toggleExpanded : undefined}>
        <Text className="text-gray-700 leading-6 text-base">
          {displayText}
        </Text>
        
        {shouldTruncate && (
          <View className="flex-row items-center mt-2">
            <Text className="text-blue-600 text-sm font-medium mr-1">
              {isExpanded ? 'Show less' : 'Read more'}
            </Text>
            <Feather 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={14} 
              color="#3B82F6" 
            />
          </View>
        )}
      </Pressable>

      {/* Gentle decorative elements */}
      <View className="absolute top-4 right-4 opacity-10">
        <Feather name="star" size={20} color="#3B82F6" />
      </View>
      
      <View className="mt-4 pt-4 border-t border-blue-100">
        <Text className="text-xs text-gray-500 text-center">
          Generated with care • Confidential & private
        </Text>
      </View>
    </Animated.View>
  );
};
