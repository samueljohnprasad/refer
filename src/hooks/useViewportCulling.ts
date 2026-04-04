/**
 * useViewportCulling Hook (Task 17)
 * Tracks the current scroll offset and provides a helper to determine
 * whether a given Y position is within (or near) the visible viewport.
 *
 * Nodes outside the viewport + overscan are skipped during render,
 * dramatically reducing the number of mounted components for long paths.
 */

import { useState, useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ViewportCullingResult {
    /** Whether a Y position is currently visible (within viewport + overscan) */
    isInViewport: (y: number) => boolean;
    /** Scroll handler to attach to the ScrollView */
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /** Current scroll offset Y */
    scrollY: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** How far above/below the viewport to keep nodes rendered (prevents pop-in) */
const DEFAULT_OVERSCAN_PX: number = 600;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns a scroll handler and `isInViewport(y)` check that culls
 * off-screen nodes. Attach `onScroll` to the ScrollView and call
 * `isInViewport(nodeY)` before rendering each node.
 *
 * @param overscan - Extra pixels above/below viewport to keep mounted
 */
export function useViewportCulling(
    overscan: number = DEFAULT_OVERSCAN_PX,
): ViewportCullingResult {
    const { height: screenHeight } = useWindowDimensions();
    const [scrollY, setScrollY] = useState<number>(0);

    const onScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
            setScrollY(event.nativeEvent.contentOffset.y);
        },
        [],
    );

    const isInViewport = useCallback(
        (y: number): boolean => {
            const top: number = scrollY - overscan;
            const bottom: number = scrollY + screenHeight + overscan;
            return y >= top && y <= bottom;
        },
        [scrollY, screenHeight, overscan],
    );

    return useMemo(
        () => ({ isInViewport, onScroll, scrollY }),
        [isInViewport, onScroll, scrollY],
    );
}
