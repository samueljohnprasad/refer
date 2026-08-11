import React from "react";
import { Modal } from "react-native";
import { useStreak } from "@/src/hooks/useStreak";
import { useReviewPrompt } from "@/src/hooks/useReviewPrompt";
import { StreakCelebration } from "./StreakCelebration";

export interface StreakDisplayProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Called when the user dismisses or taps Continue */
  onClose: () => void;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  visible,
  onClose,
}) => {
  const { currentStreak, isLoading } = useStreak();

  // Trigger review prompt at 1-day streak milestone
  useReviewPrompt({
    currentStreak: currentStreak,
    enabled: true,
  });

  if (isLoading) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StreakCelebration 
        previousStreak={Math.max(0, currentStreak - 1)}
        streak={currentStreak}
        onClose={onClose}
      />
    </Modal>
  );
};
