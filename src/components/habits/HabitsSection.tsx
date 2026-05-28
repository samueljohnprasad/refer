import React, { useRef, useState, useMemo } from "react";
import { View, Text, Alert } from "react-native";
import { isFuture } from "date-fns";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHabits } from "@/hooks/data/useHabits";
import { useHabitCompletions } from "@/hooks/data/useHabitCompletions";
import { useHabitStreaks } from "@/src/hooks/data/useHabitStreaks";

import { HabitCard } from "@/src/components/habits/HabitCard";
import { SvgAppButton } from "@/src/components/journey/svg-app-button";
import { EmptyState } from "@/src/components/ui/EmptyState";
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
import { BRAND_SURFACE, SAGE } from "@/lib/tokens";

/** Shared subtle card shadow — matches white Happy Sage surfaces. */
const SECTION_SHADOW = {
  shadowColor: SAGE[600],
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 18,
  elevation: 2,
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
      {/* Header - Only show when not empty */}
      {habitsWithStatus.length > 0 && (
        <SectionHeader
          title="Daily Habits"
          icon={Tick01Icon}
          count={totalCount > 0 ? `${completedCount}/${totalCount}` : undefined}
          className="mb-4"
          rightElement={
            <>
              <XPBadge amount={XP_REWARDS[XPActionType.HABIT_COMPLETION]} />
              <SvgAppButton
                onPress={handleAddHabitPress}
                width={46}
                height={42}
                color={SAGE[500]}
                backgroundColor={SAGE[700]}
                leftRadius={16}
                rightRadius={16}
                pressDepth={4}
              >
                <View className="flex-1 items-center justify-center">
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={20}
                    color={BRAND_SURFACE}
                  />
                </View>
              </SvgAppButton>
            </>
          }
        />
      )}



      {/* Empty State */}
      {habitsWithStatus.length === 0 ? (
        <EmptyState
          mascotState="panda-yet-sleep-pillow"
          buttonText="Add Habit"
          onButtonPress={() => addHabitModalRef.current?.present()}
          buttonIcon={Add01Icon}
        />
      ) : (
        <>
          {/* Category Cards */}
          {activeCategories.map((category) => (
            <View
              key={category}
              className="happy-brand-card mb-5 overflow-hidden rounded-[26px]"
              style={SECTION_SHADOW}
            >
              {/* Category Header */}
              <View className="border-b border-sage-100 px-4 py-3.5">
                <View className="flex-row items-center">
                  <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-sage-50">
                    <Text className="text-xl">
                      {TIME_CATEGORY_CONFIG[category].emoji}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="happy-font-body-bold text-[15px] text-ink">
                      {TIME_CATEGORY_CONFIG[category].label}
                    </Text>
                    <Text className="happy-font-body-medium text-[13px] text-ink-muted">
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
