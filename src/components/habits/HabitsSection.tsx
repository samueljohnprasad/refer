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

  const { habits, createHabit, updateHabit } = useHabits();
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
    <View className="mt-2">
      {/* Header with Title and Add Button */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-xl font-cormorantSemiBold text-gray-900">
            Daily Habits
          </Text>
          {totalCount > 0 && (
            <Text className="text-sm text-gray-500 font-medium">
              {completedCount}/{totalCount} completed
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleAddHabitPress}
          className="bg-gray-100 p-2 rounded-full"
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={Add01Icon} size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar - Only visible if habits exist */}
      {totalCount > 0 && (
        <View className="w-full h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
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
        <View className="bg-white rounded-2xl p-6 border border-gray-100 items-center justify-center">
          <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mb-3">
            <Text style={{ fontSize: 24 }}>✨</Text>
          </View>
          <Text className="text-base font-semibold text-gray-900 mb-1">
            Build Better Habits
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-4 leading-5">
            Small daily actions lead to big changes over time.
          </Text>
          <TouchableOpacity
            onPress={handleAddHabitPress}
            className="px-5 py-2.5 bg-gray-900 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm font-semibold">
              Add First Habit
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
      />
    </View>
  );
};
