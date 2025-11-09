import React from "react";
import { Modal, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "destructive" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  loading = false,
  icon = "alert-circle",
  iconColor = "#EF4444",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <BlurView intensity={20} className="flex-1">
        <Pressable
          className="flex-1 justify-center items-center bg-black/50 px-6"
          onPress={onCancel}
        >
          <Pressable
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <View className="items-center mb-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: `${iconColor}15` }}
              >
                <Feather name={icon} size={32} color={iconColor} />
              </View>
            </View>

            {/* Title */}
            <Text className="text-xl font-bold text-gray-900 text-center mb-2">
              {title}
            </Text>

            {/* Message */}
            <Text className="text-base text-gray-600 text-center mb-6 leading-6">
              {message}
            </Text>

            {/* Actions */}
            <View className="flex-row gap-3">
              <Button
                onPress={onCancel}
                disabled={loading}
                className="flex-1 bg-gray-100 rounded-xl"
              >
                <ButtonText className="text-gray-700 font-semibold">
                  {cancelText}
                </ButtonText>
              </Button>

              <Button
                onPress={onConfirm}
                disabled={loading}
                className={`flex-1 rounded-xl ${
                  confirmVariant === "destructive" ? "bg-red-600" : "bg-blue-600"
                }`}
              >
                <ButtonText className="text-white font-semibold">
                  {loading ? "Processing..." : confirmText}
                </ButtonText>
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
};
