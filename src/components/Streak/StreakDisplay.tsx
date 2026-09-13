import React, { useCallback } from "react";
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
  const previousStreak = Math.max(0, currentStreak - 1);

  // Trigger review prompt on Day 3 (2->3), Day 7, and Day 15 milestones
  const { requestReview } = useReviewPrompt({
    currentStreak,
    previousStreak,
    enabled: visible,
  });

  const handleClose = useCallback(() => {
    onClose();
    if (
      (previousStreak === 2 && currentStreak === 3) ||
      currentStreak === 7 ||
      currentStreak === 15
    ) {
      requestReview();
    }
  }, [onClose, previousStreak, currentStreak, requestReview]);

  if (isLoading) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StreakCelebration 
        previousStreak={previousStreak}
        streak={currentStreak}
        onClose={handleClose}
      />
    </Modal>
  );
};
