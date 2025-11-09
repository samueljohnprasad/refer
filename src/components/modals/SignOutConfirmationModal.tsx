import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface SignOutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const SignOutConfirmationModal: React.FC<SignOutConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const handleClose = (): void => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleConfirm = (): void => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <BlurView intensity={80} tint="dark" className="flex-1">
        <View className="flex-1 justify-center items-center px-5">
          {/* Modal Container */}
          <View className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            {/* Icon Header */}
            <View className="items-center pt-8 pb-4">
              <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
                <Feather name="log-out" size={28} color="#3B82F6" />
              </View>
              <Text className="text-gray-900 text-2xl font-bold text-center">
                Sign Out?
              </Text>
            </View>

            {/* Content */}
            <View className="px-6 pb-6">
              <Text className="text-gray-600 text-base leading-6 text-center mb-6">
                Are you sure you want to sign out? You'll need to sign in again
                to access your journals.
              </Text>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleClose}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 rounded-2xl py-4 items-center justify-center active:bg-gray-200"
                >
                  <Text className="text-gray-700 font-semibold text-base">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={
                      isLoading ? ["#999", "#777"] : ["#3B82F6", "#2563EB"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text className="text-white font-bold text-base">
                      {isLoading ? "Signing Out..." : "Sign Out"}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default SignOutConfirmationModal;
