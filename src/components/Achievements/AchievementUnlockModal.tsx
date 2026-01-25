import React, { useEffect } from "react";
import { View, Text, Modal, Pressable, Dimensions } from "react-native";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
}

const CONFETTI_COLORS = ["#FFD700", "#FFA500", "#FF6B6B", "#4ECDC4", "#95E1D3"];

/**
 * Celebration modal shown when an achievement is unlocked
 */
export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  visible,
  achievement,
  onDismiss,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (visible && achievement) {
      // Generate confetti
      const pieces: ConfettiPiece[] = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        delay: Math.random() * 400,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
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
          {/* Badge Icon */}
          <Animated.View
            style={iconStyle}
            className="w-28 h-28 rounded-3xl bg-yellow-100 items-center justify-center mb-4 border-4 border-yellow-400"
          >
            <Text style={{ fontSize: 56 }}>{achievement.icon}</Text>
          </Animated.View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Achievement Unlocked! 🎉
          </Text>

          {/* Badge Name */}
          <Text className="text-xl font-semibold text-yellow-600 mb-2">
            {achievement.name}
          </Text>

          {/* Description */}
          <Text className="text-gray-500 text-center mb-4">
            {achievement.description}
          </Text>

          {/* XP Bonus */}
          <View className="bg-yellow-100 px-4 py-2 rounded-full mb-6">
            <Text className="text-yellow-700 font-bold">
              +{achievement.xpBonus} XP Bonus!
            </Text>
          </View>

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

// Confetti drop animation
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
