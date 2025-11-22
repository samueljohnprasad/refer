import React from "react";
import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import { AnimatedBlurView } from "@/src/components/AnimatedLinearGradient";
import { Feather } from "@expo/vector-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  PencilEdit02Icon,
  ShuffleIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";

interface JournalingOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  allPrompts: string[];
  currentPrompt: string;
}

export const JournalingOptionsModal: React.FC<JournalingOptionsModalProps> = ({
  visible,
  onClose,
  onSelectPrompt,
  allPrompts,
  currentPrompt,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <AnimatedBlurView intensity={40} className="flex-1 justify-end">
        <Pressable className="flex-1 bg-black/50" onPress={onClose} />

        <View className="bg-white rounded-t-3xl p-6 pb-10 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Journaling Options
            </Text>
            <Pressable
              onPress={onClose}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Feather name="x" size={20} color="#374151" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Free Write Option */}
            <Pressable
              onPress={() => {
                onSelectPrompt("Free Write");
                onClose();
              }}
              className="flex-row items-center p-4 bg-purple-50 rounded-2xl mb-4 border border-purple-100"
            >
              <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-4">
                <HugeiconsIcon
                  icon={PencilEdit02Icon}
                  size={20}
                  color="#7B61FF"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">
                  Free Write
                </Text>
                <Text className="text-sm text-gray-500">
                  Write without a prompt
                </Text>
              </View>
            </Pressable>

            <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Select a Prompt
            </Text>

            {allPrompts.map((prompt, index) => {
              const isSelected = prompt === currentPrompt;
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    onSelectPrompt(prompt);
                    onClose();
                  }}
                  className={`p-4 rounded-xl mb-2 border ${
                    isSelected
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isSelected
                        ? "text-blue-900 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {prompt}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </AnimatedBlurView>
    </Modal>
  );
};
