import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { ActiveChallenge } from "@/src/types/challenges";
import * as Haptics from "expo-haptics";

interface ChallengeCardProps {
  challenge: ActiveChallenge;
  compact?: boolean;
}

/**
 * Minimalist challenge card with clean design
 */
export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  compact = false,
}) => {
  const scale = useSharedValue(1);

  const progressPercent = Math.min(
    (challenge.progress / challenge.condition.target) * 100,
    100,
  );

  const handlePress = (): void => {
    scale.value = withSequence(
      withSpring(0.98, { damping: 15 }),
      withSpring(1, { damping: 15 }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isComplete = challenge.completed;

  if (compact) {
    return (
      <Pressable onPress={handlePress}>
        <Animated.View
          style={animatedStyle}
          className={`bg-white rounded-2xl p-4 mb-3 border ${
            isComplete ? "border-green-200" : "border-gray-100"
          }`}
        >
          <View className="flex-row items-center">
            <Text style={{ fontSize: 28 }}>{challenge.icon}</Text>

            <View className="flex-1 ml-3">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-gray-900 font-semibold text-base"
                  numberOfLines={1}
                >
                  {challenge.title}
                </Text>
                {isComplete ? (
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-700 text-xs font-medium">
                      Done
                    </Text>
                  </View>
                ) : (
                  <Text className="text-gray-500 text-sm font-medium">
                    {challenge.progress}/{challenge.condition.target}
                  </Text>
                )}
              </View>

              <View className="h-1.5 bg-gray-100 rounded-full mt-2">
                <View
                  className={`h-full rounded-full ${
                    isComplete ? "bg-green-500" : "bg-gray-900"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={animatedStyle}
        className={`bg-white rounded-2xl p-5 mb-3 border ${
          isComplete ? "border-green-200" : "border-gray-100"
        }`}
      >
        {/* Header */}
        <View className="flex-row items-start">
          <Text style={{ fontSize: 32 }}>{challenge.icon}</Text>

          <View className="flex-1 ml-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-lg">
                  {challenge.title}
                </Text>
                <Text
                  className="text-gray-500 text-sm mt-0.5"
                  numberOfLines={2}
                >
                  {challenge.description}
                </Text>
              </View>

              {isComplete && (
                <View className="bg-green-100 px-2.5 py-1 rounded-full ml-2">
                  <Text className="text-green-700 text-xs font-semibold">
                    ✓
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Progress */}
        <View className="mt-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-500 text-sm">
              {challenge.progress} of {challenge.condition.target}
            </Text>
            <Text className="text-gray-900 font-semibold text-sm">
              {Math.round(progressPercent)}%
            </Text>
          </View>

          <View className="h-2 bg-gray-100 rounded-full">
            <View
              className={`h-full rounded-full ${
                isComplete ? "bg-green-500" : "bg-gray-900"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        {/* Rewards */}
        {!isComplete && (
          <View className="flex-row items-center mt-4 pt-4 border-t border-gray-100">
            <Text className="text-gray-500 text-xs">Rewards:</Text>
            <View className="flex-row items-center ml-2">
              <Text className="text-sm">⭐</Text>
              <Text className="text-gray-700 text-sm font-medium ml-1">
                {challenge.reward.xp} XP
              </Text>
            </View>
            <View className="flex-row items-center ml-4">
              <Text className="text-sm">🪙</Text>
              <Text className="text-gray-700 text-sm font-medium ml-1">
                {challenge.reward.coins}
              </Text>
            </View>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};
