/**
 * useSectionData
 * Orchestrates the lazy-loaded section map data pipeline:
 *
 * 1. On mount (or slug change): fetch user's current section via get_section_map(slug, NULL)
 * 2. On sticky header tap: fetch specific section via get_section_map(slug, unitNumber)
 * 3. Cache section maps in-memory (Map atom) and AsyncStorage (24h TTL)
 * 4. Progress is always fetched fresh (never cached)
 * 5. Expose sectionList for sticky header tabs
 * 6. Expose activeNodeId for auto-scroll
 *
 * Data flow:
 *   In-memory cache hit? → instant render
 *   AsyncStorage cache hit (TTL valid)? → render + background refresh
 *   Neither? → show skeleton → fetch from server → render
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useSetAtom } from "jotai";

import type {
    SectionMapResponse,
    SectionListItem,
} from "@/src/types/journey/sectionMap";
import { fetchSectionMap } from "@/src/lib/api/journeyApi";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import {
    currentSectionMapAtom,
    sectionCacheAtom,
    activeJourneySlugAtom,
    cacheSectionMap,
    loadCachedSectionMap,
    invalidateSectionCaches,
    saveActiveSlug,
} from "@/src/store/journeyStore";

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseSectionDataReturn {
    /** Whether the initial section data is loading */
    isLoading: boolean;
    /** Non-null only for hard errors */
    error: string | null;
    /** Whether we're using cached/offline data */
    isOfflineFallback: boolean;
    /** Whether a section switch is in progress */
    isSwitchingSection: boolean;
    /** Current section map response (null until first load) */
    sectionMap: SectionMapResponse | null;
    /** All sections for sticky header */
    sectionList: SectionListItem[];
    /** Active node ID in current section (for auto-scroll) */
    activeNodeId: string | null;
    /** Load a specific section (called on sticky header tap) */
    loadSection: (unitNumber: number) => Promise<void>;
    /** Refresh current section data from server */
    refresh: () => Promise<void>;
    /** True when a background refresh is in progress (does NOT trigger skeleton) */
    isRefreshing: boolean;
    /** True once per session when a version mismatch caused cache purge */
    wasVersionInvalidated: boolean;
    /** Reset the version invalidation flag (call after handling, e.g. showing toast) */
    resetVersionInvalidated: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Debounce duration for rapid section switching (ms) */
const SECTION_SWITCH_DEBOUNCE_MS = 300;

/** Skip background refresh if in-memory cache is fresher than this (ms) */
const CACHE_FRESHNESS_MS = 5 * 60 * 1000; // 5 minutes

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSectionData(slug: string | null): UseSectionDataReturn {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);
    const [isSwitchingSection, setIsSwitchingSection] = useState<boolean>(false);
    const [wasVersionInvalidated, setWasVersionInvalidated] =
        useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const [sectionMap, setSectionMap] = useAtom(currentSectionMapAtom);
    const [inMemoryCache, setInMemoryCache] = useAtom(sectionCacheAtom);
    const setActiveSlug = useSetAtom(activeJourneySlugAtom);

    const { isOnline } = useNetworkStatus();

    // Abort controller ref for cancelling in-flight requests on rapid switching
    const abortRef = useRef<AbortController | null>(null);
    // Debounce timer ref
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Track last known journey version for cache invalidation
    const journeyVersionRef = useRef<number | null>(null);
    // Timestamps for in-memory cache entries (unitNumber → Date.now())
    const cacheTsRef = useRef<Map<number, number>>(new Map());

    // ── Derived values ──
    const sectionList: SectionListItem[] = sectionMap?.sectionList ?? [];
    const activeNodeId: string | null =
        sectionMap?.progress.find((p) => p.status === "active")?.nodeId ?? null;

    // ── Core: fetch and apply a section ──
    const fetchAndApplySection = useCallback(
        async (journeySlug: string, unitNumber?: number): Promise<void> => {
            // Cancel any in-flight request
            if (abortRef.current) {
                abortRef.current.abort();
            }
            abortRef.current = new AbortController();

            try {
                // ── Step 1: Check in-memory cache ──
                if (unitNumber !== undefined) {
                    const cached: SectionMapResponse | undefined =
                        inMemoryCache.get(unitNumber);
                    if (cached) {
                        setSectionMap(cached);
                        // Skip background refresh if cache is very fresh (< 5 min)
                        const cachedAt: number = cacheTsRef.current.get(unitNumber) ?? 0;
                        const isFresh: boolean = Date.now() - cachedAt < CACHE_FRESHNESS_MS;
                        if (isOnline && !isFresh) {
                            const freshRes = await fetchSectionMap(
                                journeySlug,
                                unitNumber,
                                abortRef.current?.signal,
                            );
                            if (freshRes.success && freshRes.data) {
                                // Update progress only, keep cached structure
                                const updated: SectionMapResponse = {
                                    ...cached,
                                    progress: freshRes.data.progress,
                                    enrollment: freshRes.data.enrollment,
                                };
                                setSectionMap(updated);
                                setInMemoryCache((prev: Map<number, SectionMapResponse>) => {
                                    const next = new Map(prev);
                                    next.set(unitNumber, updated);
                                    return next;
                                });
                                cacheTsRef.current.set(unitNumber, Date.now());
                            }
                        }
                        return;
                    }
                }

                // ── Step 2: Check AsyncStorage cache ──
                if (unitNumber !== undefined) {
                    const diskCached: SectionMapResponse | null =
                        await loadCachedSectionMap(
                            journeySlug,
                            unitNumber,
                            journeyVersionRef.current ?? undefined,
                        );
                    if (diskCached) {
                        setSectionMap(diskCached);
                        setIsOfflineFallback(!isOnline);

                        // Store in memory cache
                        setInMemoryCache((prev: Map<number, SectionMapResponse>) => {
                            const next = new Map(prev);
                            next.set(unitNumber, diskCached);
                            return next;
                        });

                        // Background refresh if online
                        if (isOnline) {
                            const freshRes = await fetchSectionMap(
                                journeySlug,
                                unitNumber,
                                abortRef.current?.signal,
                            );
                            if (freshRes.success && freshRes.data) {
                                setSectionMap(freshRes.data);
                                setInMemoryCache((prev: Map<number, SectionMapResponse>) => {
                                    const next = new Map(prev);
                                    next.set(unitNumber, freshRes.data!);
                                    return next;
                                });
                                await cacheSectionMap(journeySlug, unitNumber, freshRes.data);
                            }
                        }
                        return;
                    }
                }

                // ── Step 3: Fetch from server ──
                if (!isOnline) {
                    setError("No internet connection. Please try again.");
                    return;
                }

                const res = await fetchSectionMap(
                    journeySlug,
                    unitNumber,
                    abortRef.current?.signal,
                );

                if (!res.success || !res.data) {
                    setError(res.error ?? "Failed to load section data");
                    return;
                }

                // Clear previous error on success
                setError(null);

                const data: SectionMapResponse = res.data;

                // Version mismatch check — invalidate all caches if version changed
                if (
                    journeyVersionRef.current !== null &&
                    data.journey.version !== journeyVersionRef.current
                ) {
                    await invalidateSectionCaches(
                        journeySlug,
                        data.journey.totalSections,
                    );
                    setInMemoryCache(new Map());
                    setWasVersionInvalidated(true);
                }
                journeyVersionRef.current = data.journey.version;

                // Apply
                setSectionMap(data);
                setError(null);
                setIsOfflineFallback(false);

                // Cache
                const sectionUnit: number = data.section.unitNumber;
                setInMemoryCache((prev: Map<number, SectionMapResponse>) => {
                    const next = new Map(prev);
                    next.set(sectionUnit, data);
                    return next;
                });
                cacheTsRef.current.set(sectionUnit, Date.now());
                await cacheSectionMap(journeySlug, sectionUnit, data);
            } catch (err: unknown) {
                // Ignore abort errors (expected on rapid switching)
                if (err instanceof DOMException && err.name === "AbortError") return;

                console.error("[useSectionData] Unexpected error:", err);
                setError(err instanceof Error ? err.message : "Failed to load section");
            }
        },
        [isOnline, inMemoryCache, setSectionMap, setInMemoryCache],
    );

    // ── Initial load: fetch user's current section ──
    const loadInitial = useCallback(
        async (journeySlug: string): Promise<void> => {
            setIsLoading(true);
            setError(null);
            setIsOfflineFallback(false);

            try {
                await fetchAndApplySection(journeySlug);
                setActiveSlug(journeySlug);
                await saveActiveSlug(journeySlug);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchAndApplySection, setActiveSlug],
    );

    // ── Load specific section (sticky header tap) ──
    const loadSection = useCallback(
        async (unitNumber: number): Promise<void> => {
            if (!slug) return;

            // Debounce rapid taps
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            return new Promise<void>((resolve) => {
                debounceRef.current = setTimeout(async () => {
                    setIsSwitchingSection(true);
                    try {
                        await fetchAndApplySection(slug, unitNumber);
                    } finally {
                        setIsSwitchingSection(false);
                        resolve();
                    }
                }, SECTION_SWITCH_DEBOUNCE_MS);
            });
        },
        [slug, fetchAndApplySection],
    );

    // ── Refresh current section ──
    const refresh = useCallback(async (): Promise<void> => {
        if (!slug) return;
        
        // If we have no sectionMap, it means the initial load failed.
        // In this case, we retry the initial load.
        if (!sectionMap) {
            return loadInitial(slug);
        }

        setIsRefreshing(true);
        setError(null); // Clear error on explicit refresh
        try {
            await fetchAndApplySection(slug, sectionMap.section.unitNumber);
        } finally {
            setIsRefreshing(false);
        }
    }, [slug, sectionMap, fetchAndApplySection, loadInitial]);

    // ── Effect: load on mount / slug change ──
    useEffect(() => {
        if (slug) {
            // Reset in-memory cache on slug change (different journey)
            setInMemoryCache(new Map());
            journeyVersionRef.current = null;
            loadInitial(slug);
        }

        return () => {
            // Cleanup: cancel pending requests and timers
            if (abortRef.current) abortRef.current.abort();
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        isLoading,
        error,
        isOfflineFallback,
        isSwitchingSection,
        sectionMap,
        sectionList,
        activeNodeId,
        loadSection,
        refresh,
        isRefreshing,
        wasVersionInvalidated,
        resetVersionInvalidated: useCallback(
            (): void => setWasVersionInvalidated(false),
            [],
        ),
    };
}
