import React, { forwardRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { CreateHabitFormData, PresetHabit } from "@/src/types/habits";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { INK_MUTED, SAGE } from "@/lib/tokens";
import { Card } from "@/src/components/ui/Card";

interface AddHabitModalProps {
  onSubmit: (formData: CreateHabitFormData) => Promise<void>;
}

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

export const AddHabitModal = forwardRef<BottomSheetModal, AddHabitModalProps>(
  (props, ref) => {
    const { onSubmit } = props;

    const [showCustomForm, setShowCustomForm] = useState(false);
    const [habitName, setHabitName] = useState("");
    const [habitDescription, setHabitDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePresetSelect = async (preset: PresetHabit) => {
      setLoading(true);
      await onSubmit({
        name: preset.name,
        description: preset.description,
        icon: preset.icon,
      });
      setLoading(false);

      // Close modal
      if (ref && "current" in ref) {
        ref.current?.close();
      }
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

      if (ref && "current" in ref) {
        ref.current?.close();
      }
    };

    return (
      <ShortBottomModal marginHorizontal={10} ref={ref} snapPoints={["82%"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-5 pt-4">
            {/* Header */}
            <Text className="happy-font-heading-bold mb-1 text-[32px] leading-10 text-ink">
              Add a Habit
            </Text>
            <Text className="happy-font-body-medium mb-5 text-[15px] leading-6 text-ink-muted">
              Pick a gentle preset, or create one that fits your routine.
            </Text>

            {!showCustomForm ? (
              <>
                {/* Preset Habits */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                  contentContainerClassName="pb-4"
                >
                  {PRESET_HABITS.map((preset) => {
                    const tone = PRESET_TONES[preset.category];

                    return (
                      <Card
                        key={preset.name}
                        variant="tile"
                        radius="xl"
                        showDepth={true}
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
                            <Text style={{ fontSize: 23 }}>
                              {preset.icon}
                            </Text>
                          </View>
                          <View className="min-w-0 flex-1">
                            <View className="mb-1 flex-row items-center">
                              <Text
                                className="happy-font-body-bold flex-1 text-[16px] leading-5 text-ink"
                                numberOfLines={1}
                              >
                                {preset.name}
                              </Text>
                              <View
                                className={`ml-2 h-2.5 w-2.5 rounded-full ${tone.chipClassName}`}
                              />
                            </View>
                            <Text
                              className="happy-font-body-medium text-[14px] leading-5 text-ink-muted"
                              numberOfLines={2}
                            >
                              {preset.description}
                            </Text>
                          </View>
                        </View>
                      </Card>
                    );
                  })}
                </ScrollView>

                {/* Custom Habit Button */}
                <PressableScale
                  onPress={() => {
                    setShowCustomForm(true);
                  }}
                  scale={0.97}
                  hapticStyle="light"
                  className="mb-4 rounded-[24px]"
                  accessibilityRole="button"
                >
                  <View className="flex-row items-center justify-center rounded-[24px] border-b-4 border-b-sage-700 bg-sage-500 py-4">
                    <HugeiconsIcon icon={Add01Icon} size={20} color="#FFFFFF" />
                    <Text className="happy-font-body-bold ml-2 text-[15px] text-brand-surface">
                      Create Custom Habit
                    </Text>
                  </View>
                </PressableScale>
              </>
            ) : (
              <>
                {/* Custom Habit Form */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                  contentContainerClassName="pb-4"
                >
                  <View className="mb-4">
                    <Text className="happy-brand-eyebrow mb-2 text-[11px]">
                      Habit Name *
                    </Text>
                    <TextInput
                      value={habitName}
                      onChangeText={setHabitName}
                      placeholder="e.g., Morning stretch routine"
                      placeholderTextColor={INK_MUTED}
                      maxLength={50}
                      className="happy-font-body-medium rounded-[22px] border-2 border-sage-100 bg-brand-surface-soft px-4 py-3 text-[15px] leading-6 text-ink"
                    />
                    <Text className="happy-font-body-medium mt-1 text-xs text-ink-muted">
                      {habitName.length}/50
                    </Text>
                  </View>

                  <View className="mb-6">
                    <Text className="happy-brand-eyebrow mb-2 text-[11px]">
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
                      className="happy-font-body-medium min-h-[96px] rounded-[22px] border-2 border-sage-100 bg-brand-surface-soft px-4 py-3 text-[15px] leading-6 text-ink"
                    />
                    <Text className="happy-font-body-medium mt-1 text-xs text-ink-muted">
                      {habitDescription.length}/200
                    </Text>
                  </View>
                </ScrollView>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mb-4">
                  <PressableScale
                    onPress={() => {
                      setShowCustomForm(false);
                      setHabitName("");
                      setHabitDescription("");
                    }}
                    scale={0.97}
                    hapticStyle="light"
                    className="flex-1 rounded-[22px]"
                  >
                    <View className="items-center justify-center rounded-[22px] bg-sage-pill py-4">
                      <Text className="happy-font-body-bold text-[15px] text-sage-700">
                        Back
                      </Text>
                    </View>
                  </PressableScale>

                  <PressableScale
                    onPress={handleCustomSubmit}
                    disabled={!habitName.trim() || loading}
                    scale={0.97}
                    hapticStyle="medium"
                    className="flex-1 rounded-[22px]"
                  >
                    <View
                      className={`flex-row items-center justify-center rounded-[22px] border-b-4 py-4 ${
                        !habitName.trim() || loading
                          ? "border-b-sage-300 bg-sage-200"
                          : "border-b-sage-700 bg-sage-500"
                      }`}
                    >
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={20}
                        color={
                          !habitName.trim() || loading ? SAGE[400] : "#FFFFFF"
                        }
                      />
                      <Text
                        className={`happy-font-body-bold ml-2 text-[15px] ${
                          !habitName.trim() || loading
                            ? "text-ink-muted"
                            : "text-brand-surface"
                        }`}
                      >
                        Create Habit
                      </Text>
                    </View>
                  </PressableScale>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </ShortBottomModal>
    );
  }
);

AddHabitModal.displayName = "AddHabitModal";
