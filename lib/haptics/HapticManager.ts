import { Presets, Settings } from "react-native-pulsar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HapticPreset, HapticConfig, HapticSettings } from "./types";
import { HAPTIC_PRESETS } from "./presets";

const HAPTIC_SETTINGS_KEY = "@happy_haptic_settings";

const DEFAULT_SETTINGS: HapticSettings = {
  enabled: true,
  intensity: 1.0,
  profile: "full",
  reduceMotionEnabled: false,
};

const PROFILE_MULTIPLIERS: Record<HapticSettings["profile"], number> = {
  full: 1,
  reduced: 0.5,
  minimal: 0.25,
  none: 0,
};

export class HapticManager {
  private static settings: HapticSettings = { ...DEFAULT_SETTINGS };
  private static initialized = false;

  static async initialize() {
    if (HapticManager.initialized) return;

    try {
      const stored = await AsyncStorage.getItem(HAPTIC_SETTINGS_KEY);
      if (stored) HapticManager.settings = JSON.parse(stored);
    } catch (error) {
      console.error("Error initializing haptics:", error);
    } finally {
      HapticManager.initialized = true;
      Settings.enableHaptics(HapticManager.settings.enabled);
      Settings.preloadPresets(["Heartbeat", "Fanfare", "Explosion"]);
    }
  }

  static getSettings(): HapticSettings {
    return { ...HapticManager.settings };
  }

  static async updateSettings(updates: Partial<HapticSettings>) {
    HapticManager.settings = { ...HapticManager.settings, ...updates };

    if (updates.enabled !== undefined) {
      Settings.enableHaptics(updates.enabled);
    }

    try {
      await AsyncStorage.setItem(
        HAPTIC_SETTINGS_KEY,
        JSON.stringify(HapticManager.settings),
      );
    } catch (error) {
      console.error("Error saving haptic settings:", error);
    }
  }

  static async trigger(
    preset: HapticPreset,
    overrides?: Partial<HapticConfig>,
  ) {
    if (!HapticManager.settings.enabled) return;

    const config = { ...HAPTIC_PRESETS[preset], ...overrides };
    const finalIntensity = HapticManager.resolveIntensity(config.intensity);

    if (finalIntensity === 0) return;

    try {
      await HapticManager.dispatchConfig(finalIntensity, config);
    } catch (error) {
      console.error("Error triggering haptic:", error);
    }
  }

  static async triggerCustom(config: HapticConfig) {
    if (!HapticManager.settings.enabled) return;

    const finalIntensity = HapticManager.resolveIntensity(config.intensity);

    if (finalIntensity === 0) return;

    try {
      await HapticManager.playCustomPattern(finalIntensity, config);
    } catch (error) {
      console.error("Error triggering custom haptic:", error);
    }
  }

  static async triggerPattern(configs: HapticConfig[], spacing = 100) {
    for (let i = 0; i < configs.length; i++) {
      if (i > 0) await HapticManager.delay(spacing);
      await HapticManager.triggerCustom(configs[i]);
    }
  }

  static async triggerRamp(
    startIntensity: number,
    endIntensity: number,
    duration: number,
    steps = 10,
  ) {
    if (!HapticManager.settings.enabled) return;

    const stepDuration = duration / steps;

    for (let i = 0; i < steps; i++) {
      const progress = (i + 1) / steps;
      const intensity =
        startIntensity + (endIntensity - startIntensity) * progress;

      HapticManager.fireImpactByIntensity(intensity);

      if (i < steps - 1) await HapticManager.delay(stepDuration);
    }
  }

  static triggerSystem(
    type:
      | "notificationSuccess"
      | "notificationWarning"
      | "notificationError"
      | "selection",
  ): void {
    if (!HapticManager.settings.enabled) return;
    Presets.System[type]();
  }

  // --- Private helpers ---

  private static resolveIntensity(baseIntensity: number): number {
    const profileMultiplier =
      PROFILE_MULTIPLIERS[HapticManager.settings.profile];
    const reduceMotionMultiplier = HapticManager.settings.reduceMotionEnabled
      ? 0.5
      : 1;
    return (
      baseIntensity *
      HapticManager.settings.intensity *
      profileMultiplier *
      reduceMotionMultiplier
    );
  }

  private static dispatchConfig(
    finalIntensity: number,
    config: HapticConfig,
  ): Promise<void> {
    const isShort = config.duration < 150;
    const isCrisp = config.sharpness > 0.5;

    if (isShort && isCrisp) {
      HapticManager.fireImpactByIntensity(finalIntensity);
      return Promise.resolve();
    }

    if (isShort && !isCrisp) {
      Presets.System.notificationSuccess();
      return Promise.resolve();
    }

    return HapticManager.playCustomPattern(finalIntensity, config);
  }

  private static fireImpactByIntensity(intensity: number): void {
    if (intensity > 0.75) return Presets.System.impactHeavy();
    if (intensity > 0.55) return Presets.System.impactRigid();
    if (intensity > 0.35) return Presets.System.impactMedium();
    if (intensity > 0.15) return Presets.System.impactSoft();
    return Presets.System.impactLight();
  }

  private static async playCustomPattern(
    amplitude: number,
    config: HapticConfig,
  ): Promise<void> {
    const stepDuration = Math.min(50, config.duration / 10);
    const steps = Math.ceil(config.duration / stepDuration);

    try {
      switch (config.pattern) {
        case "rampUp": {
          for (let i = 0; i < steps; i++) {
            HapticManager.fireImpactByIntensity(amplitude * ((i + 1) / steps));
            await HapticManager.delay(stepDuration);
          }
          break;
        }
        case "rampDown": {
          for (let i = 0; i < steps; i++) {
            HapticManager.fireImpactByIntensity(amplitude * (1 - i / steps));
            await HapticManager.delay(stepDuration);
          }
          break;
        }
        case "pulse": {
          const pulseCount = Math.max(1, Math.floor(config.duration / 200));
          const gap = config.duration / pulseCount;
          for (let i = 0; i < pulseCount; i++) {
            Presets.System.selection();
            await HapticManager.delay(gap);
          }
          break;
        }
        case "sine": {
          // Bell curve: ramp up to peak at midpoint, ramp down
          for (let i = 0; i < steps; i++) {
            const t = (i + 0.5) / steps;
            const envelope = Math.sin(t * Math.PI); // 0 → 1 → 0
            HapticManager.fireImpactByIntensity(amplitude * envelope);
            await HapticManager.delay(stepDuration);
          }
          break;
        }
        case "triangle": {
          // Ramp up first half, ramp down second half
          for (let i = 0; i < steps; i++) {
            const t = (i + 0.5) / steps;
            const envelope = t < 0.5 ? t * 2 : (1 - t) * 2;
            HapticManager.fireImpactByIntensity(amplitude * envelope);
            await HapticManager.delay(stepDuration);
          }
          break;
        }
        case "square": {
          // Flat at full amplitude for entire duration
          for (let i = 0; i < steps; i++) {
            HapticManager.fireImpactByIntensity(amplitude);
            await HapticManager.delay(stepDuration);
          }
          break;
        }
        default:
          // Unknown pattern — single impact at full amplitude
          HapticManager.fireImpactByIntensity(amplitude);
      }
    } catch (error) {
      console.error("Error playing custom pattern:", error);
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
