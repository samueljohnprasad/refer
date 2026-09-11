import { useCallback } from "react";
import {
  useAnimatedStyle,
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
  const faceStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(faceColor, { duration: 300 }),
    };
  });

  const rimStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(rimColor, { duration: 300 }),
    };
  });

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return {
    faceStyle,
    rimStyle,
    handlePress,
  };
}
