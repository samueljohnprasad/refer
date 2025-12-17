import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useCalorieTracker } from "@/hooks/data/useCalorieTracker";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { AppleIcon, Add01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";

interface CalorieWidgetProps {
  selectedDate: Date;
  compact?: boolean;
}

const CalorieWidget: React.FC<CalorieWidgetProps> = ({
  selectedDate,
  compact = false,
}) => {
  const router = useRouter();
  const { dailySummary, isLoading } = useCalorieTracker(
    format(selectedDate, "yyyy-MM-dd")
  );

  const handlePress = (): void => {
    router.push({
      pathname: "/tabs/screens/calorie-tracker",
      params: { date: format(selectedDate, "yyyy-MM-dd") },
    });
  };

  if (compact) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="bg-white rounded-2xl p-4 border border-gray-100"
      >
        <HStack className="justify-between items-center">
          <HStack className="items-center" space="sm">
            <View className="bg-orange-100 p-2 rounded-xl">
              <HugeiconsIcon icon={AppleIcon} size={20} color="#F97316" />
            </View>
            <VStack>
              <Text className="text-gray-900 font-semibold">Calories</Text>
              <Text className="text-gray-500 text-xs">
                {dailySummary.mealCount} meals today
              </Text>
            </VStack>
          </HStack>
          <VStack className="items-end">
            <Text className="text-2xl font-bold text-orange-500">
              {dailySummary.totalCalories}
            </Text>
            <Text className="text-xs text-gray-400">kcal</Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-2xl p-5 border border-gray-100"
    >
      <HStack className="justify-between items-center mb-4">
        <HStack className="items-center" space="sm">
          <View className="bg-orange-100 p-2 rounded-xl">
            <HugeiconsIcon icon={AppleIcon} size={24} color="#F97316" />
          </View>
          <Text className="text-gray-900 font-semibold text-lg">
            Calorie Tracker
          </Text>
        </HStack>
        <TouchableOpacity
          onPress={handlePress}
          className="bg-orange-500 p-2 rounded-xl"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} color="white" />
        </TouchableOpacity>
      </HStack>

      {dailySummary.mealCount === 0 ? (
        <View className="py-4 items-center">
          <Text className="text-gray-400 text-center">
            No meals logged today.{"\n"}Tap + to add your first meal!
          </Text>
        </View>
      ) : (
        <>
          <View className="items-center mb-4">
            <Text className="text-5xl font-bold text-orange-500">
              {dailySummary.totalCalories}
            </Text>
            <Text className="text-gray-500">calories consumed</Text>
          </View>

          <HStack className="justify-between bg-gray-50 rounded-xl p-3">
            <View className="items-center flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {dailySummary.totalProtein}g
              </Text>
              <Text className="text-xs text-gray-500">Protein</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {dailySummary.totalCarbs}g
              </Text>
              <Text className="text-xs text-gray-500">Carbs</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {dailySummary.totalFat}g
              </Text>
              <Text className="text-xs text-gray-500">Fat</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {dailySummary.mealCount}
              </Text>
              <Text className="text-xs text-gray-500">Meals</Text>
            </View>
          </HStack>
        </>
      )}
    </TouchableOpacity>
  );
};

export default CalorieWidget;
