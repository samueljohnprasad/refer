import React from "react";
import { Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TactileButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const TactileButton: React.FC<TactileButtonProps> = ({
  label,
  onPress,
  disabled = false,
  variant = "primary",
}) => {
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    translateY.value = withTiming(1.5, { duration: 90 });
  };

  const handlePressOut = () => {
    translateY.value = withTiming(0, { duration: 120 });
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (variant === "secondary") {
    return (
      <Pressable onPress={handlePress} className="w-full items-center py-3">
        <Text
          className="happy-brand-secondary-cta-text happy-font-body-medium"
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={animatedStyle}
      className={`w-full items-center rounded-2xl px-6 py-[18px] ${
        disabled ? "happy-brand-primary-cta-disabled" : "happy-brand-primary-cta"
      }`}
    >
      <Text
        className={`happy-font-body-bold text-base font-bold tracking-wide ${
          disabled ? "text-ink-muted" : "text-white"
        }`}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

export default React.memo(TactileButton);
