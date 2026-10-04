import React from "react";
import { Text, View, type ViewStyle } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { GiftIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Card } from "@/src/components/ui/Card";
import { PERFECT_WEEK_BONUS_XP } from "@/src/store/perfectWeekStore";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { styles } from "@/src/components/celebration/lessonCompleteCelebrationStyles";

interface CelebrationRewardCardProps {
  isVisible: boolean;
  isDark: boolean;
  perfectWeek: boolean;
  chestOpened: boolean;
  goalGreen: string;
  badgeColors: { surface: string; border: string; text: string };
  chestCardStyle: AnimatedStyle<ViewStyle>;
  chestIconStyle: AnimatedStyle<ViewStyle>;
  onOpenChest: () => void;
  copy: { accessibilityOpened: string; accessibilityOpen: string; perfectWeek: string; unopenedTitle: string; openedHint: string; openHint: string };
}

export function CelebrationRewardCard({
  isVisible, isDark, perfectWeek, chestOpened, goalGreen, badgeColors,
  chestCardStyle, chestIconStyle, onOpenChest, copy,
}: CelebrationRewardCardProps) {
  if (!isVisible || !perfectWeek) return null;

  const accessibilityLabel = chestOpened
    ? copy.accessibilityOpened.replace("{{xp}}", String(PERFECT_WEEK_BONUS_XP))
    : copy.accessibilityOpen;

  return (
    <Animated.View style={[styles.chestCardWrap, chestCardStyle]}>
      <Card
        variant="solid"
        radius="lg"
        showDepth
        className="w-full"
        contentClassName="flex-row items-center gap-3.5 p-3.5"
        onPress={onOpenChest}
        disabled={chestOpened}
        accessibilityLabel={accessibilityLabel}
        faceStyle={{
          backgroundColor: chestOpened ? (isDark ? "#14281a" : "#EAF7EC") : badgeColors.surface,
          borderColor: chestOpened ? (isDark ? "#2c5a34" : "#BFE3C4") : badgeColors.border,
          borderWidth: 2,
        }}
        rimStyle={{ backgroundColor: chestOpened ? (isDark ? "#2c5a34" : "#86EFAC") : badgeColors.border }}
      >
        <Animated.View style={[styles.chestIcon, chestIconStyle, { backgroundColor: chestOpened ? goalGreen : badgeColors.text }]}>
          <HugeiconsIcon
            icon={chestOpened ? Tick02Icon : GiftIcon}
            size={24}
            color={chestOpened ? (isDark ? "#0f1a0f" : "#FFFFFF") : badgeColors.surface}
            strokeWidth={2.4}
          />
        </Animated.View>
        <View style={styles.goalText}>
          <Text style={[styles.statLabel, { color: chestOpened ? goalGreen : badgeColors.text }]}>{copy.perfectWeek}</Text>
          <Text style={[styles.goalValue, { color: SEMANTIC_COLORS.text.primary }]}>
            {chestOpened ? `+${PERFECT_WEEK_BONUS_XP} XP` : copy.unopenedTitle}
          </Text>
          <Text style={[styles.goalHint, { color: SEMANTIC_COLORS.text.secondary }]}>
            {chestOpened ? copy.openedHint : copy.openHint}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}
