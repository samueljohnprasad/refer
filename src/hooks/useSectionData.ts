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
    SectionViewMode,
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
import { createLogger } from "@/src/lib/logger";

const log = createLogger("useSectionData");

function summarizeProgressRows(progress: SectionMapResponse["progress"]): Array<{
    nodeId: string;
    status: string;
    progress: number;
}> {
    return progress.map((row) => ({
        nodeId: row.nodeId,
        status: row.status,
        progress: row.progress,
    }));
}

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
    /** Reload the backend's current section/unit position */
    loadCurrentPosition: () => Promise<void>;
    /** True when a background refresh is in progress (does NOT trigger skeleton) */
    isRefreshing: boolean;
    /** True once per session when a version mismatch caused cache purge */
    wasVersionInvalidated: boolean;
    /** Reset the version invalidation flag (call after handling, e.g. showing toast) */
    resetVersionInvalidated: () => void;
}

interface FetchSectionOptions {
    preferCache?: boolean;
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

export function useSectionData(
    slug: string | null,
    viewMode: SectionViewMode = "active",
): UseSectionDataReturn {
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
    // Timestamps for in-memory cache entries (mode:unitNumber → Date.now())
    const cacheTsRef = useRef<Map<string, number>>(new Map());

    // ── Derived values ──
    const sectionList: SectionListItem[] = sectionMap?.sectionList ?? [];
    const activeNodeId: string | null =
        sectionMap?.progress.find((p) => p.status === "active")?.nodeId ?? null;

    // ── Core: fetch and apply a section ──
    const fetchAndApplySection = useCallback(
        async (
            journeySlug: string,
            unitNumber?: number,
            options: FetchSectionOptions = {},
        ): Promise<void> => {
            const { preferCache = true } = options;
            // Cancel any in-flight request
            if (abortRef.current) {
                abortRef.current.abort();
            }
            abortRef.current = new AbortController();
            log.info("Fetching section data", {
                slug: journeySlug,
                unitNumber: unitNumber ?? null,
                isOnline,
                preferCache,
                viewMode,
            });

            try {
                // ── Step 1: Check in-memory cache ──
                if (preferCache && unitNumber !== undefined) {
                    const cacheKey: string = `${viewMode}:${unitNumber}`;
                    const cached: SectionMapResponse | undefined =
                        inMemoryCache.get(cacheKey);
                    if (cached) {
                        log.info("Using in-memory section cache", {
                            slug: journeySlug,
                            unitNumber,
                            cachedProgressCount: cached.progress.length,
                            hasEnrollment: cached.enrollment !== null,
                        });
                        setSectionMap(cached);
                        // Skip background refresh if cache is very fresh (< 5 min)
                        const cachedAt: number = cacheTsRef.current.get(cacheKey) ?? 0;
                        const isFresh: boolean = Date.now() - cachedAt < CACHE_FRESHNESS_MS;
                        if (isOnline && !isFresh) {
                            log.info("Refreshing stale in-memory section cache", {
                                slug: journeySlug,
                                unitNumber,
                            });
                            const freshRes = await fetchSectionMap(
                                journeySlug,
                                unitNumber,
                                abortRef.current?.signal,
                                viewMode,
                            );
                            if (freshRes.success && freshRes.data) {
                                // Update progress only, keep cached structure
                                const updated: SectionMapResponse = {
                                    ...cached,
                                    progress: freshRes.data.progress,
                                    enrollment: freshRes.data.enrollment,
                                };
                                setSectionMap(updated);
                                setInMemoryCache((prev: Map<string, SectionMapResponse>) => {
                                    const next = new Map(prev);
                                    next.set(cacheKey, updated);
                                    return next;
                                });
                                cacheTsRef.current.set(cacheKey, Date.now());
                                log.info("Refreshed in-memory section cache", {
                                    slug: journeySlug,
                                    unitNumber,
                                    viewMode,
                                    progressCount: freshRes.data.progress.length,
                                    hasEnrollment: freshRes.data.enrollment !== null,
                                    progressRows: summarizeProgressRows(
                                        freshRes.data.progress,
                                    ),
                                });
                            }
                        }
                        return;
                    }
                }

                // ── Step 2: Check AsyncStorage cache ──
                if (preferCache && unitNumber !== undefined) {
                    const diskCached: SectionMapResponse | null =
                        await loadCachedSectionMap(
                            journeySlug,
                            unitNumber,
                            viewMode,
                            journeyVersionRef.current ?? undefined,
                        );
                    if (diskCached) {
                        log.info("Using disk-cached section data", {
                            slug: journeySlug,
                            unitNumber,
                            progressCount: diskCached.progress.length,
                            hasEnrollment: diskCached.enrollment !== null,
                            isOnline,
                            viewMode,
                        });
                        setSectionMap(diskCached);
                        setIsOfflineFallback(!isOnline);

                        // Store in memory cache
                        setInMemoryCache((prev: Map<string, SectionMapResponse>) => {
                            const next = new Map(prev);
                            next.set(`${viewMode}:${unitNumber}`, diskCached);
                            return next;
                        });

                        // Background refresh if online
                        if (isOnline) {
                            log.info("Refreshing disk-cached section data", {
                                slug: journeySlug,
                                unitNumber,
                            });
                            const freshRes = await fetchSectionMap(
                                journeySlug,
                                unitNumber,
                                abortRef.current?.signal,
                                viewMode,
                            );
                            if (freshRes.success && freshRes.data) {
                                setSectionMap(freshRes.data);
                                setInMemoryCache((prev: Map<string, SectionMapResponse>) => {
                                    const next = new Map(prev);
                                    next.set(`${viewMode}:${unitNumber}`, freshRes.data!);
                                    return next;
                                });
                                await cacheSectionMap(journeySlug, unitNumber, freshRes.data);
                                log.info("Refreshed disk-cached section data", {
                                    slug: journeySlug,
                                    unitNumber,
                                    viewMode,
                                    progressCount: freshRes.data.progress.length,
                                    hasEnrollment: freshRes.data.enrollment !== null,
                                    progressRows: summarizeProgressRows(
                                        freshRes.data.progress,
                                    ),
                                });
                            }
                        }
                        return;
                    }
                }

                // ── Step 3: Fetch from server ──
                if (!isOnline) {
                    log.warn("Cannot fetch section data while offline", {
                        slug: journeySlug,
                        unitNumber: unitNumber ?? null,
                        viewMode,
                    });
                    setError("No internet connection. Please try again.");
                    return;
                }

                const res = await fetchSectionMap(
                    journeySlug,
                    unitNumber,
                    abortRef.current?.signal,
                    viewMode,
                );

                if (!res.success || !res.data) {
                    log.warn("Section fetch returned no data", {
                        slug: journeySlug,
                        unitNumber: unitNumber ?? null,
                        viewMode,
                        error: res.error ?? "Failed to load section data",
                    });
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
                log.info("Applied server section data", {
                    slug: journeySlug,
                    unitNumber: data.section.unitNumber,
                    progressCount: data.progress.length,
                    hasEnrollment: data.enrollment !== null,
                    totalSections: data.journey.totalSections,
                    nodeCount: data.section.nodes.length,
                    viewMode: data.viewMode,
                    progressRows: summarizeProgressRows(data.progress),
                });

                // Cache
                const sectionUnit: number = data.section.unitNumber;
                setInMemoryCache((prev: Map<string, SectionMapResponse>) => {
                    const next = new Map(prev);
                    next.set(`${data.viewMode}:${sectionUnit}`, data);
                    return next;
                });
                cacheTsRef.current.set(`${data.viewMode}:${sectionUnit}`, Date.now());
                await cacheSectionMap(journeySlug, sectionUnit, data);
            } catch (err: unknown) {
                // Ignore abort errors (expected on rapid switching)
                if (err instanceof DOMException && err.name === "AbortError") {
                    log.info("Section fetch aborted", {
                        slug: journeySlug,
                        unitNumber: unitNumber ?? null,
                        viewMode,
                    });
                    return;
                }

                log.error("Unexpected section load error", err);
                setError(err instanceof Error ? err.message : "Failed to load section");
            }
        },
        [isOnline, inMemoryCache, setSectionMap, setInMemoryCache, viewMode],
    );

    // ── Initial load: fetch user's current section ──
    const loadInitial = useCallback(
        async (journeySlug: string): Promise<void> => {
            setIsLoading(true);
            setError(null);
            setIsOfflineFallback(false);
            log.info("Loading initial section", { slug: journeySlug, viewMode });

            try {
                await fetchAndApplySection(journeySlug);
                if (viewMode === "active") {
                    setActiveSlug(journeySlug);
                    await saveActiveSlug(journeySlug);
                }
                log.info("Initial section load completed", {
                    slug: journeySlug,
                    viewMode,
                });
            } finally {
                setIsLoading(false);
            }
        },
        [fetchAndApplySection, setActiveSlug, viewMode],
    );

    // ── Load specific section (sticky header tap) ──
    const loadSection = useCallback(
        async (unitNumber: number): Promise<void> => {
            if (!slug) return;
            log.info("Requested section switch", {
                slug,
                unitNumber,
                viewMode,
            });

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
        [slug, fetchAndApplySection, viewMode],
    );

    // ── Refresh current section ──
    const refresh = useCallback(async (): Promise<void> => {
        if (!slug) return;
        log.info("Refreshing current section", {
            slug,
            currentUnitNumber: sectionMap?.section.unitNumber ?? null,
            hasSectionMap: sectionMap !== null,
            viewMode,
        });
        
        // If we have no sectionMap, it means the initial load failed.
        // In this case, we retry the initial load.
        if (!sectionMap) {
            log.warn("Refresh called without sectionMap; retrying initial load", {
                slug,
            });
            return loadInitial(slug);
        }

        setIsRefreshing(true);
        setError(null); // Clear error on explicit refresh
        try {
            await fetchAndApplySection(slug, sectionMap.section.unitNumber, {
                preferCache: false,
            });
        } finally {
            setIsRefreshing(false);
        }
    }, [slug, sectionMap, fetchAndApplySection, loadInitial, viewMode]);

    const loadCurrentPosition = useCallback(async (): Promise<void> => {
        if (!slug) return;
        log.info("Reloading backend current journey position", { slug, viewMode });
        setIsRefreshing(true);
        setError(null);
        try {
            await fetchAndApplySection(slug, undefined, {
                preferCache: false,
            });
        } finally {
            setIsRefreshing(false);
        }
    }, [slug, fetchAndApplySection, viewMode]);

    // ── Effect: load on mount / slug change ──
    useEffect(() => {
        if (slug) {
            // Reset in-memory cache on slug change (different journey)
            log.info("Slug changed, resetting section cache", { slug, viewMode });
            setInMemoryCache(new Map());
            journeyVersionRef.current = null;
            loadInitial(slug);
        }

        return () => {
            // Cleanup: cancel pending requests and timers
            if (abortRef.current) abortRef.current.abort();
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [slug, viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

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
        loadCurrentPosition,
        isRefreshing,
        wasVersionInvalidated,
        resetVersionInvalidated: useCallback(
            (): void => setWasVersionInvalidated(false),
            [],
        ),
    };
}
