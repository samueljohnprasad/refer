import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import { INK_MUTED } from "@/lib/tokens";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import * as Haptics from "expo-haptics";

// Preset habits from PRD
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



interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateHabitFormData) => Promise<void>;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    if (loading) return;
    Haptics.selectionAsync();
    onClose();
  };

  const handlePresetSelect = async (preset: PresetHabit) => {
    setLoading(true);
    await onSubmit({
      name: preset.name,
      description: preset.description,
      icon: preset.icon,
    });
    setLoading(false);
    onClose();
  };

  const handleCustomSubmit = async () => {
    if (!habitName.trim()) return;

    setLoading(true);
    await onSubmit({
      name: habitName.trim(),
      description: habitDescription.trim() || undefined,
    });
    setLoading(false);

    // Reset form and close
    setHabitName("");
    setHabitDescription("");
    setShowCustomForm(false);
    onClose();
  };

  const paddingBottom = Math.max(insets.bottom, 24) + 8;

  return (
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
                className="flex-1 px-5 pt-8 bg-brand-surface"
              >
                {/* Header */}
                <RNText className="happy-font-heading-bold text-3xl mb-2 text-ink">
                  Add a Habit
                </RNText>
                <RNText className="happy-font-body text-[16px] mb-6 text-ink-muted leading-relaxed">
                  Pick a gentle preset, or create one that fits your routine.
                </RNText>

                {!showCustomForm ? (
                  <>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      className="flex-1"
                      contentContainerStyle={{ paddingBottom: 16 }}
                    >
                      {/* Custom Habit Button */}
                      <Pressable
                        onPress={() => setShowCustomForm(true)}
                        className="py-4 border-b border-sage-100 flex-row items-center"
                        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                      >
                        <View className="h-10 w-10 mr-3 items-center justify-center rounded-full bg-sage-50">
                          <HugeiconsIcon icon={Add01Icon} size={20} color={INK_MUTED} />
                        </View>
                        <RNText className="happy-font-body-bold text-[17px] text-ink">
                          Create Custom Habit
                        </RNText>
                      </Pressable>

                      {/* Preset Habits */}
                      {PRESET_HABITS.map((preset) => {
                        return (
                          <Pressable
                            key={preset.name}
                            onPress={() => handlePresetSelect(preset)}
                            disabled={loading}
                            className="py-4 border-b border-sage-100 flex-row items-center"
                            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                            accessibilityRole="button"
                            accessibilityLabel={`Add habit: ${preset.name}. ${preset.description}`}
                          >
                            <View className="mr-4 h-10 w-10 items-center justify-center">
                              <RNText style={{ fontSize: 24 }}>
                                {preset.icon}
                              </RNText>
                            </View>
                            <View className="min-w-0 flex-1">
                              <RNText className="happy-font-body-bold text-[17px] text-ink mb-1" numberOfLines={1}>
                                {preset.name}
                              </RNText>
                              <RNText className="happy-font-body-medium text-[14px] text-ink-muted" numberOfLines={2}>
                                {preset.description}
                              </RNText>
                            </View>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </>
                ) : (
                  <>
                    {/* Custom Habit Form */}
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                      keyboardDismissMode="on-drag"
                      className="flex-1"
                      contentContainerStyle={{ paddingBottom: 16 }}
                    >
                      <View className="mb-4">
                        <Text variant="label" className="text-ink-muted font-medium mb-1.5">
                          Habit name *
                        </Text>
                        <TextInput
                          value={habitName}
                          onChangeText={setHabitName}
                          placeholder="e.g., Morning stretch routine"
                          placeholderTextColor={INK_MUTED}
                          maxLength={50}
                          className="happy-font-body-medium rounded-xl border border-sage-100 bg-brand-surface-soft px-4 py-3 text-[17px] text-ink"
                        />
                        <View className="flex-row items-center justify-between mt-1.5">
                          {habitName.length === 0 ? (
                            <Text variant="caption" className="text-ink-muted">
                              Give your habit a name to get started
                            </Text>
                          ) : (
                            <Text variant="caption" className="text-transparent"> </Text>
                          )}
                          <Text variant="caption-muted">
                            {habitName.length}/50
                          </Text>
                        </View>
                      </View>

                      <View className="mb-6">
                        <Text variant="label" className="text-ink-muted font-medium mb-1.5">
                          Why is this important to you?
                        </Text>
                        <TextInput
                          value={habitDescription}
                          onChangeText={setHabitDescription}
                          placeholder="To feel more energized and focused..."
                          placeholderTextColor={INK_MUTED}
                          maxLength={200}
                          multiline
                          numberOfLines={3}
                          textAlignVertical="top"
                          className="happy-font-body-medium min-h-[96px] rounded-xl border border-sage-100 bg-brand-surface-soft px-4 py-3 text-[17px] text-ink"
                        />
                        <View className="flex-row items-center justify-between mt-1.5">
                          {habitName.length > 0 && habitDescription.length === 0 ? (
                            <Text variant="caption" className="text-ink-muted flex-1 mr-4" numberOfLines={1}>
                              Why do you want to {habitName.toLowerCase()}?
                            </Text>
                          ) : (
                            <Text variant="caption" className="text-transparent flex-1"> </Text>
                          )}
                          <Text variant="caption-muted">
                            {habitDescription.length}/200
                          </Text>
                        </View>
                      </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3 pt-2">
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
                            <HugeiconsIcon icon={Tick01Icon} size={20} color="#FFFFFF" />
                          }
                        />
                      </View>
                    </View>
                  </>
                )}
              </View>
            </KeyboardAvoidingView>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
};
