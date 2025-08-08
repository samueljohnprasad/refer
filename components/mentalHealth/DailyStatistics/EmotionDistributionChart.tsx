import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { EmotionDistribution } from '@/types/mentalHealth';

interface EmotionDistributionChartProps {
  data: EmotionDistribution[];
  className?: string;
}

export const EmotionDistributionChart: React.FC<EmotionDistributionChartProps> = ({
  data,
  className = '',
}) => {
  if (data.length === 0) {
    return (
      <View className={`${className}`}>
        <Text className="text-gray-500 text-center text-sm">
          No emotion data available
        </Text>
      </View>
    );
  }

  // Sort by percentage for better visualization
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
  
  return (
    <View className={`${className}`}>
      <Text className="text-sm font-medium text-gray-700 mb-3">
        Emotion Distribution
      </Text>
      
      {/* Horizontal Bar Chart */}
      <View className="space-y-2">
        {sortedData.map((item, index) => (
          <View key={`${item.emotion}-${index}`} className="flex-row items-center">
            <View className="w-16">
              <Text className="text-xs text-gray-600 capitalize">
                {item.emotion}
              </Text>
            </View>
            
            <View className="flex-1 mx-2">
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: `${Math.max(item.percentage, 5)}%`, // Minimum 5% for visibility
                    backgroundColor: item.color
                  }}
                />
              </View>
            </View>
            
            <View className="w-10">
              <Text className="text-xs text-gray-600 text-right">
                {Math.round(item.percentage)}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Pie Chart Alternative - Simple Circular Progress */}
      <View className="mt-4 flex-row justify-center">
        <View className="flex-row flex-wrap justify-center max-w-xs">
          {sortedData.slice(0, 4).map((item, index) => (
            <View key={`legend-${item.emotion}-${index}`} className="flex-row items-center m-1">
              <View 
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: item.color }}
              />
              <Text className="text-xs text-gray-600 capitalize">
                {item.emotion}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
