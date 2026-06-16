import React, { useEffect } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

interface FadeInItemProps {
    index: number;
    delayPerItem?: number;
    translateY?: number;
    className?: string;
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
    delayPerItem = 40,
    className,
    children,
}: FadeInItemProps) {
    const reducedMotion = useReducedMotion();
    const opacity = useSharedValue(reducedMotion ? 1 : 0);

    useEffect(() => {
        if (reducedMotion) return;
        const delay = index * delayPerItem;
        opacity.value = withDelay(delay, withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }));
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return <Animated.View style={style} className={className}>{children}</Animated.View>;
}
