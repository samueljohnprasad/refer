/**
 * HabitDetailsModal
 *
 * iOS-native settings-style bottom sheet for viewing / editing a habit's
 * scheduling details.  Uses the shared SettingsRow primitives for a
 * consistent, flat-list layout — modeled after the grok-voice-demo
 * (settings) screens.
 */

import React, { useState, useEffect } from "react";
import { View, TextInput, ScrollView, Text as RNText } from "react-native";
import { Host, BottomSheet, Group, RNHostView, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Habit,
  HabitSchedulingData,
  TimeOption,
  RepeatPattern,
  EndRepeatOption,
} from "@/src/types/habits";
import * as Haptics from "expo-haptics";
import { format } from "date-fns";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import {
  SettingsToggleRow,
  SettingsPickerRow,
  SettingsDateRow,
  SectionDivider,
} from "./SettingsRow";

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

// ─── Props ──────────────────────────────────────────────────────────

interface HabitDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  habit: Habit | null;
  onSave: (
    habitId: string,
    schedulingData: HabitSchedulingData,
  ) => Promise<void>;
  onToggleCompletion: (
    habitId: string,
    isCompleted: boolean,
    habitName: string,
  ) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
  isCompleted: boolean;
}

// ─── Component ──────────────────────────────────────────────────────

export const HabitDetailsModal: React.FC<HabitDetailsModalProps> = ({
  visible,
  onClose,
  habit,
  onSave,
  onToggleCompletion,
  onDelete,
  isCompleted,
}) => {
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

  const insets = useSafeAreaInsets();

  // Keep end date ≥ start date
  useEffect(() => {
    if (endRepeatDate < startDate) {
      setEndRepeatDate(startDate);
    }
  }, [startDate, endRepeatDate]);

  // Sync when habit prop changes
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

  const handleClose = (): void => {
    Haptics.selectionAsync();
    onClose();
  };

  const handleTimeOptionChange = (option: TimeOption): void => {
    Haptics.selectionAsync();
    setTimeOption(option);
  };

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

    await onSave(habit.id, schedulingData);
    onClose();
  };

  const handleToggle = async (): Promise<void> => {
    await onToggleCompletion(habit.id, isCompleted, habit.name);
    onClose();
  };

  const paddingBottom: number = Math.max(insets.bottom, 24) + 8;

  // ── Render ──────────────────────────────────────────────────────

  return (
    <>
      <Host>
        <BottomSheet
          isPresented={visible}
          onIsPresentedChange={(val) => {
            if (!val) handleClose();
          }}
        >
          <Group
            modifiers={[
              presentationDetents(["large"]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1 bg-[#F2F2F7]">
                <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: paddingBottom + 80,
                    paddingTop: 24,
                  }}
                >
                  {/* ─── Header ──────────────────────────── */}
                  <View className="items-center pb-6 w-full">
                    <View className="mb-3">
                      <RNText style={{ fontSize: 48 }}>
                        {habit.icon || "✨"}
                      </RNText>
                    </View>
                    <Text className="text-[22px] font-bold text-center text-black tracking-tight">
                      {habit.name}
                    </Text>
                    {habit.description && (
                      <Text className="text-[15px] text-gray-500 text-center mt-1">
                        {habit.description}
                      </Text>
                    )}
                  </View>

                  {/* ─── Time Segment ────────────────────── */}
                  <View className="mb-4 h-[32px] items-center mx-5">
                    <Host matchContents>
                      <Picker
                        selection={timeOption}
                        onSelectionChange={(sel: string) =>
                          handleTimeOptionChange(sel as TimeOption)
                        }
                        modifiers={[pickerStyle("segmented")]}
                      >
                        <SwiftUIText modifiers={[tag("anytime")]}>
                          Anytime
                        </SwiftUIText>
                        <SwiftUIText modifiers={[tag("at_time")]}>
                          At time
                        </SwiftUIText>
                      </Picker>
                    </Host>
                  </View>

                  {/* ─── Schedule Section ────────────────── */}
                  <View className="bg-white rounded-[10px] mx-4 overflow-hidden mb-6">
                    {/* Start Date */}
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

                    {/* Time & Duration — only when "At time" */}
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

                    {/* Repeat */}
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

                    {/* End Repeat */}
                    <SettingsPickerRow
                      label="End Repeat"
                      selection={endRepeatOption}
                      options={END_REPEAT_OPTIONS}
                      onSelectionChange={(val: string) => {
                        Haptics.selectionAsync();
                        setEndRepeatOption(val as EndRepeatOption);
                      }}
                    />

                    {/* On Date sub-field */}
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

                    {/* After Count sub-field */}
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

                  {/* ─── Reminder Section ────────────────── */}
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
                      label={
                        isCompleted ? "Mark Incomplete" : "✓ Complete Habit"
                      }
                      variant="ghost"
                      size="lg"
                      onPress={handleToggle}
                    />
                  </View>

                  {/* ─── Delete ──────────────────────────── */}
                  <PressableScale
                    onPress={async () => {
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Warning,
                      );
                      await onDelete(habit.id);
                      onClose();
                    }}
                  >
                    <View className="bg-white rounded-[10px] py-3.5 mx-4 items-center justify-center">
                      <Text className="text-[17px] text-red-500 font-semibold">
                        Delete Habit
                      </Text>
                    </View>
                  </PressableScale>
                </ScrollView>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </>
  );
};
