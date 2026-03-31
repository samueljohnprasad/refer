import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import { TRIAL_DAYS } from '@/src/screens/OnboardingScreen/constants';

const TRIAL_START_DATE_KEY: string = 'premium_trial_start_date';

interface UseTrialStatusReturn {
    isTrialActive: boolean;
    trialStartDate: Date | null;
    daysRemaining: number;
    isTrialExpired: boolean;
    isTrialUrgent: boolean;
    hasPro: boolean;
    startTrial: () => Promise<void>;
    isLoading: boolean;
}

export const useTrialStatus = (): UseTrialStatusReturn => {
    const { hasPro } = useRevenueCat();
    const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadTrialDate = async (): Promise<void> => {
            try {
                const stored: string | null = await AsyncStorage.getItem(TRIAL_START_DATE_KEY);
                if (stored) {
                    setTrialStartDate(new Date(stored));
                }
            } catch (error) {
                console.warn('[TrialStatus] Failed to load trial date:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTrialDate();
    }, []);

    const daysRemaining: number = useMemo(() => {
        if (!trialStartDate) return 0;
        const now: Date = new Date();
        const trialEnd: Date = new Date(trialStartDate);
        trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
        const diffMs: number = trialEnd.getTime() - now.getTime();
        const diffDays: number = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }, [trialStartDate]);

    const isTrialActive: boolean = useMemo(() => {
        if (hasPro) return false;
        return trialStartDate !== null && daysRemaining > 0;
    }, [hasPro, trialStartDate, daysRemaining]);

    const isTrialExpired: boolean = useMemo(() => {
        if (hasPro) return false;
        return trialStartDate !== null && daysRemaining === 0;
    }, [hasPro, trialStartDate, daysRemaining]);

    const isTrialUrgent: boolean = useMemo(() => {
        return isTrialActive && daysRemaining <= 2;
    }, [isTrialActive, daysRemaining]);

    const startTrial = useCallback(async (): Promise<void> => {
        try {
            const now: string = new Date().toISOString();
            await AsyncStorage.setItem(TRIAL_START_DATE_KEY, now);
            setTrialStartDate(new Date(now));
        } catch (error) {
            console.warn('[TrialStatus] Failed to save trial start date:', error);
        }
    }, []);

    return {
        isTrialActive,
        trialStartDate,
        daysRemaining,
        isTrialExpired,
        isTrialUrgent,
        hasPro,
        startTrial,
        isLoading,
    };
};
