/**
 * useSectionPrefetch
 * Proactive prefetching for the journey map:
 * 1. Pre-fetches the next section when the user completes ≥80% of current section
 * 2. Pre-fetches adjacent node content for the next 1-2 nodes ahead of the active node
 *
 * All prefetched data goes through the same caching layer (AsyncStorage + in-memory)
 * so that when the user actually navigates, the data is served instantly from cache.
 *
 * This hook is passive — it never updates visible UI state, only warms caches.
 */

import { useEffect, useRef } from "react";

import type {
    SectionMapResponse,
    SectionNodeProgress,
    NodeStub,
} from "@/src/types/journey/sectionMap";
import { fetchSectionMap, fetchNodeContent } from "@/src/lib/api/journeyApi";
import {
    cacheSectionMap,
    loadCachedSectionMap,
    cacheNodeContent,
    loadCachedNodeContent,
} from "@/src/store/journeyStore";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Completion threshold to trigger next-section prefetch (0–1) */
const SECTION_PREFETCH_THRESHOLD = 0.8;

/** Number of nodes ahead of active to prefetch content for */
const NODE_PREFETCH_LOOKAHEAD = 2;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseSectionPrefetchOptions {
    /** Current journey slug */
    slug: string | null;
    /** Current section map (null if not loaded yet) */
    sectionMap: SectionMapResponse | null;
    /** Whether the hook should be active (disabled during loading/error) */
    enabled: boolean;
}

export function useSectionPrefetch({
    slug,
    sectionMap,
    enabled,
}: UseSectionPrefetchOptions): void {
    // Track which sections/nodes we've already prefetched to avoid duplicates
    const prefetchedSectionsRef = useRef<Set<number>>(new Set());
    const prefetchedNodesRef = useRef<Set<string>>(new Set());

    // Track current section unit number for reset detection
    const currentUnitNumber: number | null =
        sectionMap?.section.unitNumber ?? null;

    // Reset section prefetch tracking when journey changes
    useEffect(() => {
        prefetchedSectionsRef.current = new Set();
        prefetchedNodesRef.current = new Set();
    }, [slug]);

    // Reset node prefetch tracking when section changes (revisited sections
    // may have new active nodes that need prefetching)
    useEffect(() => {
        prefetchedNodesRef.current = new Set();
    }, [currentUnitNumber]);

    // ── D5a: Pre-fetch next section at 80% completion ──
    useEffect(() => {
        if (!enabled || !sectionMap || !slug) return;

        const { section, progress, journey } = sectionMap;
        const totalNodes: number = section.nodes.length;
        if (totalNodes === 0) return;

        const completedCount: number = progress.filter(
            (p: SectionNodeProgress) => p.status === "completed",
        ).length;
        const completionRatio: number = completedCount / totalNodes;

        // Only prefetch if past threshold and next section exists
        const nextUnitNumber: number = section.unitNumber + 1;
        if (
            completionRatio >= SECTION_PREFETCH_THRESHOLD &&
            nextUnitNumber <= journey.totalSections &&
            !prefetchedSectionsRef.current.has(nextUnitNumber)
        ) {
            prefetchedSectionsRef.current.add(nextUnitNumber);

            // Fire-and-forget: prefetch next section into cache
            (async (): Promise<void> => {
                // Check disk cache first
                const cached: SectionMapResponse | null = await loadCachedSectionMap(
                    slug,
                    nextUnitNumber,
                    journey.version,
                );
                if (cached) return; // Already cached

                const res = await fetchSectionMap(slug, nextUnitNumber);
                if (res.success && res.data) {
                    await cacheSectionMap(slug, nextUnitNumber, res.data);
                }
            })().catch((err: unknown) => {
                // Prefetch failures are non-critical — just log
                console.debug("[useSectionPrefetch] Section prefetch failed:", err);
            });
        }
    }, [enabled, sectionMap, slug]);

    // ── D5b: Pre-fetch next 1-2 node contents ahead of active ──
    useEffect(() => {
        if (!enabled || !sectionMap || !slug) return;

        const { section, progress } = sectionMap;
        const nodes: NodeStub[] = section.nodes;

        // Find active node index
        const activeProgress: SectionNodeProgress | undefined = progress.find(
            (p: SectionNodeProgress) => p.status === "active",
        );
        if (!activeProgress) return;

        const activeIndex: number = nodes.findIndex(
            (n: NodeStub) => n.id === activeProgress.nodeId,
        );
        if (activeIndex < 0) return;

        // Prefetch next N nodes' content
        const endIndex: number = Math.min(
            activeIndex + NODE_PREFETCH_LOOKAHEAD + 1,
            nodes.length,
        );

        for (let i: number = activeIndex + 1; i < endIndex; i++) {
            const node: NodeStub = nodes[i];
            if (prefetchedNodesRef.current.has(node.id)) continue;
            prefetchedNodesRef.current.add(node.id);

            // Fire-and-forget: prefetch node content into cache
            (async (): Promise<void> => {
                const cached = await loadCachedNodeContent(node.id);
                if (cached) return; // Already cached

                const res = await fetchNodeContent(node.id);
                if (res.success && res.data) {
                    await cacheNodeContent(node.id, res.data);
                }
            })().catch((err: unknown) => {
                console.debug(
                    "[useSectionPrefetch] Node content prefetch failed:",
                    err,
                );
            });
        }
    }, [enabled, sectionMap, slug]);
}

export default useSectionPrefetch;
