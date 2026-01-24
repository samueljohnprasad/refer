import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { View, Text, TouchableOpacity, TextInput, Switch } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
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

export const HabitDetailsModal = forwardRef<
  BottomSheetModal,
  HabitDetailsModalProps
>((props, ref) => {
  const { habit, onSave, onToggleCompletion, onDelete, isCompleted } = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);

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

  // Snap points
  const snapPoints = useMemo(() => ["90%"], []);

  // Expose present and close methods
  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    close: () => bottomSheetRef.current?.dismiss(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
    snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
    snapToPosition: (position: string | number) =>
      bottomSheetRef.current?.snapToPosition(position),
    expand: () => bottomSheetRef.current?.expand(),
    collapse: () => bottomSheetRef.current?.collapse(),
    forceClose: () => bottomSheetRef.current?.forceClose(),
  }));

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

  // Render backdrop
  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleTimeOptionChange = (option: TimeOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeOption(option);
  };

  const handleSave = async () => {
    if (!habit) return;

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
    bottomSheetRef.current?.dismiss();
  };

  const handleToggle = async () => {
    if (!habit) return;
    await onToggleCompletion(habit.id, isCompleted, habit.name);
    bottomSheetRef.current?.dismiss();
  };

  // Early return AFTER all hooks
  if (!habit) return null;

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#F8F8FF" }}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
      >
        {/* Header */}
        <View className="items-center px-6 pt-2 pb-4 border-b border-gray-100 bg-white">
          <View
            className="w-14 h-14 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: habit.color + "20" }}
          >
            <Text style={{ fontSize: 28 }}>{habit.icon}</Text>
          </View>
          <Text className="text-xl font-cormorantSemiBold text-gray-900">
            {habit.name}
          </Text>
          {habit.description && (
            <Text className="text-sm text-gray-500 mt-1 text-center">
              {habit.description}
            </Text>
          )}
        </View>

        <BottomSheetScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Time Options */}
          <View className="mt-5 mb-4">
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

          {/* Settings Card */}
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
              <Text className="text-base text-gray-600 font-medium">Date</Text>
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
                            Haptics.ImpactFeedbackStyle.Light,
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

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={handleToggle}
              className={`flex-1 py-4 rounded-2xl ${
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
                {isCompleted ? "Mark Incomplete" : "✓ Complete"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-gray-900 py-4 rounded-2xl"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-base">
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={async () => {
              if (!habit) return;
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning,
              );
              await onDelete(habit.id);
              bottomSheetRef.current?.dismiss();
            }}
            className="py-3 mb-6"
            activeOpacity={0.7}
          >
            <Text className="text-center text-red-500 font-semibold text-base">
              Delete Habit
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheetModal>

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
