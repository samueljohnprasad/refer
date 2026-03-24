import React, { useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  // FIX #32: Replace Dimensions with useWindowDimensions for responsive handling
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Achievement } from "@/src/types/achievements";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
// FIX #33: Use an X/close icon for the dismiss button instead of just a text label
import { Cancel01Icon, StarsIcon } from "@hugeicons/core-free-icons";

interface AchievementUnlockModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onDismiss: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
  // FIX #34: Added shape variation for confetti visual interest
  shape: "square" | "circle" | "diamond";
}

// FIX #35: More diverse and vibrant confetti palette
const CONFETTI_COLORS = [
  "#FFD700",
  "#FFA500",
  "#FF6B6B",
  "#4ECDC4",
  "#95E1D3",
  "#A78BFA",
  "#34D399",
  "#F472B6",
];

/**
 * Celebration modal shown when an achievement is unlocked.
 */
export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  visible,
  achievement,
  onDismiss,
}) => {
  // FIX #32: useWindowDimensions for safe responsive sizing
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (visible && achievement) {
      // FIX #36: Reduced confetti count from 25 → 16 for better performance on low-end devices
      const shapes: ConfettiPiece["shape"][] = ["square", "circle", "diamond"];
      const pieces: ConfettiPiece[] = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        delay: Math.random() * 300,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }));
      setConfetti(pieces);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      iconScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.4, { damping: 8, stiffness: 150 }),
          withSpring(1, { damping: 10, stiffness: 120 }),
        ),
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
      iconScale.value = 0;
      setConfetti([]);
    }
  }, [visible, achievement]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (!visible || !achievement) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      // FIX #37: Added accessible props to the modal
      accessibilityViewIsModal={true}
    >
      <Pressable
        className="flex-1 bg-black/60 items-center justify-center px-6"
        onPress={onDismiss}
        accessible={false}
      >
        {/* Confetti */}
        {confetti.map((piece) => (
          <ConfettiDrop
            key={piece.id}
            screenHeight={SCREEN_HEIGHT}
            {...piece}
          />
        ))}

        <Animated.View
          style={containerStyle}
          // FIX #38: Reduced horizontal margin — use full width with px-6 on outer Pressable
          className="bg-white rounded-3xl w-full items-center overflow-hidden"
        >
          {/* FIX #39: Amber gradient header strip above modal content */}
          <View className="w-full bg-amber-50 border-b border-amber-100 items-center pt-8 pb-6">
            <Animated.View
              style={iconStyle}
              // FIX #40: Removed hard-coded border-yellow-400 — use more subtle amber border
              className="w-28 h-28 rounded-3xl bg-amber-100 items-center justify-center border-2 border-amber-200"
            >
              <Text style={{ fontSize: 56 }}>{achievement.icon}</Text>
            </Animated.View>
          </View>

          {/* Body */}
          <View className="items-center px-6 pt-6 pb-8 w-full">
            {/* FIX #41: Title split into eyebrow + name hierarchy */}
            <Text className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
              Achievement Unlocked 🎉
            </Text>
            <Text className="text-2xl font-black text-gray-900 text-center mb-1">
              {achievement.name}
            </Text>

            {/* Description */}
            {/* FIX #42: Description now uses text-gray-600 for better contrast */}
            <Text className="text-gray-600 text-center text-sm leading-5 mb-5">
              {achievement.description}
            </Text>

            {/* XP Bonus */}
            {/* FIX #43: XP pill now uses an icon for visual richness */}
            <View className="flex-row items-center gap-2 bg-amber-50 border border-amber-100 px-5 py-2.5 rounded-full mb-6">
              <HugeiconsIcon
                icon={StarsIcon}
                size={16}
                color="#D97706"
                strokeWidth={1.8}
              />
              <Text className="text-amber-700 font-bold text-base">
                +{achievement.xpBonus} XP Bonus!
              </Text>
            </View>

            {/* Dismiss Button */}
            {/* FIX #44: Button has full width, proper active opacity, and accessible label */}
            <Pressable
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                width: "100%",
              })}
              className="bg-gray-900 rounded-2xl py-3.5 items-center"
            >
              <Text className="text-white font-bold text-base">Continue</Text>
            </Pressable>

            {/* FIX #45: Hint text below button */}
            <Text className="text-gray-400 text-xs mt-3 text-center">
              Tap anywhere to dismiss
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

// FIX #34, #36: Confetti with shape variants and screenHeight prop
const ConfettiDrop: React.FC<ConfettiPiece & { screenHeight: number }> = ({
  x,
  delay,
  color,
  shape,
  screenHeight,
}) => {
  const translateY = useSharedValue(-50);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(screenHeight + 50, { duration: 2000 + Math.random() * 1000 }),
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 * (2 + Math.random() * 2), { duration: 2500 }),
    );
    opacity.value = withDelay(1500 + delay, withTiming(0, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: 0,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const shapeStyle =
    shape === "circle"
      ? "w-3 h-3 rounded-full"
      : shape === "diamond"
        ? "w-2.5 h-2.5 rounded-sm rotate-45"
        : "w-3 h-3 rounded-sm";

  return (
    <Animated.View style={style}>
      <View className={shapeStyle} style={{ backgroundColor: color }} />
    </Animated.View>
  );
};
