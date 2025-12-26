import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { RepeatPattern } from "@/src/types/habits";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tick01Icon } from "@hugeicons/core-free-icons";

interface RepeatOptionsModalProps {
  visible: boolean;
  selectedPattern: RepeatPattern;
  onSelect: (pattern: RepeatPattern) => void;
  onClose: () => void;
}

const REPEAT_OPTIONS: { value: RepeatPattern; label: string }[] = [
  { value: "never", label: "Never" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const RepeatOptionsModal: React.FC<RepeatOptionsModalProps> = ({
  visible,
  selectedPattern,
  onSelect,
  onClose,
}) => {
  const handleSelect = (pattern: RepeatPattern) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(pattern);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

            <Text className="text-xl font-cormorantSemiBold text-gray-900 mb-4">
              Repeat
            </Text>

            {REPEAT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelect(option.value)}
                className="flex-row items-center justify-between py-4 border-b border-gray-100"
                activeOpacity={0.7}
              >
                <Text
                  className={`text-base ${
                    selectedPattern === option.value
                      ? "text-[#7B61FF] font-semibold"
                      : "text-gray-900"
                  }`}
                >
                  {option.label}
                </Text>

                {selectedPattern === option.value && (
                  <View className="w-6 h-6 bg-[#7B61FF] rounded-full items-center justify-center">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={14}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
