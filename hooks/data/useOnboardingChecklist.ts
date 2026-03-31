import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingChecklistItem } from '@/src/screens/OnboardingScreen/types';
import { DEFAULT_CHECKLIST_ITEMS } from '@/src/screens/OnboardingScreen/constants';

const CHECKLIST_STORAGE_KEY: string = 'onboarding_checklist';
const CHECKLIST_DISMISSED_KEY: string = 'onboarding_checklist_dismissed';
const CHECKLIST_CREATED_KEY: string = 'onboarding_checklist_created_at';
const CHECKLIST_VISIBLE_DAYS: number = 3;

interface UseOnboardingChecklistReturn {
    items: OnboardingChecklistItem[];
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    isAllComplete: boolean;
    isDismissed: boolean;
    isVisible: boolean;
    totalXpReward: number;
    completeItem: (itemId: string) => Promise<void>;
    dismissChecklist: () => Promise<void>;
}

export const useOnboardingChecklist = (): UseOnboardingChecklistReturn => {
    const [items, setItems] = useState<OnboardingChecklistItem[]>([...DEFAULT_CHECKLIST_ITEMS]);
    const [isDismissed, setIsDismissed] = useState<boolean>(false);
    const [createdAt, setCreatedAt] = useState<Date | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const loadChecklist = async (): Promise<void> => {
            try {
                const [storedItems, dismissed, created] = await Promise.all([
                    AsyncStorage.getItem(CHECKLIST_STORAGE_KEY),
                    AsyncStorage.getItem(CHECKLIST_DISMISSED_KEY),
                    AsyncStorage.getItem(CHECKLIST_CREATED_KEY),
                ]);

                if (storedItems) {
                    const parsed: OnboardingChecklistItem[] = JSON.parse(storedItems);
                    setItems(parsed);
                } else {
                    const initialItems: OnboardingChecklistItem[] = [...DEFAULT_CHECKLIST_ITEMS];
                    await AsyncStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(initialItems));
                    const now: string = new Date().toISOString();
                    await AsyncStorage.setItem(CHECKLIST_CREATED_KEY, now);
                    setCreatedAt(new Date(now));
                }

                if (dismissed === 'true') {
                    setIsDismissed(true);
                }

                if (created) {
                    setCreatedAt(new Date(created));
                }
            } catch (error) {
                console.warn('[OnboardingChecklist] Failed to load checklist:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadChecklist();
    }, []);

    const completedCount: number = items.filter(
        (item: OnboardingChecklistItem) => item.completed
    ).length;
    const totalCount: number = items.length;
    const progressPercent: number = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const isAllComplete: boolean = completedCount === totalCount;

    const totalXpReward: number = items.reduce(
        (sum: number, item: OnboardingChecklistItem) => sum + item.xpReward,
        0
    );

    const isVisible: boolean = (() => {
        if (!isLoaded) return false;
        if (isDismissed) return false;
        if (isAllComplete) return false;
        if (!createdAt) return true;

        const now: Date = new Date();
        const diffMs: number = now.getTime() - createdAt.getTime();
        const diffDays: number = diffMs / (1000 * 60 * 60 * 24);
        return diffDays <= CHECKLIST_VISIBLE_DAYS;
    })();

    const completeItem = useCallback(
        async (itemId: string): Promise<void> => {
            const updatedItems: OnboardingChecklistItem[] = items.map(
                (item: OnboardingChecklistItem) =>
                    item.id === itemId ? { ...item, completed: true } : item
            );
            setItems(updatedItems);

            try {
                await AsyncStorage.setItem(
                    CHECKLIST_STORAGE_KEY,
                    JSON.stringify(updatedItems)
                );
            } catch (error) {
                console.warn('[OnboardingChecklist] Failed to save checklist:', error);
            }
        },
        [items]
    );

    const dismissChecklist = useCallback(async (): Promise<void> => {
        setIsDismissed(true);
        try {
            await AsyncStorage.setItem(CHECKLIST_DISMISSED_KEY, 'true');
        } catch (error) {
            console.warn('[OnboardingChecklist] Failed to dismiss checklist:', error);
        }
    }, []);

    return {
        items,
        completedCount,
        totalCount,
        progressPercent,
        isAllComplete,
        isDismissed,
        isVisible,
        totalXpReward,
        completeItem,
        dismissChecklist,
    };
};
