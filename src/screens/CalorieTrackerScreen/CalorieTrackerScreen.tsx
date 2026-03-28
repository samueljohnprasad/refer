import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Image as RNImage,
  DeviceEventEmitter,
} from "react-native";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import * as ImagePicker from "expo-image-picker";
import {
  useCalorieTracker,
  CalorieEntry,
} from "@/hooks/data/useCalorieTracker";
import {
  CalorieAnalysisResult,
  FoodItem,
  MicronutrientEntry,
} from "@/src/network/calorieAi";
import {
  getMicronutrientById,
  MicronutrientConfig,
  MICRONUTRIENTS_CONFIG,
} from "@/src/config/micronutrients";
import { format } from "date-fns";
import { useHeaderHeight } from "@react-navigation/elements";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Camera01Icon,
  Image01Icon,
  Delete01Icon,
  InformationCircleIcon,
  Cancel01Icon,
  Settings02Icon,
  ArrowLeft01Icon,
  AppleIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { XPBadge } from "@/src/components/XP";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";

const TRACKED_MICRONUTRIENTS_KEY = "tracked_micronutrients";

/** Shared subtle card shadow — single source of truth for all cards */
const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 1,
} as const;

interface CalorieTrackerScreenProps {
  selectedDate?: Date;
  onClose?: () => void;
}

const MealTypeColors: Record<string, { bg: string; text: string }> = {
  breakfast: { bg: "bg-gray-100", text: "text-gray-700" },
  lunch: { bg: "bg-gray-100", text: "text-gray-700" },
  dinner: { bg: "bg-gray-100", text: "text-gray-700" },
  snack: { bg: "bg-gray-100", text: "text-gray-700" },
};

const CalorieTrackerScreen: React.FC<CalorieTrackerScreenProps> = ({
  selectedDate = new Date(),
  onClose,
}) => {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<CalorieAnalysisResult | null>(null);
  const [showHealthScoreModal, setShowHealthScoreModal] = useState(false);
  const [selectedHealthScore, setSelectedHealthScore] = useState<{
    score: number;
    reasoning: string;
  } | null>(null);
  const [selectedMicronutrients, setSelectedMicronutrients] = useState<{
    title: string;
    micronutrients: MicronutrientEntry[];
  } | null>(null);
  const [trackedNutrientIds, setTrackedNutrientIds] = useState<Set<string>>(
    new Set(MICRONUTRIENTS_CONFIG.map((n) => n.id)),
  );
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

  const {
    calorieEntries,
    dailySummary,
    isLoading,
    isAnalyzing,
    analysisError,
    analyzeAndSaveFood,
    deleteEntry,
  } = useCalorieTracker(format(selectedDate, "yyyy-MM-dd"));

  // Take a photo with camera
  const takePhoto = useCallback(async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed to take photos of your food.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setCapturedImage(imageUri);
      await processImage(imageUri);
    }
  }, []);

  // Pick from gallery
  const pickImage = useCallback(async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Photo library permission is needed to select photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setCapturedImage(imageUri);
      await processImage(imageUri);
    }
  }, []);

  // Listen for CTA events from the unified CalorieWidget header
  useEffect(() => {
    const sub1 = DeviceEventEmitter.addListener("triggerCalorieCamera", () => {
      if (!isAnalyzing) takePhoto();
    });
    const sub2 = DeviceEventEmitter.addListener("triggerCalorieGallery", () => {
      if (!isAnalyzing) pickImage();
    });
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, [isAnalyzing, takePhoto, pickImage]);

  // Process the image with AI
  const processImage = async (imageUri: string): Promise<void> => {
    const result = await analyzeAndSaveFood(imageUri);
    if (result) {
      setAnalysisResult(result);
    }
  };

  // Reset capture state
  const resetCapture = (): void => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  // Handle delete entry
  const handleDeleteEntry = async (entryId: string): Promise<void> => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteEntry(entryId);
        },
      },
    ]);
  };

  // Render food item
  const renderFoodItem = (food: FoodItem, index: number): React.ReactNode => {
    // For debugging: show all micronutrients if they exist
    const allMicronutrients = food.micronutrients || [];
    const trackedMicronutrients = food.micronutrients
      ? filterTrackedMicronutrients(food.micronutrients)
      : [];

    // Show icon if there are ANY micronutrients (for now, to debug)
    const hasMicronutrients = allMicronutrients.length > 0;

    const showMicronutrientInfo = (): void => {
      if (hasMicronutrients) {
        // Show tracked ones if available, otherwise show all
        const micronutrientsToShow =
          trackedMicronutrients.length > 0
            ? trackedMicronutrients
            : allMicronutrients;

        setSelectedMicronutrients({
          title: food.name,
          micronutrients: micronutrientsToShow,
        });
        micronutrientModalRef.current?.present();
      }
    };

    const innerContent = (
      <>
        <View className="flex-1">
          <Text className="text-gray-900 font-medium text-base">
            {food.name}
          </Text>
          <Text className="text-gray-500 text-sm">{food.servingSize}</Text>
        </View>
        <HStack className="items-center" space="md">
          <View className="items-end">
            <Text className="text-gray-900 font-semibold">
              {food.calories} cal
            </Text>
            <HStack space="xs">
              <Text className="text-xs text-gray-500">P:{food.protein}g</Text>
              <Text className="text-xs text-gray-500">C:{food.carbs}g</Text>
              <Text className="text-xs text-gray-500">F:{food.fat}g</Text>
            </HStack>
          </View>
        </HStack>
      </>
    );

    return hasMicronutrients ? (
      <TouchableOpacity
        key={`${food.name}-${index}`}
        className="flex-row items-center py-3.5 border-b border-gray-50"
        onPress={showMicronutrientInfo}
        activeOpacity={0.7}
      >
        {innerContent}
      </TouchableOpacity>
    ) : (
      <View
        key={`${food.name}-${index}`}
        className="flex-row items-center py-3.5 border-b border-gray-50"
      >
        {innerContent}
      </View>
    );
  };

  // Render calorie entry card
  const renderCalorieEntry = (entry: CalorieEntry): React.ReactNode => {
    const colors = MealTypeColors[entry.meal_type] || MealTypeColors.snack;
    const healthScore = entry.health_score || 0;
    const healthScoreReasoning = entry.health_score_reasoning || "";

    // Health score color — muted tones for quiet hierarchy
    const getHealthScoreColor = (score: number) => {
      if (score >= 80)
        return {
          bg: "bg-green-50",
          text: "text-green-600",
        };
      if (score >= 60)
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-600",
        };
      return {
        bg: "bg-red-50",
        text: "text-red-500",
      };
    };

    const healthColors = getHealthScoreColor(healthScore);

    const showHealthScoreInfo = () => {
      setSelectedHealthScore({
        score: healthScore,
        reasoning: healthScoreReasoning,
      });
      setShowHealthScoreModal(true);
    };

    return (
      <View
        key={entry.id}
        className="bg-white rounded-2xl p-4 mb-3"
        style={CARD_SHADOW}
      >
        <HStack className="justify-between items-center mb-3">
          <HStack space="sm" className="items-center">
            <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
              <Text className={`text-sm font-medium capitalize ${colors.text}`}>
                {entry.meal_type}
              </Text>
            </View>
            {healthScore > 0 && (
              <TouchableOpacity
                onPress={showHealthScoreInfo}
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
              {format(new Date(entry.created_at), "h:mm a")}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteEntry(entry.id)}>
              <HugeiconsIcon icon={Delete01Icon} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </HStack>
        </HStack>

        <VStack space="xs">
          {entry.foods.map((food, index) => renderFoodItem(food, index))}
        </VStack>

        <HStack className="justify-between items-center mt-3 pt-3 border-t border-gray-50">
          <Text className="text-gray-500 font-medium text-sm">Total</Text>
          <HStack className="items-center" space="md">
            <Text className="text-gray-900 font-semibold">
              {entry.total_calories} cal
            </Text>
            {/* Micronutrient Info Icon - showing for ANY micronutrients temporarily */}
            {entry.total_micronutrients &&
              (entry.total_micronutrients as MicronutrientEntry[]).length >
                0 && (
                <TouchableOpacity
                  onPress={() => {
                    const allMicronutrients =
                      entry.total_micronutrients as MicronutrientEntry[];
                    const trackedMicronutrients =
                      filterTrackedMicronutrients(allMicronutrients);

                    const micronutrientsToShow =
                      trackedMicronutrients.length > 0
                        ? trackedMicronutrients
                        : allMicronutrients;

                    setSelectedMicronutrients({
                      title: `${
                        entry.meal_type.charAt(0).toUpperCase() +
                        entry.meal_type.slice(1)
                      } Nutrients`,
                      micronutrients: micronutrientsToShow,
                    });
                    micronutrientModalRef.current?.present();
                  }}
                  activeOpacity={0.7}
                >
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={16}
                    color="#D1D5DB"
                  />
                </TouchableOpacity>
              )}
          </HStack>
        </HStack>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <View className="flex-1 pt-2 pb-[100px]">
        <SectionHeader
          title="Calorie Tracker"
          icon={AppleIcon}
          count={dailySummary.mealCount > 0 ? dailySummary.mealCount : undefined}
          rightElement={
            <>
              <XPBadge amount={XP_REWARDS[XPActionType.CALORIE_LOG]} />
              <TouchableOpacity
                onPress={takePhoto}
                className="bg-gray-800 p-2 rounded-xl"
                activeOpacity={0.7}
              >
                <HugeiconsIcon icon={Camera01Icon} size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickImage}
                className="bg-gray-800 p-2 rounded-xl"
                activeOpacity={0.7}
              >
                <HugeiconsIcon icon={Image01Icon} size={18} color="white" />
              </TouchableOpacity>
            </>
          }
        />
        
        {/* Analyzing State */}
        {isAnalyzing && (
          <View className="bg-white rounded-2xl px-6 py-7 mb-4 items-center" style={CARD_SHADOW}>
            <ActivityIndicator size="large" color="#7B61FF" />
            <Text className="text-gray-600 mt-3 text-center">
              Analyzing your food...
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              AI is identifying nutritional information
            </Text>
          </View>
        )}

        {/* Analysis Error */}
        {analysisError && (
          <View className="bg-red-50 rounded-2xl p-4 mb-4 border border-red-100">
            <Text className="text-red-600 font-medium">Analysis Failed</Text>
            <Text className="text-red-500 text-sm mt-1">{analysisError}</Text>
            <TouchableOpacity
              className="mt-3 bg-red-100 py-2 px-4 rounded-lg self-start"
              onPress={resetCapture}
            >
              <Text className="text-red-600 font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Analysis Result */}
        {analysisResult && !isAnalyzing && (
          <View className="bg-green-50 rounded-2xl p-4 mb-4 border border-green-100">
            <HStack className="justify-between items-center mb-2">
              <Text className="text-green-700 font-semibold">
                ✓ Food Added Successfully!
              </Text>
              <TouchableOpacity onPress={resetCapture}>
                <Text className="text-green-600 font-medium">Done</Text>
              </TouchableOpacity>
            </HStack>
            <Text className="text-green-600 text-sm">
              {analysisResult.foods.length} item(s) •{" "}
              {analysisResult.totalCalories} calories
            </Text>
          </View>
        )}

        {/* Meal Entries */}
        <View className="mt-4 mb-4">
          <Text className="text-gray-800 font-semibold text-base mb-3">Today's Meals</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#7B61FF" />
          ) : calorieEntries.length === 0 ? (
            <View className="flex-1 justify-center items-center py-10">
              <RNImage
                source={require("@/assets/images/no-meal-dog.png")}
                style={{
                  width: 156,
                  height: 156,
                }}
                resizeMode="contain"
              />
            </View>
          ) : (
            calorieEntries.map((entry) => renderCalorieEntry(entry))
          )}
        </View>

        {/* Micronutrient Tracking — subtle secondary CTA */}
        <TouchableOpacity
          onPress={() => router.push("/tabs/screens/micronutrient-tracking")}
          className="flex-row items-center justify-between py-3 px-1 mb-2"
          activeOpacity={0.6}
          accessibilityLabel="Track micronutrients"
        >
          <HStack className="items-center" space="sm">
            <HugeiconsIcon icon={Settings02Icon} size={18} color="#9CA3AF" />
          </HStack>
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={16}
            color="#D1D5DB"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Health Score Modal */}
      <Modal
        visible={showHealthScoreModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHealthScoreModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center px-5"
          activeOpacity={1}
          onPress={() => setShowHealthScoreModal(false)}
        >
          <TouchableOpacity
            className="bg-white rounded-3xl p-6 w-full max-w-md"
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "CormorantSemiBold",
                  color: "#1f2937",
                }}
              >
                Health Score Analysis
              </Text>
              <TouchableOpacity
                onPress={() => setShowHealthScoreModal(false)}
                className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedHealthScore && (
              <>
                <View className="items-center py-4">
                  <View
                    className={`w-24 h-24 rounded-full items-center justify-center ${
                      selectedHealthScore.score >= 80
                        ? "bg-green-100"
                        : selectedHealthScore.score >= 60
                          ? "bg-yellow-100"
                          : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={`text-4xl font-bold ${
                        selectedHealthScore.score >= 80
                          ? "text-green-700"
                          : selectedHealthScore.score >= 60
                            ? "text-yellow-700"
                            : "text-red-700"
                      }`}
                    >
                      {selectedHealthScore.score}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-sm mt-2">out of 100</Text>
                </View>

                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-900 font-semibold mb-2">
                    Why this score?
                  </Text>
                  <Text className="text-gray-700 leading-6">
                    {selectedHealthScore.reasoning}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowHealthScoreModal(false)}
                  className="bg-[#7B61FF] rounded-xl py-3 items-center"
                >
                  <Text className="text-white font-semibold">Got it!</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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
    </View>
  );
};

export default CalorieTrackerScreen;
