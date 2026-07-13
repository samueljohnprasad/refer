import React from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Cancel01Icon,
  Logout02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { INK, SAGE } from "@/lib/tokens";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";

interface SignOutConfirmationModalProps {
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  isSignoutOPen?: boolean;
  handleClose: () => void;
}

export const SignOutConfirmationModal: React.FC<
  SignOutConfirmationModalProps
> = ({ onConfirm, isLoading = false, isSignoutOPen = false, handleClose }) => {
  if (!isSignoutOPen) return null;

  const insets = useSafeAreaInsets();

  const handleCloseCancel = (): void => {
    if (isLoading) return;
    Haptics.selectionAsync();
    handleClose();
  };

  const handleConfirm = (): void => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm().then(() => handleClose());
  };

  const paddingBottom = Math.max(insets.bottom, 24) + 8;

  return (
    <Host>
      <BottomSheet
        isPresented={isSignoutOPen}
        onIsPresentedChange={(val) => {
          if (!val) {
            handleCloseCancel();
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
            <View
              style={{ paddingBottom }}
              className="flex-1 px-5 pt-5 items-center justify-between"
            >
              <View className="items-center w-full">
                {/* Icon Header */}
                <View className="w-12 h-12 rounded-full bg-sage-pill items-center justify-center mb-4">
                  <HugeiconsIcon icon={AlertCircleIcon} size={22} color={SAGE[600]} />
                </View>

                <Text variant="h1" className="text-center text-3xl text-ink mb-2 leading-9 font-bold">
                  Sign Out?
                </Text>

                <Text variant="body" className="text-ink-soft text-center text-base px-1 leading-6">
                  Are you sure you want to sign out? You'll need to sign in again to
                  access your journals.
                </Text>
              </View>

              {/* Buttons */}
              <View className="flex-row gap-3 w-full mt-4">
                <Button
                  label="Cancel"
                  variant="secondary"
                  size="md"
                  onPress={handleCloseCancel}
                  disabled={isLoading}
                  className="flex-1"
                  rightIcon={<HugeiconsIcon icon={Cancel01Icon} size={16} color={INK} />}
                />
                <Button
                  label={isLoading ? "Signing Out..." : "Sign Out"}
                  variant="primary"
                  size="md"
                  onPress={handleConfirm}
                  loading={isLoading}
                  className="flex-1"
                  rightIcon={<HugeiconsIcon icon={Logout02Icon} size={16} color="white" />}
                />
              </View>
            </View>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
};
