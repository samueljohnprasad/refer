/**
 * useNodeContent
 * Fetches the full content JSONB for a single journey node on-demand.
 *
 * Cache strategy:
 *   1. Check in-memory ref (instant)
 *   2. Check AsyncStorage (24h TTL)
 *   3. Fetch from server via get_node_content RPC
 *
 * Usage:
 *   const { content, isLoading, error, fetchContent } = useNodeContent();
 *   // On node tap:
 *   const nodeContent = await fetchContent(nodeId);
 */

import { useCallback, useRef, useState } from "react";

import type { NodeContentResponse } from "@/src/types/journey/sectionMap";
import { fetchNodeContent as fetchNodeContentApi } from "@/src/lib/api/journeyApi";
import {
    cacheNodeContent,
    loadCachedNodeContent,
} from "@/src/store/journeyStore";

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseNodeContentReturn {
    /** Currently loaded node content (null until fetched) */
    content: NodeContentResponse | null;
    /** Whether content is being fetched */
    isLoading: boolean;
    /** Error message if fetch failed */
    error: string | null;
    /** Fetch content for a specific node. Returns the content or null on error. */
    fetchContent: (nodeId: string) => Promise<NodeContentResponse | null>;
    /** Clear the current content (e.g. when closing the node renderer) */
    clearContent: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useNodeContent(): UseNodeContentReturn {
    const [content, setContent] = useState<NodeContentResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // In-memory cache for previously fetched nodes within this session
    const memCacheRef = useRef<Map<string, NodeContentResponse>>(new Map());

    const fetchContent = useCallback(
        async (nodeId: string): Promise<NodeContentResponse | null> => {
            setIsLoading(true);
            setError(null);

            try {
                // ── Step 1: In-memory cache ──
                const memCached: NodeContentResponse | undefined =
                    memCacheRef.current.get(nodeId);
                if (memCached) {
                    setContent(memCached);
                    setIsLoading(false);
                    return memCached;
                }

                // ── Step 2: AsyncStorage cache (24h TTL) ──
                const diskCached: NodeContentResponse | null =
                    await loadCachedNodeContent(nodeId);
                if (diskCached) {
                    setContent(diskCached);
                    memCacheRef.current.set(nodeId, diskCached);
                    setIsLoading(false);
                    return diskCached;
                }

                // ── Step 3: Fetch from server ──
                const res = await fetchNodeContentApi(nodeId);

                if (!res.success || !res.data) {
                    const errorMsg: string = res.error ?? "Failed to load node content";
                    setError(errorMsg);
                    setIsLoading(false);
                    return null;
                }

                const data: NodeContentResponse = res.data;

                // Cache
                setContent(data);
                memCacheRef.current.set(nodeId, data);
                await cacheNodeContent(nodeId, data);

                return data;
            } catch (err: unknown) {
                console.error("[useNodeContent] Unexpected error:", err);
                const errorMsg: string =
                    err instanceof Error ? err.message : "Failed to load node content";
                setError(errorMsg);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const clearContent = useCallback((): void => {
        setContent(null);
        setError(null);
    }, []);

    return {
        content,
        isLoading,
        error,
        fetchContent,
        clearContent,
    };
}
