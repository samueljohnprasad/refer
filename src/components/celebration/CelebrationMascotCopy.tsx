import React from "react";
import { Text, View, type ViewStyle } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import { Image } from "expo-image";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Clapping01Icon, FireIcon } from "@hugeicons/core-free-icons";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { styles } from "@/src/components/celebration/lessonCompleteCelebrationStyles";

const PANDA = {
  celebrate: require("../../../assets/images/panda/panda-super-excite.png"),
  happy: require("../../../assets/images/panda/panda-happy.png"),
  plant: require("../../../assets/images/panda/panda-plant.png"),
  proud: require("../../../assets/images/panda/panda-love-hug.png"),
} as const;

export type CelebrationPandaVariant = keyof typeof PANDA;

interface CelebrationMascotCopyProps {
  isPerfect: boolean;
  reducedMotion: boolean;
  isVisible: boolean;
  chestOpened: boolean;
  resolvedPanda: CelebrationPandaVariant;
  resolvedTitle: string;
  resolvedMessage: string;
  activeMilestone: number | null;
  showMilestoneMessage: boolean;
  bonusXP: number;
  badgeColors: { surface: string; border: string; text: string };
  pandaStyle: AnimatedStyle<ViewStyle>;
  glowStyle: AnimatedStyle<ViewStyle>;
  titleStyle: AnimatedStyle<ViewStyle>;
  messageStyle: AnimatedStyle<ViewStyle>;
  badgeStyle: AnimatedStyle<ViewStyle>;
  milestoneStyle: AnimatedStyle<ViewStyle>;
  pandaSwapStyle: AnimatedStyle<ViewStyle>;
  streakMilestoneMessages: Record<number, string>;
  copy: { perfectLesson: string; streakMessage: string; perfectBadge: string; milestoneDays: string };
  glowColor: string;
  milestoneColors: { surface: string; border: string; text: string };
}

export function CelebrationMascotCopy({
  isPerfect,
  reducedMotion,
  isVisible,
  chestOpened,
  resolvedPanda,
  resolvedTitle,
  resolvedMessage,
  activeMilestone,
  showMilestoneMessage,
  bonusXP,
  badgeColors,
  pandaStyle,
  glowStyle,
  titleStyle,
  messageStyle,
  badgeStyle,
  milestoneStyle,
  pandaSwapStyle,
  streakMilestoneMessages,
  copy,
  glowColor,
  milestoneColors,
}: CelebrationMascotCopyProps) {
  const message = chestOpened
    ? copy.streakMessage
    : showMilestoneMessage && activeMilestone
      ? streakMilestoneMessages[activeMilestone]
      : resolvedMessage;

  return (
    <>
      <View style={styles.mascotZone}>
        <View pointerEvents="none" style={styles.confettiLayer}>
          <ConfettiExplosion isVisible={!reducedMotion && isVisible} count={isPerfect ? 40 : 28} duration={1000} />
        </View>
        {isPerfect ? (
          <Animated.View pointerEvents="none" style={[styles.glow, glowStyle, { backgroundColor: glowColor }]} />
        ) : null}
        <Animated.View style={[styles.mascotWrap, pandaStyle]}>
          <Animated.View style={[styles.mascot, pandaSwapStyle]}>
            <Image source={PANDA[resolvedPanda]} style={styles.mascot} contentFit="contain" />
          </Animated.View>
        </Animated.View>
        {chestOpened && !reducedMotion ? (
          <View pointerEvents="none" style={styles.confettiLayer}>
            <ConfettiExplosion isVisible count={36} duration={1100} />
          </View>
        ) : null}
      </View>

      <Animated.View style={titleStyle}>
        <Text style={[styles.title, { color: SEMANTIC_COLORS.text.primary }]}>{resolvedTitle}</Text>
      </Animated.View>
      <Animated.View style={[messageStyle, styles.messageWrap]}>
        <Text style={[styles.message, { color: SEMANTIC_COLORS.text.secondary }]}>{message}</Text>
      </Animated.View>

      {isPerfect ? (
        <Animated.View testID="celebration-perfect-badge" style={[styles.badge, badgeStyle, { backgroundColor: badgeColors.surface, borderColor: badgeColors.border }]}>
          <HugeiconsIcon icon={Clapping01Icon} size={18} color={badgeColors.text} strokeWidth={2.4} />
          <Text style={[styles.badgeText, { color: badgeColors.text }]}>{copy.perfectBadge}</Text>
          {bonusXP > 0 ? (
            <View style={[styles.badgeBonus, { backgroundColor: badgeColors.text }]}>
              <Text style={[styles.badgeBonusText, { color: badgeColors.surface }]}>+{bonusXP} XP</Text>
            </View>
          ) : null}
        </Animated.View>
      ) : null}

      {activeMilestone ? (
        <Animated.View testID="celebration-streak-milestone" style={[styles.badge, milestoneStyle, { backgroundColor: milestoneColors.surface, borderColor: milestoneColors.border }]}>
          <HugeiconsIcon icon={FireIcon} size={18} color={milestoneColors.text} strokeWidth={2.4} />
          <Text style={[styles.badgeText, { color: milestoneColors.text }]}>{copy.milestoneDays.replace("{{count}}", String(activeMilestone))}</Text>
        </Animated.View>
      ) : null}
    </>
  );
}
