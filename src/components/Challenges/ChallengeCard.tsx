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
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Mic01Icon,
  Sun01Icon,
  MoonIcon,
  BookOpen01Icon,
  BulbIcon,
  Camera01Icon,
  HealthIcon,
  Fire02Icon,
  Medal01Icon,
  SmileDizzyIcon,
  NoteIcon,
  TaskAdd01Icon,
  CheckmarkBadge01Icon,
  StarsIcon,
  Coins01Icon,
} from "@hugeicons/core-free-icons";

interface ChallengeCardProps {
  challenge: ActiveChallenge;
  compact?: boolean;
}

/** Map challenge emoji icon → { hugeicon, bg color, icon color } */
const ICON_MAP: Record<string, { icon: any; bg: string; color: string }> = {
  "😊": { icon: SmileDizzyIcon, bg: "#FEF9E7", color: "#F6BE5A" },
  "📝": { icon: NoteIcon, bg: "#F3F0FF", color: "#A78BFA" },
  "✅": { icon: TaskAdd01Icon, bg: "#ECFDF5", color: "#6EE7B7" },
  "🍎": { icon: HealthIcon, bg: "#FFF1F2", color: "#FDA4AF" },
  "🧘": { icon: StarsIcon, bg: "#EFF6FF", color: "#93C5FD" },
  "🎙️": { icon: Mic01Icon, bg: "#FAF5FF", color: "#C4B5FD" },
  "☀️": { icon: Sun01Icon, bg: "#FEFCE8", color: "#FCD34D" },
  "🌙": { icon: MoonIcon, bg: "#EFF6FF", color: "#93C5FD" },
  "📚": { icon: BookOpen01Icon, bg: "#F3F0FF", color: "#A78BFA" },
  "💡": { icon: BulbIcon, bg: "#FEFCE8", color: "#FCD34D" },
  "📷": { icon: Camera01Icon, bg: "#FDF2F8", color: "#F9A8D4" },
  "🥗": { icon: HealthIcon, bg: "#ECFDF5", color: "#6EE7B7" },
  "🔥": { icon: Fire02Icon, bg: "#FFF1F2", color: "#FDA4AF" },
  "🏆": { icon: Medal01Icon, bg: "#FEF9E7", color: "#F6BE5A" },
};

const DEFAULT_ICON = { icon: StarsIcon, bg: "#F8F7FF", color: "#C4B5FD" };

const ChallengeIconBubble: React.FC<{
  iconKey: string;
  size?: "sm" | "lg";
}> = ({ iconKey, size = "sm" }) => {
  const config = ICON_MAP[iconKey] ?? DEFAULT_ICON;
  const bubbleSize = size === "lg" ? 48 : 40;
  const iconSize = size === "lg" ? 22 : 18;

  return (
    <View
      style={{
        width: bubbleSize,
        height: bubbleSize,
        borderRadius: bubbleSize / 2,
        backgroundColor: config.bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HugeiconsIcon
        icon={config.icon}
        size={iconSize}
        color={config.color}
        strokeWidth={1.8}
      />
    </View>
  );
};

/**
 * Premium challenge card — uses HugeIcons in colored bubbles instead of emojis
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
      <Pressable
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          isComplete
            ? `Challenge completed: ${challenge.title}`
            : `Challenge: ${challenge.title}. ${challenge.progress} of ${challenge.condition.target} completed.`
        }
        accessibilityHint="Opens challenge details"
      >
        <Animated.View
          style={animatedStyle}
          className={`bg-white rounded-2xl p-3 mb-2 border ${
            isComplete ? "border-emerald-100/50" : "border-gray-50/50"
          }`}
        >
          <View className="flex-row items-center">
            <ChallengeIconBubble iconKey={challenge.icon} size="sm" />

            <View className="flex-1 ml-3">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-gray-900 font-bold text-[15px] tracking-tight"
                  numberOfLines={1}
                >
                  {challenge.title}
                </Text>
                {isComplete ? (
                  <View className="bg-emerald-50 px-2 py-0.5 rounded-full flex-row items-center gap-1 border border-emerald-100/50">
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      size={10}
                      color="#059669"
                      strokeWidth={2.5}
                    />
                    <Text className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      Done
                    </Text>
                  </View>
                ) : (
                  <Text className="text-gray-400 text-xs font-semibold">
                    {challenge.progress}/{challenge.condition.target}
                  </Text>
                )}
              </View>

              <View className="h-1 bg-gray-100 rounded-full mt-2.5 overflow-hidden">
                <View
                  className={`h-full rounded-full ${
                    isComplete ? "bg-emerald-400" : "bg-indigo-400"
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
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={
        isComplete
          ? `Challenge completed: ${challenge.title}`
          : `Challenge: ${challenge.title}. ${challenge.description}. ${challenge.progress} of ${challenge.condition.target} completed. Reward: ${challenge.reward.xp} XP and ${challenge.reward.coins} coins.`
      }
      accessibilityHint="Opens challenge details"
    >
      <Animated.View
        style={animatedStyle}
        className={`bg-white rounded-2xl p-4 mb-2.5 border ${
          isComplete ? "border-emerald-100" : "border-gray-100"
        }`}
      >
        {/* Header */}
        <View className="flex-row items-start">
          <ChallengeIconBubble iconKey={challenge.icon} size="lg" />

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
                <View className="bg-green-100 px-2.5 py-1 rounded-full ml-2 flex-row items-center gap-1">
                  <HugeiconsIcon
                    icon={CheckmarkBadge01Icon}
                    size={12}
                    color="#059669"
                    strokeWidth={2.5}
                  />
                  <Text className="text-green-700 text-xs font-semibold">
                    Done
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

          <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <View
              className={`h-full rounded-full ${
                isComplete ? "bg-emerald-400" : "bg-indigo-400"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        {/* Rewards */}
        {!isComplete && (
          <View className="flex-row items-center mt-3 gap-3">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Reward</Text>
            <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
              <HugeiconsIcon
                icon={StarsIcon}
                size={12}
                color="#D97706"
                strokeWidth={1.8}
              />
              <Text className="text-amber-700 text-xs font-bold">
                {challenge.reward.xp} XP
              </Text>
            </View>
            <View className="flex-row items-center gap-1 bg-gray-100/80 px-2 py-0.5 rounded-lg">
              <HugeiconsIcon
                icon={Coins01Icon}
                size={12}
                color="#92400E"
                strokeWidth={1.8}
              />
              <Text className="text-gray-600 text-xs font-bold">
                {challenge.reward.coins}
              </Text>
            </View>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};
