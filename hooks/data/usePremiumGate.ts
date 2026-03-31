import { useCallback, useMemo } from 'react';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import { useOnboardingAnalytics } from '@/src/screens/OnboardingScreen/hooks/useOnboardingAnalytics';

interface FeatureLimit {
    current: number;
    max: number;
}

interface UsePremiumGateReturn {
    hasPro: boolean;
    isGated: boolean;
    isNearLimit: boolean;
    remaining: number;
    showPaywall: () => Promise<boolean>;
    trackGateHit: () => void;
}

export const usePremiumGate = (
    feature: string,
    context: string,
    limit?: FeatureLimit
): UsePremiumGateReturn => {
    const { hasPro, presentPaywall } = useRevenueCat();
    const analytics = useOnboardingAnalytics();

    const isGated: boolean = useMemo(() => {
        if (hasPro) return false;
        if (!limit) return false;
        return limit.current >= limit.max;
    }, [hasPro, limit]);

    const isNearLimit: boolean = useMemo(() => {
        if (hasPro) return false;
        if (!limit) return false;
        const threshold: number = Math.max(1, Math.floor(limit.max * 0.8));
        return limit.current >= threshold && limit.current < limit.max;
    }, [hasPro, limit]);

    const remaining: number = useMemo(() => {
        if (hasPro) return Infinity;
        if (!limit) return Infinity;
        return Math.max(0, limit.max - limit.current);
    }, [hasPro, limit]);

    const showPaywall = useCallback(async (): Promise<boolean> => {
        analytics.trackPremiumGateHit(feature, context);
        return presentPaywall();
    }, [analytics, feature, context, presentPaywall]);

    const trackGateHit = useCallback((): void => {
        analytics.trackPremiumGateHit(feature, context);
    }, [analytics, feature, context]);

    return {
        hasPro,
        isGated,
        isNearLimit,
        remaining,
        showPaywall,
        trackGateHit,
    };
};
