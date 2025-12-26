import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHabits } from "@/hooks/data/useHabits";
import { useHabitCompletions } from "@/hooks/data/useHabitCompletions";
import { HabitCard } from "@/src/components/habits/HabitCard";
import { AddHabitModal } from "@/src/components/habits/AddHabitModal";
import { HabitDetailsModal } from "@/src/components/habits/HabitDetailsModal";
import {
  CreateHabitFormData,
  HabitSchedulingData,
  Habit,
} from "@/src/types/habits";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon } from "@hugeicons/core-free-icons";
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

  const habitsWithStatus = getHabitsWithStatus(habits);

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
    await toggleHabitCompletion(habitId, isCompleted);
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

  const selectedHabitWithStatus = selectedHabit
    ? habitsWithStatus.find((h) => h.id === selectedHabit.id)
    : null;

  return (
    <View className="mt-4">
      {/* Header with Title and Add Button */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Text className="text-lg font-semibold text-gray-900">
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
          className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center"
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={Add01Icon} size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar - Only visible if habits exist */}
      {totalCount > 0 && (
        <View className="w-full h-1 bg-gray-100 rounded-full mb-4 overflow-hidden">
          <View
            className="h-full bg-[#7B61FF] rounded-full"
            style={{
              width: `${
                totalCount > 0 ? (completedCount / totalCount) * 100 : 0
              }%`,
            }}
          />
        </View>
      )}

      {/* Habits List */}
      {habitsWithStatus.length === 0 ? (
        <View className="bg-gray-50/50 rounded-2xl p-8 items-center justify-center border border-gray-100 border-dashed">
          <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center mb-4 shadow-sm">
            <Text style={{ fontSize: 28 }}>✨</Text>
          </View>
          <Text className="text-base font-semibold text-gray-900 mb-1">
            Build Better Habits
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-5 leading-5 max-w-[240px]">
            Small daily actions lead to big changes over time.
          </Text>
          <TouchableOpacity
            onPress={handleAddHabitPress}
            className="px-6 py-3 bg-[#7B61FF] rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm font-semibold">
              Add Your First Habit
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {habitsWithStatus.map((habit) => (
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
