/**
 * AddHabitModal
 *
 * iOS-native bottom sheet for adding a new habit — either from a preset
 * list or via a custom form.  Layout follows the same flat settings-row
 * pattern as the rest of the habit modals.
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text as RNText,
  Pressable,
} from "react-native";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateHabitFormData, PresetHabit } from "@/src/types/habits";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import * as Haptics from "expo-haptics";
import { SectionDivider } from "./SettingsRow";

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
        <RNText style={{ fontSize: 24 }}>{preset.icon}</RNText>
      </View>
      <View className="min-w-0 flex-1">
        <RNText
          className="text-[17px] font-semibold text-black mb-0.5"
          numberOfLines={1}
        >
          {preset.name}
        </RNText>
        <RNText
          className="text-[14px] text-gray-500"
          numberOfLines={2}
        >
          {preset.description}
        </RNText>
      </View>
    </Pressable>
  );
}

// ─── Props ──────────────────────────────────────────────────────────

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateHabitFormData) => Promise<void>;
}

// ─── Component ──────────────────────────────────────────────────────

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [habitName, setHabitName] = useState<string>("");
  const [habitDescription, setHabitDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const handleClose = (): void => {
    if (loading) return;
    Haptics.selectionAsync();
    onClose();
  };

  const handlePresetSelect = async (preset: PresetHabit): Promise<void> => {
    setLoading(true);
    await onSubmit({
      name: preset.name,
      description: preset.description,
      icon: preset.icon,
    });
    setLoading(false);
    onClose();
  };

  const handleCustomSubmit = async (): Promise<void> => {
    if (!habitName.trim()) return;

    setLoading(true);
    await onSubmit({
      name: habitName.trim(),
      description: habitDescription.trim() || undefined,
    });
    setLoading(false);

    setHabitName("");
    setHabitDescription("");
    setShowCustomForm(false);
    onClose();
  };

  const paddingBottom: number = Math.max(insets.bottom, 24) + 8;

  return (
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
              {/* ─── Header ────────────────────────────── */}
              <View className="px-5 pt-8 pb-2">
                <RNText className="happy-font-heading-bold text-3xl mb-2 text-ink">
                  Add a Habit
                </RNText>
                <RNText className="happy-font-body text-[16px] text-ink-muted leading-relaxed">
                  Pick a gentle preset, or create one that fits your routine.
                </RNText>
              </View>

              {!showCustomForm ? (
                /* ─── Preset List ────────────────────── */
                <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: paddingBottom + 40,
                    paddingTop: 8,
                  }}
                >
                  {/* Custom Habit Row */}
                  <Pressable
                    onPress={() => setShowCustomForm(true)}
                    className="flex-row items-center px-5 py-3.5 active:bg-gray-50"
                  >
                    <View className="h-10 w-10 mr-4 items-center justify-center rounded-full bg-gray-100">
                      <HugeiconsIcon
                        icon={Add01Icon}
                        size={20}
                        color={SEMANTIC_COLORS.text.tertiary}
                      />
                    </View>
                    <RNText className="text-[17px] font-semibold text-black">
                      Create Custom Habit
                    </RNText>
                  </Pressable>

                  <SectionDivider />

                  {/* Presets */}
                  {PRESET_HABITS.map((preset, index) => (
                    <React.Fragment key={preset.name}>
                      <PresetRow
                        preset={preset}
                        onPress={() => handlePresetSelect(preset)}
                        disabled={loading}
                      />
                      {index < PRESET_HABITS.length - 1 && <SectionDivider />}
                    </React.Fragment>
                  ))}
                </ScrollView>
              ) : (
                /* ─── Custom Form ────────────────────── */
                <View className="flex-1 px-5">
                  <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{
                      paddingBottom: paddingBottom + 40,
                      paddingTop: 16,
                    }}
                  >
                    {/* Name */}
                    <View className="mb-4">
                      <Text
                        variant="label"
                        className="text-ink-muted font-medium mb-1.5"
                      >
                        Habit name *
                      </Text>
                      <TextInput
                        value={habitName}
                        onChangeText={setHabitName}
                        placeholder="e.g., Morning stretch routine"
                        placeholderTextColor={SEMANTIC_COLORS.text.tertiary}
                        maxLength={50}
                        className="rounded-xl bg-white px-4 py-3 text-[17px] text-black"
                      />
                      <View className="flex-row items-center justify-between mt-1.5">
                        {habitName.length === 0 ? (
                          <Text
                            variant="caption"
                            className="text-ink-muted"
                          >
                            Give your habit a name to get started
                          </Text>
                        ) : (
                          <Text
                            variant="caption"
                            className="text-transparent"
                          >
                            {" "}
                          </Text>
                        )}
                        <Text variant="caption-muted">
                          {habitName.length}/50
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                      <Text
                        variant="label"
                        className="text-ink-muted font-medium mb-1.5"
                      >
                        Why is this important to you?
                      </Text>
                      <TextInput
                        value={habitDescription}
                        onChangeText={setHabitDescription}
                        placeholder="To feel more energized and focused..."
                        placeholderTextColor={SEMANTIC_COLORS.text.tertiary}
                        maxLength={200}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        className="min-h-[96px] rounded-xl bg-white px-4 py-3 text-[17px] text-black"
                      />
                      <View className="flex-row items-center justify-between mt-1.5">
                        {habitName.length > 0 &&
                        habitDescription.length === 0 ? (
                          <Text
                            variant="caption"
                            className="text-ink-muted flex-1 mr-4"
                            numberOfLines={1}
                          >
                            Why do you want to{" "}
                            {habitName.toLowerCase()}?
                          </Text>
                        ) : (
                          <Text
                            variant="caption"
                            className="text-transparent flex-1"
                          >
                            {" "}
                          </Text>
                        )}
                        <Text variant="caption-muted">
                          {habitDescription.length}/200
                        </Text>
                      </View>
                    </View>
                  </ScrollView>

                  {/* Action Buttons */}
                  <View
                    className="flex-row gap-3 pt-2"
                    style={{ paddingBottom }}
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
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
};
