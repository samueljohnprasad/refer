import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
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

type PresetHabitTone = {
  iconBgClassName: string;
  iconBorderClassName: string;
  chipClassName: string;
};

const PRESET_TONES: Record<PresetHabit["category"], PresetHabitTone> = {
  health: {
    iconBgClassName: "bg-otter-blue-tint",
    iconBorderClassName: "border-otter-blue/30",
    chipClassName: "bg-otter-blue",
  },
  productivity: {
    iconBgClassName: "bg-gold-tint",
    iconBorderClassName: "border-gold/30",
    chipClassName: "bg-gold",
  },
  selfcare: {
    iconBgClassName: "bg-macaw-purple-tint",
    iconBorderClassName: "border-macaw-purple/30",
    chipClassName: "bg-macaw-purple",
  },
  mindfulness: {
    iconBgClassName: "bg-sage-selected",
    iconBorderClassName: "border-sage-200",
    chipClassName: "bg-sage-500",
  },
};

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                <Text variant="body-bold" className="text-2xl mb-1">
                  Add a Habit
                </Text>
                <Text variant="body" className="mb-5">
                  Pick a gentle preset, or create one that fits your routine.
                </Text>

                {!showCustomForm ? (
                  <>
                    {/* Custom Habit Button */}
                    <View className="mb-4">
                      <Button
                        label="Create Custom Habit"
                        variant="secondary"
                        onPress={() => setShowCustomForm(true)}
                        leftIcon={
                          <HugeiconsIcon icon={Add01Icon} size={20} color={INK_MUTED} />
                        }
                      />
                    </View>
                    {/* Preset Habits */}
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      className="flex-1"
                      contentContainerStyle={{ paddingBottom: 16 }}
                    >
                      {PRESET_HABITS.map((preset) => {
                        const tone = PRESET_TONES[preset.category];

                        return (
                          <Card
                            key={preset.name}
                            variant="tile"
                            radius="xl"
                            showDepth={false}
                            onPress={() => handlePresetSelect(preset)}
                            disabled={loading}
                            className="mb-3"
                            contentClassName="px-4 py-4"
                            accessibilityRole="button"
                            accessibilityLabel={`Add habit: ${preset.name}. ${preset.description}`}
                          >
                            <View className="flex-row items-center">
                              <View
                                className={`mr-3 h-12 w-12 items-center justify-center rounded-[18px] border ${tone.iconBorderClassName} ${tone.iconBgClassName}`}
                              >
                                <RNText style={{ fontSize: 23 }}>
                                  {preset.icon}
                                </RNText>
                              </View>
                              <View className="min-w-0 flex-1">
                                <View className="mb-0.5 flex-row items-center">
                                  <Text variant="body-bold" className="flex-1" numberOfLines={1}>
                                    {preset.name}
                                  </Text>
                                </View>
                                <Text variant="caption" numberOfLines={2}>
                                  {preset.description}
                                </Text>
                              </View>
                            </View>
                          </Card>
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
