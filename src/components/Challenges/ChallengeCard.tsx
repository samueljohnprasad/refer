import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { ActiveChallenge } from "@/src/types/challenges";
import * as Haptics from "expo-haptics";
import { Card } from "@/src/components/ui/Card";
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
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

interface ChallengeCardProps {
  challenge: ActiveChallenge;
  compact?: boolean;
}

/** Map challenge emoji icon to a Happy Sage icon treatment. */
const ICON_MAP: Record<string, { icon: any; bgClassName: string; color: string }> = {
  "😊": { icon: SmileDizzyIcon, bgClassName: "bg-gold/15", color: SEMANTIC_COLORS.warning.foreground },
  "📝": { icon: NoteIcon, bgClassName: "bg-sage-50", color: SEMANTIC_COLORS.brand.pressed },
  "✅": { icon: TaskAdd01Icon, bgClassName: "bg-sage-pill", color: SEMANTIC_COLORS.brand.pressed },
  "🍎": { icon: HealthIcon, bgClassName: "bg-terracotta-light/15", color: SEMANTIC_COLORS.error.foreground },
  "🧘": { icon: StarsIcon, bgClassName: "bg-sage-50", color: SEMANTIC_COLORS.brand.primary },
  "🎙️": { icon: Mic01Icon, bgClassName: "bg-sage-50", color: SEMANTIC_COLORS.brand.primary },
  "☀️": { icon: Sun01Icon, bgClassName: "bg-gold/15", color: SEMANTIC_COLORS.warning.foreground },
  "🌙": { icon: MoonIcon, bgClassName: "bg-sage-50", color: SEMANTIC_COLORS.brand.primary },
  "📚": { icon: BookOpen01Icon, bgClassName: "bg-sage-50", color: SEMANTIC_COLORS.brand.pressed },
  "💡": { icon: BulbIcon, bgClassName: "bg-gold/15", color: SEMANTIC_COLORS.warning.foreground },
  "📷": { icon: Camera01Icon, bgClassName: "bg-sage-50", color: SEMANTIC_COLORS.brand.primary },
  "🥗": { icon: HealthIcon, bgClassName: "bg-sage-pill", color: SEMANTIC_COLORS.brand.pressed },
  "🔥": { icon: Fire02Icon, bgClassName: "bg-terracotta-light/15", color: SEMANTIC_COLORS.error.foreground },
  "🏆": { icon: Medal01Icon, bgClassName: "bg-gold/15", color: SEMANTIC_COLORS.warning.foreground },
};

const DEFAULT_ICON = {
  icon: StarsIcon,
  bgClassName: "bg-sage-50",
  color: SEMANTIC_COLORS.brand.primary,
};

const ChallengeIconBubble: React.FC<{
  iconKey: string;
  size?: "sm" | "lg";
}> = ({ iconKey, size = "sm" }) => {
  const config = ICON_MAP[iconKey] ?? DEFAULT_ICON;
  const iconSize = size === "lg" ? 22 : 18;

  return (
    <View
      className={`items-center justify-center rounded-full border border-sage-100 ${size === "lg" ? "h-12 w-12" : "h-10 w-10"
        } ${config.bgClassName}`}
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
      withSpring(0.98, { damping: 20, stiffness: 100, overshootClamping: true }),
      withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
    );
    Haptics.selectionAsync();
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
          className="py-0.5"
        >
          <View className="flex-row items-center">
            <ChallengeIconBubble iconKey={challenge.icon} size="sm" />

            <View className="ml-3 flex-1">
              <View className="flex-row items-center justify-between">
                <Text
                  variant="body-bold"
                  className="flex-1 pr-3 text-[15px] leading-5"
                  numberOfLines={1}
                >
                  {challenge.title}
                </Text>
                {isComplete ? (
                  <View className="flex-row items-center gap-1 rounded-full bg-sage-pill px-2 py-0.5">
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      size={10}
                      color={SEMANTIC_COLORS.brand.pressed}
                      strokeWidth={2.5}
                    />
                    <Text variant="eyebrow" className="text-[10px]">Done</Text>
                  </View>
                ) : (
                  <Text variant="chip" color="muted">
                    {challenge.progress}/{challenge.condition.target}
                  </Text>
                )}
              </View>

              <View className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-sage-100">
                <View
                  className={`h-full rounded-full ${isComplete ? "bg-sage-500" : "bg-sage-400"
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
    <Card
      variant="tile"
      radius="xl"
      onPress={handlePress}
      showDepth={true}
      className="mb-2.5"
      contentClassName="p-4"
      accessibilityLabel={
        isComplete
          ? `Challenge completed: ${challenge.title}`
          : `Challenge: ${challenge.title}. ${challenge.description}. ${challenge.progress} of ${challenge.condition.target} completed. Reward: ${challenge.reward.xp} XP and ${challenge.reward.coins} coins.`
      }
      accessibilityHint="Opens challenge details"
    >
      {/* Header */}
      <View className="flex-row items-start">
        <ChallengeIconBubble iconKey={challenge.icon} size="lg" />

        <View className="ml-4 flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text variant="h3">{challenge.title}</Text>
              <Text variant="caption-muted" className="mt-0.5" numberOfLines={2}>
                {challenge.description}
              </Text>
            </View>

            {isComplete && (
              <View className="ml-2 flex-row items-center gap-1 rounded-full bg-sage-pill px-2.5 py-1">
                <HugeiconsIcon
                  icon={CheckmarkBadge01Icon}
                  size={12}
                  color={SEMANTIC_COLORS.brand.pressed}
                  strokeWidth={2.5}
                />
                <Text variant="chip" color="sage">Done</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Progress */}
      <View className="mt-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text variant="caption-muted">
            {challenge.progress} of {challenge.condition.target}
          </Text>
          <Text variant="label-bold">{Math.round(progressPercent)}%</Text>
        </View>

        <View className="h-1.5 overflow-hidden rounded-full bg-sage-100">
          <View
            className={`h-full rounded-full ${isComplete ? "bg-sage-500" : "bg-sage-400"
              }`}
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      {/* Rewards */}
      {!isComplete && (
        <View className="flex-row items-center mt-3 gap-3">
          <Text variant="eyebrow" className="text-[10px]">Reward</Text>
          <View className="flex-row items-center gap-1 rounded-lg bg-gold/15 px-2 py-0.5">
            <HugeiconsIcon
              icon={StarsIcon}
              size={12}
              color={SEMANTIC_COLORS.warning.foreground}
              strokeWidth={1.8}
            />
            <Text variant="chip" color="soft">
              {challenge.reward.xp} XP
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
};
