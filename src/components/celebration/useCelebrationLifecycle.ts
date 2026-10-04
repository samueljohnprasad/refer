import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { useSharedValue, Easing, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { hasClaimedPerfectWeek, isPerfectWeek, markPerfectWeekClaimed } from "@/src/store/perfectWeekStore";
import {
  getStreakMilestone,
  markStreakMilestoneCelebrated,
  shouldCelebrateStreakMilestone,
  type StreakMilestoneDay,
} from "@/src/store/streakMilestoneStore";
import { createLogger } from "@/src/lib/logger";

const logger = createLogger("lesson-complete-celebration");

interface UseCelebrationLifecycleOptions {
  isVisible: boolean;
  totalXP: number;
  resolvedStreak: number;
  isPerfect: boolean;
  reducedMotion: boolean;
  goalReachedBefore: boolean;
  goalReachedAfter: boolean;
  celebrateStreakMilestone?: boolean;
  celebratePerfectWeek?: boolean;
  play: (sound: "celebrationChime") => void;
  xpEarned: number;
  bonusXP: number;
  lessonTitle?: string;
}

export function useCelebrationLifecycle({
  isVisible, totalXP, resolvedStreak, isPerfect, reducedMotion,
  goalReachedBefore, goalReachedAfter, celebrateStreakMilestone,
  celebratePerfectWeek, play, xpEarned, bonusXP, lessonTitle,
}: UseCelebrationLifecycleOptions) {
  const [displayXP, setDisplayXP] = useState(0);
  const [canInteract, setCanInteract] = useState(false);
  const [goalJustReached, setGoalJustReached] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<StreakMilestoneDay | null>(null);
  const [showMilestoneMessage, setShowMilestoneMessage] = useState(false);
  const [perfectWeek, setPerfectWeek] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const chestAwardedRef = useRef(false);
  const countTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shareCardRef = useRef<View>(null);
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
  const rm = reducedMotion;
  const animDuration = rm ? 120 : 200;
  const cardDelay = rm ? 0 : 60;
  const ringDelay = rm ? 0 : 80;
  const ringFillDelay = rm ? 0 : 100;
  const ringFillDuration = rm ? 150 : 350;
  const milestoneDelay = rm ? 0 : 100;
  const popIn = (reduced: boolean) => reduced
    ? withTiming(1, { duration: 120 })
    : withSpring(1, { damping: 20, stiffness: 240 });

  const startCountUp = () => {
    if (countTimerRef.current) clearInterval(countTimerRef.current);
    const start = Date.now();
    const duration = reducedMotion ? 100 : 250;
    countTimerRef.current = setInterval(() => {
      const fraction = Math.min((Date.now() - start) / duration, 1);
      setDisplayXP(Math.round(totalXP * (1 - Math.pow(1 - fraction, 3))));
      if (fraction >= 1 && countTimerRef.current) {
        clearInterval(countTimerRef.current);
        countTimerRef.current = null;
      }
    }, 16);
  };

  useEffect(() => {
    logger.info("useEffect triggered, isVisible =", isVisible, {
      xpEarned, bonusXP, isPerfect, streakDays: resolvedStreak, lessonTitle,
    });
    if (!isVisible) {
      [overlayOpacity, pandaProgress, clapProgress, glowOpacity, titleOpacity, messageOpacity,
        badgeScale, badgeOpacity, xpScale, xpOpacity, streakScale, streakOpacity, ringScale,
        ringOpacity, milestoneScale, milestoneOpacity, flamePulse, chestScale, chestOpacity,
        chestWobble, buttonOpacity].forEach((value) => { value.value = 0; });
      pandaSwap.value = 1;
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
    play("celebrationChime");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    pandaProgress.value = withTiming(1, { duration: rm ? 150 : 280, easing: Easing.out(Easing.cubic) });
    titleOpacity.value = withDelay(rm ? 0 : 30, withTiming(1, { duration: animDuration }));
    messageOpacity.value = withDelay(rm ? 0 : 50, withTiming(1, { duration: animDuration }));
    if (isPerfect) {
      glowOpacity.value = withTiming(1, { duration: animDuration });
      badgeOpacity.value = withDelay(rm ? 0 : 50, withTiming(1, { duration: animDuration }));
      badgeScale.value = withDelay(rm ? 0 : 50, popIn(rm));
    }
    xpOpacity.value = withDelay(cardDelay, withTiming(1, { duration: animDuration }));
    xpScale.value = withDelay(cardDelay, popIn(rm));
    startCountUp();
    streakOpacity.value = withDelay(cardDelay, withTiming(1, { duration: animDuration }));
    streakScale.value = withDelay(cardDelay, popIn(rm));

    const streakMilestone = getStreakMilestone(resolvedStreak);
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

    ringOpacity.value = withDelay(ringDelay, withTiming(1, { duration: animDuration }));
    ringScale.value = withDelay(ringDelay, popIn(rm));
    if (goalReachedAfter && !goalReachedBefore) schedule(ringFillDelay + ringFillDuration, () => setGoalJustReached(true));
    let perfectWeekCheckCancelled = false;
    if (celebratePerfectWeek ?? isPerfectWeek(resolvedStreak)) {
      const showChest = () => {
        setPerfectWeek(true);
        chestOpacity.value = withDelay(ringDelay, withTiming(1, { duration: animDuration }));
        chestScale.value = withDelay(ringDelay, popIn(rm));
      };
      if (celebratePerfectWeek !== undefined) showChest();
      else {
        hasClaimedPerfectWeek().then((claimed) => {
          if (claimed || perfectWeekCheckCancelled) return;
          showChest();
          void markPerfectWeekClaimed();
        });
      }
    }
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

  return {
    displayXP, canInteract, setCanInteract, goalJustReached,
    activeMilestone, showMilestoneMessage, perfectWeek, chestOpened, setChestOpened,
    chestAwardedRef, countTimerRef, timersRef, shareCardRef, schedule,
    overlayOpacity, pandaProgress, clapProgress, glowOpacity, titleOpacity, messageOpacity,
    badgeScale, badgeOpacity, xpScale, xpOpacity, streakScale, streakOpacity, ringScale,
    ringOpacity, milestoneScale, milestoneOpacity, flamePulse, chestScale, chestOpacity,
    chestWobble, pandaSwap, buttonOpacity, ringFillDelay, ringFillDuration, milestoneDelay,
  };
}
