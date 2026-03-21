import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useCalorieTracker } from "@/hooks/data/useCalorieTracker";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AppleIcon,
  Add01Icon,
  InformationCircleIcon,
  Target02Icon,
  Camera01Icon,
  Image01Icon,
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
import { useCalorieGoal } from "@/src/hooks/data/useCalorieGoal";
import CalorieGoalModal from "@/src/components/calorie/CalorieGoalModal";
import { XPBadge } from "@/src/components/XP";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";
import { SectionHeader } from "@/src/components/ui/SectionHeader";

const TRACKED_MICRONUTRIENTS_KEY = "tracked_micronutrients";

/** Shared subtle card shadow — single source of truth */
const WIDGET_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 1,
} as const;

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
    format(selectedDate, "yyyy-MM-dd"),
  );

  // Calorie goal management
  const { calorieGoal, setCalorieGoal } = useCalorieGoal();
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);

  const [trackedNutrientIds, setTrackedNutrientIds] = useState<Set<string>>(
    new Set(MICRONUTRIENTS_CONFIG.map((n) => n.id)),
  );
  const [selectedMicronutrients, setSelectedMicronutrients] = useState<{
    title: string;
    micronutrients: MicronutrientEntry[];
  } | null>(null);
  const micronutrientModalRef = useRef<BottomSheetModal>(null);

  // Calculate progress percentage toward goal
  const progressPercentage = Math.min(
    Math.round((dailySummary.totalCalories / calorieGoal) * 100),
    100,
  );
  const remainingCalories = Math.max(
    calorieGoal - dailySummary.totalCalories,
    0,
  );

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
    micronutrients: MicronutrientEntry[],
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

  const handleGoalPress = (): void => {
    setShowGoalModal(true);
  };

  const handleSaveGoal = async (goal: number): Promise<void> => {
    await setCalorieGoal(goal);
  };

  if (compact) {
    return (
      <TouchableOpacity
        className="bg-white rounded-2xl p-4"
        style={WIDGET_SHADOW}
      >
        <HStack className="justify-between items-center">
          <HStack className="items-center" space="sm">
            <View
              className="p-2 rounded-xl"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <HugeiconsIcon icon={AppleIcon} size={20} color="#9CA3AF" />
            </View>
            <VStack>
              <Text className="text-gray-900 font-semibold">Calories</Text>
              <Text className="text-gray-500 text-xs">
                {dailySummary.mealCount} meals today
              </Text>
            </VStack>
          </HStack>
          <VStack className="items-end">
            <Text className="text-2xl font-bold text-gray-900">
              {dailySummary.totalCalories}
            </Text>
            <Text className="text-xs text-gray-400">kcal</Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  }

  return (
    <View className="gap-4">
      <SectionHeader
        title="Calorie Tracker"
        icon={AppleIcon}
        count={dailySummary.mealCount > 0 ? dailySummary.mealCount : undefined}
        rightElement={
          <>
            <XPBadge amount={XP_REWARDS[XPActionType.CALORIE_LOG]} />
            <TouchableOpacity
              onPress={() => DeviceEventEmitter.emit("triggerCalorieCamera")}
              className="bg-gray-800 p-2 rounded-xl"
              activeOpacity={0.7}
            >
              <HugeiconsIcon icon={Camera01Icon} size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => DeviceEventEmitter.emit("triggerCalorieGallery")}
              className="bg-gray-800 p-2 rounded-xl"
              activeOpacity={0.7}
            >
              <HugeiconsIcon icon={Image01Icon} size={18} color="white" />
            </TouchableOpacity>
          </>
        }
      />
      <TouchableOpacity
        className="bg-white rounded-2xl p-5"
        style={WIDGET_SHADOW}
        activeOpacity={1}
      >

      {dailySummary.mealCount === 0 ? (
        <View className="py-4 items-center">
          {/* Goal indicator when no meals are logged */}
          <TouchableOpacity
            onPress={handleGoalPress}
            className="flex-row items-center bg-orange-50 px-4 py-2 rounded-full"
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Target02Icon} size={18} color="#F97316" />
            <Text className="text-orange-600 font-medium ml-2">
              Goal: {calorieGoal} kcal
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="items-center mb-4">
            <HStack className="items-center" space="xs">
              <Text className="text-4xl font-bold text-gray-900">
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
                    className="ml-1"
                  >
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      size={20}
                      color="#D1D5DB"
                    />
                  </TouchableOpacity>
                ) : null;
              })()}
            </HStack>
            <Text className="text-gray-400 text-sm">calories consumed</Text>
          </View>

          {/* Progress bar toward goal */}
          <View className="mb-4">
            <TouchableOpacity
              onPress={handleGoalPress}
              activeOpacity={0.8}
              className="flex-row justify-between items-center mb-2"
            >
              <HStack className="items-center" space="xs">
                <HugeiconsIcon icon={Target02Icon} size={14} color="#9CA3AF" />
                <Text className="text-gray-500 text-sm">
                  Goal: {calorieGoal} kcal
                </Text>
              </HStack>
              <Text
                className={`text-sm font-medium ${
                  dailySummary.totalCalories > calorieGoal
                    ? "text-red-400"
                    : "text-gray-500"
                }`}
              >
                {dailySummary.totalCalories > calorieGoal
                  ? `+${dailySummary.totalCalories - calorieGoal} over`
                  : `${remainingCalories} left`}
              </Text>
            </TouchableOpacity>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <View
                className={`h-full rounded-full ${
                  progressPercentage >= 100 ? "bg-red-400" : "bg-gray-400"
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
            <Text className="text-gray-400 text-xs text-center mt-1">
              {progressPercentage}% of daily goal
            </Text>
          </View>

          <HStack className="justify-between rounded-xl px-2">
            <View className="items-center flex-1">
              <Text className="text-base font-medium text-gray-900">
                {dailySummary.totalProtein}g
              </Text>
              <Text className="text-xs text-gray-400">Protein</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-base font-medium text-gray-900">
                {dailySummary.totalCarbs}g
              </Text>
              <Text className="text-xs text-gray-400">Carbs</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-base font-medium text-gray-900">
                {dailySummary.totalFat}g
              </Text>
              <Text className="text-xs text-gray-400">Fat</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-base font-medium text-gray-900">
                {dailySummary.mealCount}
              </Text>
              <Text className="text-xs text-gray-400">Meals</Text>
            </View>
          </HStack>
    </>
      )}
    </TouchableOpacity>

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
                100,
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

      {/* Calorie Goal Modal */}
      <CalorieGoalModal
        visible={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSave={handleSaveGoal}
        currentGoal={calorieGoal}
      />
    </View>
  );
};

export default CalorieWidget;
