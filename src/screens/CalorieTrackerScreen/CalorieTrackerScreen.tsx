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
  ArrowRight01Icon,
  AppleIcon,
} from "@hugeicons/core-free-icons";

import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { XPBadge } from "@/src/components/XP";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/src/components/ui/Button";
import { CalorieSummarySkeleton, MealEntrySkeleton } from "./components/CalorieSkeletons";

import { useCalorieTrackerScreen } from "./hooks/useCalorieTrackerScreen";
import { MealEntryCard } from "./components/MealEntryCard";
import { HealthScoreModal } from "./components/HealthScoreModal";
import { MicronutrientSheet } from "./components/MicronutrientSheet";
import { Mascot } from "@/src/components/ui/Mascot";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalorieTrackerScreenProps {
  selectedDate?: Date;
  onClose?: () => void;
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

const AnalyzingBanner: React.FC = () => (
  <View className="bg-white rounded-2xl px-6 py-7 mb-4 items-center shadow-sm border border-gray-100">
    <ActivityIndicator size="large" color="#4B5563" />
    <Text className="text-gray-800 font-medium mt-4 text-center">
      Analyzing your food...
    </Text>
    <Text className="text-gray-500 text-sm mt-1 text-center">
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
  onUndo?: () => void;
}
const SuccessBanner: React.FC<SuccessBannerProps> = ({
  itemCount,
  totalCalories,
  onDone,
  onUndo,
}) => (
  <View className="bg-green-50 rounded-2xl p-4 mb-4 border border-green-100">
    <HStack className="justify-between items-center mb-2">
      <Text className="text-green-800 font-semibold">
        ✓ Food Added Successfully!
      </Text>
      <HStack space="md">
        {onUndo && (
          <TouchableOpacity onPress={onUndo}>
            <Text className="text-green-700 font-medium opacity-70">Undo</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDone}>
          <Text className="text-green-700 font-medium">Done</Text>
        </TouchableOpacity>
      </HStack>
    </HStack>
    <Text className="text-green-600 text-sm mt-1">
      {itemCount} item{itemCount !== 1 ? "s" : ""} • {totalCalories} calories logged to your daily goal.
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
      <View className="pb-12">
        {/* Header - Only show when not empty */}
        {calorieEntries.length > 0 && (
          <SectionHeader
            title="Calorie Tracker"
            icon={AppleIcon}
            count={
              dailySummary.mealCount > 0 ? dailySummary.mealCount : undefined
            }
            rightElement={
              <XPBadge amount={XP_REWARDS[XPActionType.CALORIE_LOG]} />
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
            onUndo={() => {
              resetCapture();
              if (calorieEntries.length > 0) {
                handleDeleteEntry(calorieEntries[0].id);
              }
            }}
          />
        )}

        {/* Meal Entries */}
        <View>
          {isLoading ? (
            <View className="gap-6 w-full">
              <CalorieSummarySkeleton />
              <View className="px-4">
                <View className="h-6 w-32 bg-gray-100 rounded mb-4" />
                <MealEntrySkeleton />
                <MealEntrySkeleton />
              </View>
            </View>
          ) : calorieEntries.length === 0 ? (
            <EmptyState
              mascotState="panda-confused-thinking"
              title="Ready to log?"
              description="Snap a photo of your meal to instantly track calories and macros."
              buttonText="Take Photo"
              onButtonPress={takePhoto}
              buttonIcon={Camera01Icon}
              buttonLoading={isAnalyzing || isLoading}
              secondaryButtonText="Upload Photo"
              onSecondaryButtonPress={pickImage}
              secondaryButtonIcon={Image01Icon}
              secondaryButtonLoading={isAnalyzing || isLoading}
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
              
              <View className="mt-6 flex-row gap-3">
                <Button
                  label="Camera"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  leftIcon={<HugeiconsIcon icon={Camera01Icon} size={20} color="white" />}
                  onPress={takePhoto}
                  loading={isAnalyzing || isLoading}
                />
                <Button
                  label="Upload"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  leftIcon={<HugeiconsIcon icon={Image01Icon} size={20} color="#4B5563" />}
                  onPress={pickImage}
                  loading={isAnalyzing || isLoading}
                />
              </View>
            </View>
          )}
        </View>

        {/* Removed Micronutrient CTA as requested */}
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
