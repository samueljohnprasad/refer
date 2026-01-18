import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { CreateHabitFormData, PresetHabit } from "@/src/types/habits";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";

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

export const AddHabitModal = forwardRef<BottomSheetModal, AddHabitModalProps>(
  (props, ref) => {
    const { onSubmit } = props;

    const [showCustomForm, setShowCustomForm] = useState(false);
    const [habitName, setHabitName] = useState("");
    const [habitDescription, setHabitDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePresetSelect = async (preset: PresetHabit) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
      <ShortBottomModal marginHorizontal={8} ref={ref} snapPoints={["80%"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-6 pt-4">
            {/* Header */}
            <Text className="text-3xl text-gray-900 mb-2 font-cormorantSemiBold">
              Add a Habit
            </Text>
            <Text className="text-gray-600 text-base mb-6">
              Choose from presets or create your own
            </Text>

            {!showCustomForm ? (
              <>
                {/* Preset Habits */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                >
                  {PRESET_HABITS.map((preset, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlePresetSelect(preset)}
                      disabled={loading}
                      className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-200"
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-3">
                          <Text style={{ fontSize: 24 }}>{preset.icon}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-gray-900 mb-1">
                            {preset.name}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {preset.description}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Custom Habit Button */}
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowCustomForm(true);
                  }}
                  className="w-full bg-[#7B61FF] rounded-full py-4 flex-row items-center justify-center gap-2 mb-4"
                  activeOpacity={0.8}
                >
                  <HugeiconsIcon icon={Add01Icon} size={20} color="#FFFFFF" />
                  <Text className="text-white font-semibold text-base">
                    Create Custom Habit
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Custom Habit Form */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                >
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Habit Name *
                    </Text>
                    <TextInput
                      value={habitName}
                      onChangeText={setHabitName}
                      placeholder="e.g., Morning stretch routine"
                      placeholderTextColor="#9CA3AF"
                      maxLength={50}
                      className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900 border border-gray-200"
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                      {habitName.length}/50
                    </Text>
                  </View>

                  <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Why is this important to you?
                    </Text>
                    <TextInput
                      value={habitDescription}
                      onChangeText={setHabitDescription}
                      placeholder="To feel more energized and focused..."
                      placeholderTextColor="#9CA3AF"
                      maxLength={200}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900 border border-gray-200 min-h-[80px]"
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                      {habitDescription.length}/200
                    </Text>
                  </View>
                </ScrollView>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mb-4">
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowCustomForm(false);
                      setHabitName("");
                      setHabitDescription("");
                    }}
                    className="flex-1 bg-gray-100 rounded-full py-4 items-center justify-center"
                    activeOpacity={0.8}
                  >
                    <Text className="text-gray-700 font-semibold text-base">
                      Back
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleCustomSubmit}
                    disabled={!habitName.trim() || loading}
                    className={`flex-1 rounded-full py-4 flex-row items-center justify-center gap-2 ${
                      !habitName.trim() || loading
                        ? "bg-gray-300"
                        : "bg-[#7B61FF]"
                    }`}
                    activeOpacity={0.8}
                  >
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={20}
                      color={
                        !habitName.trim() || loading ? "#9CA3AF" : "#FFFFFF"
                      }
                    />
                    <Text
                      className={`font-semibold text-base ${
                        !habitName.trim() || loading
                          ? "text-gray-500"
                          : "text-white"
                      }`}
                    >
                      Create Habit
                    </Text>
                  </TouchableOpacity>
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
