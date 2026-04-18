import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Delete01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { CalorieEntry } from '@/hooks/data/useCalorieTracker';
import { MicronutrientEntry } from '@/src/network/calorieAi';
import { FoodItem } from './FoodItem';

// ─── Constants ──────────────────────────────────────────────────────────────

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 1,
} as const;

const MEAL_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  breakfast: { bg: 'bg-gray-100', text: 'text-gray-700' },
  lunch: { bg: 'bg-gray-100', text: 'text-gray-700' },
  dinner: { bg: 'bg-gray-100', text: 'text-gray-700' },
  snack: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getHealthScoreColors = (score: number): { bg: string; text: string } => {
  if (score >= 80) return { bg: 'bg-green-50', text: 'text-green-600' };
  if (score >= 60) return { bg: 'bg-yellow-50', text: 'text-yellow-600' };
  return { bg: 'bg-red-50', text: 'text-red-500' };
};

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

// ─── Types ────────────────────────────────────────────────────────────────────

interface MealEntryCardProps {
  entry: CalorieEntry;
  onDelete: (id: string) => void;
  onShowHealthScore: (score: number, reasoning: string) => void;
  onShowMicronutrients: (title: string, nutrients: MicronutrientEntry[]) => void;
  filterTrackedMicronutrients: (nutrients: MicronutrientEntry[]) => MicronutrientEntry[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MealEntryCard: React.FC<MealEntryCardProps> = memo(function MealEntryCard({
  entry,
  onDelete,
  onShowHealthScore,
  onShowMicronutrients,
  filterTrackedMicronutrients,
}) {
  const colors = MEAL_TYPE_COLORS[entry.meal_type] ?? MEAL_TYPE_COLORS.snack;
  const healthScore = entry.health_score ?? 0;
  const healthScoreReasoning = entry.health_score_reasoning ?? '';
  const healthColors = getHealthScoreColors(healthScore);

  const handleShowEntryMicronutrients = useCallback((): void => {
    const allMicronutrients = entry.total_micronutrients as MicronutrientEntry[];
    const tracked = filterTrackedMicronutrients(allMicronutrients);
    const micronutrientsToShow = tracked.length > 0 ? tracked : allMicronutrients;
    onShowMicronutrients(`${capitalize(entry.meal_type)} Nutrients`, micronutrientsToShow);
  }, [entry, filterTrackedMicronutrients, onShowMicronutrients]);

  const hasTotalMicronutrients =
    !!entry.total_micronutrients &&
    (entry.total_micronutrients as MicronutrientEntry[]).length > 0;

  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3"
      style={CARD_SHADOW}
      shouldRasterizeIOS
      renderToHardwareTextureAndroid
    >
      {/* Header Row */}
      <HStack className="justify-between items-center mb-3">
        <HStack space="sm" className="items-center">
          <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
            <Text className={`text-sm font-medium capitalize ${colors.text}`}>
              {entry.meal_type}
            </Text>
          </View>

          {healthScore > 0 && (
            <TouchableOpacity
              onPress={() => onShowHealthScore(healthScore, healthScoreReasoning)}
              className={`px-2.5 py-1 rounded-full ${healthColors.bg} flex-row items-center`}
              activeOpacity={0.7}
            >
              <Text className={`text-xs font-medium ${healthColors.text}`}>
                {healthScore}
              </Text>
            </TouchableOpacity>
          )}
        </HStack>

        <HStack className="items-center" space="sm">
          <Text className="text-gray-500 text-sm">
            {format(new Date(entry.created_at), 'h:mm a')}
          </Text>
          <TouchableOpacity onPress={() => onDelete(entry.id)}>
            <HugeiconsIcon icon={Delete01Icon} size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </HStack>
      </HStack>

      {/* Food Items */}
      <VStack space="xs">
        {entry.foods.map((food, index) => {
          const allMicronutrients = food.micronutrients ?? [];
          const tracked = filterTrackedMicronutrients(allMicronutrients);
          const hasMicronutrients = allMicronutrients.length > 0;

          const handleFoodMicronutrients = (): void => {
            const micronutrientsToShow = tracked.length > 0 ? tracked : allMicronutrients;
            onShowMicronutrients(food.name, micronutrientsToShow);
          };

          return (
            <FoodItem
              key={`${food.name}-${index}`}
              food={food}
              index={index}
              hasMicronutrients={hasMicronutrients}
              onPress={handleFoodMicronutrients}
            />
          );
        })}
      </VStack>

      {/* Footer Row */}
      <HStack className="justify-between items-center mt-3 pt-3 border-t border-gray-50">
        <Text className="text-gray-500 font-medium text-sm">Total</Text>
        <HStack className="items-center" space="md">
          <Text className="text-gray-900 font-semibold">
            {entry.total_calories} cal
          </Text>

          {hasTotalMicronutrients && (
            <TouchableOpacity onPress={handleShowEntryMicronutrients} activeOpacity={0.7}>
              <HugeiconsIcon icon={InformationCircleIcon} size={16} color="#D1D5DB" />
            </TouchableOpacity>
          )}
        </HStack>
      </HStack>
    </View>
  );
});
