/**
 * GuestSignUpSheet
 *
 * Bottom sheet presented to guest users when they attempt to access
 * a node beyond the free trial (node index >= 2).
 *
 * Shows:
 * - How many nodes + XP they earned so far (social proof)
 * - Primary CTA: "Save My Progress" → opens SignInBottomSheet
 * - Secondary: "Not Now" → dismiss
 *
 * Presentation:
 * - Uses ShortBottomModal (existing pattern)
 * - forwardRef so the parent can call .present() / .dismiss()
 */

import React, { forwardRef, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { LockIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import * as Haptics from 'expo-haptics';

import ShortBottomModal from '@/src/components/ShortBottomModal';
import SignInBottomSheet from '@/src/components/SignInBottomSheet';
import type { GuestProgress } from '@/hooks/data/useGuestProgress';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GuestSignUpSheetProps {
    guestProgress: GuestProgress;
    onDismiss?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const GuestSignUpSheet = forwardRef<BottomSheetModal | null, GuestSignUpSheetProps>(
    ({ guestProgress, onDismiss }, ref) => {
        const signInSheetRef = useRef<BottomSheetModal>(null);

        const handleSaveProgress = useCallback((): void => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Dismiss this sheet first, then present sign-in
            (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
            setTimeout(() => {
                signInSheetRef.current?.present();
            }, 300);
        }, [ref]);

        const handleNotNow = useCallback((): void => {
            Haptics.selectionAsync();
            (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
            onDismiss?.();
        }, [ref, onDismiss]);

        const completedCount: number = guestProgress.completedNodeIds.length;

        return (
            <>
                <ShortBottomModal
                    ref={ref}
                    snapPoints={['48%']}
                    onDismiss={onDismiss}
                >
                    <View className="flex-1 px-6 pt-5 pb-8">
                        {/* Icon */}
                        <View className="w-14 h-14 rounded-2xl bg-purple-100 items-center justify-center mb-4">
                            <HugeiconsIcon icon={LockIcon} size={28} color="#7B61FF" />
                        </View>

                        {/* Headline */}
                        <Text
                            className="text-ink mb-1"
                            style={{ fontFamily: 'CormorantSemiBold', fontSize: 26, lineHeight: 32 }}
                        >
                            Sign up to keep going
                        </Text>
                        <Text className="text-ink-soft text-[15px] leading-6 mb-5">
                            You've completed{' '}
                            <Text className="text-purple-600 font-semibold">
                                {completedCount} {completedCount === 1 ? 'node' : 'nodes'}
                            </Text>{' '}
                            and earned{' '}
                            <Text className="text-purple-600 font-semibold">
                                {guestProgress.tempXP} IP
                            </Text>
                            . Create a free account to save your progress and unlock the rest of your journey.
                        </Text>

                        {/* Progress recap pill */}
                        {completedCount > 0 && (
                            <View className="flex-row items-center gap-2 bg-purple-50 rounded-2xl px-4 py-3 mb-5">
                                <HugeiconsIcon icon={SparklesIcon} size={18} color="#7B61FF" />
                                <Text className="text-purple-700 text-sm font-semibold">
                                    {completedCount} {completedCount === 1 ? 'lesson' : 'lessons'} · {guestProgress.tempXP} Insight Points saved
                                </Text>
                            </View>
                        )}

                        {/* Primary CTA */}
                        <TouchableOpacity
                            onPress={handleSaveProgress}
                            activeOpacity={0.8}
                            className="w-full bg-sage-700 rounded-full h-14 items-center justify-center mb-3"
                            accessibilityRole="button"
                            accessibilityLabel="Save my progress and create account"
                        >
                            <Text className="text-white font-semibold text-base">
                                Save My Progress
                            </Text>
                        </TouchableOpacity>

                        {/* Secondary */}
                        <TouchableOpacity
                            onPress={handleNotNow}
                            activeOpacity={0.7}
                            className="w-full h-11 items-center justify-center"
                            accessibilityRole="button"
                            accessibilityLabel="Dismiss, not now"
                        >
                            <Text className="text-ink-muted text-sm font-medium">Not Now</Text>
                        </TouchableOpacity>
                    </View>
                </ShortBottomModal>

                {/* Sign-in sheet — stacked behind the guest sheet */}
                <SignInBottomSheet ref={signInSheetRef} />
            </>
        );
    },
);

GuestSignUpSheet.displayName = 'GuestSignUpSheet';
export default GuestSignUpSheet;
