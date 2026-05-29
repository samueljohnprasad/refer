import { type ReactElement, type ReactNode } from "react";
import { View, Modal } from "react-native";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";

interface AssistantActionModalProps {
  visible: boolean;
  bottomInset: number;
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
              presentationDetents([{ height: 440 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1">
                {children}
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
}
