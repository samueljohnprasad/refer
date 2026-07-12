import React, { useEffect, useState } from "react";
import { View, Text, Modal, Pressable, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { LevelTier } from "@/src/types/levels";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { getLevelIcon } from "./LevelBadge";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface LevelUpCelebrationProps {
  visible: boolean;
  newLevel: LevelTier;
  onDismiss: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
}

const CONFETTI_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#95E1D3",
  "#F38181",
  "#AA96DA",
];

/**
 * Celebration modal shown when user levels up
 * Features confetti animation and level info
 */
export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  visible,
  newLevel,
  onDismiss,
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        delay: Math.random() * 500,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      }));
      setConfetti(pieces);

      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Animate in
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true });
      iconScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.3, { damping: 20, stiffness: 100, overshootClamping: true }),
          withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
        ),
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
      iconScale.value = 0;
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Pressable
        className="flex-1 bg-black/60 items-center justify-center"
        onPress={onDismiss}
      >
        {/* Confetti */}
        {confetti.map((piece) => (
          <ConfettiDrop key={piece.id} {...piece} />
        ))}

        <Animated.View
          style={containerStyle}
          className="bg-white rounded-3xl p-8 mx-6 items-center"
        >
          {/* Level Icon */}
          <Animated.View
            style={[iconStyle, { backgroundColor: newLevel.color + "30" }]}
            className="w-24 h-24 rounded-full items-center justify-center mb-4"
          >
            <HugeiconsIcon icon={getLevelIcon(newLevel.level)} size={48} color={newLevel.color} />
          </Animated.View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Level Up! 🎉
          </Text>

          {/* Level Name */}
          <Text
            className="text-xl font-semibold mb-4"
            style={{ color: newLevel.color }}
          >
            {newLevel.name}
          </Text>

          {/* Description */}
          <Text className="text-gray-500 text-center mb-6">
            Congratulations! You've reached level {newLevel.level}.{"\n"}Keep up
            the great work!
          </Text>

          {/* Dismiss Button */}
          <Pressable
            onPress={onDismiss}
            className="bg-gray-900 px-8 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Continue</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

// Individual confetti piece
const ConfettiDrop: React.FC<ConfettiPiece> = ({ x, delay, color }) => {
  const translateY = useSharedValue(-50);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 50, { duration: 2000 + Math.random() * 1000 }),
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

  return (
    <Animated.View style={style}>
      <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
    </Animated.View>
  );
};
