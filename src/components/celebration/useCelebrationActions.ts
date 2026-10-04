import { useState } from "react";
import { Share } from "react-native";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { Easing, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { PERFECT_WEEK_BONUS_XP } from "@/src/store/perfectWeekStore";
import { XPActionType } from "@/src/types/xp";

interface UseCelebrationActionsOptions {
  canInteract: boolean;
  perfectWeek: boolean;
  isPerfect: boolean;
  lessonTitle?: string;
  totalXP: number;
  resolvedStreak: number;
  chestOpened: boolean;
  setChestOpened: (opened: boolean) => void;
  chestAwardedRef: { current: boolean };
  chestWobble: { value: number };
  chestScale: { value: number };
  pandaSwap: { value: number };
  shareCardRef: React.RefObject<unknown>;
  schedule: (delay: number, fn: () => void) => void;
  play: (sound: "celebrationChime") => void;
  awardXP?: (type: XPActionType, details: { customAmount: number; customDescription: string }) => void;
  onContinue: () => void;
  copy: { perfectLesson: string; lessonComplete: string; shareDialogTitle: string; chestDescription: string };
}

export function useCelebrationActions({
  canInteract, perfectWeek, isPerfect, lessonTitle, totalXP, resolvedStreak,
  chestOpened, setChestOpened, chestAwardedRef, chestWobble, chestScale, pandaSwap,
  shareCardRef, schedule, play, awardXP, onContinue, copy,
}: UseCelebrationActionsOptions) {
  const [isSharing, setIsSharing] = useState(false);
  const awardChest = () => {
    if (chestAwardedRef.current) return;
    chestAwardedRef.current = true;
    awardXP?.(XPActionType.EXERCISE_COMPLETE, {
      customAmount: PERFECT_WEEK_BONUS_XP,
      customDescription: copy.chestDescription,
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
    pandaSwap.value = withSequence(
      withTiming(0.82, { duration: 140, easing: Easing.in(Easing.quad) }),
      withSpring(1.12, { damping: 7, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 180 }),
    );
    setChestOpened(true);
    schedule(220, () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}));
    awardChest();
  };

  const handleContinue = () => {
    if (!canInteract) return;
    if (perfectWeek) awardChest();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onContinue();
  };

  const shareMessage = `${isPerfect ? copy.perfectLesson : copy.lessonComplete}${lessonTitle ? `: ${lessonTitle}` : ""} — +${totalXP} XP and a ${resolvedStreak}-day streak on Happy! 🐼`;
  const handleShare = async () => {
    if (!canInteract || isSharing) return;
    setIsSharing(true);
    try {
      const uri = await captureRef(shareCardRef as never, { format: "png", quality: 1, result: "tmpfile" });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", UTI: "public.png", dialogTitle: copy.shareDialogTitle });
      } else {
        await Share.share({ message: shareMessage, url: uri });
      }
    } catch {
      await Share.share({ message: shareMessage }).catch(() => {});
    } finally {
      setIsSharing(false);
    }
  };

  return { isSharing, handleOpenChest, handleContinue, handleShare };
}
