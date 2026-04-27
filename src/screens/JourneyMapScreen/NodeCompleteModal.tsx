/**
 * NodeCompleteModal
 *
 * Pure presentational modal that appears when a user taps an active journey
 * node. Contains a single "Done" CTA — no business logic.
 *
 * Props:
 *  - visible          → controls Modal visibility
 *  - isCompletingNode → shows a loading spinner on the CTA
 *  - onClose          → called when the backdrop or back-button is pressed
 *  - onDone           → called when the "Done" button is pressed
 */

import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NodeCompleteModalProps {
  visible: boolean;
  isCompletingNode: boolean;
  onClose: () => void;
  onDone: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NodeCompleteModal({
  visible,
  isCompletingNode,
  onClose,
  onDone,
}: NodeCompleteModalProps): React.JSX.Element {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        if (!isCompletingNode) onClose();
      }}
    >
      {/* Dimmed backdrop — dismisses the modal when tapped */}
      <View className="flex-1 justify-center items-center px-6 bg-slate-900/40">
        <Pressable
          className="absolute inset-0"
          disabled={isCompletingNode}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close node modal"
        />

        {/* Card */}
        <View className="w-full max-w-[260px] bg-white rounded-3xl p-5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mark node as done"
            disabled={isCompletingNode}
            onPress={onDone}
            className="min-h-[56px] rounded-2xl items-center justify-center"
            style={{
              backgroundColor: isCompletingNode ? "#A3E635" : "#58CC02",
            }}
          >
            {isCompletingNode ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg font-extrabold">Done</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default NodeCompleteModal;
