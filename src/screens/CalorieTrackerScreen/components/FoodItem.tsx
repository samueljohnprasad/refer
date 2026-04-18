import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { FoodItem as FoodItemType } from '@/src/network/calorieAi';

interface FoodItemProps {
  food: FoodItemType;
  index: number;
  hasMicronutrients: boolean;
  onPress: () => void;
}

const FoodItemContent: React.FC<{ food: FoodItemType }> = ({ food }) => (
  <>
    <View className="flex-1">
      <Text className="text-gray-900 font-medium text-base">{food.name}</Text>
      <Text className="text-gray-500 text-sm">{food.servingSize}</Text>
    </View>

    <HStack className="items-center" space="md">
      <View className="items-end">
        <Text className="text-gray-900 font-semibold">{food.calories} cal</Text>
        <HStack space="xs">
          <Text className="text-xs text-gray-500">P:{food.protein}g</Text>
          <Text className="text-xs text-gray-500">C:{food.carbs}g</Text>
          <Text className="text-xs text-gray-500">F:{food.fat}g</Text>
        </HStack>
      </View>
    </HStack>
  </>
);

export const FoodItem: React.FC<FoodItemProps> = ({
  food,
  index,
  hasMicronutrients,
  onPress,
}) => {
  const rowClass = 'flex-row items-center py-3.5 border-b border-gray-50';

  if (!hasMicronutrients) {
    return (
      <View key={`${food.name}-${index}`} className={rowClass}>
        <FoodItemContent food={food} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      key={`${food.name}-${index}`}
      className={rowClass}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <FoodItemContent food={food} />
    </TouchableOpacity>
  );
};
