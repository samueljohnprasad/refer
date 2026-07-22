import { useCallback, useRef } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import type { GuestProgress } from "@/hooks/data/useGuestProgress";

export interface GuestSignUpSheetProps {
  guestProgress: GuestProgress;
  onDismiss?: () => void;
}

export function useGuestSignUpSheetViewModel(
  { guestProgress, onDismiss }: GuestSignUpSheetProps,
  ref: React.ForwardedRef<BottomSheetModal | null>,
) {
  const signInSheetRef = useRef<BottomSheetModal>(null);

  const handleSaveProgress = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    setTimeout(() => {
      signInSheetRef.current?.present();
    }, 300);
  }, [ref]);

  const handleNotNow = useCallback((): void => {
    Haptics.selectionAsync();
    (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    onDismiss?.();
  }, [ref, onDismiss]);

  const completedCount: number = guestProgress.completedNodeIds.length;

  return {
    signInSheetRef,
    handleSaveProgress,
    handleNotNow,
    completedCount,
    guestProgress,
    onDismiss,
  };
}
