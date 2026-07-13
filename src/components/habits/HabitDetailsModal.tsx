import React, { useState, useEffect } from "react";
import { View, TextInput, Switch, ScrollView, KeyboardAvoidingView, Platform, Text as RNText } from "react-native";
import { Host, BottomSheet, Group, RNHostView, DatePicker as SwiftUIDateTimePicker, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
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
import { RepeatOptionsModal } from "./RepeatOptionsModal";

import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { INK_MUTED, SAGE } from "@/lib/tokens";

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

export const HabitDetailsModal: React.FC<HabitDetailsModalProps> = ({
  visible,
  onClose,
  habit,
  onSave,
  onToggleCompletion,
  onDelete,
  isCompleted,
}) => {
  const [timeOption, setTimeOption] = useState<TimeOption>("anytime");
  const [scheduledTime, setScheduledTime] = useState<Date>(new Date());
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>("daily");
  const [endRepeatOption, setEndRepeatOption] =
    useState<EndRepeatOption>("never");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [notes, setNotes] = useState("");

  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [showDatePickerSheet, setShowDatePickerSheet] = useState(false);
  const insets = useSafeAreaInsets();

  // Sync state when habit changes
  useEffect(() => {
    if (habit) {
      setTimeOption(habit.timeOption || "anytime");
      setDurationMinutes(habit.durationMinutes || 30);
      setStartDate(new Date(habit.startDate || new Date()));
      setRepeatPattern(habit.repeatPattern || "daily");
      setEndRepeatOption(habit.endRepeatOption || "never");
      setReminderEnabled(habit.reminderEnabled || false);
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

  const handleClose = () => {
    Haptics.selectionAsync();
    onClose();
  };

  const handleTimeOptionChange = (option: TimeOption) => {
    Haptics.selectionAsync();
    setTimeOption(option);
  };

  const handleSave = async () => {
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
      endRepeatDate: undefined,
      endRepeatCount: undefined,
      reminderEnabled,
      reminderTime: reminderEnabled
        ? format(scheduledTime, "HH:mm")
        : undefined,
      notes: notes.trim() || undefined,
    };

    await onSave(habit.id, schedulingData);
    onClose();
  };

  const handleToggle = async () => {
    await onToggleCompletion(habit.id, isCompleted, habit.name);
    onClose();
  };

  const paddingBottom = Math.max(insets.bottom, 24) + 8;

  return (
    <>
      <Host>
        <BottomSheet
          isPresented={visible}
          onIsPresentedChange={(val) => {
            if (!val) {
              handleClose();
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents(["large"]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
              >
                <View
                  style={{ paddingBottom }}
                  className="flex-1 bg-[#F2F2F7]"
                >
                <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: paddingBottom + 40, paddingTop: 24, paddingHorizontal: 16 }}
                >
                  {/* Header info */}
                  <View className="items-center pb-8 w-full">
                    <View className="mb-3">
                      <RNText style={{ fontSize: 48 }}>{habit.icon || "✨"}</RNText>
                    </View>
                    <Text
                      className="text-[22px] font-bold text-center text-black tracking-tight"
                    >
                      {habit.name}
                    </Text>
                    {habit.description && (
                      <Text
                        className="text-[15px] text-gray-500 text-center mt-1"
                      >
                        {habit.description}
                      </Text>
                    )}
                  </View>

                  {/* Time Segment Options */}
                  <View className="mb-6 h-[32px] items-center">
                    <Host matchContents>
                      <Picker
                        selection={timeOption}
                        onSelectionChange={(selection: any) => handleTimeOptionChange(selection)}
                        modifiers={[pickerStyle("segmented")]}
                      >
                        <SwiftUIText modifiers={[tag("anytime")]}>Anytime</SwiftUIText>
                        <SwiftUIText modifiers={[tag("at_time")]}>At time</SwiftUIText>
                      </Picker>
                    </Host>
                  </View>

                  {/* Settings List */}
                  <View className="mb-6 bg-white rounded-[10px] overflow-hidden">
                      {/* Date Picker Trigger */}
                      <PressableScale
                        onPress={() => {
                          Haptics.selectionAsync();
                          setShowDatePickerSheet(true);
                        }}
                      >
                        <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100 w-full bg-white">
                          <Text className="text-[17px] text-black">
                            Date
                          </Text>
                          <Text className="text-[17px] text-gray-500">
                            {format(startDate, "MMM dd, yyyy")}
                          </Text>
                        </View>
                      </PressableScale>

                      {/* Time and Duration Sub-fields if At Time is active */}
                      {timeOption === "at_time" && (
                        <>
                          <View className="py-2 border-b border-gray-100 px-4 bg-white">
                            <Host matchContents>
                              <SwiftUIDateTimePicker
                                onDateChange={(date: Date) => {
                                  Haptics.selectionAsync();
                                  setScheduledTime(date);
                                }}
                                displayedComponents={["hourAndMinute"]}
                                title="Select Time"
                                selection={scheduledTime}
                              />
                            </Host>
                          </View>

                          <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100 bg-white">
                            <Text className="text-[17px] text-black">
                              Duration
                            </Text>
                            <Text className="text-[17px] text-gray-500">
                              {durationMinutes} mins
                            </Text>
                          </View>
                        </>
                      )}

                      {/* Repeat Trigger */}
                      <PressableScale
                        onPress={() => {
                          Haptics.selectionAsync();
                          setShowRepeatModal(true);
                        }}
                      >
                        <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100 w-full bg-white">
                          <Text className="text-[17px] text-black">
                            Repeat
                          </Text>
                          <Text className="text-[17px] text-gray-500 capitalize">
                            {repeatPattern === "weekly"
                              ? "Weekly on Thursday"
                              : repeatPattern}
                          </Text>
                        </View>
                      </PressableScale>

                      {/* End Repeat */}
                      <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100 bg-white">
                        <Text className="text-[17px] text-black">
                          End Repeat
                        </Text>
                        <Text className="text-[17px] text-gray-500 capitalize">
                          {endRepeatOption}
                        </Text>
                      </View>

                      {/* Reminder Switch */}
                      <View className="flex-row items-center justify-between py-2 px-4 bg-white">
                        <Text className="text-[17px] text-black">
                          Reminder
                        </Text>
                        <Switch
                          value={reminderEnabled}
                          onValueChange={(value) => {
                            Haptics.selectionAsync();
                            setReminderEnabled(value);
                          }}
                          trackColor={{ false: "#E5E7EB", true: "#34C759" }}
                          thumbColor="#FFFFFF"
                        />
                      </View>
                  </View>

                  {/* Notes Section */}
                  <View className="mb-8">
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

                  {/* Action Buttons */}
                  <View className="gap-3 mb-6">
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

                  {/* Delete Button */}
                  <PressableScale
                    onPress={async () => {
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Warning,
                      );
                      await onDelete(habit.id);
                      onClose();
                    }}
                  >
                    <View className="bg-white rounded-[10px] py-3.5 w-full items-center justify-center">
                      <Text className="text-[17px] text-red-500 font-semibold">Delete Habit</Text>
                    </View>
                  </PressableScale>

                </ScrollView>
              </View>
              </KeyboardAvoidingView>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>

      {/* Date Picker Sheet Modal */}
      <Host>
        <BottomSheet
          isPresented={showDatePickerSheet}
          onIsPresentedChange={(val) => {
            if (!val) {
              setShowDatePickerSheet(false);
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents([{ height: 420 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1 px-6 pt-6 pb-8 bg-brand-surface">
                <Text variant="h3" className="text-xl font-bold text-ink mb-4">
                  Select Date
                </Text>
                <View>
                  <Host matchContents>
                    <SwiftUIDateTimePicker
                      onDateChange={(date: Date) => {
                        setStartDate(date);
                        setShowDatePickerSheet(false);
                      }}
                      displayedComponents={["date"]}
                      title="Select Date"
                      selection={startDate}
                    />
                  </Host>
                </View>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>

      {/* Repeat Options Modal */}
      <RepeatOptionsModal
        visible={showRepeatModal}
        selectedPattern={repeatPattern}
        onSelect={setRepeatPattern}
        onClose={() => setShowRepeatModal(false)}
      />
    </>
  );
};
