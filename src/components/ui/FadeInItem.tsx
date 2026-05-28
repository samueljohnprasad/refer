import React, { useEffect } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withSpring,
} from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

interface FadeInItemProps {
    index: number;
    delayPerItem?: number;
    translateY?: number;
    children: React.ReactNode;
}

/**
 * Wraps a single list item with a staggered fade-up entry animation.
 * Pass `index` for each item — delay scales with it automatically.
 * Skips animation entirely when Reduce Motion is enabled.
 *
 * Usage:
 *   {items.map((item, i) => (
 *     <FadeInItem key={item.id} index={i}>
 *       <Card ...>{...}</Card>
 *     </FadeInItem>
 *   ))}
 */
export function FadeInItem({
    index,
    delayPerItem = 50,
    translateY = 14,
    children,
}: FadeInItemProps) {
    const reducedMotion = useReducedMotion();
    const opacity = useSharedValue(reducedMotion ? 1 : 0);
    const y = useSharedValue(reducedMotion ? 0 : translateY);

    useEffect(() => {
        if (reducedMotion) return;
        const delay = index * delayPerItem;
        const config = { damping: 20, stiffness: 200 };
        opacity.value = withDelay(delay, withSpring(1, config));
        y.value = withDelay(delay, withSpring(0, config));
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: y.value }],
    }));

    return <Animated.View style={style}>{children}</Animated.View>;
}
