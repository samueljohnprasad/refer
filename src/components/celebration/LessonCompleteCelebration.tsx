import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Share, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  withRepeat,
  interpolate,
  Extrapolation,
  useReducedMotion,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ZapIcon,
  FireIcon,
  Share01Icon,
  Clapping01Icon,
  Target02Icon,
  Tick02Icon,
  VolumeHighIcon,
  VolumeMuteIcon,
  GiftIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import {
  ShareWinCard,
  SHARE_CARD_WIDTH,
  SHARE_CARD_HEIGHT,
} from "@/src/components/celebration/ShareWinCard";
import { DailyGoalRing } from "@/src/components/celebration/DailyGoalRing";
import { FlameBurst } from "@/src/components/celebration/FlameBurst";
import { WeeklyStreakDots } from "@/src/components/celebration/WeeklyStreakDots";
import { useSoundEffects } from "@/src/hooks/useSoundEffects";
import { useStreak } from "@/src/hooks/useStreak";
import { useXPOptional } from "@/src/context/XPContext";
import { useDailyXPGoal } from "@/src/store/dailyGoalStore";
import {
  hasClaimedPerfectWeek,
  isPerfectWeek,
  markPerfectWeekClaimed,
  PERFECT_WEEK_BONUS_XP,
} from "@/src/store/perfectWeekStore";
import { XPActionType } from "@/src/types/xp";
import {
  getStreakMilestone,
  markStreakMilestoneCelebrated,
  shouldCelebrateStreakMilestone,
  STREAK_MILESTONE_MESSAGES,
  type StreakMilestoneDay,
} from "@/src/store/streakMilestoneStore";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { SAGE, NEUTRAL } from "@/src/theme/palette";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { createLogger } from "@/src/lib/logger";

const logger = createLogger("lesson-complete-celebration");

// ─── Mascot variants ──────────────────────────────────────────────────────────
const PANDA = {
  celebrate: require("../../../assets/images/panda/panda-super-excite.png"),
  happy: require("../../../assets/images/panda/panda-happy.png"),
  plant: require("../../../assets/images/panda/panda-plant.png"),
  proud: require("../../../assets/images/panda/panda-love-hug.png"),
} as const;

export type CelebrationPandaVariant = keyof typeof PANDA;

const ENCOURAGEMENTS = [
  "You showed up for yourself today.",
  "Small steps, real change.",
  "That's one more win for your mind.",
  "Progress feels good, doesn't it?",
  "You're building a calmer you.",
];

const PERFECT_ENCOURAGEMENTS = [
  "Not a single slip. That's mastery.",
  "Flawless — you really know this one.",
  "Every answer landed. Take a bow.",
];

export function pickEncouragement(seed?: string, perfect = false): string {
  const pool = perfect ? PERFECT_ENCOURAGEMENTS : ENCOURAGEMENTS;
  if (!seed) {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return pool[Math.abs(hash) % pool.length];
}

export function formatLessonDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export interface LessonCompleteCelebrationProps {
  isVisible: boolean;
  /** Base XP for completing the lesson. */
  xpEarned: number;
  /** Extra XP awarded for a perfect lesson; added to the XP shown. */
  bonusXP?: number;
  /** Flawless lesson: shows the slow-clap panda + bonus badge. */
  isPerfect?: boolean;
  /** Time spent in the lesson. Hidden when omitted. */
  durationMs?: number;
  /** Override for the streak count (defaults to the user's current streak). */
  streakDays?: number;
  /** Lesson name used on the shareable card. */
  lessonTitle?: string;
  /** Override for today's XP after this lesson (defaults to the XP context). */
  todayXP?: number;
  /** Override for the daily XP goal (defaults to the saved goal). */
  dailyGoal?: number;
  /** Force the streak-milestone flourish on/off (defaults to once-per-run detection). */
  celebrateStreakMilestone?: boolean;
  /** Force the perfect-week chest on/off (defaults to Saturday + 7-day streak, once a week). */
  celebratePerfectWeek?: boolean;
  title?: string;
  perfectTitle?: string;
  message?: string;
  continueLabel?: string;
  pandaVariant?: CelebrationPandaVariant;
  onContinue: () => void;
}

export function LessonCompleteCelebration({
  isVisible,
  xpEarned,
  bonusXP = 0,
  isPerfect = false,
  durationMs,
  streakDays,
  lessonTitle,
  todayXP: todayXPOverride,
  dailyGoal: dailyGoalOverride,
  celebrateStreakMilestone,
  celebratePerfectWeek,
  title = "Lesson complete!",
  perfectTitle = "Perfect lesson!",
  message,
  continueLabel = "Continue",
  pandaVariant = "celebrate",
  onContinue,
}: LessonCompleteCelebrationProps) {
  const isDark = useColorScheme() === "dark";
  const reducedMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { play, toggleMute, isMuted } = useSoundEffects();
  const { currentStreak } = useStreak();
  const xpContext = useXPOptional();
  const { goal: savedGoal } = useDailyXPGoal();

  const [displayXP, setDisplayXP] = useState(0);
  const [canInteract, setCanInteract] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [goalJustReached, setGoalJustReached] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<StreakMilestoneDay | null>(null);
  const [showMilestoneMessage, setShowMilestoneMessage] = useState(false);
  const [perfectWeek, setPerfectWeek] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const chestAwardedRef = useRef(false);
  const countTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shareCardRef = useRef<View>(null);

  const totalXP = xpEarned + (isPerfect ? bonusXP : 0);
  // The learner just finished a lesson today, so the streak is at least 1 even
  // if the streak query hasn't refetched yet.
  const resolvedStreak = Math.max(1, streakDays ?? currentStreak ?? 0);
  const resolvedTitle = isPerfect ? perfectTitle : title;
  const resolvedMessage = message ?? pickEncouragement(lessonTitle ?? title, isPerfect);
  const resolvedPanda: CelebrationPandaVariant = chestOpened
    ? "proud"
    : isPerfect
      ? "happy"
      : pandaVariant;

  // Daily goal: XP context is already updated optimistically with this lesson's
  // XP, so "before" is today's total minus what was just earned.
  const dailyGoal = Math.max(1, dailyGoalOverride ?? savedGoal);
  const todayAfter = Math.max(totalXP, todayXPOverride ?? xpContext?.todayXP ?? totalXP);
  const todayBefore = Math.max(0, todayAfter - totalXP);
  const goalReachedBefore = todayBefore >= dailyGoal;
  const goalReachedAfter = todayAfter >= dailyGoal;
  const xpToGoal = Math.max(0, dailyGoal - todayAfter);

  const streakMilestone = getStreakMilestone(resolvedStreak);

  // Animation values
  const overlayOpacity = useSharedValue(0);
  const pandaProgress = useSharedValue(0);
  const clapProgress = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const xpScale = useSharedValue(0);
  const xpOpacity = useSharedValue(0);
  const streakScale = useSharedValue(0);
  const streakOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const milestoneScale = useSharedValue(0);
  const milestoneOpacity = useSharedValue(0);
  const flamePulse = useSharedValue(0);
  const chestScale = useSharedValue(0);
  const chestOpacity = useSharedValue(0);
  const chestWobble = useSharedValue(0);
  const pandaSwap = useSharedValue(1);
  const buttonOpacity = useSharedValue(0);

  const schedule = (delay: number, fn: () => void) => {
    timersRef.current.push(setTimeout(fn, delay));
  };

  const runHaptic = (delay: number, style: Haptics.ImpactFeedbackStyle) => {
    schedule(delay, () => {
      Haptics.impactAsync(style).catch(() => {});
    });
  };

  const startCountUp = () => {
    if (countTimerRef.current) clearInterval(countTimerRef.current);
    const start = Date.now();
    const duration = reducedMotion ? 100 : 250;
    countTimerRef.current = setInterval(() => {
      const fraction = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - fraction, 3);
      setDisplayXP(Math.round(totalXP * eased));
      if (fraction >= 1 && countTimerRef.current) {
        clearInterval(countTimerRef.current);
        countTimerRef.current = null;
      }
    }, 16);
  };

  // ponytail: snappy spring without cartoonish overshoot
  const popIn = (rm: boolean) =>
    rm
      ? withTiming(1, { duration: 120 })
      : withSpring(1, { damping: 20, stiffness: 240 });

  // Cohesive, fast timeline (Duolingo standard ~250ms)
  const rm = reducedMotion;
  const animDuration = rm ? 120 : 200;
  const cardDelay = rm ? 0 : 60;
  const ringDelay = rm ? 0 : 80;
  const ringFillDelay = rm ? 0 : 100;
  const ringFillDuration = rm ? 150 : 350;
  const milestoneDelay = rm ? 0 : 100;

  useEffect(() => {
    // ponytail: diagnostic logging for celebration modal visibility
    logger.info("useEffect triggered, isVisible =", isVisible, {
      xpEarned,
      bonusXP,
      isPerfect,
      streakDays: resolvedStreak,
      lessonTitle,
    });
    if (!isVisible) {
      overlayOpacity.value = 0;
      pandaProgress.value = 0;
      clapProgress.value = 0;
      glowOpacity.value = 0;
      titleOpacity.value = 0;
      messageOpacity.value = 0;
      badgeScale.value = 0;
      badgeOpacity.value = 0;
      xpScale.value = 0;
      xpOpacity.value = 0;
      streakScale.value = 0;
      streakOpacity.value = 0;
      ringScale.value = 0;
      ringOpacity.value = 0;
      milestoneScale.value = 0;
      milestoneOpacity.value = 0;
      flamePulse.value = 0;
      chestScale.value = 0;
      chestOpacity.value = 0;
      chestWobble.value = 0;
      pandaSwap.value = 1;
      buttonOpacity.value = 0;
      setDisplayXP(0);
      setCanInteract(false);
      setGoalJustReached(false);
      setActiveMilestone(null);
      setShowMilestoneMessage(false);
      setPerfectWeek(false);
      setChestOpened(false);
      chestAwardedRef.current = false;
      if (countTimerRef.current) clearInterval(countTimerRef.current);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      return;
    }

    overlayOpacity.value = withTiming(1, { duration: animDuration });

    // Sound + single crisp haptic on arrival
    play("celebrationChime");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    // Mascot settles in cleanly without rotation wobble
    pandaProgress.value = withTiming(1, { duration: rm ? 150 : 280, easing: Easing.out(Easing.cubic) });

    // Title + message slide in smoothly
    titleOpacity.value = withDelay(rm ? 0 : 30, withTiming(1, { duration: animDuration }));
    messageOpacity.value = withDelay(rm ? 0 : 50, withTiming(1, { duration: animDuration }));

    // Perfect badge
    if (isPerfect) {
      glowOpacity.value = withTiming(1, { duration: animDuration });
      badgeOpacity.value = withDelay(rm ? 0 : 50, withTiming(1, { duration: animDuration }));
      badgeScale.value = withDelay(rm ? 0 : 50, popIn(rm));
    }

    // Stat cards enter together at cardDelay
    xpOpacity.value = withDelay(cardDelay, withTiming(1, { duration: animDuration }));
    xpScale.value = withDelay(cardDelay, popIn(rm));
    startCountUp();

    streakOpacity.value = withDelay(cardDelay, withTiming(1, { duration: animDuration }));
    streakScale.value = withDelay(cardDelay, popIn(rm));

    // Streak milestone
    const startMilestone = (milestone: StreakMilestoneDay) => {
      setActiveMilestone(milestone);
      milestoneOpacity.value = withDelay(milestoneDelay, withTiming(1, { duration: animDuration }));
      milestoneScale.value = withDelay(milestoneDelay, popIn(rm));
      setShowMilestoneMessage(true);
    };
    let milestoneCheckCancelled = false;
    if (streakMilestone) {
      if (celebrateStreakMilestone !== undefined) {
        if (celebrateStreakMilestone) startMilestone(streakMilestone);
      } else {
        shouldCelebrateStreakMilestone(streakMilestone).then((ok) => {
          if (!ok || milestoneCheckCancelled) return;
          startMilestone(streakMilestone);
          void markStreakMilestoneCelebrated(streakMilestone);
        });
      }
    }

    // Daily goal ring card
    ringOpacity.value = withDelay(ringDelay, withTiming(1, { duration: animDuration }));
    ringScale.value = withDelay(ringDelay, popIn(rm));
    if (goalReachedAfter && !goalReachedBefore) {
      schedule(ringFillDelay + ringFillDuration, () => {
        setGoalJustReached(true);
      });
    }

    // Perfect week chest
    let perfectWeekCheckCancelled = false;
    const perfectWeekEligible = celebratePerfectWeek ?? isPerfectWeek(resolvedStreak);
    if (perfectWeekEligible) {
      const showChest = () => {
        setPerfectWeek(true);
        chestOpacity.value = withDelay(ringDelay, withTiming(1, { duration: animDuration }));
        chestScale.value = withDelay(ringDelay, popIn(rm));
      };
      if (celebratePerfectWeek !== undefined) {
        showChest();
      } else {
        hasClaimedPerfectWeek().then((claimed) => {
          if (claimed || perfectWeekCheckCancelled) return;
          showChest();
          void markPerfectWeekClaimed();
        });
      }
    }

    // Buttons interactive and visible immediately — never hold user hostage
    buttonOpacity.value = withDelay(ringDelay, withTiming(1, { duration: animDuration }));
    setCanInteract(true);

    return () => {
      milestoneCheckCancelled = true;
      perfectWeekCheckCancelled = true;
      if (countTimerRef.current) clearInterval(countTimerRef.current);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  // Clean, crisp entrance for the panda without gelatin oscillation
  const pandaStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {
        opacity: interpolate(pandaProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      };
    }
    const translateY = interpolate(pandaProgress.value, [0, 1], [16, 0], Extrapolation.CLAMP);
    const scale = interpolate(pandaProgress.value, [0, 1], [0.92, 1], Extrapolation.CLAMP);
    const opacity = interpolate(pandaProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }, { scale }] };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.6,
    transform: [{ scale: 1 }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: 8 * (1 - titleOpacity.value) }],
  }));
  const messageStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ translateY: 8 * (1 - messageOpacity.value) }],
  }));
  // ponytail: never scale from 0 per animation skills / Emil Kowalski rules; scale from 0.95 + subtle translateY
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [
      { translateY: 6 * (1 - badgeOpacity.value) },
      { scale: interpolate(badgeScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const xpStyle = useAnimatedStyle(() => ({
    opacity: xpOpacity.value,
    transform: [
      { translateY: 8 * (1 - xpOpacity.value) },
      { scale: interpolate(xpScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const streakStyle = useAnimatedStyle(() => ({
    opacity: streakOpacity.value,
    transform: [
      { translateY: 8 * (1 - streakOpacity.value) },
      { scale: interpolate(streakScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const ringCardStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [
      { translateY: 8 * (1 - ringOpacity.value) },
      { scale: interpolate(ringScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const milestoneStyle = useAnimatedStyle(() => ({
    opacity: milestoneOpacity.value,
    transform: [
      { translateY: 6 * (1 - milestoneOpacity.value) },
      { scale: interpolate(milestoneScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const flameIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 }],
  }));
  const chestCardStyle = useAnimatedStyle(() => ({
    opacity: chestOpacity.value,
    transform: [
      { translateY: 8 * (1 - chestOpacity.value) },
      { scale: interpolate(chestScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const chestIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 }],
  }));
  const pandaSwapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pandaSwap.value }],
  }));

  const awardChest = () => {
    if (chestAwardedRef.current) return;
    chestAwardedRef.current = true;
    xpContext?.awardXP(XPActionType.EXERCISE_COMPLETE, {
      customAmount: PERFECT_WEEK_BONUS_XP,
      customDescription: "Perfect week chest",
    });
  };

  const handleOpenChest = () => {
    if (chestOpened) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    play("celebrationChime");
    chestWobble.value = 0;
    chestScale.value = withSequence(
      withTiming(0.9, { duration: 90 }),
      withSpring(1.08, { damping: 7, stiffness: 220 }),
      withSpring(1, { damping: 12, stiffness: 180 }),
    );
    // Proud panda moment: a quick dip and bounce as the mascot swaps.
    pandaSwap.value = withSequence(
      withTiming(0.82, { duration: 140, easing: Easing.in(Easing.quad) }),
      withSpring(1.12, { damping: 7, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 180 }),
    );
    setChestOpened(true);
    schedule(220, () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}));
    awardChest();
  };
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

  const handleContinue = () => {
    if (!canInteract) return;
    // Never let an unopened chest cost the learner their reward.
    if (perfectWeek) awardChest();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onContinue();
  };

  const shareMessage = `${isPerfect ? "Perfect lesson" : "Lesson complete"}${
    lessonTitle ? `: ${lessonTitle}` : ""
  } — +${totalXP} XP and a ${resolvedStreak}-day streak on Happy! 🐼`;

  const handleShare = async () => {
    if (!canInteract || isSharing) return;
    setIsSharing(true);
    try {
      const uri = await captureRef(shareCardRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          UTI: "public.png",
          dialogTitle: "Share your win",
        });
      } else {
        await Share.share({ message: shareMessage, url: uri });
      }
    } catch {
      // Image capture failed (or user dismissed) — fall back to a text share.
      await Share.share({ message: shareMessage }).catch(() => {});
    } finally {
      setIsSharing(false);
    }
  };

  if (!isVisible) return null;

  const bg = isDark ? "#0D150E" : "#F8FAF7";
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
  const goalDone = goalReachedBefore || goalJustReached;
  const ringColors = {
    fill: goalDone ? (isDark ? SAGE[300] : SAGE[500]) : "#F59E0B",
    track: isDark ? "#243425" : SAGE[100],
    label: goalDone ? (isDark ? SAGE[300] : SAGE[600]) : SEMANTIC_COLORS.text.secondary,
  };
  const ringHint = goalReachedBefore
    ? "Daily goal achieved!"
    : goalJustReached
      ? "Daily goal reached. Beautiful."
      : goalReachedAfter
        ? "Almost there!"
        : `${xpToGoal} XP to go`;

  return (
    <Modal transparent visible={isVisible} animationType="none" statusBarTranslucent>
      <View
        testID="lesson-complete-celebration"
        style={[StyleSheet.absoluteFill, { backgroundColor: bg, zIndex: 9999 }]}
      >
        {/* Off-screen share card (captured on demand) */}
        <View pointerEvents="none" style={styles.shareCardHost}>
          <ShareWinCard
            ref={shareCardRef}
            lessonTitle={lessonTitle}
            totalXP={totalXP}
            streakDays={resolvedStreak}
            isPerfect={isPerfect}
          />
        </View>

        {/* Mute toggle */}
        <Pressable
          testID="celebration-mute-toggle"
          accessibilityRole="button"
          accessibilityLabel={isMuted ? "Unmute celebration sounds" : "Mute celebration sounds"}
          accessibilityState={{ selected: isMuted }}
          hitSlop={8}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            toggleMute();
          }}
          style={({ pressed }) => [
            styles.muteButton,
            {
              top: insets.top + 12,
              backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <HugeiconsIcon
            icon={isMuted ? VolumeMuteIcon : VolumeHighIcon}
            size={20}
            color={SEMANTIC_COLORS.text.secondary}
            strokeWidth={2}
          />
        </Pressable>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: Math.max(insets.top + 28, 68),
              paddingBottom: Math.max(insets.bottom + 24, 40),
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Mascot + confetti */}
          <View style={styles.mascotZone}>
            <View pointerEvents="none" style={styles.confettiLayer}>
              <ConfettiExplosion isVisible={!reducedMotion && isVisible} count={isPerfect ? 40 : 28} duration={1000} />
            </View>
            {isPerfect ? (
              <Animated.View
                pointerEvents="none"
                style={[styles.glow, glowStyle, { backgroundColor: isDark ? "#F2C94C" : "#FFE89C" }]}
              />
            ) : null}
            <Animated.View style={[styles.mascotWrap, pandaStyle]}>
              <Animated.View style={[styles.mascot, pandaSwapStyle]}>
                <Image
                  source={PANDA[resolvedPanda]}
                  style={styles.mascot}
                  contentFit="contain"
                />
              </Animated.View>
            </Animated.View>
            {chestOpened && !reducedMotion ? (
              <View pointerEvents="none" style={styles.confettiLayer}>
                <ConfettiExplosion isVisible count={36} duration={1100} />
              </View>
            ) : null}
          </View>

          {/* Copy */}
          <Animated.View style={titleStyle}>
            <Text style={[styles.title, { color: SEMANTIC_COLORS.text.primary }]}>{resolvedTitle}</Text>
          </Animated.View>
          <Animated.View style={[messageStyle, styles.messageWrap]}>
            <Text style={[styles.message, { color: SEMANTIC_COLORS.text.secondary }]}>
              {chestOpened
                ? "Seven days straight. Look at you."
                : showMilestoneMessage && activeMilestone
                  ? STREAK_MILESTONE_MESSAGES[activeMilestone]
                  : resolvedMessage}
            </Text>
          </Animated.View>

          {/* Perfect-lesson badge */}
          {isPerfect ? (
            <Animated.View
              testID="celebration-perfect-badge"
              style={[
                styles.badge,
                badgeStyle,
                { backgroundColor: badgeColors.surface, borderColor: badgeColors.border },
              ]}
            >
              <HugeiconsIcon icon={Clapping01Icon} size={18} color={badgeColors.text} strokeWidth={2.4} />
              <Text style={[styles.badgeText, { color: badgeColors.text }]}>PERFECT LESSON</Text>
              {bonusXP > 0 ? (
                <View style={[styles.badgeBonus, { backgroundColor: badgeColors.text }]}>
                  <Text style={[styles.badgeBonusText, { color: badgeColors.surface }]}>+{bonusXP} XP</Text>
                </View>
              ) : null}
            </Animated.View>
          ) : null}

          {/* Streak milestone pill */}
          {activeMilestone ? (
            <Animated.View
              testID="celebration-streak-milestone"
              style={[
                styles.badge,
                milestoneStyle,
                { backgroundColor: milestoneColors.surface, borderColor: milestoneColors.border },
              ]}
            >
              <HugeiconsIcon icon={FireIcon} size={18} color={milestoneColors.text} strokeWidth={2.4} />
              <Text style={[styles.badgeText, { color: milestoneColors.text }]}>
                {activeMilestone}-DAY STREAK
              </Text>
            </Animated.View>
          ) : null}

          {/* Stat cards — ponytail: canonical variant="tile" tactile cards matching design system */}
          <View style={styles.statsRow}>
            <Animated.View style={[{ flex: 1 }, xpStyle]}>
              <Card
                variant="tile"
                radius="lg"
                className="w-full"
                contentClassName="items-center justify-center py-3.5 px-2 min-h-[78px]"
              >
                <Text style={[styles.statLabel, { color: SEMANTIC_COLORS.text.secondary }]}>XP</Text>
                <View style={styles.statValueRow}>
                  <HugeiconsIcon icon={ZapIcon} size={18} color="#F59E0B" strokeWidth={2.4} />
                  <Text testID="celebration-xp-value" style={[styles.statValue, { color: SEMANTIC_COLORS.text.primary }]}>
                    +{displayXP}
                  </Text>
                </View>
              </Card>
            </Animated.View>

            <Animated.View testID="celebration-streak-card" style={[{ flex: 1 }, streakStyle]}>
              <Card
                variant="tile"
                radius="lg"
                className="w-full"
                contentClassName="items-center justify-center py-3.5 px-2 min-h-[78px]"
              >
                {activeMilestone && !reducedMotion ? <FlameBurst delay={milestoneDelay} /> : null}
                <Text style={[styles.statLabel, { color: SEMANTIC_COLORS.text.secondary }]}>STREAK</Text>
                <View style={styles.statValueRow}>
                  <Animated.View style={flameIconStyle}>
                    <HugeiconsIcon icon={FireIcon} size={18} color="#EA580C" strokeWidth={2.4} />
                  </Animated.View>
                  <Text style={[styles.statValue, { color: SEMANTIC_COLORS.text.primary }]}>{resolvedStreak}</Text>
                </View>
              </Card>
            </Animated.View>
          </View>

          {/* Weekly streak dots — ponytail: dedicated row gives all 7 days horizontal breathing room */}
          <Animated.View style={[{ width: "100%", marginTop: 10 }, streakStyle]}>
            <Card
              variant="tile"
              radius="lg"
              className="w-full"
              contentClassName="py-2.5 px-4"
            >
              <View style={styles.weekDotsHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <HugeiconsIcon icon={FireIcon} size={15} color="#EA580C" strokeWidth={2.4} />
                  <Text style={[styles.statLabel, { color: SEMANTIC_COLORS.text.secondary }]}>THIS WEEK</Text>
                </View>
                <Text style={[styles.statLabel, { color: SEMANTIC_COLORS.text.primary }]}>
                  {resolvedStreak} DAY{resolvedStreak === 1 ? "" : "S"}
                </Text>
              </View>
              <WeeklyStreakDots
                streakDays={resolvedStreak}
                activeColor="#EA580C"
                inactiveColor={isDark ? "#283C29" : "#E5E5E5"}
                letterColor={isDark ? "#8FA58F" : "#64748B"}
              />
            </Card>
          </Animated.View>

          {/* Daily goal ring card — ponytail: reuse shared Card variant="tile" */}
          <Animated.View
            testID="celebration-daily-goal"
            style={[{ width: "100%", marginTop: 10 }, ringCardStyle]}
          >
            <Card
              variant="tile"
              radius="lg"
              className="w-full"
              contentClassName="flex-row items-center gap-3.5 p-3.5"
            >
              <DailyGoalRing
                size={54}
                strokeWidth={6}
                from={todayBefore / dailyGoal}
                to={todayAfter / dailyGoal}
                color={ringColors.fill}
                trackColor={ringColors.track}
                delay={ringFillDelay}
                duration={ringFillDuration}
              >
                <HugeiconsIcon
                  icon={goalDone ? Tick02Icon : Target02Icon}
                  size={20}
                  color={ringColors.fill}
                  strokeWidth={2.6}
                />
              </DailyGoalRing>
              <View style={styles.goalText}>
                <Text style={[styles.statLabel, { color: ringColors.label }]}>DAILY GOAL</Text>
                <Text style={[styles.goalValue, { color: SEMANTIC_COLORS.text.primary }]}>
                  {Math.min(todayAfter, dailyGoal)}
                  <Text style={[styles.goalOf, { color: SEMANTIC_COLORS.text.secondary }]}> / {dailyGoal} XP</Text>
                </Text>
                <Text style={[styles.goalHint, { color: ringColors.label }]}>
                  {ringHint}
                </Text>
              </View>
            </Card>
          </Animated.View>

          {/* Perfect week chest */}
          {perfectWeek ? (
            <Animated.View style={[styles.chestCardWrap, chestCardStyle]}>
              <Card
                variant="solid"
                radius="lg"
                showDepth={true}
                className="w-full"
                contentClassName="flex-row items-center gap-3.5 p-3.5"
                onPress={handleOpenChest}
                disabled={chestOpened}
                accessibilityLabel={
                  chestOpened
                    ? `Perfect week chest opened. Plus ${PERFECT_WEEK_BONUS_XP} XP`
                    : "Perfect week. Tap to open your chest"
                }
                faceStyle={{
                  backgroundColor: chestOpened ? (isDark ? "#14281a" : "#EAF7EC") : badgeColors.surface,
                  borderColor: chestOpened ? (isDark ? "#2c5a34" : "#BFE3C4") : badgeColors.border,
                  borderWidth: 2,
                }}
                rimStyle={{
                  backgroundColor: chestOpened ? (isDark ? "#2c5a34" : "#86EFAC") : badgeColors.border,
                }}
              >
                <Animated.View
                  style={[
                    styles.chestIcon,
                    chestIconStyle,
                    { backgroundColor: chestOpened ? goalGreen : badgeColors.text },
                  ]}
                >
                  <HugeiconsIcon
                    icon={chestOpened ? Tick02Icon : GiftIcon}
                    size={24}
                    color={chestOpened ? (isDark ? "#0f1a0f" : "#FFFFFF") : badgeColors.surface}
                    strokeWidth={2.4}
                  />
                </Animated.View>
                <View style={styles.goalText}>
                  <Text style={[styles.statLabel, { color: chestOpened ? goalGreen : badgeColors.text }]}>
                    PERFECT WEEK
                  </Text>
                  <Text style={[styles.goalValue, { color: SEMANTIC_COLORS.text.primary }]}>
                    {chestOpened ? `+${PERFECT_WEEK_BONUS_XP} XP` : "Seven for seven!"}
                  </Text>
                  <Text style={[styles.goalHint, { color: SEMANTIC_COLORS.text.secondary }]}>
                    {chestOpened ? "Every dot lit this week. Proud of you." : "Tap to open your bonus chest"}
                  </Text>
                </View>
              </Card>
            </Animated.View>
          ) : null}

          <View style={styles.spacer} />

          {/* CTAs — ponytail: primary Continue first, ghost Share beneath */}
          <Animated.View style={[styles.buttonWrap, buttonStyle]}>
            <View testID="celebration-continue-button" style={styles.continueWrap}>
              <Button
                label={continueLabel}
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleContinue}
                disabled={!canInteract}
              />
            </View>
            <View testID="celebration-share-button">
              <Button
                label={isSharing ? "Preparing…" : "Share your win"}
                variant="ghost"
                size="md"
                fullWidth
                leftIcon={
                  <HugeiconsIcon
                    icon={Share01Icon}
                    size={18}
                    color={SEMANTIC_COLORS.text.secondary}
                    strokeWidth={2.2}
                  />
                }
                onPress={handleShare}
                loading={isSharing}
                disabled={!canInteract}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shareCardHost: {
    // ponytail: move offscreen to prevent ghost card rendering behind modal
    position: "absolute",
    left: -10000,
    top: -10000,
    width: SHARE_CARD_WIDTH,
    height: SHARE_CARD_HEIGHT,
    zIndex: -9999,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  muteButton: {
    position: "absolute",
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  mascotZone: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 165,
    marginTop: 2,
    marginBottom: 4,
  },
  confettiLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  mascotWrap: {
    width: 175,
    height: 175,
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 30,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  messageWrap: {
    marginTop: 6,
    paddingHorizontal: 12,
  },
  message: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  badge: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: 999,
    borderWidth: 2,
  },
  badgeText: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  badgeBonus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeBonusText: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 12,
  },
  statsRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  statLabel: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  statValueRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 22,
  },
  goalText: {
    flex: 1,
  },
  goalValue: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 20,
    marginTop: 2,
  },
  goalOf: {
    fontFamily: APP_FONT_FAMILIES.bold,
    fontSize: 14,
  },
  goalHint: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 13,
    marginTop: 2,
  },
  chestCardWrap: {
    width: "100%",
    marginTop: 10,
  },
  chestIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    flex: 1,
    minHeight: 8,
  },
  weekDotsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  buttonWrap: {
    width: "100%",
    marginTop: 14,
    gap: 8,
  },
  continueWrap: {
    width: "100%",
  },
});

export default LessonCompleteCelebration;
