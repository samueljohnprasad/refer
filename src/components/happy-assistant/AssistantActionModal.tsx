import { type ReactElement, type ReactNode } from "react";
import { View, Modal } from "react-native";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";

interface AssistantActionModalProps {
  visible: boolean;
  children: ReactNode;
  onClose: () => void;
}

export function AssistantActionModal({
  visible,
  children,
  onClose,
}: AssistantActionModalProps): ReactElement | null {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Host>
        <BottomSheet
          isPresented={visible}
          onIsPresentedChange={(val: boolean) => {
            if (!val) {
              onClose();
            }
          }}
        >
          <Group
            modifiers={[
              // ponytail: compact detent height eliminating empty space per audit (24-32pt after save row)
              presentationDetents([{ height: 320 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1">{children}</View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
}
