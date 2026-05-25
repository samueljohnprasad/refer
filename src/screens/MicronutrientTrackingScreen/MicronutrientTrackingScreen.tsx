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
import { BRAND_SURFACE, GOLD, SAGE } from "@/lib/tokens";

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
            bg: "bg-sage-pill",
            text: "text-sage-600",
            checkColor: SAGE[600],
          }
        : {
            bg: "bg-gold/15",
            text: "text-ink-soft",
            checkColor: GOLD,
          };

    return (
      <TouchableOpacity
        key={nutrient.id}
        className={`mb-3 flex-row items-center rounded-[24px] p-4 ${
          isTracked
            ? "happy-brand-pressed-card-selected"
            : "happy-brand-pressed-card"
        }`}
        onPress={() => toggleNutrient(nutrient.id)}
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text
              className={`happy-font-body-bold text-[17px] ${
                isTracked ? "text-ink" : "text-ink-soft"
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
          <Text className="happy-font-body-medium text-ink-muted text-[15px] leading-5">
            {nutrient.description}
          </Text>
          <Text className="happy-font-body text-ink-muted text-xs mt-1">
            Daily: {nutrient.dailyValue} {nutrient.unit}
          </Text>
        </View>
        <View className="ml-3">
          {isTracked ? (
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: categoryColor.checkColor }}
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={20}
                color={BRAND_SURFACE}
              />
            </View>
          ) : (
            <View className="w-8 h-8 rounded-full border-2 border-sage-200" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const vitamins = getMicronutrientsByCategory("vitamin");
  const minerals = getMicronutrientsByCategory("mineral");

  return (
    <View className="flex-1 happy-brand-screen">
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
            className="happy-brand-primary-cta flex-1 rounded-[20px] py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="happy-font-body-bold text-brand-surface">
              Select All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deselectAll}
            className="flex-1 bg-brand-surface border-2 border-sage-100 rounded-[20px] py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="happy-font-body-bold text-ink-soft">
              Clear All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View className="happy-brand-card rounded-[24px] p-5 mb-6">
          <View className="flex-row items-center mb-1">
            <HugeiconsIcon icon={Idea01Icon} size={19} color={SAGE[600]} />
            <Text className="happy-font-body-bold text-sage-600 ml-1.5">
              How it works
            </Text>
          </View>
          <Text className="happy-font-body-medium text-ink-soft text-[15px] leading-6">
            Select nutrients to track. AI will analyze your meals and show how
            much of each you're consuming in your daily summary.
          </Text>
        </View>

        {/* Vitamins Section */}
        <View className="mb-5">
          <View className="flex-row items-center mb-3">
            <View className="w-1 h-4 bg-sage-500 rounded-full mr-2" />
            <Text className="happy-font-body-bold text-ink text-[17px]">
              Vitamins
            </Text>
            <Text className="happy-font-body-medium text-ink-muted text-sm ml-2">
              ({vitamins.filter((v) => trackedNutrients.has(v.id)).length}/
              {vitamins.length})
            </Text>
          </View>
          {vitamins.map(renderNutrientItem)}
        </View>

        {/* Minerals Section */}
        <View className="mb-5">
          <View className="flex-row items-center mb-3">
            <View className="w-1 h-4 bg-gold rounded-full mr-2" />
            <Text className="happy-font-body-bold text-ink text-[17px]">
              Minerals
            </Text>
            <Text className="happy-font-body-medium text-ink-muted text-sm ml-2">
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
