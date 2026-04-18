import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Camera01Icon,
  Image01Icon,
  Settings02Icon,
  ArrowLeft01Icon,
  AppleIcon,
} from "@hugeicons/core-free-icons";

import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { XPBadge } from "@/src/components/XP";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { HStack } from "@/components/ui/hstack";

import { useCalorieTrackerScreen } from "./hooks/useCalorieTrackerScreen";
import { MealEntryCard } from "./components/MealEntryCard";
import { HealthScoreModal } from "./components/HealthScoreModal";
import { MicronutrientSheet } from "./components/MicronutrientSheet";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalorieTrackerScreenProps {
  selectedDate?: Date;
  onClose?: () => void;
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

const AnalyzingBanner: React.FC = () => (
  <View
    className="bg-white rounded-2xl px-6 py-7 mb-4 items-center"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 1,
    }}
  >
    <ActivityIndicator size="large" color="#7B61FF" />
    <Text className="text-gray-600 mt-3 text-center">
      Analyzing your food...
    </Text>
    <Text className="text-gray-400 text-sm mt-1 text-center">
      AI is identifying nutritional information
    </Text>
  </View>
);

interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
}
const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry }) => (
  <View className="bg-red-50 rounded-2xl p-4 mb-4 border border-red-100">
    <Text className="text-red-600 font-medium">Analysis Failed</Text>
    <Text className="text-red-500 text-sm mt-1">{error}</Text>
    <TouchableOpacity
      className="mt-3 bg-red-100 py-2 px-4 rounded-lg self-start"
      onPress={onRetry}
    >
      <Text className="text-red-600 font-medium">Try Again</Text>
    </TouchableOpacity>
  </View>
);

interface SuccessBannerProps {
  itemCount: number;
  totalCalories: number;
  onDone: () => void;
}
const SuccessBanner: React.FC<SuccessBannerProps> = ({
  itemCount,
  totalCalories,
  onDone,
}) => (
  <View className="bg-green-50 rounded-2xl p-4 mb-4 border border-green-100">
    <HStack className="justify-between items-center mb-2">
      <Text className="text-green-700 font-semibold">
        ✓ Food Added Successfully!
      </Text>
      <TouchableOpacity onPress={onDone}>
        <Text className="text-green-600 font-medium">Done</Text>
      </TouchableOpacity>
    </HStack>
    <Text className="text-green-600 text-sm">
      {itemCount} item(s) • {totalCalories} calories
    </Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

const CalorieTrackerScreen: React.FC<CalorieTrackerScreenProps> = ({
  selectedDate = new Date(),
}) => {
  const router = useRouter();

  const {
    calorieEntries,
    dailySummary,
    analysisResult,
    selectedHealthScore,
    selectedMicronutrients,
    isLoading,
    isAnalyzing,
    analysisError,
    healthScoreModalVisible,
    micronutrientModalRef,
    takePhoto,
    pickImage,
    resetCapture,
    handleDeleteEntry,
    handleShowHealthScore,
    handleCloseHealthScore,
    handleShowMicronutrients,
    filterTrackedMicronutrients,
  } = useCalorieTrackerScreen(selectedDate);

  return (
    <View className="flex-1">
      <View className="pb-[100px]">
        {/* Header - Only show when not empty */}
        {calorieEntries.length > 0 && (
          <SectionHeader
            title="Calorie Tracker"
            icon={AppleIcon}
            count={
              dailySummary.mealCount > 0 ? dailySummary.mealCount : undefined
            }
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
        )}

        {/* Status Banners */}
        {isAnalyzing && <AnalyzingBanner />}
        {!!analysisError && (
          <ErrorBanner error={analysisError} onRetry={resetCapture} />
        )}
        {analysisResult && !isAnalyzing && (
          <SuccessBanner
            itemCount={analysisResult.foods.length}
            totalCalories={analysisResult.totalCalories}
            onDone={resetCapture}
          />
        )}

        {/* Meal Entries */}
        <View>
          {isLoading ? (
            <ActivityIndicator size="small" color="#7B61FF" />
          ) : calorieEntries.length === 0 ? (
            <EmptyState
              mascotState="panda-confused-thinking"
              buttonText="Log Meal"
              onButtonPress={takePhoto}
              buttonIcon={Camera01Icon}
            />
          ) : (
            <View className="mt-4 mb-4">
              <Text className="text-gray-800 font-semibold text-base mb-3">
                Today's Meals
              </Text>
              {calorieEntries.map((entry) => (
                <MealEntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDeleteEntry}
                  onShowHealthScore={handleShowHealthScore}
                  onShowMicronutrients={handleShowMicronutrients}
                  filterTrackedMicronutrients={filterTrackedMicronutrients}
                />
              ))}
            </View>
          )}
        </View>

        {/* Micronutrient tracking CTA */}
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

      {/* Modals */}
      <HealthScoreModal
        visible={healthScoreModalVisible}
        score={selectedHealthScore?.score ?? 0}
        reasoning={selectedHealthScore?.reasoning ?? ""}
        onClose={handleCloseHealthScore}
      />

      <MicronutrientSheet
        ref={micronutrientModalRef}
        title={selectedMicronutrients?.title}
        micronutrients={selectedMicronutrients?.micronutrients ?? []}
      />
    </View>
  );
};

export default CalorieTrackerScreen;
