import { Modal } from "react-native";
import { BlurView } from "expo-blur";

interface BlurModalProps {
  visible: boolean;
  children?: React.ReactNode;
}

export default function BlurModal({ visible, children }: BlurModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView
        intensity={10}
        style={{
          flex: 1,
          justifyContent: "flex-start",
        }}
      >
        {children}
      </BlurView>
    </Modal>
  );
}
