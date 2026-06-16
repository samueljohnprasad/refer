import { useEffect, useRef } from "react";
import { HapticManager } from "@/lib/haptics/HapticManager";
import { hapticService } from "@/lib/haptics/hapticService";

interface MeditationHapticsOptions {
  enabled?: boolean;
  _durationMinutes?: number; // Reserved for future use
  ambientFeedback?: boolean; // Subtle background haptics
  markingInterval?: number; // ms between time-marking haptics
}

/**
 * Hook that provides ambient haptic feedback during meditation.
 * Includes optional time-marking and transition cues.
 */
export const useMeditationHaptics = (
  options: MeditationHapticsOptions = {},
) => {
  const {
    enabled = true,
    ambientFeedback = true,
    markingInterval = 120000, // Every 2 minutes
  } = options;

  const ambientIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const markingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  const startMeditation = async () => {
    if (!enabled || isRunningRef.current) return;
    isRunningRef.current = true;

    try {
      // Start meditation with gentle entry
      await hapticService.meditationStart();

      if (ambientFeedback) {
        // Start ambient background feedback (pendulum pattern, barely noticeable)
        ambientIntervalRef.current = setInterval(async () => {
          try {
            await HapticManager.trigger("pendulum", { intensity: 0.15 });
          } catch (error) {
            console.error("Error in ambient meditation feedback:", error);
          }
        }, 8000); // Every 8 seconds
      }

      // Mark time passages (every 2 min)
      markingIntervalRef.current = setInterval(async () => {
        try {
          await hapticService.meditationTransition();
        } catch (error) {
          console.error("Error in meditation time marker:", error);
        }
      }, markingInterval);
    } catch (error) {
      console.error("Error starting meditation haptics:", error);
    }
  };

  const endMeditation = async () => {
    isRunningRef.current = false;

    if (ambientIntervalRef.current) {
      clearInterval(ambientIntervalRef.current);
      ambientIntervalRef.current = null;
    }

    if (markingIntervalRef.current) {
      clearInterval(markingIntervalRef.current);
      markingIntervalRef.current = null;
    }

    try {
      // Gentle outro
      await hapticService.meditationEnd();
    } catch (error) {
      console.error("Error ending meditation haptics:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (isRunningRef.current) {
        endMeditation();
      }
    };
  }, []);

  return {
    startMeditation,
    endMeditation,
    isRunning: isRunningRef.current,
  };
};

/**
 * Hook for guided meditation with breathing synchronization.
 * Syncs haptics with breathing phase (inhale/exhale).
 */
export const useGuidedMeditationHaptics = (enabled: boolean = true) => {
  const meditationHaptics = useMeditationHaptics({
    enabled,
    ambientFeedback: true,
  });

  const syncToBreathingPhase = async (phase: "inhale" | "exhale") => {
    if (!enabled) return;

    try {
      if (phase === "inhale") {
        await HapticManager.triggerRamp(0.2, 0.35, 4000, 8);
      } else {
        await HapticManager.triggerRamp(0.35, 0.2, 6000, 8);
      }
    } catch (error) {
      console.error("Error syncing to breathing phase:", error);
    }
  };

  return {
    ...meditationHaptics,
    syncToBreathingPhase,
  };
};

/**
 * Hook for sleep meditation - extra gentle, no time markers
 */
export const useSleepMeditationHaptics = (enabled: boolean = true) => {
  return useMeditationHaptics({
    enabled,
    ambientFeedback: true,
    markingInterval: Infinity, // No time markers during sleep
  });
};

/**
 * Hook for focused meditation - includes focus milestone haptics
 */
export const useFocusedMeditationHaptics = (enabled: boolean = true) => {
  const meditationHaptics = useMeditationHaptics({
    enabled,
    ambientFeedback: true,
    markingInterval: 300000, // Every 5 minutes
  });

  const focusMilestone = async () => {
    try {
      await hapticService.focusMilestone();
    } catch (error) {
      console.error("Error in focus milestone:", error);
    }
  };

  return {
    ...meditationHaptics,
    focusMilestone,
  };
};
