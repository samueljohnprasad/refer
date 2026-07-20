/**
 * Habit Details Screen (inside habits-modal)
 *
 * Receives `habitId` as a URL param and loads the habit from
 * the shared useHabits hook. Same settings-row layout as before,
 * sliding smoothly inside the habits modal stack.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text as RNText,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Host,
  Picker,
  Text as SwiftUIText,
} from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Habit,
  HabitSchedulingData,
  TimeOption,
  RepeatPattern,
  EndRepeatOption,
} from "@/src/types/habits";
import * as Haptics from "expo-haptics";
import { formatTime } from "@/src/utils/dateUtils";
import { HabitIcon } from "@/src/utils/habitIconMapper";
import { format } from "date-fns";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import {
  SettingsToggleRow,
  SettingsPickerRow,
  SettingsDateRow,
  SectionDivider,
} from "@/src/components/habits/SettingsRow";
import { useHabits } from "@/hooks/data/useHabits";
import { useHabitCompletions } from "@/hooks/data/useHabitCompletions";
import { useHabitStreaks } from "@/src/hooks/data/useHabitStreaks";
import {
  handleHabitUpdated,
  handleHabitDeleted,
} from "@/src/utils/habitNotificationHandlers";
import { isFuture } from "date-fns";
import { useCSSVariable } from "uniwind";

// ─── Option Data ────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { value: "5", label: "5 mins" },
  { value: "10", label: "10 mins" },
  { value: "15", label: "15 mins" },
  { value: "30", label: "30 mins" },
  { value: "45", label: "45 mins" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

const REPEAT_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const END_REPEAT_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "on_date", label: "On Date" },
  { value: "after_count", label: "After Count" },
];

const COUNT_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1} ${i === 0 ? "time" : "times"}`,
}));

// ─── Component ──────────────────────────────────────────────────────

export default function HabitDetailsScreen(): React.JSX.Element | null {
  const { habitId, selectedDate: selectedDateStr } =
    useLocalSearchParams<{ habitId: string; selectedDate?: string }>();
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

  // ── Local state ─────────────────────────────────────────────────
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

  // Keep end date ≥ start date
  useEffect(() => {
    if (endRepeatDate < startDate) {
      setEndRepeatDate(startDate);
    }
  }, [startDate, endRepeatDate]);

  // Sync from habit
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

  // ── Handlers ────────────────────────────────────────────────────

  const handleSave = async (): Promise<void> => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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

    await updateHabit(habit.id, schedulingData);

    await handleHabitUpdated({ ...habit, ...schedulingData });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await deleteHabit(habit.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const paddingBottom: number = Math.max(insets.bottom, 24) + 8;

  // ── Render ──────────────────────────────────────────────────────

  return (
    <>
      <Stack.Screen
        options={{
          title: habit.name,
        }}
      />

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: appBackground || "#F8FAF8" }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: paddingBottom + 80,
          paddingTop: 16,
        }}
      >
        {/* ─── Header ──────────────────────────── */}
        <View className="items-center py-6 w-full">
          <View className="mb-3">
            <HabitIcon icon={habit.icon} size={48} />
          </View>
          <Text className="text-[22px] font-bold text-center text-black tracking-tight">
            {habit.name}
          </Text>
          {habit.description && (
            <Text className="text-[15px] text-gray-500 text-center mt-1 px-8">
              {habit.description}
            </Text>
          )}
        </View>

        {/* ─── Time Segment ────────────────────── */}
        <View className="mb-4 h-[32px] items-center mx-5">
          <Host matchContents>
            <Picker
              selection={timeOption}
              onSelectionChange={(sel: string) => {
                Haptics.selectionAsync();
                setTimeOption(sel as TimeOption);
              }}
              modifiers={[pickerStyle("segmented")]}
            >
              <SwiftUIText modifiers={[tag("anytime")]}>Anytime</SwiftUIText>
              <SwiftUIText modifiers={[tag("at_time")]}>At time</SwiftUIText>
            </Picker>
          </Host>
        </View>

        {/* ─── Schedule Section ────────────────── */}
        <View className="bg-white rounded-[10px] mx-4 overflow-hidden mb-6">
          <SettingsDateRow
            label="Date"
            selection={startDate}
            onDateChange={(date: Date) => {
              Haptics.selectionAsync();
              setStartDate(date);
            }}
            displayedComponents={["date"]}
          />
          <SectionDivider />

          {timeOption === "at_time" && (
            <>
              <SettingsDateRow
                label="Time"
                selection={scheduledTime}
                onDateChange={(date: Date) => {
                  Haptics.selectionAsync();
                  setScheduledTime(date);
                }}
                displayedComponents={["hourAndMinute"]}
              />
              <SectionDivider />

              <SettingsPickerRow
                label="Duration"
                selection={durationMinutes.toString()}
                options={DURATION_OPTIONS}
                onSelectionChange={(val: string) => {
                  Haptics.selectionAsync();
                  setDurationMinutes(parseInt(val, 10));
                }}
              />
              <SectionDivider />
            </>
          )}

          <SettingsPickerRow
            label="Repeat"
            selection={repeatPattern}
            options={REPEAT_OPTIONS}
            onSelectionChange={(val: string) => {
              Haptics.selectionAsync();
              setRepeatPattern(val as RepeatPattern);
            }}
          />
          <SectionDivider />

          <SettingsPickerRow
            label="End Repeat"
            selection={endRepeatOption}
            options={END_REPEAT_OPTIONS}
            onSelectionChange={(val: string) => {
              Haptics.selectionAsync();
              setEndRepeatOption(val as EndRepeatOption);
            }}
          />

          {endRepeatOption === "on_date" && (
            <>
              <SectionDivider />
              <SettingsDateRow
                label="End Date"
                selection={endRepeatDate}
                onDateChange={(date: Date) => {
                  Haptics.selectionAsync();
                  setEndRepeatDate(date);
                }}
                displayedComponents={["date"]}
                range={{ start: startDate }}
                style="wheel"
              />
            </>
          )}

          {endRepeatOption === "after_count" && (
            <>
              <SectionDivider />
              <SettingsPickerRow
                label="After"
                selection={endRepeatCount.toString()}
                options={COUNT_OPTIONS}
                onSelectionChange={(val: string) => {
                  Haptics.selectionAsync();
                  setEndRepeatCount(parseInt(val, 10));
                }}
              />
            </>
          )}
        </View>

        {/* ─── Reminder ────────────────────────── */}
        <View className="bg-white rounded-[10px] mx-4 overflow-hidden mb-6">
          <SettingsToggleRow
            label="Reminder"
            value={reminderEnabled}
            onValueChange={(val: boolean) => {
              Haptics.selectionAsync();
              setReminderEnabled(val);
            }}
          />
        </View>

        {/* ─── Notes ───────────────────────────── */}
        <View className="mx-4 mb-8">
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this habit..."
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-white rounded-[10px] p-4 text-[17px] leading-6 text-black min-h-[100px]"
          />
        </View>

        {/* ─── Actions ─────────────────────────── */}
        <View className="gap-3 mb-6 mx-4">
          <Button
            label="Save Changes"
            variant="primary"
            size="lg"
            onPress={handleSave}
          />
          <Button
            label={isCompleted ? "Mark Incomplete" : "✓ Complete Habit"}
            variant="ghost"
            size="lg"
            onPress={handleToggle}
          />
        </View>

        {/* ─── Delete ──────────────────────────── */}
        <PressableScale onPress={handleDelete}>
          <View className="bg-white rounded-[10px] py-3.5 mx-4 items-center justify-center">
            <Text className="text-[17px] text-red-500 font-semibold">
              Delete Habit
            </Text>
          </View>
        </PressableScale>
      </ScrollView>
    </>
  );
}
