import type { JourneyStepScreenName } from "@/src/components/journey/journeyStepScreenConfig";

export type OnboardingStepName =
    | 'welcome'
    | 'reframe_thoughts_intro'
    | 'progress_graph'
    | 'goals'
    | 'quick_win_mood'
    | 'feature_discovery'
    | 'soft_paywall'
    | 'celebration';

export type MoodValue = 'terrible' | 'bad' | 'okay' | 'good' | 'great';

export type JournalingGoal =
    | 'track_emotions'
    | 'build_habits'
    | 'reduce_anxiety'
    | 'personal_growth'
    | 'improve_relationships'
    | 'practice_gratitude'
    | 'self_reflection';

export interface GoalConfig {
    id: JournalingGoal;
    label: string;
    emoji: string;
    premiumFeature: string | null;
    premiumFeatureLabel: string | null;
}

export interface PremiumFeatureConfig {
    id: string;
    title: string;
    description: string;
    emoji: string;
    isPremium: boolean;
    statLabel: string;
    statValue: string;
}

export interface PricingPlan {
    id: 'annual' | 'weekly';
    label: string;
    price: string;
    perMonthPrice: string;
    badge: string | null;
    savings: string | null;
}

export interface OnboardingFormDataExtended {
    name: string;
    reasons: string[];
    goals: JournalingGoal[];
    quickWinMood?: MoodValue;
    trialStarted: boolean;
    selectedPlan?: 'annual' | 'weekly';
}

export enum OnboardingRendererKind {
    JourneyStep = "journey-step",
    ProgressGraph = "progress-graph",
    Goals = "goals",
    QuickWinMood = "quick-win-mood",
    FeatureDiscovery = "feature-discovery",
    SoftPaywall = "soft-paywall",
    Celebration = "celebration",
}

export type OnboardingStepRendererConfig =
    | {
        kind: OnboardingRendererKind.JourneyStep;
        screenName: JourneyStepScreenName;
        transitionKey?: string;
        transitionDuration?: number;
    }
    | {
        kind: OnboardingRendererKind.ProgressGraph;
    }
    | {
        kind: OnboardingRendererKind.Goals;
    }
    | {
        kind: OnboardingRendererKind.QuickWinMood;
    }
    | {
        kind: OnboardingRendererKind.FeatureDiscovery;
    }
    | {
        kind: OnboardingRendererKind.SoftPaywall;
    }
    | {
        kind: OnboardingRendererKind.Celebration;
    };

export interface OnboardingStepConfig {
    name: OnboardingStepName;
    backgroundColor: string;
    canSkip: boolean;
    analyticsLabel: string;
    showBackButton: boolean;
    showContinueButton: boolean;
    continueButtonLabel: string;
    isContinueEnabled?: (
        formData: OnboardingFormDataExtended,
    ) => boolean;
    renderer: OnboardingStepRendererConfig;
}

export interface OnboardingAnalyticsEvent {
    eventName: string;
    properties: Record<string, string | number | boolean | string[]>;
}

export interface FeatureDiscoverySlide {
    id: string;
    title: string;
    description: string;
    emoji: string;
    isPremium: boolean;
    statLabel: string;
    backgroundColor: string;
}

export interface QuickWinMoodOption {
    value: MoodValue;
    emoji: string;
    label: string;
    color: string;
    insightText: string;
}

export interface OnboardingChecklistItem {
    id: string;
    label: string;
    completed: boolean;
    route: string;
    xpReward: number;
}
