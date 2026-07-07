/**
 * SignUpPromptModal (P1.6.1)
 *
 * Shown after a guest user completes their 2nd free node,
 * or when they try to access node 3+.
 *
 * Features:
 * - "Sign up to save your progress and continue your journey"
 * - Shows XP earned so far (motivator to not lose it)
 * - Primary CTA: Sign Up / Log In
 * - Secondary: "Maybe later" dismiss
 * - Animated entrance (slide-up with spring)
 *
 * Pure presentational — all data via props.
 */

import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { PressableScale } from '@/src/components/ui/PressableScale';

// ============================================================================
// Types
// ============================================================================

export interface SignUpPromptModalProps {
    /** Whether the modal is visible */
    visible: boolean;
    /** XP earned during the guest session */
    guestXP: number;
    /** Number of nodes completed as guest */
    completedNodes: number;
    /** Called when user taps Sign Up */
    onSignUp: () => void;
    /** Called when user taps Maybe Later */
    onDismiss: () => void;
}

// ============================================================================
// Component
// ============================================================================

export default function SignUpPromptModal({
    visible,
    guestXP,
    completedNodes,
    onSignUp,
    onDismiss,
}: SignUpPromptModalProps): React.JSX.Element {
    const slideY = useSharedValue<number>(300);
    const backdropOpacity = useSharedValue<number>(0);

    useEffect(() => {
        if (visible) {
            backdropOpacity.value = withTiming(1, { duration: 250 });
            slideY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            slideY.value = 300;
            backdropOpacity.value = 0;
        }
    }, [visible, slideY, backdropOpacity]);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: slideY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent
            onRequestClose={onDismiss}
        >
            {/* Backdrop */}
            <Animated.View
                style={[backdropStyle, { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }]}
            >
                <Pressable
                    onPress={onDismiss}
                    style={{ flex: 1 }}
                    accessibilityLabel="Dismiss sign up prompt"
                    accessibilityRole="button"
                />
            </Animated.View>

            {/* Card */}
            <Animated.View
                style={[
                    cardStyle,
                    {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                    },
                ]}
            >
                <SafeAreaView
                    className="bg-brand-surface rounded-t-3xl px-6 pt-6 pb-4"
                    edges={['bottom']}
                >
                    {/* Handle bar */}
                    <View className="w-10 h-1 bg-slate-200 rounded-full self-center mb-5" />

                    {/* Illustration */}
                    <View className="items-center mb-4">
                        <View className="w-20 h-20 rounded-full bg-violet-50 items-center justify-center">
                            <Text style={{ fontSize: 36 }}>🚀</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-ink text-center mb-2">
                        You're doing great!
                    </Text>

                    {/* Subtitle */}
                    <Text className="text-base text-ink-soft text-center leading-6 mb-5 px-2">
                        Sign up to save your progress and continue your journey.
                    </Text>

                    {/* Progress summary */}
                    <View className="flex-row justify-center gap-6 mb-6">
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-ink">
                                {completedNodes}
                            </Text>
                            <Text className="text-xs text-ink-muted">
                                {completedNodes === 1 ? 'node done' : 'nodes done'}
                            </Text>
                        </View>
                        <View className="w-px bg-slate-200" />
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-ink">
                                {guestXP}
                            </Text>
                            <Text className="text-xs text-ink-muted">IP earned</Text>
                        </View>
                    </View>

                    {/* Warning */}
                    <View className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6">
                        <Text className="text-sm text-amber-700 text-center leading-5">
                            ⚠️ Your progress will be lost if you leave without signing up
                        </Text>
                    </View>

                    {/* Primary CTA */}
                    <PressableScale
                        onPress={onSignUp}
                        scale={0.97}
                        hapticStyle="medium"
                        style={{
                            backgroundColor: '#7B61FF',
                            paddingVertical: 16,
                            borderRadius: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottomWidth: 4,
                            borderBottomColor: '#5B41DF',
                            marginBottom: 12,
                        }}
                        accessibilityLabel="Sign up to save progress"
                        accessibilityRole="button"
                    >
                        <Text className="text-base font-bold text-white">
                            Sign Up & Save Progress
                        </Text>
                    </PressableScale>

                    {/* Secondary */}
                    <Pressable
                        onPress={onDismiss}
                        className="py-3 items-center"
                        accessibilityLabel="Maybe later"
                        accessibilityRole="button"
                    >
                        <Text className="text-sm text-ink-muted">Maybe later</Text>
                    </Pressable>
                </SafeAreaView>
            </Animated.View>
        </Modal>
    );
}
