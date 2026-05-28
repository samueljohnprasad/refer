import React, { useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator, Modal } from "react-native";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
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
import { Button } from "@/src/components/ui/Button";

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
  const { deleteJournal, deleting } = useJournalOperations();

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
  }, [deleteJournal, deleteEntry.selectedDate, onDelete, deleteEntry]);

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss?.();
  };

  if (!deleteEntry.flag) return null;

  const isDestructive = confirmVariant === "destructive";

  return (
    <Modal
      visible={deleteEntry.flag}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Host>
        <BottomSheet
          isPresented={deleteEntry.flag}
          onIsPresentedChange={(val: boolean) => {
            if (!val) {
              onDismiss?.();
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents([{ height: 330 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1">
                <VStack
                  className="flex-1 px-5 pt-3 items-center justify-between pb-6"
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
                    <Button
                      label={cancelText}
                      variant="secondary"
                      size="md"
                      className="flex-1"
                      onPress={handleCancel}
                      disabled={deleting}
                      rightIcon={<HugeiconsIcon icon={Cancel01Icon} size={18} color={INK} />}
                    />

                    <Button
                      label={deleting ? "Processing..." : confirmText}
                      variant={isDestructive ? "danger" : "primary"}
                      size="md"
                      className="flex-1"
                      onPress={handleDeleteConfirm}
                      loading={deleting}
                      disabled={deleting}
                      rightIcon={
                        !deleting ? (
                          <HugeiconsIcon
                            icon={isDestructive ? Delete02Icon : Tick02Icon}
                            size={18}
                            color={BRAND_SURFACE}
                          />
                        ) : undefined
                      }
                    />
                  </View>
                </VStack>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
};
