import { useState, useEffect, useCallback } from "react";
import { HapticManager } from "@/lib/haptics/HapticManager";
import { HapticSettings } from "@/lib/haptics/types";
import { hapticService } from "@/lib/haptics/hapticService";

/**
 * Hook for managing haptic settings.
 * Provides access to and mutation of haptic preferences.
 */
export const useHapticSettings = () => {
  const [settings, setSettings] = useState<HapticSettings>({
    enabled: true,
    intensity: 1.0,
    profile: "full",
    reduceMotionEnabled: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize settings from storage
  useEffect(() => {
    const initSettings = async () => {
      try {
        await HapticManager.initialize();
        const loaded = HapticManager.getSettings();
        setSettings(loaded);
      } catch (error) {
        console.error("Error loading haptic settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSettings();
  }, []);

  const updateSettings = useCallback(
    async (updates: Partial<HapticSettings>) => {
      try {
        await HapticManager.updateSettings(updates);
        const updated = HapticManager.getSettings();
        setSettings(updated);

        // Provide haptic feedback that settings changed
        await hapticService.settingChanged();
      } catch (error) {
        console.error("Error updating haptic settings:", error);
      }
    },
    [],
  );

  const setIntensity = useCallback(
    (intensity: number) => {
      updateSettings({ intensity: Math.max(0, Math.min(1, intensity)) });
    },
    [updateSettings],
  );

  const setProfile = useCallback(
    (profile: HapticSettings["profile"]) => {
      updateSettings({ profile });
    },
    [updateSettings],
  );

  const setEnabled = useCallback(
    (enabled: boolean) => {
      updateSettings({ enabled });
    },
    [updateSettings],
  );

  const testHaptic = useCallback(async () => {
    await hapticService.buttonTap();
  }, []);

  const testMeditationHaptic = useCallback(async () => {
    await hapticService.meditationStart();
  }, []);

  const testAchievementHaptic = useCallback(async () => {
    await hapticService.streakDay7();
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    setIntensity,
    setProfile,
    setEnabled,
    testHaptic,
    testMeditationHaptic,
    testAchievementHaptic,
  };
};

/**
 * Hook for detecting and respecting system accessibility settings
 */
export const useAccessibilityHaptics = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Detect system reduce motion setting (would need native bridge)
    // For now, provide manual control
    const checkAccessibility = async () => {
      // TODO: Use AccessibilityInfo to detect system preferences
      // const screenReaderEnabled = await AccessibilityInfo.screenReaderEnabled();
      // const boldTextEnabled = await AccessibilityInfo.boldTextEnabled();
    };

    checkAccessibility();
  }, []);

  const applyAccessibilitySettings = useCallback(
    (settings: HapticSettings): HapticSettings => {
      if (reduceMotion) {
        return {
          ...settings,
          intensity: settings.intensity * 0.5,
          profile: settings.profile === "full" ? "reduced" : settings.profile,
        };
      }
      return settings;
    },
    [reduceMotion],
  );

  return { reduceMotion, setReduceMotion, applyAccessibilitySettings };
};
