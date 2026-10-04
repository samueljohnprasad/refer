import React from "react";
import { Text, View, type ViewStyle, type ColorValue } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ZapIcon, FireIcon, Tick02Icon, Target02Icon } from "@hugeicons/core-free-icons";
import { Card } from "@/src/components/ui/Card";
import { DailyGoalRing } from "@/src/components/celebration/DailyGoalRing";
import { FlameBurst } from "@/src/components/celebration/FlameBurst";
import { WeeklyStreakDots } from "@/src/components/celebration/WeeklyStreakDots";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { SAGE } from "@/src/theme/palette";
import { styles } from "@/src/components/celebration/lessonCompleteCelebrationStyles";

interface CelebrationStatsProps {
  displayXP: number;
  resolvedStreak: number;
  activeMilestone: number | null;
  reducedMotion: boolean;
  isDark: boolean;
  milestoneDelay: number;
  xpStyle: AnimatedStyle<ViewStyle>;
  streakStyle: AnimatedStyle<ViewStyle>;
  ringCardStyle: AnimatedStyle<ViewStyle>;
  flameIconStyle: AnimatedStyle<ViewStyle>;
  todayBefore: number;
  todayAfter: number;
  dailyGoal: number;
  goalDone: boolean;
  ringColors: { fill: string; track: string; label: ColorValue };
  ringFillDelay: number;
  ringFillDuration: number;
  ringHint: string;
  goalGreen: string;
  goalReachedBefore: boolean;
  goalJustReached: boolean;
  xpToGoal: number;
  copy: { xp: string; streak: string; thisWeek: string; dailyGoal: string; days: string };
}

export function CelebrationStats({
  displayXP, resolvedStreak, activeMilestone, reducedMotion, isDark, milestoneDelay,
  xpStyle, streakStyle, ringCardStyle, flameIconStyle, todayBefore, todayAfter,
  dailyGoal, goalDone, ringColors, ringFillDelay, ringFillDuration, ringHint,
  copy,
}: CelebrationStatsProps) {
  return (
    <>
      <View style={styles.statsRow}>
        <Animated.View style={[{ flex: 1 }, xpStyle]}>
          <Card variant="tile" radius="lg" className="w-full" contentClassName="items-center justify-center py-3.5 px-2 min-h-[78px]">
            <Text style={[styles.statLabel, { color: SEMANTIC_COLORS.text.secondary }]}>{copy.xp}</Text>
            <View style={styles.statValueRow}>
              <HugeiconsIcon icon={ZapIcon} size={18} color="#F59E0B" strokeWidth={2.4} />
              <Text testID="celebration-xp-value" style={[styles.statValue, { color: SEMANTIC_COLORS.text.primary }]}>+{displayXP}</Text>
            </View>
          </Card>
        </Animated.View>
        <Animated.View testID="celebration-streak-card" style={[{ flex: 1 }, streakStyle]}>
          <Card variant="tile" radius="lg" className="w-full" contentClassName="items-center justify-center py-3.5 px-2 min-h-[78px]">
            {activeMilestone && !reducedMotion ? <FlameBurst delay={milestoneDelay} /> : null}
            <Text style={[styles.statLabel, { color: SEMANTIC_COLORS.text.secondary }]}>{copy.streak}</Text>
            <View style={styles.statValueRow}>
              <Animated.View style={flameIconStyle}>
                <HugeiconsIcon icon={FireIcon} size={18} color="#EA580C" strokeWidth={2.4} />
              </Animated.View>
              <Text style={[styles.statValue, { color: SEMANTIC_COLORS.text.primary }]}>{resolvedStreak}</Text>
            </View>
          </Card>
        </Animated.View>
      </View>

      <Animated.View style={[{ width: "100%", marginTop: 10 }, streakStyle]}>
        <Card variant="tile" radius="lg" className="w-full" contentClassName="py-2.5 px-4">
          <View style={styles.weekDotsHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <HugeiconsIcon icon={FireIcon} size={15} color="#EA580C" strokeWidth={2.4} />
              <Text style={[styles.statLabel, { color: SEMANTIC_COLORS.text.secondary }]}>{copy.thisWeek}</Text>
            </View>
            <Text style={[styles.statLabel, { color: SEMANTIC_COLORS.text.primary }]}>
              {resolvedStreak} {copy.days}
            </Text>
          </View>
          <WeeklyStreakDots streakDays={resolvedStreak} activeColor="#EA580C" inactiveColor={isDark ? "#283C29" : "#E5E5E5"} letterColor={isDark ? "#8FA58F" : "#64748B"} />
        </Card>
      </Animated.View>

      <Animated.View testID="celebration-daily-goal" style={[{ width: "100%", marginTop: 10 }, ringCardStyle]}>
        <Card variant="tile" radius="lg" className="w-full" contentClassName="flex-row items-center gap-3.5 p-3.5">
          <DailyGoalRing size={54} strokeWidth={6} from={todayBefore / dailyGoal} to={todayAfter / dailyGoal} color={ringColors.fill} trackColor={ringColors.track} delay={ringFillDelay} duration={ringFillDuration}>
            <HugeiconsIcon icon={goalDone ? Tick02Icon : Target02Icon} size={20} color={ringColors.fill} strokeWidth={2.6} />
          </DailyGoalRing>
          <View style={styles.goalText}>
            <Text style={[styles.statLabel, { color: ringColors.label }]}>{copy.dailyGoal}</Text>
            <Text style={[styles.goalValue, { color: SEMANTIC_COLORS.text.primary }]}>
              {Math.min(todayAfter, dailyGoal)}
              <Text style={[styles.goalOf, { color: SEMANTIC_COLORS.text.secondary }]}> / {dailyGoal} XP</Text>
            </Text>
            <Text style={[styles.goalHint, { color: ringColors.label }]}>{ringHint}</Text>
          </View>
        </Card>
      </Animated.View>
    </>
  );
}
