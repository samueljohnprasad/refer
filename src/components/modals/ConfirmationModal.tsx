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
import { BRAND_SURFACE, DANGER, INK, SAGE } from "@/lib/tokens";

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
    <ShortBottomModal onDismiss={onDismiss} ref={sheetRef} snapPoints={["45%"]}>
      <VStack
        className="flex-1 px-5 pt-1 items-center justify-between pb-6"
        space="sm"
      >
        <View className="items-center w-full">
          {/* Icon Header */}
          <View
            className={`w-12 h-12 rounded-full items-center justify-center mb-4 ${
              isDestructive ? "bg-red-50" : "bg-sage-pill"
            }`}
          >
            <HugeiconsIcon
              icon={isDestructive ? AlertCircleIcon : Tick02Icon}
              size={22}
              color={isDestructive ? DANGER : SAGE[600]}
            />
          </View>

          <Heading className="happy-font-heading-bold text-center text-3xl text-ink mb-2 leading-9">
            {title}
          </Heading>

          <Text className="happy-font-body-medium text-ink-soft text-center text-base px-1 leading-6">
            {message}
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 w-full mt-4">
          <Pressable
            onPress={handleCancel}
            disabled={deleting}
            className="flex-1 bg-sage-pill rounded-full flex-row items-center justify-center py-4 active:opacity-80"
          >
            <Text className="happy-font-body-bold text-ink text-lg mr-2">
              {cancelText}
            </Text>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color={INK} />
          </Pressable>

          <Pressable
            onPress={handleDeleteConfirm}
            disabled={deleting}
            className={`flex-1 rounded-full flex-row items-center justify-center py-4 active:opacity-90 ${
              isDestructive ? "bg-red-500" : "happy-brand-primary-cta"
            } ${deleting ? "opacity-70" : ""}`}
          >
            <Text className="happy-font-body-bold text-brand-surface text-lg mr-2">
              {deleting ? "Processing..." : confirmText}
            </Text>
            {deleting ? (
              <ActivityIndicator color={BRAND_SURFACE} size="small" />
            ) : (
              <HugeiconsIcon
                icon={isDestructive ? Delete02Icon : Tick02Icon}
                size={20}
                color={BRAND_SURFACE}
              />
            )}
          </Pressable>
        </View>
      </VStack>
    </ShortBottomModal>
  );
};
