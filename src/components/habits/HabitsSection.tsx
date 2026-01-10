import React, { useRef, useState, useEffect } from "react";
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
    schedulingData: HabitSchedulingData
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
    isCompleted: boolean
  ) => {
    // Prevent completion for future dates
    if (isFuture(selectedDate)) {
      Alert.alert(
        "Cannot complete habit",
        "You cannot mark habits as complete for future dates."
      );
      return;
    }

    await toggleHabitCompletion(habitId, isCompleted);
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

  return (
    <View className="bg-white rounded-2xl p-5 border border-gray-100">
      {/* Header with Title and Add Button */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-theme-purple-light p-2 rounded-xl mr-2">
            <HugeiconsIcon icon={Tick01Icon} size={24} color="#7B61FF" />
          </View>
          <Text className="text-gray-900 font-semibold text-lg">
            Daily Habits
          </Text>
          {totalCount > 0 && (
            <View className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full">
              <Text className="text-xs font-medium text-gray-500">
                {completedCount}/{totalCount}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleAddHabitPress}
          className="bg-theme-purple-deep p-2 rounded-xl"
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={Add01Icon} size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Habits List */}
      {habitsWithStatus.length === 0 ? (
        <View className="py-4 items-center">
          <Text className="text-gray-400 text-center">
            No habits for today.{"\n"}Tap + to add your first habit!
          </Text>
        </View>
      ) : (
        <View>
          {/* Progress Bar */}
          <View className="w-full h-1.5 bg-theme-purple-light rounded-full mb-4 overflow-hidden">
            <Animated.View
              className="h-full bg-theme-purple-deep rounded-full"
              style={progressAnimatedStyle}
            />
          </View>

          {/* Habit Items */}
          {habitsWithStatusAndStreaks.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => handleHabitPress(habit.id)}
              onToggleComplete={() =>
                handleToggleCompletion(habit.id, habit.isCompleted)
              }
            />
          ))}
        </View>
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
