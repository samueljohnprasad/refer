import { ScrollView, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";

import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { HabitIcon } from "@/src/utils/habitIconMapper";
import { NEUTRAL } from "@/src/theme/palette";
import type {
  EndRepeatOption,
  Habit,
  RepeatPattern,
  TimeOption,
} from "@/src/types/habits";
import {
  SectionDivider,
  SettingsDateRow,
  SettingsPickerRow,
  SettingsToggleRow,
} from "./SettingsRow";

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

const COUNT_OPTIONS = Array.from({ length: 30 }, (_, index) => ({
  value: String(index + 1),
  label: `${index + 1} ${index === 0 ? "time" : "times"}`,
}));

export interface HabitDetailsFormValues {
  timeOption: TimeOption;
  scheduledTime: Date;
  durationMinutes: number;
  startDate: Date;
  repeatPattern: RepeatPattern;
  endRepeatOption: EndRepeatOption;
  endRepeatDate: Date;
  endRepeatCount: number;
  reminderEnabled: boolean;
  notes: string;
}

export interface HabitDetailsFormActions {
  setTimeOption: (value: TimeOption) => void;
  setScheduledTime: (value: Date) => void;
  setDurationMinutes: (value: number) => void;
  setStartDate: (value: Date) => void;
  setRepeatPattern: (value: RepeatPattern) => void;
  setEndRepeatOption: (value: EndRepeatOption) => void;
  setEndRepeatDate: (value: Date) => void;
  setEndRepeatCount: (value: number) => void;
  setReminderEnabled: (value: boolean) => void;
  setNotes: (value: string) => void;
  save: () => void;
  toggleCompletion: () => void;
  delete: () => void;
}

interface HabitDetailsContentProps {
  habit: Habit;
  isCompleted: boolean;
  backgroundColor: string;
  paddingBottom: number;
  values: HabitDetailsFormValues;
  actions: HabitDetailsFormActions;
}

export function HabitDetailsContent({
  habit,
  isCompleted,
  backgroundColor,
  paddingBottom,
  values,
  actions,
}: HabitDetailsContentProps): React.JSX.Element {
  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: paddingBottom + 80,
        paddingTop: 8,
      }}
    >
      <View className="w-full items-center py-3">
        <View className="mb-2">
          <HabitIcon icon={habit.icon} size={42} />
        </View>
        <Text className="text-center text-[22px] tracking-tight text-ink happy-font-heading-bold">
          {habit.name}
        </Text>
        {habit.description ? (
          <Text className="mt-1 px-8 text-center text-[14px] text-ink-soft happy-font-body">
            {habit.description}
          </Text>
        ) : null}
      </View>

      <View className="mx-5 mb-3 h-[32px] items-center">
        <Host matchContents>
          <Picker
            selection={values.timeOption}
            onSelectionChange={(selection: string) => {
              void Haptics.selectionAsync();
              actions.setTimeOption(selection as TimeOption);
            }}
            modifiers={[pickerStyle("segmented")]}
          >
            <SwiftUIText modifiers={[tag("anytime")]}>Anytime</SwiftUIText>
            <SwiftUIText modifiers={[tag("at_time")]}>At time</SwiftUIText>
          </Picker>
        </Host>
      </View>

      <View className="mx-4 mb-4 overflow-hidden rounded-[10px] bg-white">
        <SettingsDateRow
          label="Date"
          selection={values.startDate}
          onDateChange={(date) => selectDate(date, actions.setStartDate)}
          displayedComponents={["date"]}
        />
        <SectionDivider />

        {values.timeOption === "at_time" ? (
          <>
            <SettingsDateRow
              label="Time"
              selection={values.scheduledTime}
              onDateChange={(date) =>
                selectDate(date, actions.setScheduledTime)
              }
              displayedComponents={["hourAndMinute"]}
            />
            <SectionDivider />
            <SettingsPickerRow
              label="Duration"
              selection={String(values.durationMinutes)}
              options={DURATION_OPTIONS}
              onSelectionChange={(selection) => {
                void Haptics.selectionAsync();
                actions.setDurationMinutes(Number.parseInt(selection, 10));
              }}
            />
            <SectionDivider />
          </>
        ) : null}

        <SettingsPickerRow
          label="Repeat"
          selection={values.repeatPattern}
          options={REPEAT_OPTIONS}
          onSelectionChange={(selection) => {
            void Haptics.selectionAsync();
            actions.setRepeatPattern(selection as RepeatPattern);
          }}
        />
        <SectionDivider />
        <SettingsPickerRow
          label="End Repeat"
          selection={values.endRepeatOption}
          options={END_REPEAT_OPTIONS}
          onSelectionChange={(selection) => {
            void Haptics.selectionAsync();
            actions.setEndRepeatOption(selection as EndRepeatOption);
          }}
        />

        {values.endRepeatOption === "on_date" ? (
          <>
            <SectionDivider />
            <SettingsDateRow
              label="End Date"
              selection={values.endRepeatDate}
              onDateChange={(date) =>
                selectDate(date, actions.setEndRepeatDate)
              }
              displayedComponents={["date"]}
              range={{ start: values.startDate }}
              style="wheel"
            />
          </>
        ) : null}

        {values.endRepeatOption === "after_count" ? (
          <>
            <SectionDivider />
            <SettingsPickerRow
              label="After"
              selection={String(values.endRepeatCount)}
              options={COUNT_OPTIONS}
              onSelectionChange={(selection) => {
                void Haptics.selectionAsync();
                actions.setEndRepeatCount(Number.parseInt(selection, 10));
              }}
            />
          </>
        ) : null}
      </View>

      <View className="mx-4 mb-4 overflow-hidden rounded-[10px] bg-white">
        <SettingsToggleRow
          label="Reminder"
          value={values.reminderEnabled}
          onValueChange={(value) => {
            void Haptics.selectionAsync();
            actions.setReminderEnabled(value);
          }}
        />
      </View>

      <View className="mx-4 mb-4">
        <TextInput
          value={values.notes}
          onChangeText={actions.setNotes}
          placeholder="Add notes about this habit..."
          placeholderTextColor={NEUTRAL.inkSoft}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="min-h-[100px] rounded-[10px] bg-white p-4 text-[16px] leading-6 text-ink happy-font-body"
        />
      </View>

      <View className="mx-4 mb-5 gap-2">
        <Button
          label="Save Changes"
          variant="primary"
          size="lg"
          onPress={actions.save}
        />
        <Button
          label={isCompleted ? "Mark Incomplete" : "✓ Complete Habit"}
          variant="ghost"
          size="lg"
          onPress={actions.toggleCompletion}
        />
      </View>

      <PressableScale onPress={actions.delete}>
        <View className="mx-4 items-center justify-center rounded-[10px] bg-white py-3.5">
          <Text className="text-[17px] text-red-500 happy-font-body-semibold">
            Delete Habit
          </Text>
        </View>
      </PressableScale>
    </ScrollView>
  );
}

function selectDate(date: Date, onSelect: (date: Date) => void): void {
  void Haptics.selectionAsync();
  onSelect(date);
}
