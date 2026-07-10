import React, { useState, useEffect } from "react";
import { View, TextInput, Switch, ScrollView, Text as RNText } from "react-native";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
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
import { DatePicker as SwiftUIDateTimePicker } from "@expo/ui/swift-ui";
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleTimeOptionChange = (option: TimeOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
              <View
                style={{ paddingBottom }}
                className="flex-1 px-5 pt-6 bg-brand-surface"
              >
                {/* Header info */}
                <View className="items-center pb-4 border-b border-sage-100 w-full">
                  <View className="w-14 h-14 rounded-[20px] bg-sage-50 border border-sage-100 items-center justify-center mb-2">
                    <RNText style={{ fontSize: 28 }}>{habit.icon}</RNText>
                  </View>
                  <Text
                    variant="body-bold"
                    className="text-2xl text-center leading-8"
                  >
                    {habit.name}
                  </Text>
                  {habit.description && (
                    <Text
                      variant="body"
                      className="text-ink-soft text-center mt-1"
                    >
                      {habit.description}
                    </Text>
                  )}
                </View>

                <ScrollView
                  className="flex-1 mt-4"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: paddingBottom + 40 }}
                >
                  {/* Time Segment Options */}
                  <View className="mb-4">
                    <Text
                      variant="label"
                      className="happy-brand-eyebrow mb-2 text-ink-soft"
                    >
                      TIME
                    </Text>
                    <View className="flex-row rounded-full bg-sage-50 border border-sage-100 p-1">
                      <PressableScale
                        onPress={() => handleTimeOptionChange("anytime")}
                        className={`flex-1 rounded-full py-2.5 items-center justify-center ${
                          timeOption === "anytime"
                            ? "bg-white shadow-sm border border-black/5"
                            : ""
                        }`}
                      >
                        <Text
                          className={`happy-font-body-bold text-[15px] ${
                            timeOption === "anytime"
                              ? "text-ink"
                              : "text-ink-soft"
                          }`}
                        >
                          Anytime
                        </Text>
                      </PressableScale>

                      <PressableScale
                        onPress={() => handleTimeOptionChange("at_time")}
                        className={`flex-1 rounded-full py-2.5 items-center justify-center ${
                          timeOption === "at_time"
                            ? "bg-white shadow-sm border border-black/5"
                            : ""
                        }`}
                      >
                        <Text
                          className={`happy-font-body-bold text-[15px] ${
                            timeOption === "at_time"
                              ? "text-ink"
                              : "text-ink-soft"
                          }`}
                        >
                          At time
                        </Text>
                      </PressableScale>
                    </View>
                  </View>

                  {/* Settings Card */}
                  <Card variant="tile" radius="xl" showDepth={false} className="mb-5">
                    <View className="divide-y divide-sage-100/50">
                      {/* Date Picker Trigger */}
                      <PressableScale
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setShowDatePickerSheet(true);
                        }}
                      >
                        <View className="flex-row items-center justify-between px-4 py-4 w-full">
                          <Text className="happy-font-body-medium text-base text-ink-soft">
                            Date
                          </Text>
                          <Text className="happy-font-body-bold text-base text-ink">
                            {format(startDate, "MMM dd, yyyy")}
                          </Text>
                        </View>
                      </PressableScale>

                      {/* Time and Duration Sub-fields if At Time is active */}
                      {timeOption === "at_time" && (
                        <>
                          <View className="px-4 py-3 bg-brand-surface-soft/40">
                            <Host matchContents>
                              <SwiftUIDateTimePicker
                                onDateChange={(date: Date) => {
                                  Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Light,
                                  );
                                  setScheduledTime(date);
                                }}
                                displayedComponents={["hourAndMinute"]}
                                title="Select Time"
                                selection={scheduledTime}
                              />
                            </Host>
                          </View>

                          <View className="flex-row items-center justify-between px-4 py-4">
                            <Text className="happy-font-body-medium text-base text-ink-soft">
                              Duration
                            </Text>
                            <Text className="happy-font-body-bold text-base text-ink">
                              {durationMinutes} mins
                            </Text>
                          </View>
                        </>
                      )}

                      {/* Repeat Trigger */}
                      <PressableScale
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setShowRepeatModal(true);
                        }}
                      >
                        <View className="flex-row items-center justify-between px-4 py-4 w-full">
                          <Text className="happy-font-body-medium text-base text-ink-soft">
                            Repeat
                          </Text>
                          <Text className="happy-font-body-bold text-base text-ink capitalize">
                            {repeatPattern === "weekly"
                              ? "Weekly on Thursday"
                              : repeatPattern}
                          </Text>
                        </View>
                      </PressableScale>

                      {/* End Repeat */}
                      <View className="flex-row items-center justify-between px-4 py-4">
                        <Text className="happy-font-body-medium text-base text-ink-soft">
                          End Repeat
                        </Text>
                        <Text className="happy-font-body-bold text-base text-ink capitalize">
                          {endRepeatOption}
                        </Text>
                      </View>

                      {/* Reminder Switch */}
                      <View className="flex-row items-center justify-between px-4 py-4">
                        <Text className="happy-font-body-medium text-base text-ink-soft">
                          Reminder
                        </Text>
                        <Switch
                          value={reminderEnabled}
                          onValueChange={(value) => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setReminderEnabled(value);
                          }}
                          trackColor={{ false: "#E5E7EB", true: SAGE[500] }}
                          thumbColor="#FFFFFF"
                        />
                      </View>
                    </View>
                  </Card>

                  {/* Notes Section */}
                  <View className="mb-6">
                    <Text
                      variant="label"
                      className="happy-brand-eyebrow mb-2 text-ink-soft"
                    >
                      NOTES
                    </Text>
                    <TextInput
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="Add notes about this habit..."
                      placeholderTextColor={INK_MUTED}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      className="happy-font-body-medium rounded-[22px] border border-sage-100 bg-brand-surface-soft p-4 text-base leading-6 text-ink min-h-[96px]"
                    />
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-3 mb-2">
                    <View className="flex-1">
                      <Button
                        label={isCompleted ? "Mark Incomplete" : "✓ Complete"}
                        variant={isCompleted ? "secondary" : "primary"}
                        size="lg"
                        onPress={handleToggle}
                      />
                    </View>
                    <View className="flex-1">
                      <Button
                        label="Save"
                        variant="primary"
                        size="lg"
                        onPress={handleSave}
                      />
                    </View>
                  </View>

                  {/* Delete Button */}
                  <View className="mt-2 w-full">
                    <Button
                      label="Delete Habit"
                      variant="danger"
                      size="lg"
                      onPress={async () => {
                        Haptics.notificationAsync(
                          Haptics.NotificationFeedbackType.Warning,
                        );
                        await onDelete(habit.id);
                        onClose();
                      }}
                    />
                  </View>
                </ScrollView>
              </View>
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
