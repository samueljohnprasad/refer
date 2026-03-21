import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Coins01Icon } from "@hugeicons/core-free-icons";

interface CoinsBadgeProps {
  coins: number;
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
}

/**
 * Displays coin balance with animated coin icon
 */
export const CoinsBadge: React.FC<CoinsBadgeProps> = ({
  coins,
  onPress,
  size = "md",
}) => {
  const scale = useSharedValue(1);

  const sizeStyles = {
    sm: { container: "px-2 py-1", icon: 14, text: "text-xs" },
    md: { container: "px-3 py-1.5", icon: 18, text: "text-sm" },
    lg: { container: "px-4 py-2", icon: 22, text: "text-base" },
  };

  const styles = sizeStyles[size];

  const handlePress = (): void => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 10 }),
    );
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          animatedStyle,
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          },
        ]}
        className={`flex-row items-center ${styles.container} bg-white rounded-full border border-gray-100`}
      >
        <HugeiconsIcon
          icon={Coins01Icon}
          size={styles.icon}
          color="#F59E0B"
          strokeWidth={1.8}
        />
        <Text className={`${styles.text} font-bold text-gray-800 ml-1.5`}>
          {coins.toLocaleString()}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
