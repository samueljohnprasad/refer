import React from "react";
import { Modal } from "react-native";

export interface VoiceRecorderModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Called when user requests to close (e.g., swipe-down or back) */
  onRequestClose: () => void;
  children: React.ReactNode;
}

/**
 * Full-screen, therapeutic voice-recorder modal.
 * Wraps the existing `VoiceRecorderScreen` UI inside a native RN `Modal`.
 * Opens from any screen by toggling the `visible` prop.
 */
const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  visible,
  onRequestClose,
  children,
}) => {
  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      visible={visible}
      transparent
      onRequestClose={onRequestClose}
    >
      {children}
    </Modal>
  );
};

export default VoiceRecorderModal;
