import React, { useState, useMemo } from "react";
import { View, Text, Alert, Pressable } from "react-native";
import { isFuture } from "date-fns";
import { useHabits } from "@/hooks/data/useHabits";
import { useHabitCompletions } from "@/hooks/data/useHabitCompletions";
import { useHabitStreaks } from "@/src/hooks/data/useHabitStreaks";

import { HabitCard } from "@/src/components/habits/HabitCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { HabitCategorySkeleton } from "@/src/components/habits/HabitSkeletons";
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
} from "@/src/utils/habitCategories";
import { XPBadge } from "@/src/components/XP";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { BRAND_SURFACE, SAGE } from "@/lib/tokens";


interface HabitsSectionProps {
  selectedDate: Date;
}

export const HabitsSection: React.FC<HabitsSectionProps> = ({
  selectedDate,
}) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const { habits, loading: habitsLoading, createHabit, updateHabit, deleteHabit } = useHabits();
  const { toggleHabitCompletion, getHabitsWithStatus, loading: completionsLoading } =
    useHabitCompletions(selectedDate);
  const { streaks, refetchStreaks } = useHabitStreaks();

  const habitsWithStatus = getHabitsWithStatus(habits);

  const habitsWithStatusAndStreaks = habitsWithStatus.map((h) => ({
    ...h,
    currentStreak: streaks[h.id]?.currentStreak || 0,
    longestStreak: streaks[h.id]?.longestStreak || 0,
  }));

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
      setDetailsModalVisible(true);
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
    Haptics.selectionAsync();
    setAddModalVisible(true);
  };

  const completedCount = habitsWithStatus.filter((h) => h.isCompleted).length;
  const totalCount = habitsWithStatus.length;

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
    <View className="pb-48">
      {habitsLoading || completionsLoading ? (
        <>
          <HabitCategorySkeleton />
          <HabitCategorySkeleton />
        </>
      ) : habitsWithStatus.length === 0 ? (
        <EmptyState
          mascotState="panda-yet-sleep-pillow"
          title="Build Better Habits"
          description="Build healthy routines with daily tracking and streaks."
          buttonText="Add Habit"
          onButtonPress={() => setAddModalVisible(true)}
          buttonIcon={Add01Icon}
        />
      ) : (
        <>
          {/* Category Sections */}
          {activeCategories.map((category, i) => (
            <View key={category} className={i > 0 ? "mt-4" : ""}>
              {/* Category Header */}
              <View className="px-5 mb-2 mt-2">
                <Text className="happy-font-body-bold text-[14px] text-ink-muted">
                  {TIME_CATEGORY_CONFIG[category].label}
                </Text>
              </View>

              {/* Habits List */}
              <View className="px-5">
                {categorizedHabits[category].map((habit) => (
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
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Add Habit Button */}
          <Pressable
            onPress={handleAddHabitPress}
            className="flex-row items-center px-5 mt-2 py-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-sage-50 mr-3">
              <HugeiconsIcon icon={Add01Icon} size={18} color={SAGE[600]} />
            </View>
            <Text className="happy-font-body-bold text-[16px] text-sage-700">
              Add Habit
            </Text>
          </Pressable>
        </>
      )}

      {/* Add Habit Modal */}
      {addModalVisible && <AddHabitModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleCreateHabit}
      />}

      {/* Habit Details Modal */}
      {detailsModalVisible && <HabitDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        habit={selectedHabit}
        isCompleted={selectedHabitWithStatus?.isCompleted || false}
        onSave={handleSaveScheduling}
        onToggleCompletion={handleToggleCompletion}
        onDelete={handleDeleteHabit}
      />}
    </View>
  );
};
