import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BRAND_SURFACE, INK, SAGE } from "@/lib/tokens";

interface SignOutConfirmationModalProps {
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  isSignoutOPen?: boolean;
  handleClose: () => void;
}

export const SignOutConfirmationModal: React.FC<
  SignOutConfirmationModalProps
> = ({ onConfirm, isLoading = false, isSignoutOPen = false, handleClose }) => {
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
      snapPoints={["40%"]}
    >
      <VStack
        className="flex-1 px-5 pt-1 items-center justify-between pb-6"
        space="sm"
      >
        <View className="items-center w-full">
          {/* Icon Header */}
          <View className="w-12 h-12 rounded-full bg-sage-pill items-center justify-center mb-4">
            <Feather name="help-circle" size={22} color={SAGE[600]} />
          </View>

          <Heading className="happy-font-heading-bold text-center text-3xl text-ink mb-2 leading-9">
            Sign Out?
          </Heading>

          <Text className="happy-font-body-medium text-ink-muted text-center text-base px-1 leading-6">
            Are you sure you want to sign out? You'll need to sign in again to
            access your journals.
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 w-full mt-4">
          <Pressable
            onPress={handleCloseCancel}
            disabled={isLoading}
            className="flex-1 bg-sage-pill rounded-full flex-row items-center justify-center py-4 active:opacity-80"
          >
            <Text className="happy-font-body-bold text-ink text-lg mr-2">Cancel</Text>
            <Feather name="x" size={20} color={INK} />
          </Pressable>

          <Pressable
            onPress={handleConfirm}
            disabled={isLoading}
            className="happy-brand-primary-cta flex-1 rounded-full flex-row items-center justify-center py-4 active:opacity-90"
          >
            <Text className="happy-font-body-bold text-brand-surface text-lg mr-2">
              {isLoading ? "Signing Out..." : "Sign Out"}
            </Text>
            {isLoading ? (
              <ActivityIndicator color={BRAND_SURFACE} size="small" />
            ) : (
              <Feather name="log-out" size={20} color={BRAND_SURFACE} />
            )}
          </Pressable>
        </View>
      </VStack>
    </ShortBottomModal>
  );
};
