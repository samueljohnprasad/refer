import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import ShortBottomModal from "@/src/components/ShortBottomModal";
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
      ref={sheetRef}
      snapPoints={["35%"]}
    >
      <VStack
        className="flex-1 px-6 pt-2 items-center justify-between pb-8"
        space="md"
      >
        <View className="items-center w-full">
          {/* Icon Header */}
          <View className="w-14 h-14 rounded-full bg-[#f8f8f8] items-center justify-center mb-5">
            <Feather name="help-circle" size={26} color="#4b5563" />
          </View>

          <Heading className="text-center text-3xl font-cormorantSemiBold text-[#1f2937] mb-2">
            Sign Out?
          </Heading>

          <Text className="text-gray-500 text-center text-base px-2">
            Are you sure you want to sign out? You'll need to sign in again to
            access your journals.
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 w-full mt-4">
          <Pressable
            onPress={handleCloseCancel}
            disabled={isLoading}
            className="flex-1 bg-[#F6F4FF] rounded-full flex-row items-center justify-center py-4 active:opacity-80"
          >
            <Text className="text-gray-900 font-bold text-lg mr-2">Cancel</Text>
            <Feather name="x" size={20} color="#1f2937" />
          </Pressable>

          <Pressable
            onPress={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-[#7B61FF] rounded-full flex-row items-center justify-center py-4 active:opacity-90"
          >
            <Text className="text-white font-bold text-lg mr-2">
              {isLoading ? "Signing Out..." : "Sign Out"}
            </Text>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Feather name="log-out" size={20} color="white" />
            )}
          </Pressable>
        </View>
      </VStack>
    </ShortBottomModal>
  );
};

SignOutConfirmationModal.displayName = "SignOutConfirmationModal";

export default SignOutConfirmationModal;
