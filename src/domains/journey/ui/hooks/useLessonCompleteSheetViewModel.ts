import { useCallback, useEffect } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES } from "@/lib/haptics/hapticConfig";

export interface LessonCompleteSheetProps {
  isVisible: boolean;
  takeaway: string;
  onContinue: () => void;
}

export function useLessonCompleteSheetViewModel(
  { isVisible, onContinue }: LessonCompleteSheetProps,
  ref: React.ForwardedRef<BottomSheetModal>,
) {
  useEffect(() => {
    if (isVisible) {
      if (ref && "current" in ref && ref.current) {
        ref.current.present();
      }
      setTimeout(() => {
        void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM_STRONG);
      }, 100);
    } else {
      if (ref && "current" in ref && ref.current) {
        ref.current.dismiss();
      }
    }
  }, [isVisible, ref]);

  const handleContinue = useCallback(() => {
    void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM_STRONG);
    if (ref && "current" in ref && ref.current) {
      ref.current.dismiss();
    }
    onContinue();
  }, [onContinue, ref]);

  return { handleContinue };
}
