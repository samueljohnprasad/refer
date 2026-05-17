import { useMemo, type ReactElement, type ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

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
  const contentStyle = useMemo(
    () => [styles.content, { paddingBottom: bottomInset }],
    [bottomInset],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close Happy Assistant"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View style={contentStyle} pointerEvents="box-none">
          <View style={styles.card}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.28)",
  },
  content: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 28,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: "white",
    boxShadow: "0 14px 28px rgba(0, 0, 0, 0.18)",
  },
});
