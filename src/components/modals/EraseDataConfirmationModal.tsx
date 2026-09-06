import React, { useState, useEffect } from "react";
import { View, Modal, Pressable, TextInput, Keyboard } from "react-native";
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

import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";

interface DataItemProps {
  text: string;
}

// ponytail: simple neutral bullet row with normalized high-contrast text
const DataItem = ({ text }: DataItemProps): React.JSX.Element => (
  <View className="flex-row items-center">
    <View className="mr-3 h-1.5 w-1.5 rounded-full bg-ink-soft" />
    <Text className="flex-1 text-[14px] leading-5 text-ink happy-font-body-medium">
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
  // ponytail: 2-step deliberate confirmation flow inside single sheet
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState<string>("");

  useEffect(() => {
    if (visible) {
      setStep(1);
      setConfirmText("");
    }
  }, [visible]);

  const handleClose = (): void => {
    if (isDeleting) return;
    Keyboard.dismiss();
    Haptics.selectionAsync();
    setStep(1);
    setConfirmText("");
    onClose();
  };

  const handleConfirm = async (): Promise<void> => {
    if (confirmText.trim().toUpperCase() !== "DELETE") return;
    Keyboard.dismiss();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await onConfirm();
    setStep(1);
    setConfirmText("");
    onClose();
  };

  const isDeleteConfirmed = confirmText.trim().toUpperCase() === "DELETE";
  const paddingBottom = Math.max(insets.bottom, 16) + 4;

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
              // ponytail: compact 455pt detent eliminates excess blank space
              presentationDetents([{ height: 455 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View
                style={{ paddingBottom }}
                className="flex-1 items-center justify-between px-6 pt-4"
              >
                {step === 1 ? (
                  <>
                    <View className="items-center w-full">
                      <View className="mb-2.5">
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={26}
                          color={SEMANTIC_COLORS.error.foreground}
                        />
                      </View>

                      <Text className="happy-font-heading mb-1.5 text-center text-[26px] leading-8 text-ink">
                        Delete all data?
                      </Text>

                      <Text className="mb-0.5 px-2 text-center text-[15px] leading-5 text-ink-soft">
                        This permanently deletes your private data from Happy.
                      </Text>
                      <Text className="mb-3.5 text-center text-[15px] leading-5 happy-font-body-bold text-ink">
                        This cannot be undone.
                      </Text>

                      <View className="mb-3.5 w-full px-2 gap-2">
                        <DataItem text="Journal entries and transcripts" />
                        <DataItem text="Mood history" />
                        <DataItem text="AI insights and analysis" />
                        <DataItem text="Streaks and progress" />
                        <DataItem text="Account and profile data" />
                      </View>

                      <View className="w-full flex-row items-center justify-center gap-1.5 mb-1">
                        <HugeiconsIcon
                          icon={AlertCircleIcon}
                          size={15}
                          color={SEMANTIC_COLORS.text.secondary}
                        />
                        <Text className="text-[13px] leading-4 text-ink-soft happy-font-body-medium">
                          You'll be signed out.
                        </Text>
                      </View>
                    </View>

                    <View className="flex-col gap-1.5 w-full">
                      <Button
                        label="Continue"
                        variant="secondary"
                        size="lg"
                        onPress={() => {
                          Haptics.selectionAsync();
                          setStep(2);
                        }}
                        className="w-full"
                      />
                      <Pressable
                        onPress={handleClose}
                        disabled={isDeleting}
                        accessibilityRole="button"
                        accessibilityLabel="Cancel"
                        className="w-full py-2.5 items-center justify-center active:opacity-70"
                      >
                        <Text className="text-[16px] text-ink happy-font-body-bold">
                          Cancel
                        </Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="items-center w-full">
                      <View className="mb-2">
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={26}
                          color={SEMANTIC_COLORS.error.foreground}
                        />
                      </View>

                      <Text className="happy-font-heading mb-1.5 text-center text-[24px] leading-7 text-ink">
                        Delete everything permanently?
                      </Text>

                      <Text className="text-center text-[14px] leading-5 text-ink-soft px-3 mb-3">
                        All of your Happy history will be erased and you will be signed out.
                      </Text>

                      <Text className="text-center text-[13px] leading-4 text-ink happy-font-body-bold mb-2">
                        Type DELETE to confirm.
                      </Text>

                      <TextInput
                        className="w-full h-11 rounded-xl bg-neutral-100 border border-neutral-300 px-4 text-center text-[15px] happy-font-body-bold text-ink tracking-wider mb-2"
                        placeholder="DELETE"
                        placeholderTextColor={SEMANTIC_COLORS.text.tertiary as string}
                        value={confirmText}
                        onChangeText={setConfirmText}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        editable={!isDeleting}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>

                    <View className="flex-col gap-1.5 w-full">
                      <Button
                        label={isDeleting ? "Deleting..." : "Delete All Data"}
                        variant="danger"
                        size="lg"
                        onPress={handleConfirm}
                        disabled={!isDeleteConfirmed || isDeleting}
                        loading={isDeleting}
                        className="w-full"
                      />
                      <Pressable
                        onPress={handleClose}
                        disabled={isDeleting}
                        accessibilityRole="button"
                        accessibilityLabel="Cancel"
                        className="w-full py-2.5 items-center justify-center active:opacity-70"
                      >
                        <Text className="text-[16px] text-ink happy-font-body-bold">
                          Cancel
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
};
