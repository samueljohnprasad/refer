import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { isFuture } from "date-fns";
import { useHabits } from "@/hooks/data/useHabits";
import { useHabitCompletions } from "@/hooks/data/useHabitCompletions";
import { useHabitStreaks } from "@/src/hooks/data/useHabitStreaks";

import { HabitCard } from "@/src/components/habits/HabitCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { HabitCategorySkeleton } from "@/src/components/habits/HabitSkeletons";
import { Habit } from "@/src/types/habits";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import {
  categorizeHabits,
  getActiveCategories,
  TIME_CATEGORY_CONFIG,
} from "@/src/utils/habitCategories";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";


interface HabitsSectionProps {
  selectedDate: Date;
}

export const HabitsSection: React.FC<HabitsSectionProps> = ({
  selectedDate,
}) => {
  const router = useRouter();

  const { habits, loading: habitsLoading } = useHabits();
  const { toggleHabitCompletion, getHabitsWithStatus, loading: completionsLoading } =
    useHabitCompletions(selectedDate);
  const { streaks, refetchStreaks } = useHabitStreaks();

  const habitsWithStatus = getHabitsWithStatus(habits);

  const habitsWithStatusAndStreaks = habitsWithStatus.map((h) => ({
    ...h,
    currentStreak: streaks[h.id]?.currentStreak || 0,
  }));

  const handleHabitPress = (habitId: string) => {
    Haptics.selectionAsync();
    router.push({
      pathname: "/tabs/screens/habits-modal/details",
      params: { habitId, selectedDate: selectedDate.toISOString() },
    } as never);
  };

  const handleToggleCompletion = async (
    habitId: string,
    isCompleted: boolean,
    habitName: string,
  ) => {
    if (isFuture(selectedDate)) return;
    await toggleHabitCompletion(habitId, isCompleted, habitName);
    refetchStreaks();
  };

  const handleAddHabitPress = () => {
    Haptics.selectionAsync();
    router.push("/tabs/screens/habits-modal/add" as never);
  };

  const completedCount = habitsWithStatus.filter((h) => h.isCompleted).length;
  const totalCount = habitsWithStatus.length;

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
    <View className={habitsWithStatus.length === 0 && !habitsLoading && !completionsLoading ? "flex-1" : "pb-48"}>
      {habitsLoading || completionsLoading ? (
        <>
          <HabitCategorySkeleton />
          <HabitCategorySkeleton />
        </>
      ) : habitsWithStatus.length === 0 ? (
        <EmptyState
          mascotState="panda-yet-sleep-pillow"
          title={[
            "Build Better Habits",
            "Track Daily Progress",
            "Stay Consistent"
          ]}
          description="Build healthy routines with daily tracking and streaks."
          buttonText="Add Habit"
          onButtonPress={() => router.push("/tabs/screens/habits-modal/add" as never)}
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
              <HugeiconsIcon icon={Add01Icon} size={18} color={SEMANTIC_COLORS.brand.pressed} />
            </View>
            <Text className="happy-font-body-bold text-[16px] text-sage-700">
              Add Habit
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
};
