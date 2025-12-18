import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CheckmarkCircle02Icon, Idea01Icon } from "@hugeicons/core-free-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MICRONUTRIENTS_CONFIG,
  getMicronutrientsByCategory,
  type MicronutrientConfig,
} from "@/src/config/micronutrients";

const STORAGE_KEY = "tracked_micronutrients";

const MicronutrientTrackingScreen: React.FC = () => {
  const headerHeight = useHeaderHeight();
  const [trackedNutrients, setTrackedNutrients] = useState<Set<string>>(
    new Set(MICRONUTRIENTS_CONFIG.map((n) => n.id))
  );

  // Load saved preferences
  useEffect(() => {
    loadTrackedNutrients();
  }, []);

  const loadTrackedNutrients = async (): Promise<void> => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTrackedNutrients(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error("Failed to load tracked nutrients:", error);
    }
  };

  const saveTrackedNutrients = async (
    nutrients: Set<string>
  ): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(nutrients))
      );
    } catch (error) {
      console.error("Failed to save tracked nutrients:", error);
    }
  };

  const toggleNutrient = (id: string): void => {
    const newTracked = new Set(trackedNutrients);
    if (newTracked.has(id)) {
      newTracked.delete(id);
    } else {
      newTracked.add(id);
    }
    setTrackedNutrients(newTracked);
    saveTrackedNutrients(newTracked);
  };

  const selectAll = (): void => {
    const all = new Set(MICRONUTRIENTS_CONFIG.map((n) => n.id));
    setTrackedNutrients(all);
    saveTrackedNutrients(all);
  };

  const deselectAll = (): void => {
    setTrackedNutrients(new Set());
    saveTrackedNutrients(new Set());
  };

  const renderNutrientItem = (
    nutrient: MicronutrientConfig
  ): React.ReactNode => {
    const isTracked = trackedNutrients.has(nutrient.id);
    const categoryColor =
      nutrient.category === "vitamin"
        ? {
            bg: "bg-purple-50",
            text: "text-purple-600",
            border: "border-purple-200",
          }
        : {
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            border: "border-emerald-200",
          };

    return (
      <TouchableOpacity
        key={nutrient.id}
        className={`rounded-xl p-4 mb-2 flex-row items-center ${
          isTracked
            ? "bg-white border border-purple-200"
            : "bg-gray-50 border border-gray-100"
        }`}
        onPress={() => toggleNutrient(nutrient.id)}
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text
              className={`font-semibold text-base ${
                isTracked ? "text-gray-900" : "text-gray-600"
              }`}
            >
              {nutrient.name}
            </Text>
            <View
              className={`ml-2 px-2 py-0.5 rounded-full ${categoryColor.bg}`}
            >
              <Text
                className={`text-xs font-medium capitalize ${categoryColor.text}`}
              >
                {nutrient.category}
              </Text>
            </View>
          </View>
          <Text className="text-gray-500 text-sm">{nutrient.description}</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Daily: {nutrient.dailyValue} {nutrient.unit}
          </Text>
        </View>
        <View className="ml-3">
          {isTracked ? (
            <View className="w-7 h-7 rounded-full bg-purple-600 items-center justify-center">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={20}
                color="white"
              />
            </View>
          ) : (
            <View className="w-7 h-7 rounded-full border-2 border-gray-300" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const vitamins = getMicronutrientsByCategory("vitamin");
  const minerals = getMicronutrientsByCategory("mineral");

  return (
    <View className="flex-1 bg-[#F6F4FF]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View className="flex-row gap-3 mb-5">
          <TouchableOpacity
            onPress={selectAll}
            className="flex-1 bg-purple-600 rounded-xl py-3.5 items-center shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deselectAll}
            className="flex-1 bg-white border border-gray-200 rounded-xl py-3.5 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 font-semibold">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View className="bg-purple-50 rounded-xl p-4 mb-5 border border-purple-100">
          <View className="flex-row items-center mb-1">
            <HugeiconsIcon icon={Idea01Icon} size={18} color="#7C3AED" />
            <Text className="text-purple-800 font-medium ml-1.5">
              How it works
            </Text>
          </View>
          <Text className="text-purple-700 text-sm leading-5">
            Select nutrients to track. AI will analyze your meals and show how
            much of each you're consuming in your daily summary.
          </Text>
        </View>

        {/* Vitamins Section */}
        <View className="mb-5">
          <View className="flex-row items-center mb-3">
            <View className="w-1 h-4 bg-purple-500 rounded-full mr-2" />
            <Text className="text-gray-800 font-bold">Vitamins</Text>
            <Text className="text-gray-400 text-sm ml-2">
              ({vitamins.filter((v) => trackedNutrients.has(v.id)).length}/
              {vitamins.length})
            </Text>
          </View>
          {vitamins.map(renderNutrientItem)}
        </View>

        {/* Minerals Section */}
        <View className="mb-5">
          <View className="flex-row items-center mb-3">
            <View className="w-1 h-4 bg-emerald-500 rounded-full mr-2" />
            <Text className="text-gray-800 font-bold">Minerals</Text>
            <Text className="text-gray-400 text-sm ml-2">
              ({minerals.filter((m) => trackedNutrients.has(m.id)).length}/
              {minerals.length})
            </Text>
          </View>
          {minerals.map(renderNutrientItem)}
        </View>
      </ScrollView>
    </View>
  );
};

export default MicronutrientTrackingScreen;
