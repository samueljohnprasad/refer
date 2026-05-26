import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BRAND_SURFACE, GOLD, SAGE, TERRACOTTA } from "@/lib/tokens";

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
      snapPoints={["72%"]}
    >
      <View className="flex-1 items-center justify-between px-5 pb-6 pt-1">
        <View className="items-center w-full">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-[24px] border-2 border-terracotta-light bg-brand-surface">
            <Feather name="trash-2" size={28} color={TERRACOTTA} />
          </View>

          <Text className="happy-font-heading-bold mb-2 text-center text-[30px] leading-9 text-ink">
            Erase All Data?
          </Text>

          <Text className="happy-font-body-medium mb-4 px-2 text-center text-base leading-6 text-ink-soft">
            This permanently removes the private history saved in Happy.
          </Text>

          <View className="happy-brand-preview-tile mb-4 w-full rounded-[28px] p-4">
            <Text className="happy-brand-eyebrow mb-3">Will be deleted</Text>
            <View className="gap-3">
              <DataItem text="Journal entries and transcripts" />
              <DataItem text="Mood history and emotions" />
              <DataItem text="AI insights and analysis" />
              <DataItem text="Streaks and engagement stats" />
              <DataItem text="Profile and account information" />
            </View>
          </View>

          <View className="happy-brand-card-selected flex-row items-start rounded-[24px] p-4">
            <Feather
              name="alert-triangle"
              size={20}
              color={GOLD}
              style={{ marginTop: 1 }}
            />
            <Text className="happy-font-body-semibold ml-3 flex-1 text-sm leading-5 text-sage-700">
              You'll be logged out immediately. This can't be recovered later.
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3 w-full">
          <Pressable
            onPress={handleClose}
            disabled={isDeleting}
            className="happy-brand-card flex-1 flex-row items-center justify-center rounded-[24px] py-4 active:opacity-80"
          >
            <Text className="happy-font-body-bold mr-2 text-[17px] text-sage-700">
              Cancel
            </Text>
            <Feather name="x" size={20} color={SAGE[700]} />
          </Pressable>

          <Pressable
            onPress={handleConfirm}
            disabled={isDeleting}
            className="flex-1 flex-row items-center justify-center rounded-[24px] bg-terracotta py-4 active:opacity-90"
            style={{ borderBottomWidth: 4, borderBottomColor: TERRACOTTA }}
          >
            {isDeleting ? (
              <>
                <Text className="happy-font-body-bold mr-2 text-[17px] text-brand-surface">
                  Erasing...
                </Text>
                <ActivityIndicator color={BRAND_SURFACE} size="small" />
              </>
            ) : (
              <>
                <Text className="happy-font-body-bold mr-2 text-[17px] text-brand-surface">
                  Delete
                </Text>
                <Feather name="trash" size={20} color={BRAND_SURFACE} />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </ShortBottomModal>
  );
};

const DataItem = ({ text }: { text: string }) => (
  <View className="flex-row items-center">
    <View className="mr-3 h-2 w-2 rounded-full bg-terracotta-light" />
    <Text className="happy-font-body-medium text-sm leading-5 text-ink">
      {text}
    </Text>
  </View>
);
