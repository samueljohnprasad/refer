import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import ShortBottomModal from "../ShortBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import { DeleteJournal } from "@/src/screens/DailyNotesScreen/atoms";

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
      await deleteJournal({
        journalId: deleteEntry.entry.id,
        selectedDate: deleteEntry.selectedDate,
      });

      onDelete?.();
    } catch (error) {}
  }, [deleteJournal, deleteEntry.selectedDate, onDelete]);

  return (
    <ShortBottomModal onDismiss={onDismiss} ref={sheetRef}>
      <View className="flex-1 p-6 w-full justify-between">
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            {title}
          </Text>

          <Text className="text-base text-gray-600 text-center mb-6 leading-6">
            {message}
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-3">
          <Button
            onPress={() => {
              sheetRef.current?.close();
            }}
            disabled={deleting}
            className="flex-1 bg-gray-100 rounded-xl"
          >
            <ButtonText className="text-gray-700 font-semibold">
              {cancelText}
            </ButtonText>
          </Button>

          <Button
            onPress={handleDeleteConfirm}
            disabled={deleting}
            className={`flex-1 rounded-xl ${
              confirmVariant === "destructive" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            <ButtonText className="text-white font-semibold">
              {deleting ? "Processing..." : confirmText}
            </ButtonText>
          </Button>
        </View>
      </View>
    </ShortBottomModal>
  );
};
