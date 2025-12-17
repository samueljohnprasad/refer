import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
import { CalorieAnalysisResult, FoodItem } from "@/src/network/calorieAi";
import { format } from "date-fns";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Camera01Icon,
  Image01Icon,
  Delete01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";

interface CalorieTrackerScreenProps {
  selectedDate?: Date;
  onClose?: () => void;
}

const MealTypeColors: Record<string, { bg: string; text: string }> = {
  breakfast: { bg: "bg-amber-100", text: "text-amber-700" },
  lunch: { bg: "bg-green-100", text: "text-green-700" },
  dinner: { bg: "bg-purple-100", text: "text-purple-700" },
  snack: { bg: "bg-blue-100", text: "text-blue-700" },
};

const CalorieTrackerScreen: React.FC<CalorieTrackerScreenProps> = ({
  selectedDate = new Date(),
  onClose,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<CalorieAnalysisResult | null>(null);

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
        "Camera permission is needed to take photos of your food."
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
        "Photo library permission is needed to select photos."
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
  const renderFoodItem = (food: FoodItem, index: number): React.ReactNode => (
    <View
      key={`${food.name}-${index}`}
      className="flex-row items-center py-3 border-b border-gray-100"
    >
      <View className="flex-1">
        <Text className="text-gray-900 font-medium text-base">{food.name}</Text>
        <Text className="text-gray-500 text-sm">{food.servingSize}</Text>
      </View>
      <View className="items-end">
        <Text className="text-gray-900 font-semibold">{food.calories} cal</Text>
        <HStack space="xs">
          <Text className="text-xs text-gray-500">P:{food.protein}g</Text>
          <Text className="text-xs text-gray-500">C:{food.carbs}g</Text>
          <Text className="text-xs text-gray-500">F:{food.fat}g</Text>
        </HStack>
      </View>
    </View>
  );

  // Render calorie entry card
  const renderCalorieEntry = (entry: CalorieEntry): React.ReactNode => {
    const colors = MealTypeColors[entry.meal_type] || MealTypeColors.snack;
    return (
      <View
        key={entry.id}
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
      >
        <HStack className="justify-between items-center mb-3">
          <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
            <Text className={`text-sm font-medium capitalize ${colors.text}`}>
              {entry.meal_type}
            </Text>
          </View>
          <HStack className="items-center" space="sm">
            <Text className="text-gray-500 text-sm">
              {format(new Date(entry.created_at), "h:mm a")}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteEntry(entry.id)}>
              <HugeiconsIcon icon={Delete01Icon} size={18} color="#EF4444" />
            </TouchableOpacity>
          </HStack>
        </HStack>

        <VStack space="xs">
          {entry.foods.map((food, index) => renderFoodItem(food, index))}
        </VStack>

        <HStack className="justify-between mt-3 pt-3 border-t border-gray-100">
          <Text className="text-gray-900 font-semibold">Total</Text>
          <Text className="text-purple-600 font-bold text-lg">
            {entry.total_calories} cal
          </Text>
        </HStack>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 py-4 bg-white border-b border-gray-100">
        <HStack className="items-center" space="md">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Heading className="text-2xl font-cormorantSemiBold text-gray-900">
              Calorie Tracker
            </Heading>
            <Text className="text-gray-500 mt-1">
              {format(selectedDate, "EEEE, MMMM d")}
            </Text>
          </View>
        </HStack>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Summary Card */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100">
          <Text className="text-gray-600 font-medium mb-2">Today's Total</Text>
          <Text className="text-4xl font-bold text-purple-600 mb-4">
            {dailySummary.totalCalories} cal
          </Text>
          <HStack className="justify-between">
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-900">
                {dailySummary.totalProtein}g
              </Text>
              <Text className="text-xs text-gray-500">Protein</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-900">
                {dailySummary.totalCarbs}g
              </Text>
              <Text className="text-xs text-gray-500">Carbs</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-900">
                {dailySummary.totalFat}g
              </Text>
              <Text className="text-xs text-gray-500">Fat</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-900">
                {dailySummary.totalFiber}g
              </Text>
              <Text className="text-xs text-gray-500">Fiber</Text>
            </View>
          </HStack>
        </View>

        {/* Add Food Buttons */}
        <HStack className="mb-5" space="md">
          <TouchableOpacity
            className="flex-1 bg-purple-600 rounded-2xl py-4 items-center flex-row justify-center"
            onPress={takePhoto}
            disabled={isAnalyzing}
          >
            <HugeiconsIcon icon={Camera01Icon} size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-white border border-purple-600 rounded-2xl py-4 items-center flex-row justify-center"
            onPress={pickImage}
            disabled={isAnalyzing}
          >
            <HugeiconsIcon icon={Image01Icon} size={20} color="#7B61FF" />
            <Text className="text-purple-600 font-semibold ml-2">Gallery</Text>
          </TouchableOpacity>
        </HStack>

        {/* Analyzing State */}
        {isAnalyzing && (
          <View className="bg-white rounded-2xl p-6 mb-5 items-center border border-gray-100">
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
          <View className="bg-red-50 rounded-2xl p-4 mb-5 border border-red-200">
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
          <View className="bg-green-50 rounded-2xl p-4 mb-5 border border-green-200">
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
        <View className="mt-2">
          <Text className="text-gray-600 font-medium mb-3">Today's Meals</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#7B61FF" />
          ) : calorieEntries.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 items-center border border-gray-100">
              <Text className="text-gray-400 text-center">
                No meals logged today.{"\n"}Take a photo of your food to get
                started!
              </Text>
            </View>
          ) : (
            calorieEntries.map((entry) => renderCalorieEntry(entry))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CalorieTrackerScreen;
