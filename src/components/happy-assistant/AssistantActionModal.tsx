import { type ReactElement, type ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";

interface AssistantActionModalProps {
  visible: boolean;
  bottomInset: number;
  children: ReactNode;
  onClose: () => void;
}

export function AssistantActionModal({
  visible,
  bottomInset,
  children,
  onClose,
}: AssistantActionModalProps): ReactElement {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-sage-800/35">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close Happy Assistant"
          className="absolute inset-0"
          onPress={onClose}
        />
        <View
          className="px-4"
          style={{ paddingBottom: bottomInset }}
          pointerEvents="box-none"
        >
          <View className="overflow-hidden rounded-[32px] bg-white">
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}
