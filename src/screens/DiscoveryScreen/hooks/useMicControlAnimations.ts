import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface UseMicControlAnimationsProps {
  isRecording: boolean;
  isPaused: boolean;
}

/**
 * Custom hook to manage all animations for the mic control view
 * Handles mic button, side icons, and overlay animations
 */
export const useMicControlAnimations = ({
  isRecording,
  isPaused,
}: UseMicControlAnimationsProps) => {
  // Animated shared values
  const micScale = useSharedValue(1);
  const micOpacity = useSharedValue(0);
  const sideIconsOpacity = useSharedValue(0);
  const sideIconsScale = useSharedValue(0.8);

  // Animate when recording state changes
  useEffect(() => {
    if (isRecording) {
      // Fade out controls smoothly when recording starts
      micOpacity.value = withTiming(0, { duration: 400 });
      sideIconsOpacity.value = withTiming(0, { duration: 400 });
      micScale.value = 1; // Reset scale when hiding
    } else {
      // Fade in controls with spring when recording stops
      micOpacity.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });

      // Add subtle pulsing effect to mic button on appear
      micScale.value = withSpring(1.05, {
        damping: 10,
        stiffness: 100,
      });

      // Return to normal scale after pulse
      setTimeout(() => {
        micScale.value = withSpring(1, {
          damping: 12,
          stiffness: 120,
        });
      }, 300);
    }
  }, [isRecording]);

  // Animate side icons when paused state changes
  useEffect(() => {
    if (isPaused && !isRecording) {
      // Show side icons with fade and scale
      sideIconsOpacity.value = withTiming(1, { duration: 300 });
      sideIconsScale.value = withSpring(1, {
        damping: 12,
        stiffness: 150,
      });
    } else {
      // Hide side icons smoothly
      sideIconsOpacity.value = withTiming(0, { duration: 350 });
      sideIconsScale.value = withSpring(0.8, {
        damping: 15,
        stiffness: 200,
      });
    }
  }, [isPaused, isRecording]);

  // Animated styles for mic button
  const micAnimatedStyle = useAnimatedStyle(() => ({
    opacity: micOpacity.value,
    transform: [{ scale: micScale.value }],
  }));

  // Animated styles for side icons (cancel & tick)
  const sideIconsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sideIconsOpacity.value,
    transform: [{ scale: sideIconsScale.value }],
  }));

  return {
    micAnimatedStyle,
    sideIconsAnimatedStyle,
  };
};
