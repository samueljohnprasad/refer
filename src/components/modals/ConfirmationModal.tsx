import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import ShortBottomModal from "../ShortBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import { DeleteJournal } from "@/src/screens/DailyNotesScreen/atoms";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Cancel01Icon,
  Tick02Icon,
  Delete02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import * as Haptics from "expo-haptics";

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "destructive" | "primary";
  onDelete?: () => void;
  deleteEntry: DeleteJournal;
  onDismiss?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  onDelete,
  deleteEntry,
  onDismiss,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { deleteJournal, deleting } = useJournalOperations();

  useEffect(() => {
    if (deleteEntry.flag) {
      return sheetRef.current?.present();
    }
    return sheetRef.current?.close();
  }, [deleteEntry.flag]);

  const handleDeleteConfirm = useCallback(async (): Promise<void> => {
    if (!deleteEntry) return;

    try {
      if (!deleteEntry.entry?.id) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await deleteJournal({
        journalId: deleteEntry.entry.id,
        selectedDate: deleteEntry.selectedDate,
      });

      onDelete?.();
    } catch (error) {}
  }, [deleteJournal, deleteEntry.selectedDate, onDelete]);

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sheetRef.current?.close();
  };

  const isDestructive = confirmVariant === "destructive";

  return (
    <ShortBottomModal onDismiss={onDismiss} ref={sheetRef} snapPoints={["40%"]}>
      <VStack
        className="flex-1 px-6 pt-2 items-center justify-between pb-8"
        space="md"
      >
        <View className="items-center w-full">
          {/* Icon Header */}
          <View
            className={`w-14 h-14 rounded-full items-center justify-center mb-5 ${
              isDestructive ? "bg-red-50" : "bg-purple-50"
            }`}
          >
            <HugeiconsIcon
              icon={isDestructive ? AlertCircleIcon : Tick02Icon}
              size={26}
              color={isDestructive ? "#DC2626" : "#7B61FF"}
            />
          </View>

          <Heading className="text-center text-4xl font-cormorantSemiBold text-[#1f2937] mb-3 leading-10">
            {title}
          </Heading>

          <Text className="text-gray-600 text-center text-lg px-2 leading-7 font-medium">
            {message}
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 w-full mt-4">
          <Pressable
            onPress={handleCancel}
            disabled={deleting}
            className="flex-1 bg-[#F6F4FF] rounded-full flex-row items-center justify-center py-4 active:opacity-80"
          >
            <Text className="text-gray-900 font-bold text-lg mr-2">
              {cancelText}
            </Text>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#1f2937" />
          </Pressable>

          <Pressable
            onPress={handleDeleteConfirm}
            disabled={deleting}
            className={`flex-1 rounded-full flex-row items-center justify-center py-4 active:opacity-90 ${
              isDestructive ? "bg-red-500" : "bg-[#7B61FF]"
            } ${deleting ? "opacity-70" : ""}`}
          >
            <Text className="text-white font-bold text-lg mr-2">
              {deleting ? "Processing..." : confirmText}
            </Text>
            {deleting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <HugeiconsIcon
                icon={isDestructive ? Delete02Icon : Tick02Icon}
                size={20}
                color="white"
              />
            )}
          </Pressable>
        </View>
      </VStack>
    </ShortBottomModal>
  );
};
