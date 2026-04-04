/**
 * useViewportCulling Hook (Task 17 — Perf #1 rewrite)
 *
 * Tracks the current scroll offset via a Reanimated SharedValue and provides
 * a JS-side `isInViewport(y)` check for render-time culling decisions.
 *
 * Architecture (post-perf-audit):
 * - The canonical scroll position lives in a SharedValue owned by the caller
 *   (MultiUnitPresentation's `useAnimatedScrollHandler`).
 * - This hook reads a **snapshot** of that value. The snapshot is pushed to JS
 *   via `runOnJS` only when the scroll crosses a culling-zone boundary
 *   (every ~300px of travel), NOT every frame. This means React re-renders
 *   only 2-3 times during a full-screen fling instead of 60+ times.
 * - Between snapshots the `isInViewport` check uses the stale value which is
 *   fine because the overscan buffer (600px) absorbs the gap.
 *
 * Nodes outside the viewport + overscan are skipped during render,
 * dramatically reducing the number of mounted components for long paths.
 */

import { useState, useCallback, useMemo, useRef } from "react";
import { useWindowDimensions } from "react-native";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ViewportCullingResult {
    /** Whether a Y position is currently visible (within viewport + overscan) */
    isInViewport: (y: number) => boolean;
    /** Current scroll offset Y snapshot (for consumers that need it) */
    scrollY: number;
    /** Call this from `runOnJS` inside `useAnimatedScrollHandler` to push a new snapshot */
    updateScrollY: (y: number) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** How far above/below the viewport to keep nodes rendered (prevents pop-in) */
const DEFAULT_OVERSCAN_PX: number = 600;

/**
 * Minimum scroll distance (px) before we push a new snapshot to JS.
 * Must be significantly less than overscan so nodes are never popped in late.
 * 300px means ~2-3 JS updates per full-screen fling — virtually free.
 */
const SNAPSHOT_HYSTERESIS_PX: number = 300;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns `isInViewport(y)` for render-time culling and an `updateScrollY`
 * callback to be called from the caller's Reanimated scroll handler via `runOnJS`.
 *
 * The hook no longer owns a scroll handler — the caller drives it.
 *
 * @param overscan - Extra pixels above/below viewport to keep mounted
 */
export function useViewportCulling(
    overscan: number = DEFAULT_OVERSCAN_PX,
): ViewportCullingResult {
    const { height: screenHeight } = useWindowDimensions();
    const [scrollY, setScrollY] = useState<number>(0);

    // Track the last value we actually pushed so we can apply hysteresis
    const lastPushedRef = useRef<number>(0);

    /**
     * Called from `runOnJS` on the UI thread. Only commits a React state
     * update when scroll has moved more than SNAPSHOT_HYSTERESIS_PX since
     * the last push, collapsing dozens of frames into 1 re-render.
     */
    const updateScrollY = useCallback((y: number): void => {
        if (Math.abs(y - lastPushedRef.current) >= SNAPSHOT_HYSTERESIS_PX) {
            lastPushedRef.current = y;
            setScrollY(y);
        }
    }, []);

    const isInViewport = useCallback(
        (y: number): boolean => {
            const top: number = scrollY - overscan;
            const bottom: number = scrollY + screenHeight + overscan;
            return y >= top && y <= bottom;
        },
        [scrollY, screenHeight, overscan],
    );

    return useMemo(
        () => ({ isInViewport, scrollY, updateScrollY }),
        [isInViewport, scrollY, updateScrollY],
    );
}
