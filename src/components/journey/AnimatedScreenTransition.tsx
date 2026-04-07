/**
 * AnimatedScreenTransition
 * Wraps child content with a fade-in animation on mount.
 * Used for smooth transitions between different journey tab states
 * (onboarding → map, map → catalog, journey switch reload).
 *
 * Lightweight — uses Reanimated's entering/layout animations.
 * No gesture handling or complex state.
 */

import React from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface AnimatedScreenTransitionProps {
    /** Content to animate in */
    children: React.ReactNode;
    /** Duration of fade-in (ms). Default: 300 */
    duration?: number;
    /** Unique key to trigger re-animation when content changes */
    transitionKey: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function AnimatedScreenTransition({
    children,
    duration = 300,
    transitionKey,
}: AnimatedScreenTransitionProps): React.JSX.Element {
    return (
        <Animated.View
            key={transitionKey}
            entering={FadeIn.duration(duration)}
            exiting={FadeOut.duration(150)}
            className="flex-1"
        >
            {children}
        </Animated.View>
    );
}

export default React.memo(AnimatedScreenTransition);
