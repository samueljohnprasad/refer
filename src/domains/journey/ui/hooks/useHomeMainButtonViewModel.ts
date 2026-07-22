import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type HomeMainButtonProps = {
  unitLabel: string;
  unitTitle: string;
  faceColor: string;
  rimColor: string;
  unitIconKey?: string | null;
  onPress: () => void;
};

export function useHomeMainButtonViewModel({
  faceColor,
  rimColor,
  onPress,
}: HomeMainButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: withTiming(faceColor, { duration: 300 }),
      borderBottomColor: withTiming(rimColor, { duration: 300 }),
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 20, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    void Haptics.selectionAsync();
    onPress();
  }, [onPress]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    handlePress,
  };
}
