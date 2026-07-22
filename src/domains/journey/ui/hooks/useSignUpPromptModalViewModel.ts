import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export interface SignUpPromptModalProps {
  visible: boolean;
  guestXP: number;
  completedNodes: number;
  onSignUp: () => void;
  onDismiss: () => void;
}

export function useSignUpPromptModalViewModel({
  visible,
  guestXP,
  completedNodes,
  onSignUp,
  onDismiss,
}: SignUpPromptModalProps) {
  const slideY = useSharedValue<number>(300);
  const backdropOpacity = useSharedValue<number>(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 250 });
      slideY.value = withDelay(
        100,
        withSpring(0, {
          damping: 20,
          stiffness: 100,
          overshootClamping: true,
        }),
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      slideY.value = 300;
      backdropOpacity.value = 0;
    }
  }, [visible, slideY, backdropOpacity]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return {
    cardStyle,
    backdropStyle,
    visible,
    guestXP,
    completedNodes,
    onSignUp,
    onDismiss,
  };
}
