import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReducedMotion } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { VolumeHighIcon, VolumeMuteIcon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { ShareWinCard } from "@/src/components/celebration/ShareWinCard";
import { CelebrationMascotCopy, type CelebrationPandaVariant } from "@/src/components/celebration/CelebrationMascotCopy";
import { CelebrationStats } from "@/src/components/celebration/CelebrationStats";
import { CelebrationRewardCard } from "@/src/components/celebration/CelebrationRewardCard";
import { CelebrationActions } from "@/src/components/celebration/CelebrationActions";
import { useCelebrationActions } from "@/src/components/celebration/useCelebrationActions";
import { useCelebrationLifecycle } from "@/src/components/celebration/useCelebrationLifecycle";
import { useCelebrationAnimatedStyles } from "@/src/components/celebration/useCelebrationAnimatedStyles";
import { useSoundEffects } from "@/src/hooks/useSoundEffects";
import { useStreak } from "@/src/hooks/useStreak";
import { useXPOptional } from "@/src/context/XPContext";
import { useDailyXPGoal } from "@/src/store/dailyGoalStore";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { SAGE } from "@/src/theme/palette";
import { styles } from "@/src/components/celebration/lessonCompleteCelebrationStyles";
import { getEncouragementIndex, formatLessonDuration } from "@/src/components/celebration/lessonCompleteHelpers";

export { type CelebrationPandaVariant };
export { formatLessonDuration };

export interface LessonCompleteCelebrationProps {
  isVisible: boolean;
  xpEarned: number;
  bonusXP?: number;
  isPerfect?: boolean;
  durationMs?: number;
  streakDays?: number;
  lessonTitle?: string;
  todayXP?: number;
  dailyGoal?: number;
  celebrateStreakMilestone?: boolean;
  celebratePerfectWeek?: boolean;
  title?: string;
  perfectTitle?: string;
  message?: string;
  continueLabel?: string;
  pandaVariant?: CelebrationPandaVariant;
  onContinue: () => void;
}

export function LessonCompleteCelebration({
  isVisible, xpEarned, bonusXP = 0, isPerfect = false, streakDays, lessonTitle,
  todayXP: todayXPOverride, dailyGoal: dailyGoalOverride, celebrateStreakMilestone,
  celebratePerfectWeek, title, perfectTitle, message, continueLabel, pandaVariant = "celebrate", onContinue,
}: LessonCompleteCelebrationProps) {
  const { t } = useTranslation("exercises");
  const isDark = useColorScheme() === "dark";
  const reducedMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { play, toggleMute, isMuted } = useSoundEffects();
  const { currentStreak } = useStreak();
  const xpContext = useXPOptional();
  const { goal: savedGoal } = useDailyXPGoal();
  const totalXP = xpEarned + (isPerfect ? bonusXP : 0);
  const resolvedStreak = Math.max(1, streakDays ?? currentStreak ?? 0);
  const dailyGoal = Math.max(1, dailyGoalOverride ?? savedGoal);
  const todayAfter = Math.max(totalXP, todayXPOverride ?? xpContext?.todayXP ?? totalXP);
  const todayBefore = Math.max(0, todayAfter - totalXP);
  const goalReachedBefore = todayBefore >= dailyGoal;
  const goalReachedAfter = todayAfter >= dailyGoal;
  const xpToGoal = Math.max(0, dailyGoal - todayAfter);
  const lifecycle = useCelebrationLifecycle({
    isVisible, totalXP, resolvedStreak, isPerfect, reducedMotion, goalReachedBefore,
    goalReachedAfter, celebrateStreakMilestone, celebratePerfectWeek, play,
    xpEarned, bonusXP, lessonTitle,
  });
  const goalDone = goalReachedBefore || lifecycle.goalJustReached;
  const motion = useCelebrationAnimatedStyles({ ...lifecycle, reducedMotion });
  const actions = useCelebrationActions({
    canInteract: lifecycle.canInteract,
    perfectWeek: lifecycle.perfectWeek,
    isPerfect,
    lessonTitle,
    totalXP,
    resolvedStreak,
    chestOpened: lifecycle.chestOpened,
    setChestOpened: lifecycle.setChestOpened,
    chestAwardedRef: lifecycle.chestAwardedRef,
    chestWobble: lifecycle.chestWobble,
    chestScale: lifecycle.chestScale,
    pandaSwap: lifecycle.pandaSwap,
    shareCardRef: lifecycle.shareCardRef,
    schedule: lifecycle.schedule,
    play,
    awardXP: xpContext?.awardXP.bind(xpContext),
    onContinue,
    copy: {
      perfectLesson: t("flow.ui.celebration.sharePerfect"),
      lessonComplete: t("flow.ui.celebration.shareComplete"),
      shareDialogTitle: t("flow.ui.celebration.shareTitle"),
      chestDescription: t("flow.ui.celebration.chestDescription"),
    },
  });
  if (!isVisible) return null;

  const badgeColors = {
    surface: isDark ? "#2A2312" : "#FFFDF0",
    border: isDark ? "#4A3B18" : "#FDE68A",
    text: isDark ? "#FBBF24" : "#92400E",
  };
  const milestoneColors = {
    surface: isDark ? "#2A1D14" : "#FFEDD5",
    border: isDark ? "#522C1A" : "#FED7AA",
    text: isDark ? "#FB923C" : "#C2410C",
  };
  const goalGreen = isDark ? SAGE[300] : SAGE[500];
  const ringColors = {
    fill: goalDone ? (isDark ? SAGE[300] : SAGE[500]) : "#F59E0B",
    track: isDark ? "#243425" : SAGE[100],
    label: goalDone ? (isDark ? SAGE[300] : SAGE[600]) : SEMANTIC_COLORS.text.secondary,
  };
  const ringHint = goalReachedBefore
    ? t("flow.ui.celebration.goalAchieved")
    : lifecycle.goalJustReached
      ? t("flow.ui.celebration.goalReached")
      : goalReachedAfter
        ? t("flow.ui.celebration.goalAlmost")
        : t("flow.ui.celebration.xpToGo", { count: xpToGoal });
  const resolvedTitle = isPerfect
    ? perfectTitle ?? t("flow.ui.celebration.perfectTitle")
    : title ?? t("flow.ui.celebration.title");
  const encouragementKey = isPerfect
    ? "flow.ui.celebration.perfectEncouragements"
    : "flow.ui.celebration.encouragements";
  const encouragements = t(encouragementKey, { returnObjects: true }) as string[];
  const encouragementIndex = getEncouragementIndex(lessonTitle ?? resolvedTitle, encouragements.length);
  const resolvedMessage = message ?? encouragements[encouragementIndex];
  const streakMilestoneMessages = {
    3: t("flow.ui.celebration.milestoneMessage3"),
    7: t("flow.ui.celebration.milestoneMessage7"),
    15: t("flow.ui.celebration.milestoneMessage15"),
    30: t("flow.ui.celebration.milestoneMessage30"),
  };
  const resolvedPanda = lifecycle.chestOpened ? "proud" : isPerfect ? "happy" : pandaVariant;

  return (
    <Modal transparent visible={isVisible} animationType="none" statusBarTranslucent>
      <View testID="lesson-complete-celebration" style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? "#0D150E" : "#F8FAF7", zIndex: 9999 }]}>
        <View pointerEvents="none" style={styles.shareCardHost}>
          <ShareWinCard ref={lifecycle.shareCardRef} lessonTitle={lessonTitle} totalXP={totalXP} streakDays={resolvedStreak} isPerfect={isPerfect} />
        </View>
        <Pressable
          testID="celebration-mute-toggle"
          accessibilityRole="button"
          accessibilityLabel={t(isMuted ? "flow.ui.celebration.unmute" : "flow.ui.celebration.mute")}
          accessibilityState={{ selected: isMuted }}
          hitSlop={8}
          onPress={() => { Haptics.selectionAsync().catch(() => {}); toggleMute(); }}
          style={({ pressed }) => [styles.muteButton, {
            top: insets.top + 12,
            backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
            opacity: pressed ? 0.6 : 1,
          }]}
        >
          <HugeiconsIcon icon={isMuted ? VolumeMuteIcon : VolumeHighIcon} size={20} color={SEMANTIC_COLORS.text.secondary} strokeWidth={2} />
        </Pressable>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, {
            paddingTop: Math.max(insets.top + 28, 68),
            paddingBottom: Math.max(insets.bottom + 24, 40),
          }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <CelebrationMascotCopy
            isPerfect={isPerfect}
            reducedMotion={reducedMotion}
            isVisible={isVisible}
            chestOpened={lifecycle.chestOpened}
            resolvedPanda={resolvedPanda}
            resolvedTitle={resolvedTitle}
            resolvedMessage={resolvedMessage}
            activeMilestone={lifecycle.activeMilestone}
            showMilestoneMessage={lifecycle.showMilestoneMessage}
            bonusXP={bonusXP}
            badgeColors={badgeColors}
            pandaStyle={motion.pandaStyle}
            glowStyle={motion.glowStyle}
            titleStyle={motion.titleStyle}
            messageStyle={motion.messageStyle}
            badgeStyle={motion.badgeStyle}
            milestoneStyle={motion.milestoneStyle}
            pandaSwapStyle={motion.pandaSwapStyle}
            streakMilestoneMessages={streakMilestoneMessages}
            glowColor={isDark ? "#F2C94C" : "#FFE89C"}
            milestoneColors={milestoneColors}
            copy={{
              perfectLesson: t("flow.ui.celebration.sharePerfect"),
              streakMessage: t("flow.ui.celebration.streakMessage"),
              perfectBadge: t("flow.ui.celebration.perfectBadge"),
              milestoneDays: t("flow.ui.celebration.milestoneDays"),
            }}
          />
          <CelebrationStats
            displayXP={lifecycle.displayXP}
            resolvedStreak={resolvedStreak}
            activeMilestone={lifecycle.activeMilestone}
            reducedMotion={reducedMotion}
            isDark={isDark}
            milestoneDelay={lifecycle.milestoneDelay}
            xpStyle={motion.xpStyle}
            streakStyle={motion.streakStyle}
            ringCardStyle={motion.ringCardStyle}
            flameIconStyle={motion.flameIconStyle}
            todayBefore={todayBefore}
            todayAfter={todayAfter}
            dailyGoal={dailyGoal}
            goalDone={goalDone}
            ringColors={ringColors}
            ringFillDelay={lifecycle.ringFillDelay}
            ringFillDuration={lifecycle.ringFillDuration}
            ringHint={ringHint}
            goalGreen={goalGreen}
            goalReachedBefore={goalReachedBefore}
            goalJustReached={lifecycle.goalJustReached}
            xpToGoal={xpToGoal}
            copy={{
              xp: t("flow.ui.celebration.xp"),
              streak: t("flow.ui.celebration.streak"),
              thisWeek: t("flow.ui.celebration.thisWeek"),
              dailyGoal: t("flow.ui.celebration.dailyGoal"),
              days: t(resolvedStreak === 1 ? "flow.ui.celebration.day" : "flow.ui.celebration.days"),
            }}
          />
          <CelebrationRewardCard
            isVisible={isVisible}
            isDark={isDark}
            perfectWeek={lifecycle.perfectWeek}
            chestOpened={lifecycle.chestOpened}
            goalGreen={goalGreen}
            badgeColors={badgeColors}
            chestCardStyle={motion.chestCardStyle}
            chestIconStyle={motion.chestIconStyle}
            onOpenChest={actions.handleOpenChest}
            copy={{
              accessibilityOpened: t("flow.ui.celebration.chestOpened"),
              accessibilityOpen: t("flow.ui.celebration.chestOpen"),
              perfectWeek: t("flow.ui.celebration.perfectWeek"),
              unopenedTitle: t("flow.ui.celebration.sevenForSeven"),
              openedHint: t("flow.ui.celebration.chestOpenedHint"),
              openHint: t("flow.ui.celebration.chestOpenHint"),
            }}
          />
          <CelebrationActions
            canInteract={lifecycle.canInteract}
            isSharing={actions.isSharing}
            continueLabel={continueLabel ?? t("flow.ui.celebration.continue")}
            buttonStyle={motion.buttonStyle}
            onContinue={actions.handleContinue}
            onShare={actions.handleShare}
            copy={{ share: t("flow.ui.celebration.shareTitle"), preparing: t("flow.ui.celebration.preparing") }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

export default LessonCompleteCelebration;
