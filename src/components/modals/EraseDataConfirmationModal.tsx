import React from "react";
import { View, Modal } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Delete02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { GOLD, SAGE, TERRACOTTA, INK_SOFT } from "@/lib/tokens";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";

interface DataItemProps {
  text: string;
}

const DataItem = ({ text }: DataItemProps): React.JSX.Element => (
  <View className="flex-row items-center">
    <View className="mr-3 h-1.5 w-1.5 rounded-full bg-red-200" />
    <Text variant="label" className="flex-1 text-sm leading-5 text-ink">
      {text}
    </Text>
  </View>
);

interface EraseDataConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export const EraseDataConfirmationModal: React.FC<
  EraseDataConfirmationModalProps
> = ({ visible, onClose, onConfirm, isDeleting = false }) => {
  const insets = useSafeAreaInsets();

  const handleClose = (): void => {
    if (isDeleting) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleConfirm = async (): Promise<void> => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await onConfirm();
    onClose();
  };

  const paddingBottom = Math.max(insets.bottom, 24) + 8;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Host>
      <BottomSheet
        isPresented={visible}
        onIsPresentedChange={(val) => {
          if (!val) {
            handleClose();
          }
        }}
      >
        <Group
          modifiers={[
            presentationDetents([{ height: 585 }]),
            presentationDragIndicator("visible"),
          ]}
        >
          <RNHostView>
            <View
              style={{ paddingBottom }}
              className="flex-1 items-center justify-between px-5 pt-5"
            >
              <View className="items-center w-full">
                <View className="mb-6">
                  <HugeiconsIcon icon={Delete02Icon} size={36} color={TERRACOTTA} />
                </View>

                <Text className="happy-font-body-bold mb-2 text-center text-[30px] leading-9 text-ink">
                  Erase All Data?
                </Text>

                <Text variant="body" className="mb-4 px-2 text-center text-base leading-6 text-ink-soft">
                  This permanently removes the private history saved in Happy.
                </Text>

                <View className="mb-8 w-full px-4 gap-4">
                  <DataItem text="Journal entries and transcripts" />
                  <DataItem text="Mood history and emotions" />
                  <DataItem text="AI insights and analysis" />
                  <DataItem text="Streaks and engagement stats" />
                  <DataItem text="Profile and account information" />
                </View>

                <View className="w-full flex-row items-center justify-center gap-2 px-4 mb-2">
                  <HugeiconsIcon
                    icon={AlertCircleIcon}
                    size={16}
                    color={TERRACOTTA}
                  />
                  <Text className="text-sm text-terracotta font-medium">
                    You'll be logged out. This cannot be undone.
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-col gap-3 w-full">
                <Button
                  label={isDeleting ? "Erasing..." : "Delete All Data"}
                  variant="danger"
                  size="lg"
                  onPress={handleConfirm}
                  loading={isDeleting}
                  className="w-full"
                />
                <Button
                  label="Cancel"
                  variant="ghost"
                  size="lg"
                  onPress={handleClose}
                  disabled={isDeleting}
                  className="w-full"
                />
              </View>
            </View>
          </RNHostView>
        </Group>
      </BottomSheet>
      </Host>
    </Modal>
  );
};
