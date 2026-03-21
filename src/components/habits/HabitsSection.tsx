import React, { useRef, useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { isFuture } from "date-fns";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHabits } from "@/hooks/data/useHabits";
import { useHabitCompletions } from "@/hooks/data/useHabitCompletions";
import { useHabitStreaks } from "@/src/hooks/data/useHabitStreaks";

import { HabitCard } from "@/src/components/habits/HabitCard";
import { AddHabitModal } from "@/src/components/habits/AddHabitModal";
import { HabitDetailsModal } from "@/src/components/habits/HabitDetailsModal";
import {
  CreateHabitFormData,
  HabitSchedulingData,
  Habit,
} from "@/src/types/habits";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import {
  handleHabitCreated,
  handleHabitUpdated,
} from "@/src/utils/habitNotificationHandlers";
import {
  categorizeHabits,
  getActiveCategories,
  TIME_CATEGORY_CONFIG,
  TimeCategory,
} from "@/src/utils/habitCategories";
import { XPBadge } from "@/src/components/XP";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";
import { SectionHeader } from "@/src/components/ui/SectionHeader";

/** Shared subtle card shadow — matches CalorieWidget for cross-tab consistency */
const SECTION_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 1,
} as const;

interface HabitsSectionProps {
  selectedDate: Date;
}

export const HabitsSection: React.FC<HabitsSectionProps> = ({
  selectedDate,
}) => {
  const addHabitModalRef = useRef<BottomSheetModal>(null);
  const detailsModalRef = useRef<BottomSheetModal>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const { habits, createHabit, updateHabit, deleteHabit } = useHabits();
  const { toggleHabitCompletion, getHabitsWithStatus } =
    useHabitCompletions(selectedDate);
  const { streaks, refetchStreaks } = useHabitStreaks();

  const habitsWithStatus = getHabitsWithStatus(habits);

  const habitsWithStatusAndStreaks = habitsWithStatus.map((h) => ({
    ...h,
    currentStreak: streaks[h.id]?.currentStreak || 0,
    longestStreak: streaks[h.id]?.longestStreak || 0,
  }));

  // Animated progress bar
  const progressWidth = useSharedValue(0);

  const handleCreateHabit = async (formData: CreateHabitFormData) => {
    const created = await createHabit(formData);
    if (created) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Schedule notification if reminder is enabled
      await handleHabitCreated(created);
    }
  };

  const handleHabitPress = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      setSelectedHabit(habit);
      detailsModalRef.current?.present();
    }
  };

  const handleSaveScheduling = async (
    habitId: string,
    schedulingData: HabitSchedulingData,
  ) => {
    // Update habit with scheduling data
    await updateHabit(habitId, schedulingData);

    // Update notifications based on new scheduling data
    const updatedHabit = habits.find((h) => h.id === habitId);
    if (updatedHabit) {
      await handleHabitUpdated({
        ...updatedHabit,
        ...schedulingData,
      });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleToggleCompletion = async (
    habitId: string,
    isCompleted: boolean,
    habitName: string,
  ) => {
    // Prevent completion for future dates
    if (isFuture(selectedDate)) {
      Alert.alert(
        "Cannot complete habit",
        "You cannot mark habits as complete for future dates.",
      );
      return;
    }

    await toggleHabitCompletion(habitId, isCompleted, habitName);
    refetchStreaks();
  };

  const handleDeleteHabit = async (habitId: string) => {
    await deleteHabit(habitId);
    setSelectedHabit(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleAddHabitPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addHabitModalRef.current?.present();
  };

  const completedCount = habitsWithStatus.filter((h) => h.isCompleted).length;
  const totalCount = habitsWithStatus.length;

  // Animate progress bar when completion changes
  useEffect(() => {
    const targetProgress =
      totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    progressWidth.value = withTiming(targetProgress, {
      duration: 400,
    });
  }, [completedCount, totalCount]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const selectedHabitWithStatus = selectedHabit
    ? habitsWithStatus.find((h) => h.id === selectedHabit.id)
    : null;

  // Categorize habits by time of day
  const categorizedHabits = useMemo(
    () => categorizeHabits(habitsWithStatusAndStreaks),
    [habitsWithStatusAndStreaks],
  );

  const activeCategories = useMemo(
    () => getActiveCategories(categorizedHabits),
    [categorizedHabits],
  );

  return (
    <View style={{ paddingBottom: 120 }}>
      <SectionHeader
        title="Daily Habits"
        icon={Tick01Icon}
        count={totalCount > 0 ? `${completedCount}/${totalCount}` : undefined}
        className="mb-4"
        rightElement={
          <>
            <XPBadge amount={XP_REWARDS[XPActionType.HABIT_COMPLETION]} />
            <TouchableOpacity
              onPress={handleAddHabitPress}
              className="bg-gray-800 p-2 rounded-xl"
              activeOpacity={0.7}
            >
              <HugeiconsIcon icon={Add01Icon} size={18} color="white" />
            </TouchableOpacity>
          </>
        }
      />

      {/* Progress Bar Card */}
      {totalCount > 0 && (
        <View className="bg-white rounded-2xl p-5 mb-4" style={SECTION_SHADOW}>
          <Text className="text-gray-900 font-semibold mb-3">Daily Progress</Text>
          <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <Animated.View
              className="h-full bg-gray-400 rounded-full"
              style={progressAnimatedStyle}
            />
          </View>
        </View>
      )}

      {/* Empty State */}
      {habitsWithStatus.length === 0 ? (
        <View
          className="bg-white rounded-2xl p-8 items-center"
          style={SECTION_SHADOW}
        >
          <Text className="text-gray-400 text-center">
            No habits for today.{"\n"}Tap + to add your first habit!
          </Text>
        </View>
      ) : (
        <>
          {/* Category Cards */}
          {activeCategories.map((category) => (
            <View
              key={category}
              className="bg-white rounded-2xl mb-4 overflow-hidden"
              style={SECTION_SHADOW}
            >
              {/* Category Header */}
              <View className="px-4 py-3 border-b border-gray-50">
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">
                    {TIME_CATEGORY_CONFIG[category].emoji}
                  </Text>
                  <View>
                    <Text className="text-sm font-semibold text-gray-700">
                      {TIME_CATEGORY_CONFIG[category].label}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {TIME_CATEGORY_CONFIG[category].range}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Habits List - Clean flat layout */}
              <View className="px-4">
                {categorizedHabits[category].map((habit, index) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onPress={() => handleHabitPress(habit.id)}
                    onToggleComplete={() =>
                      handleToggleCompletion(
                        habit.id,
                        habit.isCompleted,
                        habit.name,
                      )
                    }
                    isLast={index === categorizedHabits[category].length - 1}
                  />
                ))}
              </View>
            </View>
          ))}
        </>
      )}

      {/* Add Habit Modal */}
      <AddHabitModal ref={addHabitModalRef} onSubmit={handleCreateHabit} />

      {/* Habit Details Modal */}
      <HabitDetailsModal
        ref={detailsModalRef}
        habit={selectedHabit}
        isCompleted={selectedHabitWithStatus?.isCompleted || false}
        onSave={handleSaveScheduling}
        onToggleCompletion={handleToggleCompletion}
        onDelete={handleDeleteHabit}
      />
    </View>
  );
};
