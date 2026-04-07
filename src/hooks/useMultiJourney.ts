/**
 * useMultiJourney
 * Reusable hook for multi-journey enrollment management.
 *
 * Responsibilities:
 * - Hydrate enrollments from Supabase on mount
 * - Switch active journey (updates atom + persists)
 * - Enroll in new journey
 * - Archive / restore journeys
 * - Derive hasEnrollments for empty state routing
 *
 * All state stored in Jotai atoms (journeyStore.ts).
 * Persistence via AsyncStorage for offline fallback.
 */

import { useCallback, useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import type {
    JourneyEnrollment,
    MentalHealthJourneyListItem,
    JourneySwitcherItem,
} from "@/src/types/journey";
import {
    activeJourneySlugAtom,
    journeyEnrollmentsAtom,
    hasActiveEnrollmentAtom,
    journeySwitcherItemsAtom,
    saveActiveSlug,
    loadActiveSlug,
    saveMultiJourneyState,
    loadMultiJourneyState,
} from "@/src/store/journeyStore";
import { fetchMHJourneyCatalog } from "@/src/lib/api/mentalHealthJourneyApi";

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseMultiJourneyReturn {
    /** Currently active journey slug */
    activeSlug: string | null;
    /** All user enrollments */
    enrollments: JourneyEnrollment[];
    /** Whether user has any active (non-archived) enrollments */
    hasEnrollments: boolean;
    /** Items for the journey switcher bottom sheet */
    switcherItems: JourneySwitcherItem[];
    /** Loading state for initial hydration */
    isLoading: boolean;
    /** Error message if hydration failed */
    error: string | null;
    /** Switch to a different journey */
    switchJourney: (slug: string) => Promise<void>;
    /** Enroll in a new journey from catalog */
    enrollInJourney: (journey: MentalHealthJourneyListItem) => Promise<void>;
    /** Archive (hide) a journey from the switcher */
    archiveJourney: (slug: string) => void;
    /** Restore an archived journey */
    restoreJourney: (slug: string) => void;
    /** Refresh enrollments from server */
    refreshEnrollments: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a MentalHealthJourneyListItem (from catalog API) to JourneyEnrollment.
 */
function catalogItemToEnrollment(
    item: MentalHealthJourneyListItem,
): JourneyEnrollment {
    const progressPercent: number =
        item.totalNodes > 0
            ? Math.round((item.completedNodes / item.totalNodes) * 100)
            : 0;

    return {
        journeyId: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description,
        status: item.enrollmentStatus ?? "active",
        completedNodes: item.completedNodes,
        totalNodes: item.totalNodes,
        progressPercent,
        currentUnitTitle: null,
        colorScheme: item.colorScheme,
        category: item.category,
        difficulty: item.difficulty,
        iconUrl: item.iconUrl,
        colorThemeKey: item.colorThemeKey,
        iconKey: item.iconKey,
        enrolledAt: new Date().toISOString(),
        isArchived: false,
    };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMultiJourney(): UseMultiJourneyReturn {
    const [activeSlug, setActiveSlug] = useAtom(activeJourneySlugAtom);
    const [enrollments, setEnrollments] = useAtom(journeyEnrollmentsAtom);
    const hasEnrollments: boolean = useAtomValue(hasActiveEnrollmentAtom);
    const switcherItems: JourneySwitcherItem[] = useAtomValue(
        journeySwitcherItemsAtom,
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ── Hydrate from local cache first, then server ──
    const hydrateEnrollments = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            // 1. Restore from local cache for instant UI
            const cached = await loadMultiJourneyState();
            if (cached) {
                setEnrollments(cached.enrollments);
                if (cached.activeJourneySlug) {
                    setActiveSlug(cached.activeJourneySlug);
                }
            }

            // 2. Also restore the active slug independently
            const savedSlug: string | null = await loadActiveSlug();
            if (savedSlug && !cached?.activeJourneySlug) {
                setActiveSlug(savedSlug);
            }

            // 3. Fetch fresh data from server
            const res = await fetchMHJourneyCatalog();
            if (res.success) {
                const enrolled: JourneyEnrollment[] = res.data
                    .filter(
                        (j: MentalHealthJourneyListItem) =>
                            j.isEnrolled && j.enrollmentStatus !== null,
                    )
                    .map(catalogItemToEnrollment);

                // Preserve local archive state
                const archivedSlugs: Set<string> = new Set(
                    enrollments
                        .filter((e: JourneyEnrollment) => e.isArchived)
                        .map((e: JourneyEnrollment) => e.slug),
                );
                const mergedEnrollments: JourneyEnrollment[] = enrolled.map(
                    (e: JourneyEnrollment): JourneyEnrollment => ({
                        ...e,
                        isArchived: archivedSlugs.has(e.slug),
                    }),
                );

                setEnrollments(mergedEnrollments);

                // If no active slug yet, default to the first active enrollment
                if (!savedSlug && !cached?.activeJourneySlug && enrolled.length > 0) {
                    const firstActive: JourneyEnrollment | undefined = enrolled.find(
                        (e: JourneyEnrollment) => e.status === "active",
                    );
                    if (firstActive) {
                        setActiveSlug(firstActive.slug);
                        await saveActiveSlug(firstActive.slug);
                    }
                }

                // Persist merged state
                await saveMultiJourneyState({
                    activeJourneySlug: activeSlug ?? savedSlug ?? null,
                    enrollments: mergedEnrollments,
                });
            } else {
                // Server failed — use cached data (already set above)
                if (!cached) {
                    setError(res.error ?? "Failed to load journeys");
                }
            }
        } catch (err) {
            console.error("[useMultiJourney] hydration error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    }, [setActiveSlug, setEnrollments]);

    // Hydrate on mount
    useEffect(() => {
        hydrateEnrollments();
    }, [hydrateEnrollments]);

    // ── Switch active journey ──
    const switchJourney = useCallback(
        async (slug: string): Promise<void> => {
            setActiveSlug(slug);
            await saveActiveSlug(slug);
            await saveMultiJourneyState({
                activeJourneySlug: slug,
                enrollments,
            });
        },
        [setActiveSlug, enrollments],
    );

    // ── Enroll in a new journey ──
    const enrollInJourney = useCallback(
        async (journey: MentalHealthJourneyListItem): Promise<void> => {
            const newEnrollment: JourneyEnrollment = catalogItemToEnrollment({
                ...journey,
                isEnrolled: true,
                enrollmentStatus: "active",
                completedNodes: 0,
            });

            const updatedEnrollments: JourneyEnrollment[] = [
                ...enrollments.filter(
                    (e: JourneyEnrollment) => e.slug !== journey.slug,
                ),
                newEnrollment,
            ];

            setEnrollments(updatedEnrollments);
            setActiveSlug(journey.slug);
            await saveActiveSlug(journey.slug);
            await saveMultiJourneyState({
                activeJourneySlug: journey.slug,
                enrollments: updatedEnrollments,
            });
        },
        [enrollments, setEnrollments, setActiveSlug],
    );

    // ── Archive journey ──
    const archiveJourney = useCallback(
        (slug: string): void => {
            const updated: JourneyEnrollment[] = enrollments.map(
                (e: JourneyEnrollment): JourneyEnrollment =>
                    e.slug === slug ? { ...e, isArchived: true } : e,
            );
            setEnrollments(updated);
            saveMultiJourneyState({
                activeJourneySlug: activeSlug,
                enrollments: updated,
            });
        },
        [enrollments, setEnrollments, activeSlug],
    );

    // ── Restore archived journey ──
    const restoreJourney = useCallback(
        (slug: string): void => {
            const updated: JourneyEnrollment[] = enrollments.map(
                (e: JourneyEnrollment): JourneyEnrollment =>
                    e.slug === slug ? { ...e, isArchived: false } : e,
            );
            setEnrollments(updated);
            saveMultiJourneyState({
                activeJourneySlug: activeSlug,
                enrollments: updated,
            });
        },
        [enrollments, setEnrollments, activeSlug],
    );

    return {
        activeSlug,
        enrollments,
        hasEnrollments,
        switcherItems,
        isLoading,
        error,
        switchJourney,
        enrollInJourney,
        archiveJourney,
        restoreJourney,
        refreshEnrollments: hydrateEnrollments,
    };
}
