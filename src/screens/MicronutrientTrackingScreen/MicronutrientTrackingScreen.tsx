import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  CircleIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MICRONUTRIENTS_CONFIG,
  getMicronutrientsByCategory,
  type MicronutrientConfig,
} from "@/src/config/micronutrients";

const STORAGE_KEY = "tracked_micronutrients";

const MicronutrientTrackingScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [trackedNutrients, setTrackedNutrients] = useState<Set<string>>(
    new Set(MICRONUTRIENTS_CONFIG.map((n) => n.id)) // All selected by default
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load saved preferences
  React.useEffect(() => {
    loadTrackedNutrients();
  }, []);

  const loadTrackedNutrients = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTrackedNutrients(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error("Failed to load tracked nutrients:", error);
    }
  };

  const saveTrackedNutrients = async (nutrients: Set<string>) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(nutrients))
      );
    } catch (error) {
      console.error("Failed to save tracked nutrients:", error);
    }
  };

  const toggleNutrient = (id: string) => {
    const newTracked = new Set(trackedNutrients);
    if (newTracked.has(id)) {
      newTracked.delete(id);
    } else {
      newTracked.add(id);
    }
    setTrackedNutrients(newTracked);
    saveTrackedNutrients(newTracked);
  };

  const selectAll = () => {
    const all = new Set(MICRONUTRIENTS_CONFIG.map((n) => n.id));
    setTrackedNutrients(all);
    saveTrackedNutrients(all);
  };

  const deselectAll = () => {
    setTrackedNutrients(new Set());
    saveTrackedNutrients(new Set());
  };

  const renderNutrientItem = (nutrient: MicronutrientConfig) => {
    const isTracked = trackedNutrients.has(nutrient.id);
    return (
      <TouchableOpacity
        key={nutrient.id}
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center"
        onPress={() => toggleNutrient(nutrient.id)}
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-gray-900 font-semibold text-base">
              {nutrient.name}
            </Text>
            <View
              className={`ml-2 px-2 py-0.5 rounded-full ${
                nutrient.category === "vitamin"
                  ? "bg-purple-100"
                  : "bg-green-100"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  nutrient.category === "vitamin"
                    ? "text-purple-700"
                    : "text-green-700"
                }`}
              >
                {nutrient.category}
              </Text>
            </View>
          </View>
          <Text className="text-gray-600 text-sm mb-1">
            {nutrient.description}
          </Text>
          <Text className="text-gray-500 text-xs">
            Daily Value: {nutrient.dailyValue} {nutrient.unit}
          </Text>
        </View>
        <View className="ml-3">
          {isTracked ? (
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={28}
              color="#7B61FF"
              fill="#7B61FF"
            />
          ) : (
            <HugeiconsIcon icon={CircleIcon} size={28} color="#D1D5DB" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const vitamins = getMicronutrientsByCategory("vitamin");
  const minerals = getMicronutrientsByCategory("mineral");

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 mr-3"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CormorantSemiBold",
                color: "#1f2937",
                letterSpacing: -0.5,
              }}
            >
              Track Micronutrients
            </Text>
            <Text className="text-gray-500 text-sm mt-0.5">
              {trackedNutrients.size} of {MICRONUTRIENTS_CONFIG.length} selected
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={selectAll}
            className="flex-1 bg-purple-600 rounded-xl py-3 items-center"
          >
            <Text className="text-white font-semibold">Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deselectAll}
            className="flex-1 bg-white border border-gray-300 rounded-xl py-3 items-center"
          >
            <Text className="text-gray-700 font-semibold">Deselect All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View className="bg-purple-50 rounded-2xl p-4 mb-5 border border-purple-100">
          <Text className="text-purple-900 font-semibold mb-2">
            💡 How it works
          </Text>
          <Text className="text-purple-700 text-sm leading-5">
            Select the micronutrients you want to track. AI will analyze your
            meals and show you how much of each nutrient you're consuming.
            Selected nutrients will appear in your daily summary.
          </Text>
        </View>

        {/* Vitamins Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="w-1 h-5 bg-purple-600 rounded-full mr-2" />
            <Text className="text-gray-900 font-bold text-lg">Vitamins</Text>
          </View>
          {vitamins.map(renderNutrientItem)}
        </View>

        {/* Minerals Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="w-1 h-5 bg-green-600 rounded-full mr-2" />
            <Text className="text-gray-900 font-bold text-lg">Minerals</Text>
          </View>
          {minerals.map(renderNutrientItem)}
        </View>
      </ScrollView>
    </View>
  );
};

export default MicronutrientTrackingScreen;
