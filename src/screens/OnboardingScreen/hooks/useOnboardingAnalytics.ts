// ponytail: high-resolution onboarding analytics — dwell time, clicks, slot toggles & drop-off detection
import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { usePostHog } from "posthog-react-native";
import { OnboardingStepName } from "../types";

export type AnalyticsPrimitive = string | number | boolean | string[];

export interface UseOnboardingAnalyticsReturn {
  trackStarted: () => void;
  trackStepViewed: (stepName: OnboardingStepName, stepNumber: number) => void;
  trackStepCompleted: (
    stepName: OnboardingStepName,
    stepNumber: number,
    metadata?: Record<string, AnalyticsPrimitive>,
  ) => void;
  trackStepSkipped: (
    stepName: OnboardingStepName,
    stepNumber?: number,
    metadata?: Record<string, AnalyticsPrimitive>,
  ) => void;
  trackBackNavigated: (
    fromStep: OnboardingStepName,
    toStep: OnboardingStepName,
  ) => void;
  trackMotivationSelected: (motivation: string, isChange?: boolean) => void;
  trackThoughtSelected: (
    scenarioId: string,
    distortionType: string,
    thoughtText: string,
  ) => void;
  trackThoughtReframeViewed: (distortionType: string) => void;
  trackStreakLockIn: (streakCount: number) => void;
  trackReminderSlotToggled: (slotId: string, enabled: boolean) => void;
  trackReminderTimeChanged: (slotId: string, timeString: string) => void;
  trackNotificationDecision: (
    action: "set_reminders" | "skipped",
    slotsConfig: Record<string, boolean>,
    osStatus?: string,
  ) => void;
  trackPaywallPlanSelected: (tier: string) => void;
  trackPaywallDismissed: (method: "close_button" | "skip") => void;
  trackGoalsSelected: (goals: string[]) => void;
  trackQuickWinMood: (mood: string) => void;
  trackPaywallViewed: () => void;
  trackTrialStarted: (planType: "annual" | "weekly" | "monthly") => void;
  trackTrialSkipped: () => void;
  trackOnboardingCompleted: (stepsCompleted: number) => void;
  trackOnboardingSkipped: (stepName: OnboardingStepName) => void;
  trackPremiumGateHit: (feature: string, context: string) => void;
  trackChecklistItemCompleted: (itemName: string, dayNumber: number) => void;
  setUserPersonProperties: (props: Record<string, AnalyticsPrimitive>) => void;
}

export const useOnboardingAnalytics = (): UseOnboardingAnalyticsReturn => {
  const posthog = usePostHog();
  const stepStartTimes = useRef<Record<string, number>>({});
  const currentStepRef = useRef<{ name: OnboardingStepName; index: number }>({
    name: "welcome",
    index: 0,
  });
  const sessionStartTime = useRef<number>(Date.now());

  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, AnalyticsPrimitive>): void => {
      try {
        posthog?.capture(eventName, properties);
      } catch (error) {
        console.warn("[OnboardingAnalytics] Failed to track event:", eventName, error);
      }
    },
    [posthog],
  );

  const setUserPersonProperties = useCallback(
    (props: Record<string, AnalyticsPrimitive>): void => {
      try {
        posthog?.capture("$set", { $set: props });
      } catch (error) {
        console.warn("[OnboardingAnalytics] Failed to set person props:", error);
      }
    },
    [posthog],
  );

  // AppState drop-off tracker: captures if user closes/backgrounds app mid-step
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        const cur = currentStepRef.current;
        if (!cur) return;
        const start = stepStartTimes.current[cur.name] ?? Date.now();
        const dwellSec = Math.max(0, Math.round((Date.now() - start) / 1000));
        const totalElapsedSec = Math.max(0, Math.round((Date.now() - sessionStartTime.current) / 1000));

        trackEvent("onboarding_step_abandoned", {
          last_step_name: cur.name,
          last_step_index: cur.index,
          time_on_step_seconds: dwellSec,
          total_onboarding_elapsed_seconds: totalElapsedSec,
        });

        try {
          posthog?.flush?.();
        } catch {
          // ignore flush errors
        }
      }
    });

    return () => subscription.remove();
  }, [trackEvent, posthog]);

  const trackStarted = useCallback((): void => {
    sessionStartTime.current = Date.now();
    trackEvent("onboarding_started", { source: "onboarding" });
  }, [trackEvent]);

  const trackStepViewed = useCallback(
    (stepName: OnboardingStepName, stepNumber: number): void => {
      stepStartTimes.current[stepName] = Date.now();
      currentStepRef.current = { name: stepName, index: stepNumber };
      trackEvent("onboarding_step_viewed", {
        step_name: stepName,
        step_number: stepNumber,
      });
    },
    [trackEvent],
  );

  const trackStepCompleted = useCallback(
    (
      stepName: OnboardingStepName,
      stepNumber: number,
      metadata?: Record<string, AnalyticsPrimitive>,
    ): void => {
      const startTime = stepStartTimes.current[stepName] ?? Date.now();
      const durationMs = Date.now() - startTime;
      const durationSec = Math.max(0, Math.round(durationMs / 1000));

      trackEvent("onboarding_step_completed", {
        step_name: stepName,
        step_number: stepNumber,
        duration_ms: durationMs,
        duration_seconds: durationSec,
        ...metadata,
      });
    },
    [trackEvent],
  );

  const trackStepSkipped = useCallback(
    (
      stepName: OnboardingStepName,
      stepNumber?: number,
      metadata?: Record<string, AnalyticsPrimitive>,
    ): void => {
      const startTime = stepStartTimes.current[stepName] ?? Date.now();
      const durationMs = Date.now() - startTime;
      const durationSec = Math.max(0, Math.round(durationMs / 1000));

      trackEvent("onboarding_step_skipped", {
        step_name: stepName,
        step_number: stepNumber ?? currentStepRef.current.index,
        duration_ms: durationMs,
        duration_seconds: durationSec,
        ...metadata,
      });
    },
    [trackEvent],
  );

  const trackBackNavigated = useCallback(
    (fromStep: OnboardingStepName, toStep: OnboardingStepName): void => {
      const startTime = stepStartTimes.current[fromStep] ?? Date.now();
      const dwellSec = Math.max(0, Math.round((Date.now() - startTime) / 1000));

      trackEvent("onboarding_back_navigated", {
        from_step: fromStep,
        to_step: toStep,
        duration_before_back_seconds: dwellSec,
      });
    },
    [trackEvent],
  );

  const trackMotivationSelected = useCallback(
    (motivation: string, isChange: boolean = false): void => {
      trackEvent("onboarding_motivation_selected", {
        choice: motivation,
        is_change: isChange,
      });
      setUserPersonProperties({ onboarding_motivation: motivation });
    },
    [trackEvent, setUserPersonProperties],
  );

  const trackThoughtSelected = useCallback(
    (scenarioId: string, distortionType: string, thoughtText: string): void => {
      trackEvent("onboarding_thought_bubble_selected", {
        scenario_id: scenarioId,
        distortion_type: distortionType,
        thought_text: thoughtText,
      });
    },
    [trackEvent],
  );

  const trackThoughtReframeViewed = useCallback(
    (distortionType: string): void => {
      trackEvent("onboarding_thought_reframe_viewed", {
        distortion_type: distortionType,
      });
    },
    [trackEvent],
  );

  const trackStreakLockIn = useCallback(
    (streakCount: number): void => {
      const startTime = stepStartTimes.current["milestone_celebration"] ?? Date.now();
      const dwellSec = Math.max(0, Math.round((Date.now() - startTime) / 1000));

      trackEvent("onboarding_streak_lock_in_tapped", {
        streak_count: streakCount,
        time_to_lock_in_seconds: dwellSec,
      });
      setUserPersonProperties({ streak_ignited: true, current_streak: streakCount });
    },
    [trackEvent, setUserPersonProperties],
  );

  const trackReminderSlotToggled = useCallback(
    (slotId: string, enabled: boolean): void => {
      trackEvent("onboarding_reminder_slot_toggled", {
        slot_id: slotId,
        enabled,
      });
    },
    [trackEvent],
  );

  const trackReminderTimeChanged = useCallback(
    (slotId: string, timeString: string): void => {
      trackEvent("onboarding_reminder_time_changed", {
        slot_id: slotId,
        new_time: timeString,
      });
    },
    [trackEvent],
  );

  const trackNotificationDecision = useCallback(
    (
      action: "set_reminders" | "skipped",
      slotsConfig: Record<string, boolean>,
      osStatus: string = "unknown",
    ): void => {
      const enabledSlots = Object.entries(slotsConfig)
        .filter(([, v]) => v)
        .map(([k]) => k);

      trackEvent("onboarding_notification_decision", {
        action,
        os_permission_status: osStatus,
        active_slots_count: enabledSlots.length,
        enabled_slots: enabledSlots,
      });

      setUserPersonProperties({
        notifications_enabled: action === "set_reminders" && enabledSlots.length > 0,
        notification_slots_count: enabledSlots.length,
        notification_slots: enabledSlots,
      });
    },
    [trackEvent, setUserPersonProperties],
  );

  const trackPaywallPlanSelected = useCallback(
    (tier: string): void => {
      trackEvent("onboarding_paywall_plan_selected", { tier });
    },
    [trackEvent],
  );

  const trackPaywallDismissed = useCallback(
    (method: "close_button" | "skip"): void => {
      const startTime = stepStartTimes.current["soft_paywall"] ?? Date.now();
      const dwellSec = Math.max(0, Math.round((Date.now() - startTime) / 1000));

      trackEvent("onboarding_paywall_dismissed", {
        dismiss_method: method,
        time_on_paywall_seconds: dwellSec,
      });
    },
    [trackEvent],
  );

  const trackGoalsSelected = useCallback(
    (goals: string[]): void => {
      trackEvent("onboarding_goals_selected", { goals });
    },
    [trackEvent],
  );

  const trackQuickWinMood = useCallback(
    (mood: string): void => {
      trackEvent("onboarding_quick_win_mood", { mood_value: mood });
    },
    [trackEvent],
  );

  const trackPaywallViewed = useCallback((): void => {
    trackEvent("onboarding_paywall_viewed", { source: "onboarding" });
  }, [trackEvent]);

  const trackTrialStarted = useCallback(
    (planType: "annual" | "weekly" | "monthly"): void => {
      trackEvent("onboarding_trial_started", { plan_type: planType });
      setUserPersonProperties({ trial_started: true, subscription_tier: planType });
    },
    [trackEvent, setUserPersonProperties],
  );

  const trackTrialSkipped = useCallback((): void => {
    trackEvent("onboarding_trial_skipped", {});
  }, [trackEvent]);

  const trackOnboardingCompleted = useCallback(
    (stepsCompleted: number): void => {
      const totalSec = Math.max(0, Math.round((Date.now() - sessionStartTime.current) / 1000));
      trackEvent("onboarding_completed", {
        steps_completed: stepsCompleted,
        total_duration_seconds: totalSec,
      });
      setUserPersonProperties({ onboarding_completed: true });
    },
    [trackEvent, setUserPersonProperties],
  );

  const trackOnboardingSkipped = useCallback(
    (stepName: OnboardingStepName): void => {
      trackEvent("onboarding_skipped", { step_name: stepName });
    },
    [trackEvent],
  );

  const trackPremiumGateHit = useCallback(
    (feature: string, context: string): void => {
      trackEvent("premium_gate_hit", { feature, context });
    },
    [trackEvent],
  );

  const trackChecklistItemCompleted = useCallback(
    (itemName: string, dayNumber: number): void => {
      trackEvent("checklist_item_completed", {
        item_name: itemName,
        day_number: dayNumber,
      });
    },
    [trackEvent],
  );

  return {
    trackStarted,
    trackStepViewed,
    trackStepCompleted,
    trackStepSkipped,
    trackBackNavigated,
    trackMotivationSelected,
    trackThoughtSelected,
    trackThoughtReframeViewed,
    trackStreakLockIn,
    trackReminderSlotToggled,
    trackReminderTimeChanged,
    trackNotificationDecision,
    trackPaywallPlanSelected,
    trackPaywallDismissed,
    trackGoalsSelected,
    trackQuickWinMood,
    trackPaywallViewed,
    trackTrialStarted,
    trackTrialSkipped,
    trackOnboardingCompleted,
    trackOnboardingSkipped,
    trackPremiumGateHit,
    trackChecklistItemCompleted,
    setUserPersonProperties,
  };
};
