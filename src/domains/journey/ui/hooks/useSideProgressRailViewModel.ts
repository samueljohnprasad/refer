import { useCallback } from "react";
import type { JourneyStats } from "@/src/types/journey/state";
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES } from "@/lib/haptics/hapticConfig";

export interface SideProgressRailProps {
  stats: JourneyStats;
  onXPPress?: () => void;
  onHeartsPress?: () => void;
  onStreakPress?: () => void;
}

export interface RailIconProps {
  icon: string;
  value: string;
  backgroundColor: string;
  borderColor: string;
  onPress?: () => void;
  accessibilityLabel: string;
}

export function useRailIconViewModel({ onPress }: { onPress?: () => void }) {
  const handlePress = useCallback(() => {
    void triggerIfEnabledSync("pulse", HAPTIC_INTENSITIES.PULSE_LIGHT);
    onPress?.();
  }, [onPress]);

  return { handlePress };
}

export function useSideProgressRailViewModel({
  stats,
  onXPPress,
  onHeartsPress,
  onStreakPress,
}: SideProgressRailProps) {
  return {
    stats,
    onXPPress,
    onHeartsPress,
    onStreakPress,
  };
}
