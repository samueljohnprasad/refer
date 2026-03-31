import { useCallback, useRef } from 'react';
import { usePostHog } from 'posthog-react-native';
import { OnboardingStepName, OnboardingAnalyticsEvent, JournalingGoal, MoodValue } from '../types';

interface UseOnboardingAnalyticsReturn {
    trackStepViewed: (stepName: OnboardingStepName, stepNumber: number) => void;
    trackStepCompleted: (stepName: OnboardingStepName, stepNumber: number) => void;
    trackStepSkipped: (stepName: OnboardingStepName) => void;
    trackGoalsSelected: (goals: JournalingGoal[]) => void;
    trackQuickWinMood: (mood: MoodValue) => void;
    trackPaywallViewed: () => void;
    trackTrialStarted: (planType: 'annual' | 'weekly') => void;
    trackTrialSkipped: () => void;
    trackOnboardingCompleted: (stepsCompleted: number) => void;
    trackPremiumGateHit: (feature: string, context: string) => void;
    trackChecklistItemCompleted: (itemName: string, dayNumber: number) => void;
}

export const useOnboardingAnalytics = (): UseOnboardingAnalyticsReturn => {
    const posthog = usePostHog();
    const stepStartTimes = useRef<Record<string, number>>({});

    const trackEvent = useCallback(
        (eventName: string, properties: Record<string, string | number | boolean | string[]>): void => {
            try {
                posthog?.capture(eventName, properties);
            } catch (error) {
                console.warn('[OnboardingAnalytics] Failed to track event:', eventName, error);
            }
        },
        [posthog]
    );

    const trackStepViewed = useCallback(
        (stepName: OnboardingStepName, stepNumber: number): void => {
            stepStartTimes.current[stepName] = Date.now();
            trackEvent('onboarding_step_viewed', {
                step_name: stepName,
                step_number: stepNumber,
            });
        },
        [trackEvent]
    );

    const trackStepCompleted = useCallback(
        (stepName: OnboardingStepName, stepNumber: number): void => {
            const startTime: number = stepStartTimes.current[stepName] ?? Date.now();
            const durationMs: number = Date.now() - startTime;
            trackEvent('onboarding_step_completed', {
                step_name: stepName,
                step_number: stepNumber,
                duration_ms: durationMs,
            });
        },
        [trackEvent]
    );

    const trackStepSkipped = useCallback(
        (stepName: OnboardingStepName): void => {
            trackEvent('onboarding_step_skipped', { step_name: stepName });
        },
        [trackEvent]
    );

    const trackGoalsSelected = useCallback(
        (goals: JournalingGoal[]): void => {
            trackEvent('onboarding_goals_selected', { goals });
        },
        [trackEvent]
    );

    const trackQuickWinMood = useCallback(
        (mood: MoodValue): void => {
            trackEvent('onboarding_quick_win_mood', { mood_value: mood });
        },
        [trackEvent]
    );

    const trackPaywallViewed = useCallback((): void => {
        trackEvent('onboarding_paywall_viewed', { source: 'onboarding' });
    }, [trackEvent]);

    const trackTrialStarted = useCallback(
        (planType: 'annual' | 'weekly'): void => {
            trackEvent('onboarding_trial_started', { plan_type: planType });
        },
        [trackEvent]
    );

    const trackTrialSkipped = useCallback((): void => {
        trackEvent('onboarding_trial_skipped', {});
    }, [trackEvent]);

    const trackOnboardingCompleted = useCallback(
        (stepsCompleted: number): void => {
            trackEvent('onboarding_completed', {
                steps_completed: stepsCompleted,
            });
        },
        [trackEvent]
    );

    const trackPremiumGateHit = useCallback(
        (feature: string, context: string): void => {
            trackEvent('premium_gate_hit', { feature, context });
        },
        [trackEvent]
    );

    const trackChecklistItemCompleted = useCallback(
        (itemName: string, dayNumber: number): void => {
            trackEvent('checklist_item_completed', {
                item_name: itemName,
                day_number: dayNumber,
            });
        },
        [trackEvent]
    );

    return {
        trackStepViewed,
        trackStepCompleted,
        trackStepSkipped,
        trackGoalsSelected,
        trackQuickWinMood,
        trackPaywallViewed,
        trackTrialStarted,
        trackTrialSkipped,
        trackOnboardingCompleted,
        trackPremiumGateHit,
        trackChecklistItemCompleted,
    };
};
