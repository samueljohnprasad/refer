import { useEffect, useRef } from "react";
import { HapticManager } from "@/lib/haptics/HapticManager";

interface BreathingHapticsOptions {
  enabled?: boolean;
  inhaleTime?: number; // ms
  holdTime?: number; // ms
  exhaleTime?: number; // ms
  autoStart?: boolean;
}

/**
 * Hook that synchronizes haptics with breathing animations.
 * Creates ramp-up/ramp-down patterns matched to breathing cycle.
 */
export const useBreathingHaptics = (options: BreathingHapticsOptions = {}) => {
  const {
    enabled = true,
    inhaleTime = 4000,
    holdTime = 4000,
    exhaleTime = 8000,
    autoStart = true,
  } = options;

  const cycleRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  const totalCycleDuration = inhaleTime + holdTime + exhaleTime;

  const startBreathing = async () => {
    if (!enabled || isRunningRef.current) return;
    isRunningRef.current = true;

    const performCycle = async () => {
      try {
        // Inhale: ramp up from 0.2 to 0.35 intensity
        await HapticManager.triggerRamp(0.2, 0.35, inhaleTime, 10);

        // Hold: sustain 0.35 intensity
        await HapticManager.triggerCustom({
          intensity: 0.35,
          sharpness: 0.2,
          duration: holdTime,
          pattern: "sine",
        });

        // Exhale: ramp down from 0.35 to 0.2 intensity
        await HapticManager.triggerRamp(0.35, 0.2, exhaleTime, 10);
      } catch (error) {
        console.error("Error in breathing haptics cycle:", error);
      }
    };

    // Start immediately
    await performCycle();

    // Schedule next cycle
    cycleRef.current = setInterval(performCycle, totalCycleDuration);
  };

  const stopBreathing = () => {
    isRunningRef.current = false;
    if (cycleRef.current) {
      clearInterval(cycleRef.current);
      cycleRef.current = null;
    }
  };

  useEffect(() => {
    if (autoStart) {
      startBreathing();
    }

    return () => {
      stopBreathing();
    };
  }, [enabled, inhaleTime, holdTime, exhaleTime, autoStart]);

  return { startBreathing, stopBreathing, isRunning: isRunningRef.current };
};

/**
 * Hook for box breathing pattern (4-4-4-4)
 */
export const useBoxBreathingHaptics = (enabled: boolean = true) => {
  return useBreathingHaptics({
    enabled,
    inhaleTime: 4000,
    holdTime: 4000,
    exhaleTime: 4000,
  });
};

/**
 * Hook for extended breathing (4-7-8)
 */
export const useExtendedBreathingHaptics = (enabled: boolean = true) => {
  return useBreathingHaptics({
    enabled,
    inhaleTime: 4000,
    holdTime: 7000,
    exhaleTime: 8000,
  });
};

/**
 * Hook for slow, calming breathing (6-6-6)
 */
export const useSlowBreathingHaptics = (enabled: boolean = true) => {
  return useBreathingHaptics({
    enabled,
    inhaleTime: 6000,
    holdTime: 6000,
    exhaleTime: 6000,
  });
};
