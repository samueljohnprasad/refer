/**
 * Habit Details Screen (inside habits-modal)
 *
 * Receives `habitId` as a URL param and loads the habit from
 * the shared useHabits hook. Same settings-row layout as before,
 * sliding smoothly inside the habits modal stack.
 */

import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { format, isFuture } from "date-fns";
import { useCSSVariable } from "uniwind";

import {
  HabitDetailsContent,
  type HabitDetailsFormActions,
  type HabitDetailsFormValues,
} from "@/src/components/habits/HabitDetailsContent";
import { useHabits } from "@/hooks/data/useHabits";
import { useHabitCompletions } from "@/hooks/data/useHabitCompletions";
import { useHabitStreaks } from "@/src/hooks/data/useHabitStreaks";
import { NEUTRAL } from "@/src/theme/palette";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import type {
  EndRepeatOption,
  Habit,
  HabitSchedulingData,
  RepeatPattern,
  TimeOption,
} from "@/src/types/habits";
import { handleHabitUpdated } from "@/src/utils/habitNotificationHandlers";

// ─── Component ──────────────────────────────────────────────────────

export default function HabitDetailsScreen(): React.JSX.Element | null {
  const { habitId, selectedDate: selectedDateStr } = useLocalSearchParams<{
    habitId: string;
    selectedDate?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const appBackground = useCSSVariable("--app-background") as string;

  const selectedDate = selectedDateStr ? new Date(selectedDateStr) : new Date();

  const { habits, updateHabit, deleteHabit } = useHabits();
  const { toggleHabitCompletion, getHabitsWithStatus } =
    useHabitCompletions(selectedDate);
  const { refetchStreaks } = useHabitStreaks();

  const habit: Habit | undefined = habits.find((h) => h.id === habitId);
  const habitsWithStatus = getHabitsWithStatus(habits);
  const habitWithStatus = habitsWithStatus.find((h) => h.id === habitId);
  const isCompleted = habitWithStatus?.isCompleted ?? false;

  const [timeOption, setTimeOption] = useState<TimeOption>("anytime");
  const [scheduledTime, setScheduledTime] = useState<Date>(new Date());
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>("daily");
  const [endRepeatOption, setEndRepeatOption] =
    useState<EndRepeatOption>("never");
  const [endRepeatDate, setEndRepeatDate] = useState<Date>(new Date());
  const [endRepeatCount, setEndRepeatCount] = useState<number>(10);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (endRepeatDate < startDate) {
      setEndRepeatDate(startDate);
    }
  }, [startDate, endRepeatDate]);

  useEffect(() => {
    if (habit) {
      setTimeOption(habit.timeOption || "anytime");
      setDurationMinutes(habit.durationMinutes || 30);
      setStartDate(new Date(habit.startDate || new Date()));
      setRepeatPattern(habit.repeatPattern || "daily");
      setEndRepeatOption(habit.endRepeatOption || "never");
      setEndRepeatDate(
        habit.endRepeatDate ? new Date(habit.endRepeatDate) : new Date(),
      );
      setEndRepeatCount(habit.endRepeatCount || 10);
      setReminderEnabled(habit.reminderEnabled ?? true);
      setNotes(habit.notes || "");

      if (habit.scheduledTime) {
        const [hours, minutes] = habit.scheduledTime.split(":");
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        setScheduledTime(date);
      } else {
        setScheduledTime(new Date());
      }
    }
  }, [habit]);

  if (!habit) return null;

  const handleSave = async (): Promise<void> => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const schedulingData: HabitSchedulingData = {
      timeOption,
      scheduledTime:
        timeOption === "at_time" ? format(scheduledTime, "HH:mm") : undefined,
      durationMinutes: timeOption === "at_time" ? durationMinutes : undefined,
      startDate: format(startDate, "yyyy-MM-dd"),
      repeatPattern,
      repeatDays: repeatPattern === "weekly" ? [4] : undefined,
      endRepeatOption,
      endRepeatDate:
        endRepeatOption === "on_date"
          ? format(endRepeatDate, "yyyy-MM-dd")
          : undefined,
      endRepeatCount:
        endRepeatOption === "after_count" ? endRepeatCount : undefined,
      reminderEnabled,
      reminderTime: reminderEnabled
        ? format(scheduledTime, "HH:mm")
        : undefined,
      notes: notes.trim() || undefined,
    };

    await updateHabit(habit.id, { ...schedulingData });

    await handleHabitUpdated({ ...habit, ...schedulingData });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handleToggle = async (): Promise<void> => {
    if (isFuture(selectedDate)) {
      Alert.alert(
        "Cannot complete habit",
        "You cannot mark habits as complete for future dates.",
      );
      return;
    }
    await toggleHabitCompletion(habit.id, isCompleted, habit.name);
    refetchStreaks();
    router.back();
  };

  const handleDelete = async (): Promise<void> => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await deleteHabit(habit.id);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const paddingBottom: number = Math.max(insets.bottom, 24) + 8;
  const values: HabitDetailsFormValues = {
    timeOption,
    scheduledTime,
    durationMinutes,
    startDate,
    repeatPattern,
    endRepeatOption,
    endRepeatDate,
    endRepeatCount,
    reminderEnabled,
    notes,
  };
  const actions: HabitDetailsFormActions = {
    setTimeOption,
    setScheduledTime,
    setDurationMinutes,
    setStartDate,
    setRepeatPattern,
    setEndRepeatOption,
    setEndRepeatDate,
    setEndRepeatCount,
    setReminderEnabled,
    setNotes,
    save: () => void handleSave(),
    toggleCompletion: () => void handleToggle(),
    delete: () => void handleDelete(),
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: habit.name,
          headerTitleStyle: {
            color: NEUTRAL.inkSoft,
            fontFamily: APP_FONT_FAMILIES.semiBold,
            fontSize: 16,
          },
        }}
      />
      <HabitDetailsContent
        habit={habit}
        isCompleted={isCompleted}
        backgroundColor={appBackground || NEUTRAL.offWhite}
        paddingBottom={paddingBottom}
        values={values}
        actions={actions}
      />
    </>
  );
}
