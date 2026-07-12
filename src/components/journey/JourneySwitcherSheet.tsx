/**
 * JourneySwitcherSheet
 * Bottom sheet for switching between enrolled journeys.
 * Follows the BookmarkedJournalsBottomSheet pattern (Gorhom BottomSheetModal).
 *
 * Shows:
 * - Header with title + enrollment count
 * - List of enrolled journeys with progress bars
 * - Active journey highlighted
 * - "Discover New Journeys" button at bottom
 *
 * Pure presentational — all data and actions via props.
 */

import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Feather } from "@expo/vector-icons";
import {
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import type { JourneySwitcherItem } from "@/src/types/journey";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JourneySwitcherSheetProps {
    /** Whether the sheet is open */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
    /** List of enrolled journeys formatted for display */
    items: JourneySwitcherItem[];
    /** Called when user taps a journey to switch to it */
    onSwitchJourney: (slug: string) => void;
    /** Called when user taps "Discover New Journeys" */
    onDiscoverPress: () => void;
    /** Called when user swipes to archive a journey */
    onArchive?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Color helper — map colorScheme to tailwind-friendly bg colors
// ---------------------------------------------------------------------------

const COLOR_MAP: Record<string, string> = {
    blue: "#3B82F6",
    green: "#22C55E",
    purple: "#8B5CF6",
    red: "#EF4444",
    orange: "#F97316",
    teal: "#14B8A6",
    pink: "#EC4899",
    indigo: "#6366F1",
};

function getSchemeColor(colorScheme: string): string {
    return COLOR_MAP[colorScheme] ?? "#7B61FF";
}

// ---------------------------------------------------------------------------
// JourneyRow — single journey item in the switcher
// ---------------------------------------------------------------------------

/** Swipe threshold to trigger archive (pixels) */
const ARCHIVE_THRESHOLD: number = -80;

interface JourneyRowProps {
    item: JourneySwitcherItem;
    onPress: (slug: string) => void;
    onArchive?: (slug: string) => void;
}

function JourneyRow({
    item,
    onPress,
    onArchive,
}: JourneyRowProps): React.JSX.Element {
    const accentColor: string = getSchemeColor(item.colorScheme);
    const isCompleted: boolean = item.status === "completed";
    const translateX = useSharedValue<number>(0);

    const handlePress = useCallback((): void => {
        onPress(item.slug);
    }, [onPress, item.slug]);

    const triggerArchive = useCallback((): void => {
        onArchive?.(item.slug);
    }, [onArchive, item.slug]);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((e) => {
            // Only allow left swipe (negative x)
            translateX.value = Math.min(0, e.translationX);
        })
        .onEnd(() => {
            if (translateX.value < ARCHIVE_THRESHOLD) {
                // Snap off-screen then archive
                translateX.value = withSpring(-200, { damping: 20, stiffness: 100, overshootClamping: true });
                runOnJS(triggerArchive)();
            } else {
                // Snap back
                translateX.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
            }
        });

    const rowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const archiveRevealStyle = useAnimatedStyle(() => ({
        opacity: translateX.value < -20 ? 1 : 0,
    }));

    return (
        <View className="relative mb-3">
            {/* Archive action revealed behind */}
            <Animated.View
                className="absolute right-0 top-0 bottom-0 w-20 rounded-2xl bg-red-500 items-center justify-center"
                style={archiveRevealStyle}
            >
                <Feather
                    name="archive"
                    size={20}
                    color="white"
                />
                <Text className="text-xs font-semibold text-white mt-1">Hide</Text>
            </Animated.View>

            {/* Swipeable row */}
            <GestureDetector gesture={panGesture}>
                <Animated.View style={rowAnimatedStyle}>
                    <Pressable
                        onPress={handlePress}
                        className={`flex-row items-center px-5 py-4 rounded-2xl bg-brand-surface ${item.isActive ? "border-2" : "border border-gray-100"
                            }`}
                        style={item.isActive ? { borderColor: accentColor } : undefined}
                        accessibilityRole="button"
                        accessibilityLabel={`${item.title}. ${item.progressPercent}% complete${item.isActive ? ". Currently active" : ""
                            }. Swipe left to hide.`}
                    >
                        {/* Color indicator dot */}
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: `${accentColor}20` }}
                        >
                            {isCompleted ? (
                                <Feather
                                    name="check-circle"
                                    size={20}
                                    color={accentColor}
                                />
                            ) : (
                                <View
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: accentColor }}
                                />
                            )}
                        </View>

                        {/* Title + subtitle */}
                        <View className="flex-1 mr-3">
                            <View className="flex-row items-center gap-2">
                                <Text
                                    className={`text-base font-bold ${item.isActive ? "text-ink" : "text-ink"
                                        }`}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                {item.isActive && (
                                    <View
                                        className="px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: `${accentColor}20` }}
                                    >
                                        <Text
                                            className="text-xs font-semibold"
                                            style={{ color: accentColor }}
                                        >
                                            Active
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Current unit or status */}
                            <Text
                                className="text-sm text-ink-muted mt-0.5"
                                numberOfLines={1}
                            >
                                {isCompleted
                                    ? "Completed"
                                    : (item.currentUnitTitle ??
                                        `${item.progressPercent}% complete`)}
                            </Text>

                            {/* Progress bar */}
                            {!isCompleted && (
                                <View className="h-1.5 bg-sage-50 rounded-full mt-2">
                                    <View
                                        className="h-1.5 rounded-full"
                                        style={{
                                            width: `${Math.max(item.progressPercent, 2)}%`,
                                            backgroundColor: accentColor,
                                        }}
                                    />
                                </View>
                            )}
                        </View>

                        {/* Progress percentage */}
                        <Text
                            className="text-sm font-semibold"
                            style={{ color: isCompleted ? "#22C55E" : accentColor }}
                        >
                            {item.progressPercent}%
                        </Text>
                    </Pressable>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

// ---------------------------------------------------------------------------
// JourneySwitcherSheet
// ---------------------------------------------------------------------------

export function JourneySwitcherSheet({
    isOpen,
    onClose,
    items,
    onSwitchJourney,
    onDiscoverPress,
    onArchive,
}: JourneySwitcherSheetProps): React.JSX.Element {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["90%"], []);

    // Present/dismiss based on isOpen prop
    useEffect(() => {
        if (isOpen) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [isOpen]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="close"
            />
        ),
        [],
    );

    const handleSheetChanges = useCallback(
        (index: number): void => {
            if (index === -1) {
                onClose();
            }
        },
        [onClose],
    );

    const handleSwitchAndClose = useCallback(
        (slug: string): void => {
            onSwitchJourney(slug);
            onClose();
        },
        [onSwitchJourney, onClose],
    );

    const activeItems: JourneySwitcherItem[] = items.filter(
        (i: JourneySwitcherItem) => i.status === "active",
    );
    const completedItems: JourneySwitcherItem[] = items.filter(
        (i: JourneySwitcherItem) => i.status === "completed",
    );

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: "white" }}
            handleIndicatorStyle={{ backgroundColor: "#E2E8F0" }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-6 border-b border-gray-100">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center">
                        <Text className="text-lg">🏳️</Text>
                    </View>
                    <View>
                        <Text className="text-2xl font-bold text-ink">
                            My Journeys
                        </Text>
                        <Text className="text-sm text-ink-soft">
                            {items.length} {items.length === 1 ? "journey" : "journeys"}{" "}
                            enrolled
                        </Text>
                    </View>
                </View>
            </View>

            {/* Content */}
            <BottomSheetScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Active journeys */}
                {activeItems.length > 0 && (
                    <View className="pt-5">
                        <Text className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3 px-1">
                            In Progress
                        </Text>
                        {activeItems.map(
                            (item: JourneySwitcherItem): React.JSX.Element => (
                                <JourneyRow
                                    key={item.slug}
                                    item={item}
                                    onPress={handleSwitchAndClose}
                                    onArchive={onArchive}
                                />
                            ),
                        )}
                    </View>
                )}

                {/* Completed journeys */}
                {completedItems.length > 0 && (
                    <View className="pt-4">
                        <Text className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3 px-1">
                            Completed
                        </Text>
                        {completedItems.map(
                            (item: JourneySwitcherItem): React.JSX.Element => (
                                <JourneyRow
                                    key={item.slug}
                                    item={item}
                                    onPress={handleSwitchAndClose}
                                    onArchive={onArchive}
                                />
                            ),
                        )}
                    </View>
                )}

                {/* Empty state */}
                {items.length === 0 && (
                    <View className="items-center justify-center py-20">
                        <View className="w-20 h-20 rounded-full bg-sage-50 items-center justify-center mb-4">
                            <Feather
                                name="map"
                                size={40}
                                color="#9CA3AF"
                            />
                        </View>
                        <Text className="text-lg font-semibold text-ink mb-2">
                            No Journeys Yet
                        </Text>
                        <Text className="text-sm text-ink-soft text-center px-8">
                            Start your first journey to begin tracking your progress
                        </Text>
                    </View>
                )}

                {/* Discover New Journeys button */}
                <Pressable
                    onPress={onDiscoverPress}
                    className="mt-6 mb-4 bg-purple-600 rounded-2xl py-4 px-6 flex-row items-center justify-center gap-2"
                    accessibilityRole="button"
                    accessibilityLabel="Discover new journeys"
                >
                    <Feather
                        name="compass"
                        size={18}
                        color="white"
                    />
                    <Text className="text-base font-bold text-white">
                        Discover New Journeys
                    </Text>
                </Pressable>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
}

export default React.memo(JourneySwitcherSheet);
