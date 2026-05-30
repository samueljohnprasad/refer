import React, { useEffect } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withSpring,
} from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { SPRING_DEFAULT as APP_SPRING } from "@/src/utils/motionTokens";

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
    delayPerItem = 50,
    translateY = 14,
    className,
    children,
}: FadeInItemProps) {
    const reducedMotion = useReducedMotion();
    const opacity = useSharedValue(reducedMotion ? 1 : 0);
    const y = useSharedValue(reducedMotion ? 0 : translateY);

    useEffect(() => {
        if (reducedMotion) return;
        const delay = index * delayPerItem;
        opacity.value = withDelay(delay, withSpring(1, APP_SPRING));
        y.value = withDelay(delay, withSpring(0, APP_SPRING));
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: y.value }],
    }));

    return <Animated.View style={style} className={className}>{children}</Animated.View>;
}
