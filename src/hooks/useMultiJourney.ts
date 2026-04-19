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

import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

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
} from "@/src/store/journeyStore";
import {
    fetchMHJourneyCatalog,
    fetchMHJourneyTemplate,
} from "@/src/lib/api/mentalHealthJourneyApi";
import { enrollInJourney as enrollJourneyApi } from "@/src/lib/api/journeyApi";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("useMultiJourney");

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
    const latestStateRef = useRef<{
        activeSlug: string | null;
        enrollments: JourneyEnrollment[];
    }>({
        activeSlug,
        enrollments,
    });

    useEffect(() => {
        latestStateRef.current = {
            activeSlug,
            enrollments,
        };
    }, [activeSlug, enrollments]);

    const persistEnrollmentState = useCallback(
        async (
            nextEnrollments: JourneyEnrollment[],
            nextActiveSlug: string | null,
        ): Promise<void> => {
            log.info("Persisting multi-journey state", {
                nextActiveSlug,
                enrollmentCount: nextEnrollments.length,
                enrollmentSlugs: nextEnrollments.map((e) => e.slug),
            });
            latestStateRef.current = {
                activeSlug: nextActiveSlug,
                enrollments: nextEnrollments,
            };
            setEnrollments(nextEnrollments);
            setActiveSlug(nextActiveSlug);



        },
        [setActiveSlug, setEnrollments],
    );

    // ── Hydrate from local cache first, then server ──
    const hydrateEnrollments = useCallback(
        async (preferredActiveSlug?: string | null): Promise<void> => {
            try {
                setIsLoading(true);
                setError(null);
                log.info("Hydrating multi-journey state", {
                    preferredActiveSlug: preferredActiveSlug ?? null,
                });


                // 3. Fetch fresh data from server
                const res = await fetchMHJourneyCatalog();
                if (res.success) {
                    const enrolled: JourneyEnrollment[] = res.data
                        .filter(
                            (j: MentalHealthJourneyListItem) =>
                                j.isEnrolled && j.enrollmentStatus !== null,
                        )
                        .map(catalogItemToEnrollment);

                    const existingEnrollments: JourneyEnrollment[] =
                        latestStateRef.current.enrollments;

                    // Preserve local archive state
                    const archivedSlugs: Set<string> = new Set(
                        existingEnrollments
                            .filter((e: JourneyEnrollment) => e.isArchived)
                            .map((e: JourneyEnrollment) => e.slug),
                    );
                    const mergedEnrollments: JourneyEnrollment[] = enrolled.map(
                        (e: JourneyEnrollment): JourneyEnrollment => ({
                            ...e,
                            isArchived: archivedSlugs.has(e.slug),
                        }),
                    );

                    const requestedActiveSlug: string | null =
                        preferredActiveSlug ??
                        latestStateRef.current.activeSlug;

                    const isRequestedSlugValid =
                        requestedActiveSlug !== null &&
                        mergedEnrollments.some(
                            (e: JourneyEnrollment) =>
                                e.slug === requestedActiveSlug && !e.isArchived,
                        );

                    const fallbackActiveSlug: string | null =
                        mergedEnrollments.find(
                            (e: JourneyEnrollment) => e.status === "active" && !e.isArchived,
                        )?.slug ?? null;

                    log.info("Hydration fetched server journeys", {
                        totalCatalogCount: res.data.length,
                        enrolledCount: mergedEnrollments.length,
                        requestedActiveSlug,
                        resolvedActiveSlug: isRequestedSlugValid
                            ? requestedActiveSlug
                            : fallbackActiveSlug,
                    });
                    await persistEnrollmentState(
                        mergedEnrollments,
                        isRequestedSlugValid ? requestedActiveSlug : fallbackActiveSlug,
                    );
                } else {
                    // Server failed — use cached data (already set above)
                    log.warn("Hydration failed and no cache available", {
                        error: res.error ?? "Failed to load journeys",
                    });
                    setError(res.error ?? "Failed to load journeys");
                }
            } catch (err) {
                log.error("Hydration error", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        },
        [persistEnrollmentState, setActiveSlug, setEnrollments],
    );

    // Hydrate on mount
    useEffect(() => {
        hydrateEnrollments();
    }, [hydrateEnrollments]);

    // ── Switch active journey ──
    const switchJourney = useCallback(
        async (slug: string): Promise<void> => {
            log.info("Switching active journey", {
                slug,
                currentActiveSlug: latestStateRef.current.activeSlug,
                enrollmentCount: latestStateRef.current.enrollments.length,
            });
            await persistEnrollmentState(latestStateRef.current.enrollments, slug);
        },
        [persistEnrollmentState],
    );

    // ── Enroll in a new journey ──
    const enrollInJourney = useCallback(
        async (journey: MentalHealthJourneyListItem): Promise<void> => {
            log.info("Starting journey enrollment", {
                slug: journey.slug,
                journeyId: journey.id,
            });
            const templateRes = await fetchMHJourneyTemplate(journey.slug);
            if (!templateRes.success || !templateRes.data) {
                log.warn("Journey template lookup failed", {
                    slug: journey.slug,
                    error: templateRes.error ?? "Unknown template error",
                });
                throw new Error(
                    templateRes.error ?? `Failed to load template for ${journey.slug}`,
                );
            }

            const firstNodeId: string | undefined =
                templateRes.data.units[0]?.nodes[0]?.id;

            if (!firstNodeId) {
                log.warn("Journey template missing first node", {
                    slug: journey.slug,
                    unitCount: templateRes.data.units.length,
                });
                throw new Error(`Journey ${journey.slug} does not have a start node`);
            }

            log.info("Template resolved for enrollment", {
                slug: journey.slug,
                templateId: templateRes.data.id,
                templateVersion: templateRes.data.version,
                firstNodeId,
            });
            const enrollRes = await enrollJourneyApi({
                journeyId: templateRes.data.id,
                templateVersion: templateRes.data.version,
                firstNodeId,
            });

            if (!enrollRes.success) {
                log.warn("Journey enrollment API failed", {
                    slug: journey.slug,
                    error: enrollRes.error ?? "Unknown enrollment error",
                });
                throw new Error(
                    enrollRes.error ?? `Failed to enroll in ${journey.slug}`,
                );
            }

            log.info("Journey enrollment API succeeded", { slug: journey.slug });
            await hydrateEnrollments(journey.slug);
        },
        [hydrateEnrollments],
    );

    // ── Archive journey ──
    const archiveJourney = useCallback(
        (slug: string): void => {
            log.info("Archiving journey locally", { slug });
            const updated: JourneyEnrollment[] =
                latestStateRef.current.enrollments.map(
                    (e: JourneyEnrollment): JourneyEnrollment =>
                        e.slug === slug ? { ...e, isArchived: true } : e,
                );
            latestStateRef.current = {
                activeSlug: latestStateRef.current.activeSlug,
                enrollments: updated,
            };
            setEnrollments(updated);

        },
        [setEnrollments],
    );

    // ── Restore archived journey ──
    const restoreJourney = useCallback(
        (slug: string): void => {
            log.info("Restoring journey locally", { slug });
            const updated: JourneyEnrollment[] =
                latestStateRef.current.enrollments.map(
                    (e: JourneyEnrollment): JourneyEnrollment =>
                        e.slug === slug ? { ...e, isArchived: false } : e,
                );
            latestStateRef.current = {
                activeSlug: latestStateRef.current.activeSlug,
                enrollments: updated,
            };
            setEnrollments(updated);

        },
        [setEnrollments],
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
