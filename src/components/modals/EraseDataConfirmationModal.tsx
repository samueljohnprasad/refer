import React from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Delete02Icon,
  Cancel01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { GOLD, SAGE, TERRACOTTA } from "@/lib/tokens";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";

interface DataItemProps {
  text: string;
}

const DataItem = ({ text }: DataItemProps): React.JSX.Element => (
  <View className="flex-row items-center">
    <View className="mr-3 h-2 w-2 rounded-full bg-red-400" />
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
  if (!visible) return null;

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
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-[24px] border-2 border-red-100 bg-red-50">
                  <HugeiconsIcon icon={Delete02Icon} size={28} color={TERRACOTTA} />
                </View>

                <Text variant="h3" className="mb-2 text-center text-[30px] leading-9 text-ink font-bold">
                  Erase All Data?
                </Text>

                <Text variant="body" className="mb-4 px-2 text-center text-base leading-6 text-ink-soft">
                  This permanently removes the private history saved in Happy.
                </Text>

                <Card
                  variant="answer"
                  radius="xl"
                  showDepth={false}
                  className="mb-4 w-full"
                  contentClassName="p-4"
                >
                  <Text variant="eyebrow" className="mb-3 text-[11px] tracking-widest text-ink-muted uppercase">
                    Will be deleted
                  </Text>
                  <View className="gap-3">
                    <DataItem text="Journal entries and transcripts" />
                    <DataItem text="Mood history and emotions" />
                    <DataItem text="AI insights and analysis" />
                    <DataItem text="Streaks and engagement stats" />
                    <DataItem text="Profile and account information" />
                  </View>
                </Card>

                <Card
                  variant="tile"
                  radius="lg"
                  showDepth={false}
                  className="border-amber-200 bg-amber-50/50 w-full"
                  contentClassName="flex-row items-start p-4 gap-3"
                >
                  <View className="mt-0.5">
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      size={18}
                      color={GOLD}
                    />
                  </View>
                  <Text variant="label" className="flex-1 text-sm leading-5 text-amber-900 font-medium">
                    You'll be logged out immediately. This can't be recovered later.
                  </Text>
                </Card>
              </View>

              <View className="mt-5 flex-row gap-3 w-full">
                <Button
                  label="Cancel"
                  variant="secondary"
                  size="md"
                  onPress={handleClose}
                  disabled={isDeleting}
                  className="flex-1"
                  rightIcon={<HugeiconsIcon icon={Cancel01Icon} size={16} color={SAGE[700]} />}
                />
                <Button
                  label={isDeleting ? "Erasing..." : "Delete"}
                  variant="destructive"
                  size="md"
                  onPress={handleConfirm}
                  loading={isDeleting}
                  className="flex-1"
                  rightIcon={<HugeiconsIcon icon={Delete02Icon} size={16} color="white" />}
                />
              </View>
            </View>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
};
