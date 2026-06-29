/**
 * AnimatedNodeButton
 *
 * Duolingo-style 3D press button designed for journey map nodes.
 * Features a shadow layer beneath that creates the illusion of depth,
 * and a spring-driven translateY animation on press that "pushes" the
 * button into the shadow — exactly like Duolingo's lesson nodes.
 *
 * Haptic feedback fires on press-in for tactile reinforcement.
 * Respects reduced-motion accessibility settings.
 *
 * @example
 * <AnimatedNodeButton
 *   size={64}
 *   backgroundColor="#58CC02"
 *   shadowColor="#45A802"
 *   onPress={handlePress}
 * >
 *   <Text>⭐</Text>
 * </AnimatedNodeButton>
 */

import React, { useCallback, useRef } from 'react';
import { View, Pressable, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { SPRING_DUOLINGO_PRESS } from '@/src/utils/motionTokens';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

// ─── Types ───────────────────────────────────────────────────────────────────

export type NodeHapticStyle = 'none' | 'light' | 'medium' | 'heavy';

export interface AnimatedNodeButtonProps {
    /** Node diameter in dp */
    size: number;
    /** Main face background color */
    backgroundColor: string;
    /** 3D shadow layer color (should be a darker shade of backgroundColor) */
    shadowColor: string;
    /** Press callback */
    onPress: (e?: any) => void;
    /** Whether press is disabled */
    disabled?: boolean;
    /** Haptic intensity on press-in. Default: 'medium' */
    hapticStyle?: NodeHapticStyle;
    /** Bottom shadow depth in dp. Default: 6 */
    shadowDepth?: number;
    /** Border radius override. Default: size / 2 (circle) */
    borderRadius?: number;
    /** Inner content (icon, emoji, SVG) */
    children: React.ReactNode;
    /** Accessibility label */
    accessibilityLabel?: string;
    /** Accessibility state */
    accessibilityState?: { disabled?: boolean };
    /** Additional className for the outer wrapper */
    className?: string;
}

// ─── Haptic Map ──────────────────────────────────────────────────────────────

const HAPTIC_MAP: Record<NodeHapticStyle, () => Promise<void>> = {
    none: () => Promise.resolve(),
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_SHADOW_DEPTH = 6;
const DOUBLE_TAP_GUARD_MS = 250;

// ─── Component ───────────────────────────────────────────────────────────────

function AnimatedNodeButtonInner({
    size,
    backgroundColor,
    shadowColor,
    onPress,
    disabled = false,
    hapticStyle = 'medium',
    shadowDepth = DEFAULT_SHADOW_DEPTH,
    borderRadius,
    children,
    accessibilityLabel,
    accessibilityState,
    className,
}: AnimatedNodeButtonProps): React.JSX.Element {
    const reducedMotion: boolean = useReducedMotion();
    const pressY = useSharedValue<number>(0);
    const pressLock = useRef<boolean>(false);

    const radius: number = borderRadius ?? size / 2;

    // Animated translateY for the "push into shadow" effect
    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: pressY.value }],
    }));

    const handlePressIn = useCallback((): void => {
        if (disabled) return;

        // Fire haptic on press-in for immediate tactile feedback
        HAPTIC_MAP[hapticStyle]().catch(() => {
            // no-op if not supported
        });

        if (reducedMotion) return;

        // Push the face down into the shadow
        pressY.value = withSpring(shadowDepth, SPRING_DUOLINGO_PRESS);
    }, [disabled, hapticStyle, reducedMotion, pressY, shadowDepth]);

    const handlePressOut = useCallback((): void => {
        if (disabled || reducedMotion) return;

        // Spring back to resting position
        pressY.value = withSpring(0, SPRING_DUOLINGO_PRESS);
    }, [disabled, reducedMotion, pressY]);

    const handlePress = useCallback((e?: any): void => {
        if (disabled) return;

        // Double-tap guard
        if (pressLock.current) return;
        pressLock.current = true;

        try {
            onPress(e);
        } finally {
            setTimeout(() => {
                pressLock.current = false;
            }, DOUBLE_TAP_GUARD_MS);
        }
    }, [disabled, onPress]);

    return (
        <View
            className={className}
            style={{
                width: size,
                height: size + shadowDepth,
                position: 'relative',
            }}
        >
            {/* 3D shadow layer — sits at the bottom, always visible */}
            <View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: size,
                    height: size,
                    borderRadius: radius,
                    backgroundColor: shadowColor,
                }}
            />

            {/* Main pressable face — slides down on press to merge with shadow */}
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                accessibilityState={accessibilityState}
                {...(Platform.OS === 'android'
                    ? { android_ripple: { borderless: true, radius: radius } }
                    : {})}
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                <Animated.View
                    style={[
                        pressStyle,
                        {
                            width: size,
                            height: size,
                            borderRadius: radius,
                            backgroundColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // Subtle top highlight for 3D depth on iOS
                            ...(Platform.OS === 'ios'
                                ? {
                                    shadowColor: '#FFFFFF',
                                    shadowOffset: { width: 0, height: -1 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 1,
                                }
                                : {}),
                        },
                    ]}
                >
                    {children}
                </Animated.View>
            </Pressable>
        </View>
    );
}

AnimatedNodeButtonInner.displayName = 'AnimatedNodeButton';

const AnimatedNodeButton = React.memo(AnimatedNodeButtonInner);

export default AnimatedNodeButton;
