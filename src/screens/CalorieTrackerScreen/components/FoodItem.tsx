import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { FoodItem as FoodItemType } from '@/src/network/calorieAi';

interface FoodItemProps {
  food: FoodItemType;
  index: number;
  hasMicronutrients: boolean;
  onPress: () => void;
}

const FoodItemContent: React.FC<{ food: FoodItemType }> = ({ food }) => {
  const { t, i18n } = useTranslation("tracking");
  const formatNumber = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 1,
  });

  return (
  <>
    <View className="flex-1">
      <Text className="text-gray-900 font-medium text-base">{food.name}</Text>
      <Text className="text-gray-500 text-sm">{food.servingSize}</Text>
    </View>

    <HStack className="items-center" space="md">
      <View className="items-end">
        <Text className="text-gray-900 font-semibold">
          {formatNumber.format(food.calories)} {t("calorie.calorieUnit")}
        </Text>
        <HStack space="xs">
          <Text className="text-xs text-gray-500">{t("calorie.macros.proteinShort")}:{formatNumber.format(food.protein)}g</Text>
          <Text className="text-xs text-gray-500">{t("calorie.macros.carbsShort")}:{formatNumber.format(food.carbs)}g</Text>
          <Text className="text-xs text-gray-500">{t("calorie.macros.fatShort")}:{formatNumber.format(food.fat)}g</Text>
        </HStack>
      </View>
    </HStack>
  </>
  );
};

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
