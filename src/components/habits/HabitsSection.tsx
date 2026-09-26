import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { isFuture } from "date-fns";
import { useHabits } from "@/hooks/data/useHabits";
import { useHabitCompletions } from "@/hooks/data/useHabitCompletions";
import { useHabitStreaks } from "@/src/hooks/data/useHabitStreaks";
import { useFreemiumGate } from "@/src/hooks/useFreemiumGate";

import { HabitCard } from "@/src/components/habits/HabitCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { HabitCategorySkeleton } from "@/src/components/habits/HabitSkeletons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import {
  categorizeHabits,
  getActiveCategories,
  TIME_CATEGORY_CONFIG,
} from "@/src/utils/habitCategories";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface HabitsSectionProps {
  selectedDate: Date;
}

export const HabitsSection: React.FC<HabitsSectionProps> = ({
  selectedDate,
}) => {
  const router = useRouter();

  const { habits, loading: habitsLoading } = useHabits();
  const {
    toggleHabitCompletion,
    getHabitsWithStatus,
    loading: completionsLoading,
  } = useHabitCompletions(selectedDate);
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

  const { requirePro } = useFreemiumGate();

  const handleAddHabitPress = async () => {
    Haptics.selectionAsync();
    const canAdd = await requirePro("habits", habits.length);
    if (!canAdd) return;
    router.push("/tabs/screens/habits-modal/add" as never);
  };

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
    <View
      className={
        habitsWithStatus.length === 0 && !habitsLoading && !completionsLoading
          ? "-mt-3 flex-1"
          : "-mt-3 pb-32"
      }
    >
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
            "Stay Consistent",
          ]}
          // ponytail: concise habit empty-state copy
          description="Build routines with simple daily tracking."
          buttonText="Add Habit"
          onButtonPress={() =>
            router.push("/tabs/screens/habits-modal/add" as never)
          }
          buttonIcon={Add01Icon}
        />
      ) : (
        <>
          {/* Category Sections — 32pt gap between sections, compact within */}
          {activeCategories.map((category, i) => (
            <View key={category} className={i > 0 ? "mt-8" : ""}>
              {/* Section header — quiet, small, uppercase label */}
              <View className="mb-1 px-5">
                <Text className="text-xs uppercase tracking-wider text-ink-soft happy-font-body-bold">
                  {TIME_CATEGORY_CONFIG[category].label}
                </Text>
              </View>

              {/* Habits — compact rhythm within section */}
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

          {/* Add Habit — quiet final row, full row tappable */}
          <Pressable
            onPress={handleAddHabitPress}
            className="flex-row items-center px-5 mt-8 py-3 min-h-[44px]"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            accessibilityRole="button"
            accessibilityLabel="Add a new habit"
          >
            <View className="h-9 w-9 items-center justify-center rounded-full bg-sage-50 mr-3">
              <HugeiconsIcon
                icon={Add01Icon}
                size={16}
                color={SEMANTIC_COLORS.brand.pressed}
              />
            </View>
            <Text className="happy-font-body text-[15px] text-ink-muted">
              Add Habit
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
};
