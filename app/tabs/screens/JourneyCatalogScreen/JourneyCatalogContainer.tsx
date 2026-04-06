/**
 * JourneyCatalogContainer (P1.2.1)
 * Container component — handles data fetching, state, and business logic.
 * No markup beyond composing the presentation child + bottom sheet.
 *
 * Data flow:
 * 1. fetchMHJourneyCatalog() → all published journeys with enrollment status
 * 2. useStreak() → current streak for banner
 * 3. useInsightPoints() → today IP for banner
 * 4. Category filtering (local state)
 * 5. Journey card press → open JourneyDetailSheet
 * 6. Start/Continue → navigate to journey map
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';

import type {
    MentalHealthJourneyListItem,
    JourneyCategory,
} from '@/src/types/journey/mentalHealth';
import type { MHTemplateUnit } from '@/src/lib/api/mentalHealthJourneyApi';
import {
    fetchMHJourneyCatalog,
    fetchMHJourneyTemplate,
} from '@/src/lib/api/mentalHealthJourneyApi';
import { useStreak } from '@/src/hooks/useStreak';
import { useInsightPoints } from '@/src/hooks/useInsightPoints';

import JourneyCatalogPresentation from './JourneyCatalogPresentation';
import JourneyDetailSheet from '@/src/components/journey/JourneyDetailSheet';

// ============================================================================
// Constants
// ============================================================================

const CATEGORIES: Array<{ key: JourneyCategory | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'anxiety', label: 'Anxiety' },
    { key: 'mood', label: 'Mood' },
    { key: 'stress', label: 'Stress' },
    { key: 'growth', label: 'Growth' },
    { key: 'sleep', label: 'Sleep' },
    { key: 'self_compassion', label: 'Self-Compassion' },
];

// ============================================================================
// Container
// ============================================================================

export default function JourneyCatalogContainer(): React.JSX.Element {
    // ── State ──
    const [allJourneys, setAllJourneys] = useState<MentalHealthJourneyListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<JourneyCategory | 'all'>('all');

    // Detail sheet state
    const [selectedJourney, setSelectedJourney] = useState<MentalHealthJourneyListItem | null>(null);
    const [detailSections, setDetailSections] = useState<MHTemplateUnit[]>([]);
    const [detailSectionsLoading, setDetailSectionsLoading] = useState<boolean>(false);
    const detailSheetRef = useRef<BottomSheetModal>(null);

    // ── Hooks ──
    const { currentStreak } = useStreak();
    const { todayIP } = useInsightPoints();

    // ── Data fetching ──
    const loadCatalog = useCallback(async (showRefresh: boolean = false): Promise<void> => {
        try {
            if (showRefresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            const res = await fetchMHJourneyCatalog();
            if (res.success) {
                setAllJourneys(res.data);
            } else {
                setError(res.error ?? 'Failed to load journeys');
            }
        } catch (err) {
            console.error('[JourneyCatalog] loadCatalog error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadCatalog();
    }, [loadCatalog]);

    // ── Derived: filtered journeys ──
    const filteredJourneys: MentalHealthJourneyListItem[] = useMemo(() => {
        if (selectedCategory === 'all') return allJourneys;
        return allJourneys.filter(
            (j: MentalHealthJourneyListItem) => j.category === selectedCategory,
        );
    }, [allJourneys, selectedCategory]);

    // ── Derived: active journey (first in-progress) ──
    const activeJourney: MentalHealthJourneyListItem | null = useMemo(() => {
        return (
            allJourneys.find(
                (j: MentalHealthJourneyListItem) =>
                    j.isEnrolled && j.enrollmentStatus === 'active',
            ) ?? null
        );
    }, [allJourneys]);

    // ── Handlers ──

    /** Open detail sheet for a journey */
    const handleJourneyPress = useCallback(
        async (journey: MentalHealthJourneyListItem): Promise<void> => {
            setSelectedJourney(journey);
            setDetailSections([]);
            setDetailSectionsLoading(true);
            detailSheetRef.current?.present();

            // Fetch sections for the detail view
            try {
                const templateRes = await fetchMHJourneyTemplate(journey.slug);
                if (templateRes.success && templateRes.data) {
                    setDetailSections(templateRes.data.units);
                }
            } catch (err) {
                console.error('[JourneyCatalog] Failed to fetch journey details:', err);
            } finally {
                setDetailSectionsLoading(false);
            }
        },
        [],
    );

    /** Navigate to journey map (continue) */
    const handleContinuePress = useCallback(
        (journey: MentalHealthJourneyListItem): void => {
            detailSheetRef.current?.dismiss();
            router.push({
                pathname: '/tabs/(tabs)/insights',
                params: { slug: journey.slug },
            } as never);
        },
        [],
    );

    /** Start a new journey → navigate to journey map */
    const handleStartJourney = useCallback(
        (journey: MentalHealthJourneyListItem): void => {
            detailSheetRef.current?.dismiss();
            router.push({
                pathname: '/tabs/(tabs)/insights',
                params: { slug: journey.slug },
            } as never);
        },
        [],
    );

    /** Dismiss detail sheet */
    const handleDismissSheet = useCallback((): void => {
        detailSheetRef.current?.dismiss();
        setSelectedJourney(null);
        setDetailSections([]);
    }, []);

    /** Category change */
    const handleCategoryChange = useCallback(
        (category: JourneyCategory | 'all'): void => {
            setSelectedCategory(category);
        },
        [],
    );

    /** Pull-to-refresh */
    const handleRefresh = useCallback((): void => {
        loadCatalog(true);
    }, [loadCatalog]);

    return (
        <BottomSheetModalProvider>
            <JourneyCatalogPresentation
                journeys={filteredJourneys}
                activeJourney={activeJourney}
                selectedCategory={selectedCategory}
                categories={CATEGORIES}
                currentStreak={currentStreak}
                todayIP={todayIP}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                error={error}
                onJourneyPress={handleJourneyPress}
                onContinuePress={handleContinuePress}
                onCategoryChange={handleCategoryChange}
                onRefresh={handleRefresh}
            />
            <JourneyDetailSheet
                ref={detailSheetRef}
                journey={selectedJourney}
                sections={detailSections}
                sectionsLoading={detailSectionsLoading}
                onStart={handleStartJourney}
                onContinue={handleContinuePress}
                onDismiss={handleDismissSheet}
            />
        </BottomSheetModalProvider>
    );
}
