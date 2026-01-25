import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { Reward } from "@/src/types/rewards";
import * as Haptics from "expo-haptics";

interface RewardPurchaseModalProps {
  visible: boolean;
  reward: Reward | null;
  currentCoins: number;
  onConfirm: () => void;
  onCancel: () => void;
  isPurchasing?: boolean;
}

/**
 * Confirmation modal for reward purchases
 */
export const RewardPurchaseModal: React.FC<RewardPurchaseModalProps> = ({
  visible,
  reward,
  currentCoins,
  onConfirm,
  onCancel,
  isPurchasing = false,
}) => {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      scale.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible || !reward) return null;

  const canAfford = currentCoins >= reward.cost;
  const remainingCoins = currentCoins - reward.cost;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center"
        onPress={onCancel}
      >
        <Animated.View
          style={animatedStyle}
          className="bg-white rounded-3xl p-6 mx-6 w-80 items-center"
        >
          {/* Icon */}
          <View
            className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
            style={{ backgroundColor: reward.color + "20" }}
          >
            <Text style={{ fontSize: 40 }}>{reward.icon}</Text>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {reward.name}
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-4">
            {reward.description}
          </Text>

          {/* Price breakdown */}
          <View className="bg-gray-50 rounded-xl p-4 w-full mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Your Balance</Text>
              <Text className="font-semibold text-gray-700">
                🪙 {currentCoins.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Cost</Text>
              <Text className="font-semibold text-red-500">
                - 🪙 {reward.cost.toLocaleString()}
              </Text>
            </View>
            <View className="h-px bg-gray-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-gray-700 font-medium">After Purchase</Text>
              <Text
                className={`font-bold ${
                  canAfford ? "text-green-600" : "text-red-500"
                }`}
              >
                🪙 {Math.max(remainingCoins, 0).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row w-full gap-3">
            <Pressable
              onPress={onCancel}
              className="flex-1 py-3 rounded-xl bg-gray-100"
            >
              <Text className="text-center font-semibold text-gray-600">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={canAfford ? onConfirm : undefined}
              className={`flex-1 py-3 rounded-xl ${
                canAfford ? "bg-yellow-400" : "bg-gray-200"
              }`}
              disabled={!canAfford || isPurchasing}
            >
              <Text
                className={`text-center font-bold ${
                  canAfford ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {isPurchasing ? "..." : canAfford ? "Buy Now" : "Not Enough"}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};
