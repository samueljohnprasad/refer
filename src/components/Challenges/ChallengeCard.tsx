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
import { GOLD, SAGE, TERRACOTTA } from "@/lib/tokens";

interface ChallengeCardProps {
  challenge: ActiveChallenge;
  compact?: boolean;
}

/** Map challenge emoji icon to a Happy Sage icon treatment. */
const ICON_MAP: Record<string, { icon: any; bgClassName: string; color: string }> = {
  "😊": { icon: SmileDizzyIcon, bgClassName: "bg-gold/15", color: GOLD },
  "📝": { icon: NoteIcon, bgClassName: "bg-sage-50", color: SAGE[600] },
  "✅": { icon: TaskAdd01Icon, bgClassName: "bg-sage-pill", color: SAGE[600] },
  "🍎": { icon: HealthIcon, bgClassName: "bg-terracotta-light/15", color: TERRACOTTA },
  "🧘": { icon: StarsIcon, bgClassName: "bg-sage-50", color: SAGE[500] },
  "🎙️": { icon: Mic01Icon, bgClassName: "bg-sage-50", color: SAGE[500] },
  "☀️": { icon: Sun01Icon, bgClassName: "bg-gold/15", color: GOLD },
  "🌙": { icon: MoonIcon, bgClassName: "bg-sage-50", color: SAGE[500] },
  "📚": { icon: BookOpen01Icon, bgClassName: "bg-sage-50", color: SAGE[600] },
  "💡": { icon: BulbIcon, bgClassName: "bg-gold/15", color: GOLD },
  "📷": { icon: Camera01Icon, bgClassName: "bg-sage-50", color: SAGE[500] },
  "🥗": { icon: HealthIcon, bgClassName: "bg-sage-pill", color: SAGE[600] },
  "🔥": { icon: Fire02Icon, bgClassName: "bg-terracotta-light/15", color: TERRACOTTA },
  "🏆": { icon: Medal01Icon, bgClassName: "bg-gold/15", color: GOLD },
};

const DEFAULT_ICON = {
  icon: StarsIcon,
  bgClassName: "bg-sage-50",
  color: SAGE[500],
};

const ChallengeIconBubble: React.FC<{
  iconKey: string;
  size?: "sm" | "lg";
}> = ({ iconKey, size = "sm" }) => {
  const config = ICON_MAP[iconKey] ?? DEFAULT_ICON;
  const iconSize = size === "lg" ? 22 : 18;

  return (
    <View
      className={`items-center justify-center rounded-full border border-sage-100 ${
        size === "lg" ? "h-12 w-12" : "h-10 w-10"
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
          className="py-0.5"
        >
          <View className="flex-row items-center">
            <ChallengeIconBubble iconKey={challenge.icon} size="sm" />

            <View className="ml-3 flex-1">
              <View className="flex-row items-center justify-between">
                <Text
                  className="happy-font-body-bold flex-1 pr-3 text-[15px] leading-5 text-ink"
                  numberOfLines={1}
                >
                  {challenge.title}
                </Text>
                {isComplete ? (
                  <View className="flex-row items-center gap-1 rounded-full bg-sage-pill px-2 py-0.5">
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      size={10}
                      color={SAGE[600]}
                      strokeWidth={2.5}
                    />
                    <Text className="happy-font-body-bold text-[10px] uppercase tracking-wider text-sage-600">
                      Done
                    </Text>
                  </View>
                ) : (
                  <Text className="happy-font-body-bold text-xs text-ink-muted">
                    {challenge.progress}/{challenge.condition.target}
                  </Text>
                )}
              </View>

              <View className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-sage-100">
                <View
                  className={`h-full rounded-full ${
                    isComplete ? "bg-sage-500" : "bg-sage-400"
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
              <Text className="happy-font-body-bold text-lg text-ink">
                {challenge.title}
              </Text>
              <Text
                className="happy-font-body-medium mt-0.5 text-sm text-ink-muted"
                numberOfLines={2}
              >
                {challenge.description}
              </Text>
            </View>

            {isComplete && (
              <View className="ml-2 flex-row items-center gap-1 rounded-full bg-sage-pill px-2.5 py-1">
                <HugeiconsIcon
                  icon={CheckmarkBadge01Icon}
                  size={12}
                  color={SAGE[600]}
                  strokeWidth={2.5}
                />
                <Text className="happy-font-body-bold text-xs text-sage-600">
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
          <Text className="happy-font-body-medium text-sm text-ink-muted">
            {challenge.progress} of {challenge.condition.target}
          </Text>
          <Text className="happy-font-body-bold text-sm text-ink">
            {Math.round(progressPercent)}%
          </Text>
        </View>

        <View className="h-1.5 overflow-hidden rounded-full bg-sage-100">
          <View
            className={`h-full rounded-full ${
              isComplete ? "bg-sage-500" : "bg-sage-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      {/* Rewards */}
      {!isComplete && (
        <View className="flex-row items-center mt-3 gap-3">
          <Text className="happy-brand-eyebrow text-[10px]">Reward</Text>
          <View className="flex-row items-center gap-1 rounded-lg bg-gold/15 px-2 py-0.5">
            <HugeiconsIcon
              icon={StarsIcon}
              size={12}
              color={GOLD}
              strokeWidth={1.8}
            />
            <Text className="happy-font-body-bold text-xs text-ink-soft">
              {challenge.reward.xp} XP
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
};
