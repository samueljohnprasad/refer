/**
 * LearnNodeRenderer (P1.3.1)
 * Full-screen swipeable card carousel for Learn nodes (2-4 min psychoeducation).
 *
 * Features:
 * - Horizontal swipe between cards with spring animation
 * - Illustration area (top 60%) + text content (bottom 40%)
 * - Max 40 words per card enforced in display
 * - Progress dots at bottom
 * - Last card = "Key Takeaway" with distinct styling
 * - "Continue" button on last card → triggers completion callback
 * - Cannot skip forward, but can swipe back
 * - Accessibility: screen reader announces card content
 *
 * Container/Presentation split:
 * This file is the Presentation layer. The container that provides
 * LearnContent and handles completion is the parent screen.
 */

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    type ViewToken,
    type NativeSyntheticEvent,
    type NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolation,
    useAnimatedScrollHandler,
    type SharedValue,
} from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
    BookOpen02Icon,
    ArrowLeft01Icon,
    CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

import type { LearnContent, LearnCard } from "@/src/types/journey/mentalHealth";
import { PressableScale } from "@/src/components/ui/PressableScale";

// ============================================================================
// Types
// ============================================================================

export interface LearnNodeRendererProps {
    /** Learn node content from the template JSONB */
    content: LearnContent;
    /** Node title (shown in header) */
    title: string;
    /** Estimated minutes */
    estimatedMinutes: number;
    /** Called when user taps "Continue" on the last card */
    onComplete: () => void;
    /** Called when user taps back button */
    onBack: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const MAX_WORD_COUNT: number = 40;
const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.8 };

/** Visual key → icon/emoji mapping for illustration area */
const VISUAL_MAP: Record<string, { emoji: string; bgColor: string }> = {
    brain: { emoji: "🧠", bgColor: "bg-purple-50" },
    heart: { emoji: "❤️", bgColor: "bg-red-50" },
    calm: { emoji: "🧘", bgColor: "bg-blue-50" },
    storm: { emoji: "⛈️", bgColor: "bg-slate-100" },
    shield: { emoji: "🛡️", bgColor: "bg-green-50" },
    magnifier: { emoji: "🔍", bgColor: "bg-amber-50" },
    lightbulb: { emoji: "💡", bgColor: "bg-yellow-50" },
    thought: { emoji: "💭", bgColor: "bg-indigo-50" },
    body: { emoji: "🧍", bgColor: "bg-teal-50" },
    breath: { emoji: "🌬️", bgColor: "bg-cyan-50" },
    anchor: { emoji: "⚓", bgColor: "bg-blue-50" },
    wave: { emoji: "🌊", bgColor: "bg-sky-50" },
    sun: { emoji: "☀️", bgColor: "bg-orange-50" },
    star: { emoji: "⭐", bgColor: "bg-yellow-50" },
    trophy: { emoji: "🏆", bgColor: "bg-amber-50" },
    key: { emoji: "🔑", bgColor: "bg-yellow-50" },
    book: { emoji: "📖", bgColor: "bg-indigo-50" },
    puzzle: { emoji: "🧩", bgColor: "bg-pink-50" },
    tree: { emoji: "🌳", bgColor: "bg-green-50" },
    mountain: { emoji: "🏔️", bgColor: "bg-slate-50" },
    default: { emoji: "📚", bgColor: "bg-slate-50" },
};

// ============================================================================
// Helpers
// ============================================================================

/** Truncate text to MAX_WORD_COUNT words */
function truncateWords(
    text: string,
    maxWords: number = MAX_WORD_COUNT,
): string {
    const words: string[] = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "…";
}

/** Resolve visual_key to icon config */
function resolveVisual(visualKey: string): { emoji: string; bgColor: string } {
    return VISUAL_MAP[visualKey] ?? VISUAL_MAP.default;
}

// ============================================================================
// Sub-components
// ============================================================================

/** Header bar with back button, title, and card counter */
function LearnHeader({
    title,
    currentIndex,
    totalCards,
    estimatedMinutes,
    onBack,
}: {
    title: string;
    currentIndex: number;
    totalCards: number;
    estimatedMinutes: number;
    onBack: () => void;
}): React.JSX.Element {
    return (
        <View className="flex-row items-center px-4 pt-2 pb-3">
            <PressableScale
                onPress={onBack}
                scale={0.9}
                hapticStyle="light"
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#F1F5F9",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                accessibilityLabel="Go back"
                accessibilityRole="button"
            >
                <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    size={20}
                    color="#475569"
                />
            </PressableScale>

            <View className="flex-1 mx-3">
                <Text
                    className="text-sm font-bold text-slate-800"
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <Text className="text-xs text-slate-400">
                    {estimatedMinutes} min · Card {currentIndex + 1} of {totalCards}
                </Text>
            </View>

            <View className="bg-purple-50 px-3 py-1.5 rounded-full">
                <HugeiconsIcon
                    icon={BookOpen02Icon}
                    size={16}
                    color="#8B5CF6"
                />
            </View>
        </View>
    );
}

/** Progress bar (thin, below header) */
function ProgressBar({
    current,
    total,
}: {
    current: number;
    total: number;
}): React.JSX.Element {
    const progressPercent: number = total > 0 ? ((current + 1) / total) * 100 : 0;

    return (
        <View className="h-1 bg-slate-100 mx-4 rounded-full overflow-hidden">
            <Animated.View
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
            />
        </View>
    );
}

/** A single learn card */
function CardItem({
    card,
    index,
    totalCards,
    width,
    scrollX,
}: {
    card: LearnCard;
    index: number;
    totalCards: number;
    width: number;
    scrollX: SharedValue<number>;
}): React.JSX.Element {
    const isLastCard: boolean = index === totalCards - 1;
    const visual = resolveVisual(card.visual_key);
    const displayText: string = truncateWords(card.text);

    const animatedStyle = useAnimatedStyle(() => {
        const inputRange: number[] = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        const scale: number = interpolate(
            scrollX.value,
            inputRange,
            [0.92, 1, 0.92],
            Extrapolation.CLAMP,
        );

        const opacity: number = interpolate(
            scrollX.value,
            inputRange,
            [0.6, 1, 0.6],
            Extrapolation.CLAMP,
        );

        return { transform: [{ scale }], opacity };
    });

    return (
        <Animated.View
            style={[animatedStyle, { width }]}
            className="px-5"
            accessibilityLabel={`Card ${index + 1} of ${totalCards}. ${card.text}`}
            accessibilityRole="text"
        >
            <View
                className={`flex-1 rounded-3xl overflow-hidden ${isLastCard ? "border-2 border-purple-200" : "border border-slate-100"
                    }`}
            >
                {/* Illustration area — top 60% */}
                <View
                    className={`flex-[3] items-center justify-center ${isLastCard ? "bg-purple-50" : visual.bgColor
                        }`}
                >
                    {isLastCard ? (
                        <View className="items-center">
                            <View className="w-20 h-20 rounded-full bg-purple-100 items-center justify-center mb-3">
                                <Text className="text-4xl">💡</Text>
                            </View>
                            <Text className="text-sm font-bold text-purple-600 uppercase tracking-widest">
                                Key Takeaway
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-7xl">{visual.emoji}</Text>
                    )}
                </View>

                {/* Text content — bottom 40% */}
                <View
                    className={`flex-[2] px-6 py-5 justify-center ${isLastCard ? "bg-white" : "bg-white"
                        }`}
                >
                    <Text
                        className={`text-lg leading-7 ${isLastCard
                            ? "font-bold text-purple-800 text-center"
                            : "font-medium text-slate-700"
                            }`}
                    >
                        {displayText}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

/** Progress dots */
function ProgressDots({
    total,
    current,
}: {
    total: number;
    current: number;
}): React.JSX.Element {
    return (
        <View className="flex-row items-center justify-center gap-2 py-3">
            {Array.from({ length: total }, (_, i: number) => (
                <View
                    key={i}
                    className={`rounded-full ${i === current
                        ? "w-6 h-2 bg-purple-500"
                        : i < current
                            ? "w-2 h-2 bg-purple-300"
                            : "w-2 h-2 bg-slate-200"
                        }`}
                />
            ))}
        </View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function LearnNodeRenderer({
    content,
    title,
    estimatedMinutes,
    onComplete,
    onBack,
}: LearnNodeRendererProps): React.JSX.Element {
    const { width: screenWidth } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [highestViewed, setHighestViewed] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useSharedValue<number>(0);

    const cards: LearnCard[] = content.cards;
    const totalCards: number = cards.length;
    const isOnLastCard: boolean = currentIndex === totalCards - 1;
    const hasViewedAll: boolean = highestViewed >= totalCards - 1;

    // Track scroll position for card animations
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    // Track visible card index
    const viewabilityConfig = useMemo(
        () => ({ viewAreaCoveragePercentThreshold: 50 }),
        [],
    );

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                const newIndex: number = viewableItems[0].index;
                setCurrentIndex(newIndex);
                setHighestViewed((prev: number) => Math.max(prev, newIndex));
            }
        },
        [],
    );

    // Prevent skipping forward (can only advance to highestViewed + 1)
    const handleScrollEnd = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
            const offsetX: number = e.nativeEvent.contentOffset.x;
            const newIndex: number = Math.round(offsetX / screenWidth);

            // If user tried to skip ahead, snap back
            if (newIndex > highestViewed + 1) {
                flatListRef.current?.scrollToIndex({
                    index: highestViewed,
                    animated: true,
                });
            }
        },
        [highestViewed, screenWidth],
    );

    // Render card
    const renderCard = useCallback(
        ({
            item,
            index,
        }: {
            item: LearnCard;
            index: number;
        }): React.JSX.Element => (
            <CardItem
                card={item}
                index={index}
                totalCards={totalCards}
                width={screenWidth}
                scrollX={scrollX}
            />
        ),
        [totalCards, screenWidth, scrollX],
    );

    const keyExtractor = useCallback(
        (_: LearnCard, index: number): string => `learn-card-${index}`,
        [],
    );

    // Swipe hint text
    const hintText: string = isOnLastCard
        ? ""
        : `Swipe left to continue · ${totalCards - currentIndex - 1} remaining`;

    return (
        <SafeAreaView
            className="flex-1 bg-white"
            edges={["top", "bottom"]}
        >
            {/* Header */}
            <LearnHeader
                title={title}
                currentIndex={currentIndex}
                totalCards={totalCards}
                estimatedMinutes={estimatedMinutes}
                onBack={onBack}
            />

            {/* Progress bar */}
            <ProgressBar
                current={currentIndex}
                total={totalCards}
            />

            {/* Card carousel */}
            <View className="flex-1 mt-4">
                <Animated.FlatList
                    ref={flatListRef as React.RefObject<FlatList>}
                    data={cards}
                    renderItem={renderCard}
                    keyExtractor={keyExtractor}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    onMomentumScrollEnd={handleScrollEnd}
                    bounces={false}
                    decelerationRate="fast"
                    getItemLayout={(_, index: number) => ({
                        length: screenWidth,
                        offset: screenWidth * index,
                        index,
                    })}
                />
            </View>

            {/* Bottom area: dots + hint/button */}
            <View className="pb-4 px-5">
                {/* Progress dots */}
                <ProgressDots
                    total={totalCards}
                    current={currentIndex}
                />

                {/* Swipe hint or Continue button */}
                {isOnLastCard ? (
                    <PressableScale
                        onPress={onComplete}
                        scale={0.96}
                        hapticStyle="medium"
                        style={{
                            backgroundColor: "#8B5CF6",
                            paddingVertical: 16,
                            borderRadius: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomWidth: 4,
                            borderBottomColor: "#7C3AED",
                        }}
                        accessibilityLabel="Complete this lesson and continue"
                        accessibilityRole="button"
                    >
                        <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={20}
                            color="#FFFFFF"
                        />
                        <Text className="text-base font-bold text-white ml-2">
                            Continue
                        </Text>
                    </PressableScale>
                ) : (
                    <Text
                        className="text-xs text-slate-400 text-center py-3"
                        accessibilityHint="Swipe left to see the next card"
                    >
                        {hintText}
                    </Text>
                )}
            </View>
        </SafeAreaView>
    );
}
