import React, { useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { useBottomSheet } from "@/components/ui/bottomsheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface SignOutConfirmationModalProps {
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  isSignoutOPen?: boolean;
  handleClose: () => void;
}

const SignOutConfirmationModal: React.FC<SignOutConfirmationModalProps> = ({
  onConfirm,
  isLoading = false,
  isSignoutOPen = false,
  handleClose,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const handleCloseCancel = (): void => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleClose();
  };

  useEffect(() => {
    if (isSignoutOPen) {
      return sheetRef.current?.present();
    }
    return sheetRef.current?.close();
  }, [isSignoutOPen]);

  const handleConfirm = (): void => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm().then(() => handleClose());
  };

  return (
    <ShortBottomModal
      onDismiss={() => {
        handleClose();
      }}
      height={300}
      ref={sheetRef}
      snapPoints={["42%"]}
    >
      <VStack className="flex-1 px-4" space="xl">
        {/* Icon Header */}
        <View className="items-center">
          <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Feather name="log-out" size={28} color="#3B82F6" />
          </View>
          <Heading size="2xl" className="text-center mb-2">
            Sign Out?
          </Heading>
          <Text className="text-gray-600 text-base leading-6 text-center">
            Are you sure you want to sign out? You'll need to sign in again to
            access your journals.
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mt-10">
          <Pressable
            onPress={handleCloseCancel}
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
              colors={isLoading ? ["#999", "#777"] : ["#3B82F6", "#2563EB"]}
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
      </VStack>
    </ShortBottomModal>
  );
};

SignOutConfirmationModal.displayName = "SignOutConfirmationModal";

export default SignOutConfirmationModal;
