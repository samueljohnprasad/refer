import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface EraseDataConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export const EraseDataConfirmationModal: React.FC<
  EraseDataConfirmationModalProps
> = ({ visible, onClose, onConfirm, isDeleting = false }) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  const handleClose = (): void => {
    if (isDeleting) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const handleConfirm = async (): Promise<void> => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await onConfirm();
    onClose();
  };

  return (
    <ShortBottomModal
      onDismiss={() => {
        onClose();
      }}
      ref={sheetRef}
      snapPoints={["70%"]}
    >
      <VStack
        className="flex-1 px-5 pt-1 items-center justify-between pb-6"
        space="sm"
      >
        <View className="items-center w-full">
          {/* Icon Header */}
          <View className="w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-4">
            <Feather name="trash-2" size={26} color="#DC2626" />
          </View>

          <Heading className="text-center text-3xl font-cormorantSemiBold text-[#1f2937] mb-2 leading-9">
            Erase All Data?
          </Heading>

          <Text className="text-gray-600 text-center text-base font-medium px-1 mb-4 leading-6">
            This will permanently delete:
          </Text>

          {/* Data Items List */}
          <View className="w-full bg-red-50/50 rounded-2xl p-4 mb-4">
            <VStack space="sm">
              <DataItem text="All journal entries and transcripts" />
              <DataItem text="Mood tracking history and emotions" />
              <DataItem text="AI-generated insights and analysis" />
              <DataItem text="Streaks and engagement statistics" />
              <DataItem text="Profile and account information" />
            </VStack>
          </View>

          {/* Warning */}
          <View className="flex-row items-start bg-amber-50 p-3 rounded-xl border border-amber-100">
            <Feather
              name="alert-triangle"
              size={18}
              color="#F59E0B"
              style={{ marginTop: 2 }}
            />
            <Text className="text-amber-900 text-sm ml-2.5 flex-1 leading-5 font-medium">
              You will be immediately logged out. Your account cannot be
              recovered.
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-4 w-full mt-2">
          <Pressable
            onPress={handleClose}
            disabled={isDeleting}
            className="flex-1 bg-[#F6F4FF] rounded-full flex-row items-center justify-center py-4 active:opacity-80"
          >
            <Text className="text-gray-900 font-bold text-xl mr-2">Cancel</Text>
            <Feather name="x" size={24} color="#1f2937" />
          </Pressable>

          <Pressable
            onPress={handleConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-500 rounded-full flex-row items-center justify-center py-4 active:opacity-90 shadow-sm"
          >
            {isDeleting ? (
              <>
                <Text className="text-white font-bold text-xl mr-2">
                  Erasing...
                </Text>
                <ActivityIndicator color="white" size="small" />
              </>
            ) : (
              <>
                <Text className="text-white font-bold text-xl mr-2">
                  Delete
                </Text>
                <Feather name="trash" size={24} color="white" />
              </>
            )}
          </Pressable>
        </View>
      </VStack>
    </ShortBottomModal>
  );
};

const DataItem = ({ text }: { text: string }) => (
  <View className="flex-row items-center">
    <View className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2.5" />
    <Text className="text-gray-800 text-sm font-medium tracking-tight">
      {text}
    </Text>
  </View>
);
