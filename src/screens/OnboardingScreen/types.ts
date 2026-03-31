import { AgeRange, Gender } from '@/types/types';

export type OnboardingStepName =
    | 'welcome'
    | 'demographics'
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
    ageRange?: AgeRange;
    gender?: Gender;
    reasons: string[];
    goals: JournalingGoal[];
    quickWinMood?: MoodValue;
    trialStarted: boolean;
    selectedPlan?: 'annual' | 'weekly';
}

export interface OnboardingStepConfig {
    name: OnboardingStepName;
    backgroundColor: string;
    canSkip: boolean;
    analyticsLabel: string;
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

