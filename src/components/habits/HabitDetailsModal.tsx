import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Modal,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useImperativeHandle } from "react";
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
import {
  Host,
  DateTimePicker as SwiftUIDateTimePicker,
} from "@expo/ui/swift-ui";
import ShortBottomModal from "@/src/components/ShortBottomModal";

interface HabitDetailsModalProps {
  habit: Habit | null;
  onSave: (
    habitId: string,
    schedulingData: HabitSchedulingData
  ) => Promise<void>;
  onToggleCompletion: (habitId: string, isCompleted: boolean) => Promise<void>;
  isCompleted: boolean;
}

export const HabitDetailsModal = forwardRef<
  BottomSheetModal,
  HabitDetailsModalProps
>((props, ref) => {
  const { habit, onSave, onToggleCompletion, isCompleted } = props;

  const [visible, setVisible] = useState(false);

  // State - Must be declared before any conditional returns
  const [timeOption, setTimeOption] = useState<TimeOption>("anytime");
  const [scheduledTime, setScheduledTime] = useState<Date>(new Date());
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>("daily");
  const [endRepeatOption, setEndRepeatOption] =
    useState<EndRepeatOption>("never");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [notes, setNotes] = useState("");

  // Modal refs
  const datePickerModalRef = useRef<BottomSheetModal>(null);

  // Modal states
  const [showRepeatModal, setShowRepeatModal] = useState(false);

  // Expose present and close methods
  useImperativeHandle(ref, () => ({
    present: () => setVisible(true),
    close: () => setVisible(false),
    dismiss: () => setVisible(false),
    snapToIndex: () => {},
    snapToPosition: () => {},
    expand: () => {},
    collapse: () => {},
    forceClose: () => setVisible(false),
  }));

  // Sync state when habit changes
  React.useEffect(() => {
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

  // Early return AFTER all hooks
  if (!habit) return null;

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
    setVisible(false);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white border-b border-gray-200 px-6 pt-4 pb-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="py-2"
                activeOpacity={0.7}
              >
                <Text className="text-base text-gray-600 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>

              <Text className="text-lg font-cormorantSemiBold text-gray-900">
                {habit.name}
              </Text>

              <TouchableOpacity
                onPress={handleSave}
                className="py-2"
                activeOpacity={0.7}
              >
                <Text className="text-base text-[#7B61FF] font-semibold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Icon Display */}
            <View className="items-center mb-6">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: habit.color + "20" }}
              >
                <Text style={{ fontSize: 32 }}>{habit.icon}</Text>
              </View>
            </View>

            {/* Time Options */}
            <View className="mb-5">
              <Text className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Time
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => handleTimeOptionChange("anytime")}
                  className={`flex-1 py-3.5 rounded-xl ${
                    timeOption === "anytime"
                      ? "bg-[#7B61FF]"
                      : "bg-white border border-gray-200"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-center font-semibold text-base ${
                      timeOption === "anytime" ? "text-white" : "text-gray-700"
                    }`}
                  >
                    Anytime
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleTimeOptionChange("at_time")}
                  className={`flex-1 py-3.5 rounded-xl ${
                    timeOption === "at_time"
                      ? "bg-[#7B61FF]"
                      : "bg-white border border-gray-200"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-center font-semibold text-base ${
                      timeOption === "at_time" ? "text-white" : "text-gray-700"
                    }`}
                  >
                    At time
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Content Card */}
            <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5">
              {/* Date Picker */}
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  datePickerModalRef.current?.present();
                }}
                className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100"
                activeOpacity={0.7}
              >
                <Text className="text-base text-gray-600 font-medium">
                  Date
                </Text>
                <Text className="text-base text-gray-900 font-semibold">
                  {format(startDate, "MMM dd, yyyy")}
                </Text>
              </TouchableOpacity>

              {/* Time Section - Only visible if "At time" is selected */}
              {timeOption === "at_time" && (
                <>
                  {/* Time Picker */}
                  <View className="border-b border-gray-100">
                    <View className="px-4 py-4">
                      <Host matchContents>
                        <SwiftUIDateTimePicker
                          onDateSelected={(date) => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light
                            );
                            setScheduledTime(new Date(date));
                          }}
                          displayedComponents={"hourAndMinute"}
                          title="Select Time"
                          initialDate={scheduledTime.toISOString()}
                          variant={"graphical"}
                        />
                      </Host>
                    </View>
                  </View>

                  {/* Duration */}
                  <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                    <Text className="text-base text-gray-600 font-medium">
                      Duration
                    </Text>
                    <Text className="text-base text-gray-900 font-semibold">
                      {durationMinutes} mins
                    </Text>
                  </View>
                </>
              )}

              {/* Repeat Pattern */}
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowRepeatModal(true);
                }}
                className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100"
                activeOpacity={0.7}
              >
                <Text className="text-base text-gray-600 font-medium">
                  Repeat
                </Text>
                <Text className="text-base text-gray-900 font-semibold capitalize">
                  {repeatPattern === "weekly"
                    ? "Weekly on Thursday"
                    : repeatPattern}
                </Text>
              </TouchableOpacity>

              {/* End Repeat */}
              <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                <Text className="text-base text-gray-600 font-medium">
                  End Repeat
                </Text>
                <Text className="text-base text-gray-900 font-semibold capitalize">
                  {endRepeatOption}
                </Text>
              </View>

              {/* Reminder Toggle */}
              <View className="flex-row items-center justify-between px-4 py-4">
                <Text className="text-base text-gray-600 font-medium">
                  Reminder
                </Text>
                <Switch
                  value={reminderEnabled}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setReminderEnabled(value);
                  }}
                  trackColor={{ false: "#E5E7EB", true: "#7B61FF" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Description Section */}
            {habit.description && (
              <View className="mb-5">
                <Text className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  Description
                </Text>
                <View className="bg-white rounded-2xl p-4 border border-gray-200">
                  <Text className="text-base text-gray-700 leading-6">
                    {habit.description}
                  </Text>
                </View>
              </View>
            )}

            {/* Notes */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Notes
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this habit..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-white rounded-2xl p-4 text-base text-gray-900 border border-gray-200 min-h-[100px]"
              />
            </View>

            {/* Complete Button */}
            <TouchableOpacity
              onPress={() => {
                onToggleCompletion(habit.id, isCompleted);
                setVisible(false);
              }}
              className={`py-4 rounded-2xl mb-8 ${
                isCompleted
                  ? "bg-white border-2 border-gray-300"
                  : "bg-[#7B61FF]"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-center font-bold text-base ${
                  isCompleted ? "text-gray-700" : "text-white"
                }`}
              >
                {isCompleted ? "Mark Incomplete" : "✓ Complete Habit"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Date Picker Bottom Sheet Modal */}
      <ShortBottomModal ref={datePickerModalRef} snapPoints={["50%"]}>
        <View className="flex-1 px-6 pt-4 pb-6">
          <Text className="text-xl font-cormorantSemiBold text-gray-900 mb-4">
            Select Date
          </Text>
          <View>
            <Host matchContents>
              <SwiftUIDateTimePicker
                onDateSelected={(date) => {
                  setStartDate(new Date(date));
                  datePickerModalRef.current?.close();
                }}
                displayedComponents={"date"}
                title="Select Date"
                initialDate={startDate.toISOString()}
                variant={"graphical"}
              />
            </Host>
          </View>
        </View>
      </ShortBottomModal>

      {/* Repeat Options Modal */}
      <RepeatOptionsModal
        visible={showRepeatModal}
        selectedPattern={repeatPattern}
        onSelect={setRepeatPattern}
        onClose={() => setShowRepeatModal(false)}
      />
    </>
  );
});

HabitDetailsModal.displayName = "HabitDetailsModal";
