import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Modal, Share, useColorScheme } from "react-native";
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
  Clock01Icon,
  Share01Icon,
  Clapping01Icon,
  Target02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/src/components/ui/Button";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { ShareWinCard } from "@/src/components/celebration/ShareWinCard";
import { DailyGoalRing } from "@/src/components/celebration/DailyGoalRing";
import { FlameBurst } from "@/src/components/celebration/FlameBurst";
import { useSoundEffects } from "@/src/hooks/useSoundEffects";
import { useStreak } from "@/src/hooks/useStreak";
import { useXPOptional } from "@/src/context/XPContext";
import { useDailyXPGoal } from "@/src/store/dailyGoalStore";
import {
  getStreakMilestone,
  markStreakMilestoneCelebrated,
  shouldCelebrateStreakMilestone,
  STREAK_MILESTONE_MESSAGES,
  type StreakMilestoneDay,
} from "@/src/store/streakMilestoneStore";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

// ─── Mascot variants ──────────────────────────────────────────────────────────
const PANDA = {
  celebrate: require("../../../assets/images/panda/panda-super-excite.png"),
  happy: require("../../../assets/images/panda/panda-happy.png"),
  plant: require("../../../assets/images/panda/panda-plant.png"),
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
  title = "Lesson complete!",
  perfectTitle = "Perfect lesson!",
  message,
  continueLabel = "Continue",
  pandaVariant = "celebrate",
  onContinue,
}: LessonCompleteCelebrationProps) {
  const isDark = useColorScheme() === "dark";
  const reducedMotion = useReducedMotion();
  const { play } = useSoundEffects();
  const { currentStreak } = useStreak();
  const xpContext = useXPOptional();
  const { goal: savedGoal } = useDailyXPGoal();

  const [displayXP, setDisplayXP] = useState(0);
  const [canInteract, setCanInteract] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [goalJustReached, setGoalJustReached] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<StreakMilestoneDay | null>(null);
  const [showMilestoneMessage, setShowMilestoneMessage] = useState(false);
  const countTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shareCardRef = useRef<View>(null);

  const totalXP = xpEarned + (isPerfect ? bonusXP : 0);
  // The learner just finished a lesson today, so the streak is at least 1 even
  // if the streak query hasn't refetched yet.
  const resolvedStreak = Math.max(1, streakDays ?? currentStreak ?? 0);
  const resolvedTitle = isPerfect ? perfectTitle : title;
  const resolvedMessage = message ?? pickEncouragement(lessonTitle ?? title, isPerfect);
  const resolvedPanda: CelebrationPandaVariant = isPerfect ? "happy" : pandaVariant;

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
  const timeScale = useSharedValue(0);
  const timeOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const milestoneScale = useSharedValue(0);
  const milestoneOpacity = useSharedValue(0);
  const flamePulse = useSharedValue(0);
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
    const duration = reducedMotion ? 200 : 700;
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

  const popIn = (rm: boolean) =>
    rm
      ? withTiming(1, { duration: 150 })
      : withSequence(
          withSpring(1.12, { damping: 9, stiffness: 150 }),
          withSpring(1, { damping: 12, stiffness: 160 }),
        );

  // Shared timeline (ms) — also read by the ring at render time.
  const rm = reducedMotion;
  const badgeDelay = rm ? 200 : 700;
  const stagger = rm ? 40 : 140;
  const cardDelay = isPerfect ? badgeDelay + (rm ? 80 : 260) : rm ? 220 : 760;
  const milestoneDelay = cardDelay + stagger + (rm ? 80 : 260);
  const ringDelay = cardDelay + stagger * 3 + (rm ? 40 : 120);
  const ringFillDelay = ringDelay + (rm ? 60 : 220);
  const ringFillDuration = rm ? 250 : 900;

  useEffect(() => {
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
      timeScale.value = 0;
      timeOpacity.value = 0;
      ringScale.value = 0;
      ringOpacity.value = 0;
      milestoneScale.value = 0;
      milestoneOpacity.value = 0;
      flamePulse.value = 0;
      buttonOpacity.value = 0;
      setDisplayXP(0);
      setCanInteract(false);
      setGoalJustReached(false);
      setActiveMilestone(null);
      setShowMilestoneMessage(false);
      if (countTimerRef.current) clearInterval(countTimerRef.current);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      return;
    }

    overlayOpacity.value = withTiming(1, { duration: rm ? 150 : 280 });

    // Sound: a soft page-turn as the screen opens, a chime as the mascot lands.
    play("pageTurn");
    schedule(rm ? 120 : 380, () => play("celebrationChime"));

    // Mascot pop
    pandaProgress.value = withDelay(
      rm ? 0 : 120,
      withTiming(1, { duration: rm ? 250 : 760, easing: Easing.out(Easing.cubic) }),
    );
    runHaptic(rm ? 120 : 420, Haptics.ImpactFeedbackStyle.Medium);

    // Perfect lesson: golden glow + a slow, rhythmic 3-beat clap after landing.
    if (isPerfect) {
      glowOpacity.value = withDelay(rm ? 150 : 700, withTiming(1, { duration: 500 }));
      if (!rm) {
        const beat = 520;
        clapProgress.value = withDelay(
          900,
          withRepeat(
            withSequence(
              withTiming(1, { duration: beat / 2, easing: Easing.out(Easing.quad) }),
              withTiming(0, { duration: beat / 2, easing: Easing.in(Easing.quad) }),
            ),
            3,
            false,
          ),
        );
        for (let i = 0; i < 3; i++) {
          runHaptic(900 + i * beat + beat / 2, Haptics.ImpactFeedbackStyle.Light);
        }
      }
    }

    // Title + message
    titleOpacity.value = withDelay(rm ? 150 : 420, withTiming(1, { duration: rm ? 150 : 320 }));
    messageOpacity.value = withDelay(rm ? 180 : 560, withTiming(1, { duration: rm ? 150 : 320 }));

    // Perfect badge
    if (isPerfect) {
      badgeOpacity.value = withDelay(badgeDelay, withTiming(1, { duration: rm ? 120 : 200 }));
      badgeScale.value = withDelay(badgeDelay, popIn(rm));
      runHaptic(badgeDelay, Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Stat cards spring in one after another; XP counts up as it lands.
    xpOpacity.value = withDelay(cardDelay, withTiming(1, { duration: rm ? 120 : 220 }));
    xpScale.value = withDelay(cardDelay, popIn(rm));
    schedule(cardDelay, () => {
      startCountUp();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    });

    streakOpacity.value = withDelay(cardDelay + stagger, withTiming(1, { duration: rm ? 120 : 220 }));
    streakScale.value = withDelay(cardDelay + stagger, popIn(rm));
    runHaptic(cardDelay + stagger, Haptics.ImpactFeedbackStyle.Light);

    if (durationMs !== undefined) {
      timeOpacity.value = withDelay(cardDelay + stagger * 2, withTiming(1, { duration: rm ? 120 : 220 }));
      timeScale.value = withDelay(cardDelay + stagger * 2, popIn(rm));
      runHaptic(cardDelay + stagger * 2, Haptics.ImpactFeedbackStyle.Light);
    }

    // Streak milestone: flame burst on the streak card + message pill.
    const startMilestone = (milestone: StreakMilestoneDay) => {
      setActiveMilestone(milestone);
      milestoneOpacity.value = withDelay(milestoneDelay, withTiming(1, { duration: rm ? 120 : 200 }));
      milestoneScale.value = withDelay(milestoneDelay, popIn(rm));
      // Swap the encouragement line for the milestone message with a quick dip.
      messageOpacity.value = withDelay(
        milestoneDelay,
        withSequence(withTiming(0, { duration: 120 }), withTiming(1, { duration: 240 })),
      );
      schedule(milestoneDelay + 120, () => setShowMilestoneMessage(true));
      if (!rm) {
        flamePulse.value = withDelay(
          milestoneDelay,
          withRepeat(
            withSequence(
              withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) }),
              withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) }),
            ),
            2,
            false,
          ),
        );
      }
      runHaptic(milestoneDelay, Haptics.ImpactFeedbackStyle.Heavy);
      runHaptic(milestoneDelay + 200, Haptics.ImpactFeedbackStyle.Medium);
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

    // Daily goal ring card: pops in after the stats, then fills.
    ringOpacity.value = withDelay(ringDelay, withTiming(1, { duration: rm ? 120 : 220 }));
    ringScale.value = withDelay(ringDelay, popIn(rm));
    runHaptic(ringDelay, Haptics.ImpactFeedbackStyle.Light);
    if (goalReachedAfter && !goalReachedBefore) {
      schedule(ringFillDelay + ringFillDuration - 60, () => {
        setGoalJustReached(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      });
    }

    // Buttons
    buttonOpacity.value = withDelay(
      ringFillDelay + (rm ? 120 : 420),
      withTiming(1, { duration: rm ? 120 : 260 }, (finished) => {
        if (finished) runOnJS(setCanInteract)(true);
      }),
    );

    return () => {
      milestoneCheckCancelled = true;
      if (countTimerRef.current) clearInterval(countTimerRef.current);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  const pandaStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {
        opacity: interpolate(pandaProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
        transform: [
          { scale: interpolate(pandaProgress.value, [0, 1], [0.96, 1], Extrapolation.CLAMP) },
        ],
      };
    }
    const translateY = interpolate(pandaProgress.value, [0, 0.4, 0.7, 1], [50, -14, 4, 0], Extrapolation.CLAMP);
    const popScale = interpolate(pandaProgress.value, [0, 0.4, 0.6, 0.8, 1], [0.5, 1.15, 0.95, 1.03, 1], Extrapolation.CLAMP);
    const popRotate = interpolate(pandaProgress.value, [0, 0.4, 0.6, 0.8, 1], [-6, 5, -2, 1, 0], Extrapolation.CLAMP);
    const opacity = interpolate(pandaProgress.value, [0, 0.12, 1], [0, 1, 1], Extrapolation.CLAMP);
    // Slow clap: gentle squeeze + tilt on each beat.
    const scale = popScale + clapProgress.value * 0.07;
    const rotate = popRotate + clapProgress.value * 4;
    return { opacity, transform: [{ translateY }, { scale }, { rotate: `${rotate}deg` }] };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * (0.55 + clapProgress.value * 0.45),
    transform: [{ scale: 1 + clapProgress.value * 0.08 }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: 12 * (1 - titleOpacity.value) }],
  }));
  const messageStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ translateY: 12 * (1 - messageOpacity.value) }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));
  const xpStyle = useAnimatedStyle(() => ({
    opacity: xpOpacity.value,
    transform: [{ scale: xpScale.value }],
  }));
  const streakStyle = useAnimatedStyle(() => ({
    opacity: streakOpacity.value,
    transform: [{ scale: streakScale.value }],
  }));
  const timeStyle = useAnimatedStyle(() => ({
    opacity: timeOpacity.value,
    transform: [{ scale: timeScale.value }],
  }));
  const ringCardStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));
  const milestoneStyle = useAnimatedStyle(() => ({
    opacity: milestoneOpacity.value,
    transform: [{ scale: milestoneScale.value }],
  }));
  const flameIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + flamePulse.value * 0.45 }, { rotate: `${flamePulse.value * -8}deg` }],
  }));
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

  const handleContinue = () => {
    if (!canInteract) return;
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

  const bg = isDark ? "#0f1a0f" : "#fbfdf8";
  const amber = "#F5A623";
  const xpColors = {
    surface: isDark ? "#2a2410" : "#FFF7E0",
    border: isDark ? "#4a3f18" : "#F6D97A",
    label: isDark ? "#C9A24A" : "#B4791B",
    value: isDark ? "#F3C969" : "#8A5A12",
    icon: amber,
  };
  const streakColors = {
    surface: isDark ? "#2e1c12" : "#FFF0E6",
    border: isDark ? "#55301c" : "#FFC9A3",
    label: isDark ? "#E08A5A" : "#C2501A",
    value: isDark ? "#FFB08A" : "#A63E10",
    icon: "#FF7A3D",
  };
  const timeColors = {
    surface: isDark ? "#12222e" : "#E9F3FF",
    border: isDark ? "#1f3a52" : "#B9D8FF",
    label: isDark ? "#6FA8E6" : "#2B6CB0",
    value: isDark ? "#A9CFFF" : "#1F4F85",
    icon: "#3B82F6",
  };
  const badgeColors = {
    surface: isDark ? "#3a2d0c" : "#FFE89C",
    border: isDark ? "#6b5316" : "#F2C94C",
    text: isDark ? "#FFE08A" : "#7A4D0A",
  };
  const milestoneColors = {
    surface: isDark ? "#3a1d10" : "#FFE4D1",
    border: isDark ? "#6b3a1c" : "#FFB383",
    text: isDark ? "#FFC9A3" : "#9A3A0C",
  };
  const goalGreen = isDark ? "#7FCB85" : "#4F9A55";
  const goalDone = goalReachedBefore || goalJustReached;
  const ringColors = {
    surface: goalDone ? (isDark ? "#14281a" : "#EAF7EC") : SEMANTIC_COLORS.surface.secondary,
    border: goalDone ? (isDark ? "#2c5a34" : "#BFE3C4") : isDark ? "#2a3a2a" : "#E3ECE3",
    fill: goalDone ? goalGreen : amber,
    track: isDark ? "#2a3a2a" : "#E6EDE6",
    label: goalDone ? goalGreen : SEMANTIC_COLORS.text.secondary,
  };
  const ringHint = goalReachedBefore
    ? "Goal already met — every extra XP counts."
    : goalJustReached
      ? "Daily goal reached. Beautiful."
      : goalReachedAfter
        ? "Almost there…"
        : `${xpToGoal} XP to go`;

  return (
    <Modal transparent visible={isVisible} animationType="none" statusBarTranslucent>
      <Animated.View
        testID="lesson-complete-celebration"
        style={[StyleSheet.absoluteFill, overlayStyle, { backgroundColor: bg }]}
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

        <View style={styles.content}>
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
              <Image
                source={PANDA[resolvedPanda]}
                style={styles.mascot}
                contentFit="contain"
              />
            </Animated.View>
          </View>

          {/* Copy */}
          <Animated.View style={titleStyle}>
            <Text style={[styles.title, { color: SEMANTIC_COLORS.text.primary }]}>{resolvedTitle}</Text>
          </Animated.View>
          <Animated.View style={[messageStyle, styles.messageWrap]}>
            <Text style={[styles.message, { color: SEMANTIC_COLORS.text.secondary }]}>
              {showMilestoneMessage && activeMilestone
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

          {/* Stat cards */}
          <View style={styles.statsRow}>
            <Animated.View
              style={[styles.statCard, xpStyle, { backgroundColor: xpColors.surface, borderColor: xpColors.border }]}
            >
              <Text style={[styles.statLabel, { color: xpColors.label }]}>XP</Text>
              <View style={styles.statValueRow}>
                <HugeiconsIcon icon={ZapIcon} size={20} color={xpColors.icon} strokeWidth={2.4} />
                <Text testID="celebration-xp-value" style={[styles.statValue, { color: xpColors.value }]}>
                  +{displayXP}
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              testID="celebration-streak-card"
              style={[
                styles.statCard,
                streakStyle,
                {
                  backgroundColor: streakColors.surface,
                  borderColor: activeMilestone ? streakColors.icon : streakColors.border,
                },
              ]}
            >
              {activeMilestone && !reducedMotion ? <FlameBurst delay={milestoneDelay} /> : null}
              <Text style={[styles.statLabel, { color: streakColors.label }]}>STREAK</Text>
              <View style={styles.statValueRow}>
                <Animated.View style={flameIconStyle}>
                  <HugeiconsIcon icon={FireIcon} size={20} color={streakColors.icon} strokeWidth={2.4} />
                </Animated.View>
                <Text style={[styles.statValue, { color: streakColors.value }]}>{resolvedStreak}</Text>
              </View>
            </Animated.View>

            {durationMs !== undefined ? (
              <Animated.View
                testID="celebration-time-card"
                style={[styles.statCard, timeStyle, { backgroundColor: timeColors.surface, borderColor: timeColors.border }]}
              >
                <Text style={[styles.statLabel, { color: timeColors.label }]}>TIME</Text>
                <View style={styles.statValueRow}>
                  <HugeiconsIcon icon={Clock01Icon} size={20} color={timeColors.icon} strokeWidth={2.4} />
                  <Text style={[styles.statValue, { color: timeColors.value }]}>
                    {formatLessonDuration(durationMs)}
                  </Text>
                </View>
              </Animated.View>
            ) : null}
          </View>

          {/* Daily goal ring */}
          <Animated.View
            testID="celebration-daily-goal"
            style={[
              styles.goalCard,
              ringCardStyle,
              { backgroundColor: ringColors.surface, borderColor: ringColors.border },
            ]}
          >
            <DailyGoalRing
              size={60}
              strokeWidth={7}
              from={todayBefore / dailyGoal}
              to={todayAfter / dailyGoal}
              color={ringColors.fill}
              trackColor={ringColors.track}
              delay={ringFillDelay}
              duration={ringFillDuration}
            >
              <HugeiconsIcon
                icon={goalDone ? Tick02Icon : Target02Icon}
                size={22}
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
              <Text style={[styles.goalHint, { color: goalDone ? goalGreen : SEMANTIC_COLORS.text.secondary }]}>
                {ringHint}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.spacer} />

          {/* CTAs */}
          <Animated.View style={[styles.buttonWrap, buttonStyle]}>
            <View testID="celebration-share-button">
              <Button
                label={isSharing ? "Preparing…" : "Share your win"}
                variant="secondary"
                size="lg"
                fullWidth
                leftIcon={
                  <HugeiconsIcon
                    icon={Share01Icon}
                    size={20}
                    color={SEMANTIC_COLORS.text.primary}
                    strokeWidth={2.2}
                  />
                }
                onPress={handleShare}
                loading={isSharing}
                disabled={!canInteract}
              />
            </View>
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
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shareCardHost: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
    alignItems: "center",
  },
  mascotZone: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    width: 190,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 28,
    textAlign: "center",
  },
  messageWrap: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  message: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 17,
    lineHeight: 24,
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
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    overflow: "visible",
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
  goalCard: {
    marginTop: 12,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 2,
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
  spacer: {
    flex: 1,
  },
  buttonWrap: {
    width: "100%",
    gap: 12,
  },
  continueWrap: {
    width: "100%",
  },
});

export default LessonCompleteCelebration;
