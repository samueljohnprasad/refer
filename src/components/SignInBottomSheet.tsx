import React, { forwardRef, useImperativeHandle } from "react";
import { StyleSheet } from "react-native";
import { BottomSheet, Group, Host, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import SignInBottomSheetContent from "./SignInBottomSheet/SignInBottomSheetContent";
import { useSignInBottomSheetController } from "./SignInBottomSheet/useSignInBottomSheetController";

interface SignInBottomSheetProps {
  source?: "entry" | "onboarding";
  onDismiss?: () => void;
  onSkip?: () => void;
  onSuccess?: () => void;
  showSkipButton?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface SignInBottomSheetHandle {
  present: () => void;
  dismiss: () => void;
}

export default forwardRef<SignInBottomSheetHandle, SignInBottomSheetProps>(
  function SignInBottomSheet(
    {
      source = "entry",
      onDismiss,
      onSkip,
      onSuccess,
      showSkipButton = false,
      onOpenChange,
    },
    ref,
  ) {
    const controller = useSignInBottomSheetController({
      source,
      onDismiss,
      onSkip,
      onSuccess,
      onOpenChange,
    });

    useImperativeHandle(ref, () => ({
      present: controller.openSheet,
      dismiss: controller.dismissSheet,
    }));

    const sheetHeight =
      controller.premiumRecovery || controller.accountConflict
        ? 380
        : showSkipButton
          ? 285
          : 245;

    return (
      <Host
        style={controller.isOpen ? StyleSheet.absoluteFill : undefined}
        pointerEvents={controller.isOpen ? "auto" : "none"}
      >
        <BottomSheet
          isPresented={controller.isOpen}
          onIsPresentedChange={(isPresented: boolean) => {
            if (!isPresented) controller.handleSheetDismiss();
          }}
        >
          <Group
            modifiers={[
              presentationDetents([{ height: sheetHeight }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <SignInBottomSheetContent
                isAnonymous={controller.isAnonymous}
                accountConflict={controller.accountConflict}
                hasPro={controller.hasPro}
                providerLabel={controller.providerLabel}
                busyProvider={controller.busyProvider}
                busyMove={controller.busyMove}
                busyRestore={controller.busyRestore}
                premiumRecovery={controller.premiumRecovery}
                isAppleAuthAvailable={controller.isAppleAuthAvailable}
                showSkipButton={showSkipButton}
                onProviderPress={controller.handleProviderPress}
                onStay={controller.handleStay}
                onMove={controller.handleMove}
                onRetryRestore={controller.handleRetryRestore}
                onContinueAfterRecovery={
                  controller.handleContinueAfterRecovery
                }
                onSkip={controller.handleSkip}
              />
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    );
  },
);
