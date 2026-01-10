import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useCalorieTracker } from "@/hooks/data/useCalorieTracker";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AppleIcon,
  Add01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  MICRONUTRIENTS_CONFIG,
  getMicronutrientById,
} from "@/src/config/micronutrients";
import { MicronutrientEntry } from "@/src/network/calorieAi";

const TRACKED_MICRONUTRIENTS_KEY = "tracked_micronutrients";

interface CalorieWidgetProps {
  selectedDate: Date;
  compact?: boolean;
}

const CalorieWidget: React.FC<CalorieWidgetProps> = ({
  selectedDate,
  compact = false,
}) => {
  const router = useRouter();
  const { dailySummary, isLoading, calorieEntries } = useCalorieTracker(
    format(selectedDate, "yyyy-MM-dd")
  );

  const [trackedNutrientIds, setTrackedNutrientIds] = useState<Set<string>>(
    new Set(MICRONUTRIENTS_CONFIG.map((n) => n.id))
  );
  const [selectedMicronutrients, setSelectedMicronutrients] = useState<{
    title: string;
    micronutrients: MicronutrientEntry[];
  } | null>(null);
  const micronutrientModalRef = useRef<BottomSheetModal>(null);

  // Load tracked micronutrients from storage
  useEffect(() => {
    const loadTrackedNutrients = async (): Promise<void> => {
      try {
        const saved = await AsyncStorage.getItem(TRACKED_MICRONUTRIENTS_KEY);
        if (saved) {
          setTrackedNutrientIds(new Set(JSON.parse(saved)));
        }
      } catch (error) {
        console.error("Failed to load tracked nutrients:", error);
      }
    };
    loadTrackedNutrients();
  }, []);

  // Filter micronutrients to only show tracked ones
  const filterTrackedMicronutrients = (
    micronutrients: MicronutrientEntry[]
  ): MicronutrientEntry[] => {
    return micronutrients.filter((m) => trackedNutrientIds.has(m.name));
  };

  // Calculate daily total micronutrients from all entries
  const calculateDailyMicronutrients = (): MicronutrientEntry[] => {
    const micronutrientMap = new Map<string, number>();

    calorieEntries.forEach((entry) => {
      if (entry.total_micronutrients) {
        const nutrients = entry.total_micronutrients as MicronutrientEntry[];
        nutrients.forEach((nutrient) => {
          const current = micronutrientMap.get(nutrient.name) || 0;
          micronutrientMap.set(nutrient.name, current + nutrient.amount);
        });
      }
    });

    return Array.from(micronutrientMap.entries()).map(([name, amount]) => ({
      name,
      amount,
    }));
  };

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
            <View
              className="p-2 rounded-xl"
              style={{ backgroundColor: "#FFE8D6" }}
            >
              <HugeiconsIcon icon={AppleIcon} size={20} color="#FF8C42" />
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
          <View
            className="p-2 rounded-xl"
            style={{ backgroundColor: "#FFE8D6" }}
          >
            <HugeiconsIcon icon={AppleIcon} size={24} color="#FF8C42" />
          </View>
          <Text className="text-gray-900 font-semibold text-lg">
            Calorie Tracker
          </Text>
        </HStack>
        <TouchableOpacity
          onPress={handlePress}
          className="p-2 rounded-xl"
          style={{ backgroundColor: "#FF8C42" }}
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
            <HStack className="items-center" space="sm">
              <Text className="text-5xl font-bold text-orange-500">
                {dailySummary.totalCalories}
              </Text>
              {(() => {
                const dailyMicronutrients = calculateDailyMicronutrients();
                const trackedDailyMicronutrients =
                  filterTrackedMicronutrients(dailyMicronutrients);
                return trackedDailyMicronutrients.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedMicronutrients({
                        title: "Today's Total Nutrients",
                        micronutrients: trackedDailyMicronutrients,
                      });
                      micronutrientModalRef.current?.present();
                    }}
                    activeOpacity={0.7}
                  >
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      size={24}
                      color="#F97316"
                    />
                  </TouchableOpacity>
                ) : null;
              })()}
            </HStack>
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

      {/* Micronutrient Modal using ShortBottomModal */}
      <ShortBottomModal
        ref={micronutrientModalRef}
        snapPoints={["50%", "75%"]}
        marginHorizontal={8}
        enableContentPanningGesture={true}
      >
        <View className="px-5 pt-4 pb-2">
          <Text
            style={{
              fontSize: 22,
              fontFamily: "CormorantSemiBold",
              color: "#1f2937",
              marginBottom: 12,
            }}
          >
            {selectedMicronutrients?.title || "Micronutrients"}
          </Text>
        </View>

        {selectedMicronutrients &&
        selectedMicronutrients.micronutrients.length > 0 ? (
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {selectedMicronutrients.micronutrients.map((nutrient, idx) => {
              const config = getMicronutrientById(nutrient.name);
              if (!config || nutrient.amount <= 0) return null;

              const percentage = Math.min(
                Math.round((nutrient.amount / config.dailyValue) * 100),
                100
              );
              const barColor =
                percentage >= 50
                  ? "bg-green-500"
                  : percentage >= 25
                  ? "bg-yellow-500"
                  : "bg-gray-400";

              return (
                <View
                  key={`${nutrient.name}-${idx}`}
                  className="mb-4 pb-4 border-b border-gray-100"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-900 font-medium">
                      {config.name}
                    </Text>
                    <Text className="text-gray-600">
                      {nutrient.amount.toFixed(1)} {config.unit}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className={`h-full ${barColor} rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </View>
                    <Text className="text-xs text-gray-500 w-12 text-right">
                      {percentage}%
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-400 mt-1">
                    Daily Value: {config.dailyValue} {config.unit}
                  </Text>
                </View>
              );
            })}
          </BottomSheetScrollView>
        ) : (
          <View className="py-8 items-center">
            <Text className="text-gray-400 text-center">
              No micronutrient data available
            </Text>
          </View>
        )}
      </ShortBottomModal>
    </TouchableOpacity>
  );
};

export default CalorieWidget;
