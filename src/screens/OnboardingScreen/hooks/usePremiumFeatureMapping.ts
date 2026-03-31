import { useMemo } from 'react';
import { JournalingGoal, FeatureDiscoverySlide } from '../types';
import {
    GOAL_TO_FEATURES_MAP,
    FEATURE_DISCOVERY_SLIDES,
    PREMIUM_FEATURES,
} from '../constants';

interface UsePremiumFeatureMappingReturn {
    relevantSlides: FeatureDiscoverySlide[];
    relevantPremiumFeatures: typeof PREMIUM_FEATURES[number][];
    hasPremiumGoals: boolean;
}

export const usePremiumFeatureMapping = (
    selectedGoals: JournalingGoal[]
): UsePremiumFeatureMappingReturn => {
    const relevantFeatureIds: string[] = useMemo(() => {
        const featureSet = new Set<string>();
        selectedGoals.forEach((goal: JournalingGoal) => {
            const features: string[] = GOAL_TO_FEATURES_MAP[goal] ?? [];
            features.forEach((f: string) => featureSet.add(f));
        });
        return Array.from(featureSet);
    }, [selectedGoals]);

    const relevantSlides: FeatureDiscoverySlide[] = useMemo(() => {
        if (relevantFeatureIds.length === 0) {
            return [...FEATURE_DISCOVERY_SLIDES].slice(0, 3);
        }

        const matched: FeatureDiscoverySlide[] = FEATURE_DISCOVERY_SLIDES.filter(
            (slide: FeatureDiscoverySlide) => relevantFeatureIds.includes(slide.id)
        );

        const remaining: FeatureDiscoverySlide[] = FEATURE_DISCOVERY_SLIDES.filter(
            (slide: FeatureDiscoverySlide) => !relevantFeatureIds.includes(slide.id)
        );

        return [...matched, ...remaining].slice(0, 4);
    }, [relevantFeatureIds]);

    const relevantPremiumFeatures = useMemo(() => {
        if (relevantFeatureIds.length === 0) {
            return [...PREMIUM_FEATURES].slice(0, 4);
        }

        const matched = PREMIUM_FEATURES.filter(
            (f) => relevantFeatureIds.includes(f.id)
        );

        const remaining = PREMIUM_FEATURES.filter(
            (f) => !relevantFeatureIds.includes(f.id)
        );

        return [...matched, ...remaining].slice(0, 5);
    }, [relevantFeatureIds]);

    const hasPremiumGoals: boolean = useMemo(() => {
        return relevantPremiumFeatures.some((f) => f.isPremium);
    }, [relevantPremiumFeatures]);

    return {
        relevantSlides,
        relevantPremiumFeatures,
        hasPremiumGoals,
    };
};
