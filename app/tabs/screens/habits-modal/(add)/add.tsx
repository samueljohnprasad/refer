/**
 * Add Habit Screen (inside habits-modal)
 *
 * Shows preset habits list + custom form, sliding smoothly inside the habits modal stack.
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text as RNText,
  Pressable,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateHabitFormData, PresetHabit } from "@/src/types/habits";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { INK_MUTED } from "@/lib/tokens";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import * as Haptics from "expo-haptics";
import { SectionDivider } from "@/src/components/habits/SettingsRow";
import { useHabits } from "@/hooks/data/useHabits";
import { handleHabitCreated } from "@/src/utils/habitNotificationHandlers";
import { useCSSVariable } from "uniwind";
import { HabitIcon } from "@/src/utils/habitIconMapper";

// ─── Presets ────────────────────────────────────────────────────────

const PRESET_HABITS: PresetHabit[] = [
  {
    name: "Drink 8 glasses of water",
    description: "Stay hydrated for better energy and focus",
    icon: "💧",
    category: "health",
  },
  {
    name: "Exercise for 30 mins",
    description: "Move your body, clear your mind",
    icon: "💪",
    category: "health",
  },
  {
    name: "Meditate",
    description: "Find your calm and center",
    icon: "🧘",
    category: "health",
  },
  {
    name: "Read for 15 mins",
    description: "Expand your mind daily",
    icon: "📚",
    category: "productivity",
  },
  {
    name: "Practice gratitude",
    description: "Appreciate the good in your life",
    icon: "❤️",
    category: "productivity",
  },
  {
    name: "Write a journal entry",
    description: "Reflect on your thoughts and feelings",
    icon: "✍️",
    category: "mindfulness",
  },
  {
    name: "Get 8 hours of sleep",
    description: "Rest is essential for recovery",
    icon: "😴",
    category: "health",
  },
  {
    name: "Go for a walk",
    description: "Fresh air and movement",
    icon: "🚶",
    category: "selfcare",
  },
];

// ─── Sub-components ─────────────────────────────────────────────────

interface PresetRowProps {
  preset: PresetHabit;
  onPress: () => void;
  disabled: boolean;
}

function PresetRow({ preset, onPress, disabled }: PresetRowProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center px-5 py-3.5 active:bg-gray-50"
      accessibilityRole="button"
      accessibilityLabel={`Add habit: ${preset.name}. ${preset.description}`}
    >
      <View className="mr-4 h-10 w-10 items-center justify-center">
        <HabitIcon icon={preset.icon} size={24} />
      </View>
      <View className="min-w-0 flex-1">
        <RNText
          className="text-[17px] font-semibold text-black mb-0.5"
          numberOfLines={1}
        >
          {preset.name}
        </RNText>
        <RNText className="text-[14px] text-gray-500" numberOfLines={2}>
          {preset.description}
        </RNText>
      </View>
    </Pressable>
  );
}

// ─── Component ──────────────────────────────────────────────────────

export default function HabitAddScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createHabit } = useHabits();
  const appBackground = useCSSVariable("--app-background") as string;

  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [habitName, setHabitName] = useState<string>("");
  const [habitDescription, setHabitDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const paddingBottom: number = Math.max(insets.bottom, 24) + 8;

  const handlePresetSelect = async (preset: PresetHabit): Promise<void> => {
    setLoading(true);
    const formData: CreateHabitFormData = {
      name: preset.name,
      description: preset.description,
      icon: preset.icon,
    };
    const created = await createHabit(formData);
    if (created) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await handleHabitCreated(created);
      setLoading(false);
      router.replace({
        pathname: "/tabs/screens/habits-modal/details",
        params: { habitId: created.id },
      } as never);
    } else {
      setLoading(false);
      router.back();
    }
  };

  const handleCustomSubmit = async (): Promise<void> => {
    if (!habitName.trim()) return;

    setLoading(true);
    const formData: CreateHabitFormData = {
      name: habitName.trim(),
      description: habitDescription.trim() || undefined,
    };
    const created = await createHabit(formData);
    if (created) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await handleHabitCreated(created);
      setLoading(false);
      setHabitName("");
      setHabitDescription("");
      setShowCustomForm(false);
      router.replace({
        pathname: "/tabs/screens/habits-modal/details",
        params: { habitId: created.id },
      } as never);
    } else {
      setLoading(false);
      router.back();
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: appBackground || "#F8FAF8" }}>
      {!showCustomForm ? (
        /* ─── Preset List ────────────────────── */
        <ScrollView
          className="flex-1"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: paddingBottom + 40 }}
        >
          <View className="bg-white rounded-[10px] mx-4 mt-4 overflow-hidden">
            {/* Create Custom Row */}
            <Pressable
              onPress={() => setShowCustomForm(true)}
              className="flex-row items-center px-5 py-3.5 active:bg-gray-50"
            >
              <View className="h-10 w-10 mr-4 items-center justify-center rounded-full bg-gray-100">
                <HugeiconsIcon icon={Add01Icon} size={20} color={INK_MUTED} />
              </View>
              <RNText className="text-[17px] font-semibold text-black">
                Create Custom Habit
              </RNText>
            </Pressable>

            {PRESET_HABITS.map((preset, index) => (
              <React.Fragment key={preset.name}>
                <SectionDivider />
                <PresetRow
                  preset={preset}
                  onPress={() => handlePresetSelect(preset)}
                  disabled={loading}
                />
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* ─── Custom Form ────────────────────── */
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={{
              paddingBottom: paddingBottom + 120,
              paddingHorizontal: 20,
              paddingTop: 16,
            }}
          >
            {/* Name */}
            <RNText className="text-[13px] font-medium text-gray-500 mb-2">
              Habit name *
            </RNText>
            <TextInput
              value={habitName}
              onChangeText={setHabitName}
              placeholder="e.g., Morning stretch routine"
              placeholderTextColor={INK_MUTED}
              maxLength={50}
              autoFocus
              returnKeyType="next"
              className="bg-white rounded-xl px-4 py-3 text-[17px] text-black mb-1"
            />
            <View className="flex-row items-center justify-between mb-6">
              <RNText className="text-[13px] text-gray-400">
                {habitName.length === 0
                  ? "Give your habit a name to get started"
                  : " "}
              </RNText>
              <RNText className="text-[13px] text-gray-400">
                {habitName.length}/50
              </RNText>
            </View>

            {/* Description */}
            <RNText className="text-[13px] font-medium text-gray-500 mb-2">
              Why is this important to you?
            </RNText>
            <TextInput
              value={habitDescription}
              onChangeText={setHabitDescription}
              placeholder="To feel more energized and focused..."
              placeholderTextColor={INK_MUTED}
              maxLength={200}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="bg-white rounded-xl px-4 py-3 text-[17px] text-black min-h-[96px] mb-1"
            />
            <View className="flex-row items-center justify-between">
              <RNText
                className="text-[13px] text-gray-400 flex-1 mr-4"
                numberOfLines={1}
              >
                {habitName.length > 0 && habitDescription.length === 0
                  ? `Why do you want to ${habitName.toLowerCase()}?`
                  : " "}
              </RNText>
              <RNText className="text-[13px] text-gray-400">
                {habitDescription.length}/200
              </RNText>
            </View>
          </ScrollView>

          {/* Action Buttons — pinned above keyboard */}
          <View
            className="flex-row gap-3 px-5 pt-2 border-t border-gray-200"
            style={{
              backgroundColor: appBackground || "#F8FAF8",
              paddingBottom: paddingBottom + 8,
            }}
          >
            <View className="flex-1">
              <Button
                label="Back"
                variant="secondary"
                size="lg"
                onPress={() => {
                  setShowCustomForm(false);
                  setHabitName("");
                  setHabitDescription("");
                }}
              />
            </View>
            <View className="flex-1">
              <Button
                label="Create Habit"
                variant="primary"
                size="lg"
                disabled={!habitName.trim() || loading}
                onPress={handleCustomSubmit}
                leftIcon={
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={20}
                    color="#FFFFFF"
                  />
                }
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
